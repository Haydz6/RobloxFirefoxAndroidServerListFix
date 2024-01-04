import { useState, useEffect, useCallback } from 'react';
import { authenticatedUser } from 'header-scripts';
import serverListService from '../services/serverListService';
import gameDetailMetaData from '../../gameData/utils/gameDetailMetaData';
import serverListConstants from '../constants/serverListConstants';

const { getCurrentGameMetaData } = gameDetailMetaData;
const { defaultOptions } = serverListConstants;

function useServerList(getGameServers, fetchPrivateServerDetails = false) {
  const {
    gameDetailUniverseId: universeId,
    gameDetailPlaceId: placeId,
    gameDetailPlaceName: placeName,
    gameDetailCanCreateServer: canCreateServer,
    gameDetailPrivateServerPrice: price,
    gameDetailUserCanManagePlace: userCanManagePlace,
    gameDetailSellerId: sellerId,
    gameDetailSellerName: sellerName,
    gameDetailPrivateServerProductId: privateServerProductId
  } = getCurrentGameMetaData();
  const [isBusy, setIsBusy] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [servers, setServers] = useState([]);
  const [nextPageCursor, setNextPageCursor] = useState('');

  const combinedServers = (currentServers, newServers) => {
    // Servers change sizes over time. We might have an instance already even though
    // its in a new response. This isn't like other paged endpoints.
    // ... but we can ensure the list is always de-duplicated!
    const currentServersCopy = [...currentServers];
    const currentServersGuids = {};
    currentServersCopy.forEach(server => {
      if (server.id !== undefined) {
        currentServersGuids[server.id] = server;
      }
    });

    newServers.forEach(server => {
      const currentServer = currentServersGuids[server.id];
      if (currentServer) {
        // It's a duplicate! Our information is more up to date though, so lets use it.
        Object.assign(currentServer, server);
      } else {
        // No duplicate here, append it to the list.
        currentServersCopy.push(server);
      }
    });

    // Don't sort this by player count - it feels better as a user to let existng order persist
    return currentServersCopy;
  };

  const loadMoreServers = useCallback(
    async (params = {}, clearServersList = false) => {
      if (isBusy) {
        throw Error('Cannot load more servers while a request is in flight');
      }

      setIsBusy(true);
      setHasError(false);
      try {
        const {
          data: { data: instances, nextPageCursor: nextPageCursorData }
        } = await getGameServers(placeId, clearServersList ? '' : nextPageCursor, params);

        await Promise.all(
          instances.map(async instance => {
            // Can remove this once players is guaranteed to be set in the response
            if (instance.players === undefined) {
              // eslint-disable-next-line no-param-reassign
              instance.players = [];
            }

            // Combine players and playerTokens into a single list
            const { players, playerTokens } = instance;
            const playerTokensToPlayer = {};
            players.forEach(player => {
              playerTokensToPlayer[player.playerToken] = player;
            });

            playerTokens.forEach(playerToken => {
              if (playerTokensToPlayer[playerToken] == null) {
                players.push({
                  id: null,
                  name: null,
                  playerToken,
                  displayName: null
                });
              }
            });

            if (
              fetchPrivateServerDetails &&
              instance.vipServerId &&
              instance.owner?.id === authenticatedUser.id
            ) {
              const { vipServerId } = instance;
              try {
                const { data } = await serverListService.getVipServer(vipServerId);
                // eslint-disable-next-line no-param-reassign
                instance.vipServerSubscription = data.subscription;
              } catch {
                // Swallow error, we can show an error loading subscription status
                // in the future if we choose.
              }
            }
          })
        );

        setServers(clearServersList ? instances : combinedServers(servers, instances));
        setNextPageCursor(nextPageCursorData);
      } catch {
        setServers([]);
        setNextPageCursor('');
        setHasError(true);
      } finally {
        setIsBusy(false);
      }
    },
    [isBusy, placeId, nextPageCursor, servers, getGameServers, fetchPrivateServerDetails]
  );

  // The following two methods exist such that we can avoid full page reloads
  // on server shutdown. They are quick operations and do not require setting the isBusy flag
  const removeServerAtIndex = useCallback(
    index => {
      if (isBusy) {
        throw Error('Cannot remove server from list while a request is in flight');
      }

      const serversCopy = [...servers];
      serversCopy.splice(index, 1);
      setServers(serversCopy);
    },
    [isBusy, servers]
  );

  // Clears player list and guid (i.e. private server shutdown)
  const clearServerAtIndex = useCallback(
    index => {
      if (isBusy) {
        throw Error('Cannot clear server while a request is in flight');
      }

      const serversCopy = [...servers];
      const server = serversCopy[index];
      server.playerTokens = [];
      server.players = [];
      server.playing = 0;
      server.id = null;
      setServers(serversCopy);
    },
    [isBusy, servers]
  );

  const refreshServers = useCallback(
    (params = {}) => {
      if (isBusy) {
        throw Error('Cannot refresh server list while a request is in flight');
      }

      loadMoreServers(params, true);
    },
    [isBusy, loadMoreServers]
  );

  useEffect(() => {
    loadMoreServers(defaultOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    metaData: {
      universeId,
      placeId,
      placeName,
      canCreateServer,
      price,
      userCanManagePlace,
      sellerId,
      sellerName,
      privateServerProductId
    },
    servers,
    loadMoreServers,
    removeServerAtIndex,
    clearServerAtIndex,
    refreshServers,
    hasNext: !!nextPageCursor,
    isBusy,
    setIsBusy,
    hasError
  };
}

export default useServerList;

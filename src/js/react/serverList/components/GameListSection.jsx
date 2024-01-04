import React, { Fragment, useEffect, useMemo, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { withTranslations } from 'react-utilities';
import { createSystemFeedback, Button, Loading } from 'react-style-guide';
import translationConfig from '../translation.config';
import GameInstanceCard from '../containers/GameInstanceCard';
import gameInstanceConstants from '../constants/serverListConstants';
import ServerListOptions from '../../../../ts/react/serverList/ServerListOptions';
import ExperimentContext from '../../../../ts/react/common/utils/ExperimentContext';

const [SystemFeedback, systemFeedbackService] = createSystemFeedback();
const {
  slowGameFpsThreshold,
  resources,
  numGameInstancesPerRow,
  defaultOptions
} = gameInstanceConstants;

function GameListSection({
  translate,
  headerTitle,
  type,
  placeId,
  showLoadMoreButton,
  gameInstances,
  loadMoreGameInstances,
  refreshGameInstances,
  handleGameInstanceShutdownAtIndex,
  userCanManagePlace,
  loadingError,
  isLoading,
  setIsLoading
}) {
  const cssKey = type ? `${type}-` : '';
  const id = `rbx-${cssKey}running-games`;
  const emptyGameInstanceList = gameInstances.length === 0;
  const itemContainerId = `rbx-${cssKey}game-server-item-container`;
  const itemContainerClass = `card-list rbx-${cssKey}game-server-item-container`;
  const footerClass = `rbx-${cssKey}running-games-footer`;

  const displayedGameInstances = useMemo(() => {
    // We display N items in a row in this UI treatment, but we fetch 10 at a time from the API,
    // and deduplicate ones that are returned more than once due to changes in server ordering on the backend.
    // To ensure users see full rows when possible, we slice the list such that it's a multiple of N, unless
    // we are at the end of the list (showLoadMoreButton corresponds to this). The servers aren't ever removed
    // from the original list, just saved until next time.
    const extraGameInstances = gameInstances.length % numGameInstancesPerRow;
    if (extraGameInstances > 0 && showLoadMoreButton) {
      return gameInstances.slice(0, -1 * extraGameInstances);
    }
    return gameInstances;
  }, [gameInstances, showLoadMoreButton]);

  const [options, setOptions] = useState(defaultOptions);

  const experiments = useContext(ExperimentContext);

  useEffect(() => {
    refreshGameInstances?.(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  return (
    <Fragment>
      <SystemFeedback />
      <div id={id} className='stack server-list-section' data-placeid={placeId} data-showshutdown>
        {headerTitle && (
          <div className='container-header'>
            <div className='server-list-container-header'>
              <h2 className='server-list-header'>{headerTitle}</h2>
              <Button
                size={Button.sizes.extraSmall}
                variant={Button.variants.control}
                className='btn-more rbx-refresh refresh-link-icon'
                onClick={() => refreshGameInstances(options)}
                isDisabled={isLoading}>
                {translate(resources.privateServerRefreshText) || 'Refresh'}
              </Button>
            </div>
            {type === '' && (
              <ServerListOptions
                {...{
                  translate,
                  isLoading,
                  options,
                  setOptions
                }}
              />
            )}
          </div>
        )}

        {emptyGameInstanceList ? (
          <div className='section-content-off empty-game-instances-container'>
            {isLoading ? (
              <Loading />
            ) : (
              <p className='no-servers-message'>
                {loadingError
                  ? translate(resources.loadServersError) || 'Unable to load servers.'
                  : translate(resources.noServersFoundText)}
              </p>
            )}
          </div>
        ) : (
          <Fragment>
            <ul id={itemContainerId} className={itemContainerClass}>
              {displayedGameInstances.map(
                (
                  {
                    id: instanceId,
                    playing,
                    maxPlayers,
                    pfs,
                    vipServerId,
                    vipServerSubscription,
                    accessCode,
                    name,
                    owner,
                    players
                  },
                  index
                ) => (
                  <GameInstanceCard
                    key={id}
                    {...{
                      id: instanceId,
                      translate,
                      cssKey,
                      serverListType: type,
                      placeId,
                      canManagePlace: userCanManagePlace,
                      name,
                      vipServerId,
                      vipServerSubscription,
                      owner,
                      accessCode,
                      currentPlayersCount: playing || players.length,
                      showSlowGameMessage: pfs < slowGameFpsThreshold,
                      gameServerStatus: translate(resources.playerCountText, {
                        currentPlayers: playing || players.length,
                        maximumAllowedPlayers: maxPlayers
                      }),
                      players,
                      onShutdownServerSuccess: () => {
                        handleGameInstanceShutdownAtIndex(index);
                      },
                      systemFeedbackService,
                      isLoading,
                      setIsLoading,
                      maxPlayers
                    }}
                  />
                )
              )}
            </ul>
            <div className={footerClass}>
              {showLoadMoreButton && (
                <Button
                  type='button'
                  onClick={() => loadMoreGameInstances(options)}
                  className='rbx-running-games-load-more'
                  variant={Button.variants.control}
                  width={Button.widths.full}
                  isDisabled={isLoading}>
                  {translate(resources.loadMoreButtonText)}
                </Button>
              )}
            </div>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
}

GameListSection.defaultProps = {
  type: '',
  showLoadMoreButton: false,
  loadMoreButtonText: '',
  headerTitle: '',
  gameInstances: []
};

GameListSection.propTypes = {
  translate: PropTypes.func.isRequired,
  type: PropTypes.string,
  placeId: PropTypes.number.isRequired,
  headerTitle: PropTypes.string,
  loadMoreGameInstances: PropTypes.func.isRequired,
  showLoadMoreButton: PropTypes.bool,
  loadMoreButtonText: PropTypes.string,
  gameInstances: PropTypes.arrayOf(PropTypes.any),
  refreshGameInstances: PropTypes.func.isRequired,
  handleGameInstanceShutdownAtIndex: PropTypes.func.isRequired,
  userCanManagePlace: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  setIsLoading: PropTypes.func.isRequired,
  loadingError: PropTypes.bool.isRequired
};

export default withTranslations(GameListSection, translationConfig.serverList);

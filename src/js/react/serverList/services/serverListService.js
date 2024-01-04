import { httpService } from 'core-utilities';
import urlConstant from '../constants/urlConstants';
import serverListConstants from '../constants/serverListConstants';

const { serverListTypes } = serverListConstants;

const {
  getGameServersUrl,
  getPrivateGameServersUrl,
  getShutdownGameInstanceUrl,
  getVipServerUrl,
  createVipServerUrl,
  createPrivateServerUrl,
  updateVipServerSubscriptionUrl
} = urlConstant;

export default {
  getPublicGameInstances: (placeId, cursor, paramsArg = {}) => {
    const urlConfig = {
      url: getGameServersUrl(placeId, serverListTypes.public.value),
      retryable: true,
      withCredentials: true
    };

    // This fixes the bug where setting params.cursor would make the cursor key
    // permanent, even on server list refresh. structuredClone is probably a
    // better option for copying an object, but it's very new and not well supported.
    const params = { cursor, ...paramsArg };
    return httpService.get(urlConfig, params);
  },
  getFriendsGameInstances: (placeId, cursor, paramsArg = {}) => {
    const urlConfig = {
      url: getGameServersUrl(placeId, serverListTypes.friend.value),
      retryable: true,
      withCredentials: true
    };

    const params = { cursor, ...paramsArg };
    return httpService.get(urlConfig, params);
  },
  getVipGameInstances: (placeId, cursor, paramsArg = {}) => {
    const urlConfig = {
      url: getPrivateGameServersUrl(placeId),
      retryable: true,
      withCredentials: true
    };

    const params = { cursor, ...paramsArg };
    return httpService.get(urlConfig, params);
  },

  shutdownGameInstance: (placeId, gameId, privateServerId) => {
    const requestVerificationToken = document.getElementsByName('__RequestVerificationToken')[0]
      ?.value;

    const urlConfig = {
      url: getShutdownGameInstanceUrl(),
      retryable: true,
      withCredentials: true
    };

    const data = {
      __RequestVerificationToken: requestVerificationToken,
      placeId,
      gameId
    };

    if (privateServerId) {
      data.privateServerId = privateServerId;
    }

    return httpService.post(urlConfig, data);
  },
  createPrivateServer: (universeId, name, expectedPrice) => {
    const urlConfig = {
      url: createPrivateServerUrl(universeId),
      retryable: true,
      withCredentials: true
    };

    const params = {
      name,
      expectedPrice
    };

    return httpService.post(urlConfig, params);
  },
  getVipServer: vipServerId => {
    const urlConfig = {
      url: getVipServerUrl(vipServerId),
      retryable: true,
      withCredentials: true
    };
    return httpService.get(urlConfig);
  },
  createVipServer: (universeId, name, expectedPrice) => {
    const urlConfig = {
      url: createVipServerUrl(universeId),
      retryable: true,
      withCredentials: true
    };
    return httpService.post(urlConfig, { name, expectedPrice });
  },
  updateVipServerSubscription: (vipServerId, active, price) => {
    const urlConfig = {
      url: updateVipServerSubscriptionUrl(vipServerId),
      retryable: true,
      withCredentials: true
    };
    return httpService.patch(urlConfig, { active, price });
  }
};

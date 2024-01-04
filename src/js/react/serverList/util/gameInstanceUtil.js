import { DeviceMeta, GameLauncher, EventStream } from 'Roblox';
import { jsClientDeviceIdentifier, authenticatedUser } from 'header-scripts';
import { urlService, uuidService } from 'core-utilities';
import gameDataUtil from '../../gameData/utils/gameDetailMetaData';
import attributionUtils from '../../../../ts/react/common/utils/attributionUtils';
import { EventType } from '../../../../ts/react/common/constants/eventStreamConstants';

const { isIE11 } = jsClientDeviceIdentifier;
const { getCurrentGameMetaData } = gameDataUtil;

const { deviceType, isUWPApp, isInApp } = DeviceMeta();
export const getPlaceIdFromUrl = () => {
  return +window.location.pathname.split('/')[2];
};

const shouldUseGameLaunchInterface = () => {
  return (
    (deviceType === 'computer' && !isUWPApp) || (deviceType === 'tablet' && isIE11) || isUWPApp
  );
};

export const getJoinScript = (placeId, { instanceId, accessCode }, serverListType) => {
  const joinAttemptId = GameLauncher.isJoinAttemptIdEnabled()
    ? uuidService.generateRandomUuid()
    : undefined;
  const gamePlayIntentContext = `${serverListType}ServerListJoin`;
  const commonEventParams = {
    pid: getPlaceIdFromUrl(),
    joinAttemptId
  };

  const sendPlayGameClickedEvent = () => {
    EventStream.SendEventWithTarget(
      'playGameClicked',
      gamePlayIntentContext,
      {
        attributionId: attributionUtils.getAttributionId(EventType.GameDetailReferral),
        ...commonEventParams
      },
      EventStream.TargetTypes.WWW
    );
  };

  if (shouldUseGameLaunchInterface()) {
    return () => {
      sendPlayGameClickedEvent();
      EventStream.SendEventWithTarget(
        'gamePlayIntent',
        gamePlayIntentContext,
        {
          lType: 'protocol',
          refuid: null,
          pg: 'gameDetail',
          ...commonEventParams
        },
        EventStream.TargetTypes.WWW
      );

      // accessCode must be checked first in the case of joining a live private server instance
      if (accessCode) {
        GameLauncher.joinPrivateGame(
          placeId,
          accessCode,
          undefined,
          joinAttemptId,
          GameLauncher.isJoinAttemptIdEnabled() ? gamePlayIntentContext : undefined
        );
        return;
      }

      if (instanceId) {
        GameLauncher.joinGameInstance(
          placeId,
          instanceId,
          false,
          false,
          joinAttemptId,
          GameLauncher.isJoinAttemptIdEnabled() ? gamePlayIntentContext : undefined
        );
      }
    };
  }
  let url = '';
  if (isInApp) {
    url = urlService.getUrlWithQueries('/games/start', { placeId });
  } else {
    url = `robloxmobile://placeID=${placeId}`;
  }
  if (instanceId) {
    url += `&gameInstanceId=${instanceId}`;
  }

  if (accessCode) {
    url += `&accessCode=${accessCode}`;
  }

  if (GameLauncher.isJoinAttemptIdEnabled() && joinAttemptId) {
    url += `&joinAttemptId=${joinAttemptId}&joinAttemptOrigin=${gamePlayIntentContext}`;
  }

  return () => {
    sendPlayGameClickedEvent();
    window.location.href = url;
  };
};

export const canCreatePrivateGameServer = servers => {
  let { gameDetailPrivateServerLimit } = getCurrentGameMetaData();
  servers.forEach(({ owner }) => {
    if (owner.id === authenticatedUser.id) {
      gameDetailPrivateServerLimit -= 1;
    }
  });
  return gameDetailPrivateServerLimit > 0;
};

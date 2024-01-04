import { EnvironmentUrls } from 'Roblox';
import { urlService } from 'core-utilities';

const { gamesApi } = EnvironmentUrls;

export default {
  getUserProfileUrl: userId => urlService.getAbsoluteUrl(`/users/${userId}/profile`),
  getGameServersUrl: (placeId, serverType) =>
    urlService.getAbsoluteUrl(`${gamesApi}/v1/games/${placeId}/servers/${serverType}`),
  getPrivateGameServersUrl: placeId =>
    urlService.getAbsoluteUrl(`${gamesApi}/v1/games/${placeId}/private-servers`),
  getShutdownGameInstanceUrl: () => urlService.getAbsoluteUrl('/game-instances/shutdown'),
  getPrivateServerConfigUrl: privateServerId =>
    urlService.getUrlWithQueries(`/private-server/configure`, { privateServerId }),
  getVipServerUrl: vipServerId => `${gamesApi}/v1/vip-servers/${vipServerId}`,
  createVipServerUrl: universeId => `${gamesApi}/v1/games/vip-servers/${universeId}`,
  updateVipServerSubscriptionUrl: vipServerId =>
    `${gamesApi}/v1/vip-servers/${vipServerId}/subscription`,
  createPrivateServerUrl: universeId => `${gamesApi}/v1/games/vip-servers/${universeId}`,
  privateServerHelpUrl: locale => urlService.getUrlWithLocale('/info/vip-server', locale)
};

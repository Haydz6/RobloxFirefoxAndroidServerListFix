import { EnvironmentUrls } from 'Roblox';

const { apiGatewayUrl } = EnvironmentUrls;

const url = {
  getExperimentationValues: (
    projectId: number,
    layerName: string,
    values: string[]
  ): { url: string; withCredentials: boolean } => ({
    url: `${apiGatewayUrl}/product-experimentation-platform/v1/projects/${projectId}/layers/${layerName}/values?parameters=${values.join(
      ','
    )}`,
    withCredentials: true
  })
};

const layerNames = {
  homePage: 'PlayerApp.HomePage.UX',
  homePageWeb: 'Website.Homepage',
  serverTab: 'GameDetails.ServersTab',
  gameDetails: 'Website.GameDetails',
  searchPage: 'Website.SearchResultsPage',
  discoverPage: 'Website.GamesPage'
};

const defaultValues = {
  homePage: {},
  homePageWeb: {},
  serverTab: {
    ShouldDisableJoinButtonForFullServers: false
  },
  gameDetails: {
    ShouldHidePrivateServersInAboutTab: false
  },
  searchPage: {
    ShouldUseOmniSearchAPI: false
  },
  discoverPage: {
    IsGamesOmniFeedEnabled: false
  }
};

export default {
  url,
  defaultValues,
  layerNames
};

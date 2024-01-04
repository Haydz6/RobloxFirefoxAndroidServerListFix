import { AxiosResponse } from 'axios';
import { httpService, uuidService } from 'core-utilities';
import experimentConstants from '../constants/experimentConstants';
import bedev2Constants from '../constants/bedev2Constants';
import {
  TExploreApiGameSortResponse,
  TExploreApiSortsResponse,
  TGetOmniRecommendationsMetadataResponse,
  TGetOmniRecommendationsResponse,
  TGetOmniSearchParsedResponse,
  TGetOmniSearchResponse,
  TOmniRecommendation,
  TOmniSearchContentType,
  TOmniSearchGameDataModel,
  TTreatmentType
} from '../types/bedev2Types';
import { TPageType } from '../types/bedev1Types';

const getExperimentationValues = async <T extends Record<string, number | string | boolean>>(
  layerName: string,
  defaultValues: T,
  projectId = 1
): Promise<T> => {
  try {
    const { data } = ((await httpService.get(
      experimentConstants.url.getExperimentationValues(
        projectId,
        layerName,
        Object.keys(defaultValues)
      )
    )) as unknown) as AxiosResponse<T>;
    const parsedData = Object.keys(data).reduce<Record<string, any>>((acc, item) => {
      if (data[item] !== null) {
        acc[item] = data[item];
      }
      return acc;
    }, {});
    return { ...defaultValues, ...parsedData };
  } catch {
    return defaultValues;
  }
};

export const getOmniRecommendations = async (
  pageType: TPageType,
  sessionId?: string
): Promise<TGetOmniRecommendationsResponse> => {
  const params = {
    pageType,
    sessionId: sessionId || uuidService.generateRandomUuid(),
    supportedTreatmentTypes: [TTreatmentType.SortlessGrid]
  };

  const { data } = await httpService.post<TGetOmniRecommendationsResponse>(
    bedev2Constants.url.getOmniRecommendations,
    params
  );

  Object.keys(data.contentMetadata.Game).forEach(universeId => {
    const gameData = data.contentMetadata.Game[universeId];
    gameData.placeId = gameData.rootPlaceId as number;
  });

  return data;
};

export const getOmniRecommendationsMetadata = async (
  recommendationList: TOmniRecommendation[],
  sessionId?: string
): Promise<TGetOmniRecommendationsMetadataResponse> => {
  const { data } = await httpService.post<TGetOmniRecommendationsMetadataResponse>(
    bedev2Constants.url.getOmniRecommendationsMetadata,
    {
      contents: recommendationList,
      sessionId: sessionId || uuidService.generateRandomUuid()
    }
  );

  Object.keys(data.contentMetadata.Game).forEach(universeId => {
    const gameData = data.contentMetadata.Game[universeId];
    gameData.placeId = gameData.rootPlaceId as number;
  });

  return data;
};

export const getOmniSearch = async (
  searchQuery: string,
  pageToken: string,
  sessionId: string,
  pageType: string
): Promise<TGetOmniSearchParsedResponse> => {
  const { data } = await httpService.get<TGetOmniSearchResponse>(
    bedev2Constants.url.getOmniSearch,
    {
      searchQuery,
      pageToken,
      sessionId,
      pageType
    }
  );

  const gamesList: TOmniSearchGameDataModel[] = [];

  if (data && data.searchResults && data.searchResults.length > 0) {
    data.searchResults.forEach(contentGroup => {
      // 08/31/22 Currently the backend only returns the "Game" content type.
      // Future content types can be added here for parsing.
      if (contentGroup.contentGroupType === TOmniSearchContentType.Game) {
        const contents = contentGroup.contents as TOmniSearchGameDataModel[];
        contents.forEach(item => {
          gamesList.push(item);
        });
      }
    });
  }

  return {
    filteredSearchQuery: data.filteredSearchQuery,
    nextPageToken: data.nextPageToken,
    gamesList
  };
};

export const getExploreSorts = (
  sessionId: string | undefined,
  sortsPageToken: string | undefined
): Promise<TExploreApiSortsResponse> => {
  return httpService
    .get<TExploreApiSortsResponse>(bedev2Constants.url.getExploreSorts, {
      sessionId: sessionId || uuidService.generateRandomUuid(),
      sortsPageToken
    })
    .then(response => {
      return response.data;
    });
};

export const getExploreSortContents = (
  sessionId: string | undefined,
  sortId: string,
  pageToken: string | undefined
): Promise<TExploreApiGameSortResponse> => {
  return httpService
    .get<TExploreApiGameSortResponse>(bedev2Constants.url.getExploreSortContents, {
      sessionId: sessionId || uuidService.generateRandomUuid(),
      sortId,
      pageToken
    })
    .then(response => {
      return response.data;
    });
};

export default {
  getExperimentationValues,
  getOmniRecommendations,
  getOmniRecommendationsMetadata,
  getOmniSearch,
  getExploreSorts,
  getExploreSortContents
};

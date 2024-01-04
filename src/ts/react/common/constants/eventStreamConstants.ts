import { eventStreamService } from 'core-roblox-utilities';
import { parseEventParams } from '../utils/parsingUtils';
import { AttributionType, getAttributionId } from '../utils/attributionUtils';
import { getHttpReferrer } from '../utils/browserUtils';
import { PageContext } from '../types/pageContext';

const {
  eventTypes: { pageLoad, formInteraction }
} = eventStreamService;

export enum EventStreamMetadata {
  AbsPositions = 'absPositions',
  AdsPositions = 'adsPositions',
  AdFlags = 'adFlags',
  Algorithm = 'algorithm',
  AttributionId = 'attributionId',
  HttpReferrer = 'httpReferrer',
  EmphasisFlag = 'emphasisFlag',
  GameSetTargetId = 'gameSetTargetId',
  GameSetTypeId = 'gameSetTypeId',
  IsAd = 'isAd',
  NativeAdData = 'nativeAdData',
  AdIds = 'adIds',
  NumberOfLoadedTiles = 'numberOfLoadedTiles',
  Page = 'page',
  PlaceId = 'placeId',
  Position = 'position',
  RootPlaceIds = 'rootPlaceIds',
  SortId = 'sortId',
  SortPos = 'sortPos',
  SuggestionKwd = 'suggestionKwd',
  SuggestionReplacedKwd = 'suggestionReplacedKwd',
  SuggestionCorrectedKwd = 'suggestionCorrectedKwd',
  SuggestionAlgorithm = 'suggestionAlgorithm',
  Topics = 'topics',
  TreatmentType = 'treatmentType',
  UniverseId = 'universeId',
  UniverseIds = 'universeIds',
  FriendId = 'friendId'
}

export enum EventType {
  GameImpressions = 'gameImpressions',
  GameDetailReferral = 'gameDetailReferral',
  SortDetailReferral = 'sortDetailReferral'
}

export enum SessionInfoType {
  HomePageSessionInfo = 'homePageSessionInfo',
  GameSearchSessionInfo = 'gameSearchSessionInfo',
  DiscoverPageSessionInfo = 'discoverPageSessionInfo'
}

export type TEvent = [
  { name: string; type: EventType; context: string },
  Record<string, string | number>
];

type TBaseGameImpressions = {
  [EventStreamMetadata.RootPlaceIds]: number[];
  [EventStreamMetadata.AbsPositions]: number[];
  [EventStreamMetadata.UniverseIds]: number[];
  [EventStreamMetadata.GameSetTypeId]?: number;
  [EventStreamMetadata.AdsPositions]?: number[];
  [EventStreamMetadata.AdFlags]?: number[];
  [EventStreamMetadata.AdIds]?: string[];
};

export type TGridGameImpressions = TBaseGameImpressions & {
  [EventStreamMetadata.SuggestionKwd]?: string;
  [EventStreamMetadata.SuggestionReplacedKwd]?: string;
  [EventStreamMetadata.SuggestionCorrectedKwd]?: string;
  [EventStreamMetadata.SuggestionAlgorithm]?: string;
  [EventStreamMetadata.Algorithm]?: string;
  [SessionInfoType.GameSearchSessionInfo]?: string;
  [SessionInfoType.HomePageSessionInfo]?: string;
  [EventStreamMetadata.EmphasisFlag]?: boolean;
  [EventStreamMetadata.SortPos]?: number;
  [EventStreamMetadata.NumberOfLoadedTiles]?: number;
  [EventStreamMetadata.Page]:
    | PageContext.SearchPage
    | PageContext.SortDetailPageDiscover
    | PageContext.SortDetailPageHome
    | PageContext.HomePage;
};

export type TCarouselGameImpressions = TBaseGameImpressions & {
  [EventStreamMetadata.SortPos]: number;
  [SessionInfoType.HomePageSessionInfo]?: string;
  [SessionInfoType.DiscoverPageSessionInfo]?: string;
  [EventStreamMetadata.Page]:
    | PageContext.SortDetailPageDiscover
    | PageContext.SortDetailPageHome
    | PageContext.HomePage
    | PageContext.GamesPage
    | PageContext.GameDetailPage;
};

export type TGameImpressions = TCarouselGameImpressions | TGridGameImpressions;

export type TSortDetailReferral =
  | {
      [EventStreamMetadata.Position]: number;
      [EventStreamMetadata.SortId]?: number;
      [EventStreamMetadata.GameSetTypeId]?: number;
      [EventStreamMetadata.GameSetTargetId]?: number;
      [SessionInfoType.DiscoverPageSessionInfo]?: string;
      [SessionInfoType.HomePageSessionInfo]?: string;
      [EventStreamMetadata.TreatmentType]?: string;
      [EventStreamMetadata.Page]: PageContext.HomePage | PageContext.GamesPage;
    }
  | Record<string, never>;

export type TGameDetailReferral =
  | {
      [EventStreamMetadata.PlaceId]: number;
      [EventStreamMetadata.UniverseId]: number;
      [EventStreamMetadata.IsAd]?: boolean;
      [EventStreamMetadata.NativeAdData]?: string;
      [EventStreamMetadata.Position]: number;
      [EventStreamMetadata.SortPos]?: number;
      [EventStreamMetadata.NumberOfLoadedTiles]?: number;
      [EventStreamMetadata.GameSetTypeId]?: number;
      [EventStreamMetadata.GameSetTargetId]?: number;
      [EventStreamMetadata.FriendId]?: number;
      [EventStreamMetadata.AttributionId]?: string;
      [SessionInfoType.DiscoverPageSessionInfo]?: string;
      [SessionInfoType.GameSearchSessionInfo]?: string;
      [SessionInfoType.HomePageSessionInfo]?: string;
      [EventStreamMetadata.Page]:
        | PageContext.SearchPage
        | PageContext.SortDetailPageDiscover
        | PageContext.SortDetailPageHome
        | PageContext.HomePage
        | PageContext.GamesPage
        | PageContext.GameDetailPage
        | PageContext.PeopleListInHomePage;
    }
  | Record<string, never>;

export default {
  [EventType.GameImpressions]: ({ ...params }: TGameImpressions): TEvent => [
    {
      name: EventType.GameImpressions,
      type: EventType.GameImpressions,
      context: formInteraction
    },
    parseEventParams({
      ...params
    })
  ],
  [EventType.GameDetailReferral]: (params: TGameDetailReferral = {}): TEvent => [
    {
      name: EventType.GameDetailReferral,
      type: EventType.GameDetailReferral,
      context: pageLoad
    },
    parseEventParams({
      [EventStreamMetadata.AttributionId]: getAttributionId(AttributionType.GameDetailReferral),
      [EventStreamMetadata.HttpReferrer]: getHttpReferrer(),
      ...params
    })
  ],
  [EventType.SortDetailReferral]: (params: TSortDetailReferral = {}): TEvent => [
    {
      name: EventType.SortDetailReferral,
      type: EventType.SortDetailReferral,
      context: pageLoad
    },
    parseEventParams({
      ...params
    })
  ]
};

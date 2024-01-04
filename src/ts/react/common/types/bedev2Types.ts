import { TGameData } from './bedev1Types';

export enum TContentType {
  Game = 'Game',
  CatalogAsset = 'CatalogAsset',
  CatalogBundle = 'CatalogBundle'
}

export enum TTreatmentType {
  Carousel = 'Carousel',
  AvatarCarousel = 'AvatarCarousel',
  SortlessGrid = 'SortlessGrid'
}

export enum TSortTopic {
  Sponsored = 'Sponsored',
  SponsoredGame = 'SponsoredGame'
}

export enum TComponentType {
  AppGameTileNoMetadata = 'AppGameTileNoMetadata',
  GridTile = 'GridTile'
}

export enum TPlayerCountStyle {
  Always = 'Always',
  Hover = 'Hover'
}

export type TCatalog = {
  name: string;
  creatorName: string;
  creatorType: string;
  creatorId: number;
  lowestPrice?: number;
  price?: number;
  premiumPrice?: number;
  numberRemaining?: number;
  noPriceStatus: string;
  itemStatus: string[];
  itemRestrictions: string[];
  itemId: number;
  itemType: string;
};

export type TOmniRecommendationGame = {
  contentType: TContentType.Game;
  contentId: number;
  contentMetadata: Record<string, string>;
};
export type TOmniRecommendationCatalog = {
  contentType: TContentType.CatalogAsset | TContentType.CatalogBundle;
  contentId: number;
};
export type TOmniRecommendation = TOmniRecommendationGame | TOmniRecommendationCatalog;

export type TOmniRecommendationTopicLayoutData = {
  componentType?: TComponentType;
  playerCountStyle?: TPlayerCountStyle;
};

type TSharedGameSort = {
  topic: string;
  topicId: number;
  treatmentType: TTreatmentType.Carousel | TTreatmentType.SortlessGrid;
};

export type TOmniRecommendationGameSort = TSharedGameSort & {
  recommendationList: TOmniRecommendationGame[];
  topicLayoutData?: TOmniRecommendationTopicLayoutData;
  numberOfRows?: number;
};

export type TOmniRecommendationCatalogSort = {
  topic: string;
  topicId: number;
  treatmentType: TTreatmentType.AvatarCarousel;
  recommendationList: TOmniRecommendationCatalog[];
};

export type TExploreApiGameSortResponse = {
  sortDisplayName: string;
  sortId: string;
  treatmentType: TTreatmentType.Carousel;
  contentType: string;
  games: TGameData[];
  nextPageToken: string;
  gameSetTypeId: number;
  gameSetTargetId?: number;
};

export type TExploreApiSortsResponse = {
  sorts: TExploreApiGameSortResponse[];
  nextSortsPageToken: string;
};

export type TExploreApiGameSort = TSharedGameSort & {
  games: TGameData[];
  sortId: string;
  contentType: string;
  nextPageToken: string;
  gameSetTargetId?: number;
};

export type TExploreApiSorts = {
  sorts: TExploreApiGameSort[];
  nextSortsPageToken: string;
};

export type TGameSort = TExploreApiGameSort | TOmniRecommendationGameSort;

export type TOmniRecommendationSort = TOmniRecommendationGameSort | TOmniRecommendationCatalogSort;

export type TSort = TGameSort | TOmniRecommendationCatalogSort;

export type TGetOmniRecommendationsMetadataResponse = {
  contentMetadata: TOmniRecommendationsContentMetadata;
};

export type TOmniRecommendationsContentMetadata = {
  [TContentType.Game]: Record<string, TGameData>;
  [TContentType.CatalogAsset]: Record<string, TCatalog>;
  [TContentType.CatalogBundle]: Record<string, TCatalog>;
};

export type TGetOmniRecommendationsResponse = {
  sorts: TOmniRecommendationSort[];
} & TGetOmniRecommendationsMetadataResponse;

export enum TOmniSearchPageType {
  All = 'all'
}

export enum TOmniSearchContentType {
  Game = 'Game'
}

export type TOmniSearchContentDataModel = {
  contentType: string;
  contentId: number;
};

export type TOmniSearchGameDataModel = {
  contentType: string; // 'Game'
  contentId: number; // universeId
  universeId: number;
  rootPlaceId: number;
  name: string;
  description: string;
  playerCount: number;
  totalUpVotes: number;
  totalDownVotes: number;
  emphasis: boolean;
  isSponsored: boolean;
  nativeAdData: string;
  creatorName: string;
  creatorType: string;
  creatorId: number;
  creatorHasVerifiedBadge?: boolean;
};

export type TOmniSearchContentGroup = {
  contentGroupType: string;
  contents: TOmniSearchContentDataModel[];
};

export type TGetOmniSearchResponse = {
  searchResults: TOmniSearchContentGroup[];
  filteredSearchQuery: string;
  nextPageToken: string;
};

export type TGetOmniSearchParsedResponse = {
  filteredSearchQuery: string;
  nextPageToken: string;
  gamesList: TOmniSearchGameDataModel[];
};

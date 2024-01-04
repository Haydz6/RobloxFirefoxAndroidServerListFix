import { Presence, Intl } from 'Roblox';
import { abbreviateNumber, numberFormat, urlService } from 'core-utilities';
import {
  TGetFriendsResponse,
  TGearCategoryType,
  TFriendVisits,
  TGameData
} from '../types/bedev1Types';
import { EventStreamMetadata } from '../constants/eventStreamConstants';

export const GAME_STATS_PLACEHOLDER_STRING = '--';

export const dateTimeFormatter = new Intl().getDateTimeFormatter();

export const getGearIconName = (gearName: TGearCategoryType): string => {
  const gearMap: Record<string, string> = {
    PowerUps: 'PowerUp',
    Music: 'Musical',
    PersonalTransport: 'Transport'
  };
  return gearMap[gearName] || gearName;
};

export const getInGameFriends = (
  friendData: TGetFriendsResponse[],
  universeId: number
): TGetFriendsResponse[] => {
  return friendData.filter(
    friend =>
      friend.presence?.universeId === universeId &&
      friend.presence?.userPresenceType === Presence.PresenceTypes.InGame
  );
};

export const getFriendVisits = (
  friendData: TGetFriendsResponse[],
  friendVisits: TFriendVisits[] | undefined
): TGetFriendsResponse[] => {
  if (!friendVisits) {
    return [];
  }

  const friendIdMap = new Map<number, TGetFriendsResponse>(
    friendData.map(friend => [friend.id, friend])
  );

  const friendVisitData = friendVisits.map(friendVisit => friendIdMap.get(friendVisit.userId));

  return friendVisitData.filter(
    (friendVisit: TGetFriendsResponse | undefined): friendVisit is TGetFriendsResponse =>
      friendVisit !== undefined
  );
};

export const getVotePercentageValue = (upvotes: number, downvotes: number): number | undefined => {
  let percentUp = 0;
  if (!Number.isNaN(upvotes) && !Number.isNaN(downvotes)) {
    if (upvotes === 0 && downvotes === 0) {
      return undefined;
    }
    if (upvotes === 0 && downvotes !== 0) {
      percentUp = 0;
    } else if (upvotes !== 0 && downvotes === 0) {
      percentUp = 100;
    } else {
      percentUp = Math.floor((upvotes / (upvotes + downvotes)) * 100);
      percentUp = percentUp > 100 ? 100 : percentUp;
    }
  }
  return percentUp;
};

export const getVotePercentage = (upvotes: number, downvotes: number): string | undefined => {
  const votePercentageValue = getVotePercentageValue(upvotes, downvotes);

  return votePercentageValue !== undefined ? `${votePercentageValue}%` : undefined;
};

export const getPlayerCount = (playerCount: number): string => {
  return playerCount === -1
    ? GAME_STATS_PLACEHOLDER_STRING
    : abbreviateNumber.getAbbreviatedValue(playerCount);
};

export const capitalize = (args: string): string => {
  return args.charAt(0).toUpperCase() + args.slice(1);
};

export const humanizeCamelCase = (camelCasedString: string): string => {
  const splitString = camelCasedString.split(/([A-Z][a-z]*)/g);
  if (splitString.length === 1) {
    return camelCasedString;
  }
  return capitalize(splitString.filter(array => array.length !== 0).join(' '));
};

export const parseEventParams = (params: Record<string, any>): Record<string, string | number> => {
  return Object.keys(params).reduce<Record<string, string | number>>((acc, key) => {
    if (typeof params[key] === 'object' && params[key]) {
      acc[key] = JSON.stringify(params[key]);
    }

    if (typeof params[key] === 'number') {
      acc[key] = params[key] as number;
    }

    if (typeof params[key] === 'string') {
      acc[key] = encodeURIComponent(params[key]);
    }

    if (typeof params[key] === 'boolean') {
      acc[key] = params[key] ? 1 : 0;
    }

    return acc;
  }, {});
};

export const composeQueryString = (queryParams: Record<string, unknown>): string => {
  const parsedQueryParams = urlService.composeQueryString(queryParams);
  if (!parsedQueryParams) {
    return '';
  }

  return `?${parsedQueryParams}`;
};

type GameImpressionsEventSponsoredAdData = {
  [EventStreamMetadata.AdFlags]: number[];
  [EventStreamMetadata.AdIds]: string[];
};

export const getSponsoredAdImpressionsData = (
  gameData: TGameData[],
  impressedIndexes: number[]
): GameImpressionsEventSponsoredAdData | {} => {
  const hasSponsoredGame = impressedIndexes.some(index => gameData[index]?.isSponsored);

  if (hasSponsoredGame) {
    return {
      [EventStreamMetadata.AdsPositions]: impressedIndexes.map(index =>
        gameData[index].isSponsored ? 1 : 0
      ),
      [EventStreamMetadata.AdFlags]: impressedIndexes.map(index =>
        gameData[index].isSponsored ? 1 : 0
      ),
      [EventStreamMetadata.AdIds]: impressedIndexes.map(
        index => gameData[index]?.nativeAdData || '0'
      )
    };
  }

  return {};
};

// NOTE(jcountryman, 10/25/21): Assumes a comparision of two non-negative
// numeric ranges with the structure of [min, max] and generates a sorted impressed range of
// indexes based off baseline range.
export const calculateImpressedIndexes = (
  baseline: [number, number] | undefined,
  compared: [number, number]
): number[] => {
  if (baseline === undefined) {
    return Array.from(new Array(compared[1] - compared[0] + 1), (_, index) => index + compared[0]);
  }

  // NOTE(jcountryman, 10/25/21): Left intersect is not inclusive of max value
  // in range and right intersect is not inclusive of min value.
  const leftIntersect =
    compared[0] < baseline[0] ? ([compared[0], baseline[0]] as [number, number]) : undefined;
  const rightIntersect =
    compared[1] > baseline[1] ? ([baseline[1], compared[1]] as [number, number]) : undefined;
  const leftIntersectIndexes = leftIntersect
    ? new Array(leftIntersect[1] - leftIntersect[0])
        .fill(0)
        .map((_, index) => index + leftIntersect[0])
    : [];
  const rightIntersectIndexes = rightIntersect
    ? new Array(rightIntersect[1] - rightIntersect[0])
        .fill(0)
        .map((_, index) => index + rightIntersect[0] + 1)
    : [];

  return [...leftIntersectIndexes, ...rightIntersectIndexes];
};

export const splitArray = <T>(input: T[], maxSize: number): T[][] => {
  if (input.length === 0 || maxSize === 0) {
    return [input];
  }

  const numberOfSubArrays = Math.ceil(input.length / maxSize);
  return new Array(numberOfSubArrays)
    .fill(0)
    .map((_, index) => input.slice(index * maxSize, (index + 1) * maxSize));
};

export const { parseQueryString } = urlService;
export const { getAbbreviatedValue } = abbreviateNumber;
export const { getNumberFormat } = numberFormat;

export default {
  capitalize,
  humanizeCamelCase,
  parseEventParams,
  getInGameFriends,
  getVotePercentageValue,
  getVotePercentage,
  getPlayerCount,
  getGearIconName,
  getNumberFormat,
  getAbbreviatedValue,
  dateTimeFormatter,
  parseQueryString,
  composeQueryString,
  getSponsoredAdImpressionsData,
  calculateImpressedIndexes,
  splitArray,
  GAME_STATS_PLACEHOLDER_STRING
};

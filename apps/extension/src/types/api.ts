import {
  CreateTweetVariables,
  DraftTweetVariables,
  FavoriteTweetVariables,
  HomeLatestTimelineVariables,
  HomeTimelineVariables,
  SearchTimelineVariables,
  TweetDetailVariables,
} from './tweet';

// GraphQL 叩くときに送られる features
export type Features = {
  [key: string]: boolean;
};
// GraphQL 叩くときに送られる features
export type FieldToggles = {
  [key: string]: boolean;
};

// GraphQL の variables
export type Variables =
  | HomeLatestTimelineVariables
  | DraftTweetVariables
  | CreateTweetVariables
  | FavoriteTweetVariables
  | SearchTimelineVariables
  | TweetDetailVariables
  | HomeTimelineVariables;

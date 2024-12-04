export type Tweet_results = {
  result: {
    rest_id: string;
    core?: {
      user_results: {
        result: {
          legacy: {
            can_dm: boolean;
            can_media_tag: boolean;
            created_at: string;
            screen_name: string;
          };
          __typename: 'User';
        };
      };
    };
    legacy?: {
      bookmark_count: number;
      favorite_count: number;
      favorited: boolean;
      full_text: string;
      id_str: string;
      reply_count: number;
      retweet_count: number;
      retweeted: boolean;
      user_id_str: string;
      entities: Legacy_Entity;
    };
    views: {
      count?: number;
      state: 'Enabled' | 'EnabledWithCount';
    };
    tombstone?: Tombstone;
    __typename: 'Tweet';
  };
  __typename: 'TimelineTweet';
};
type PromotedMetadata = {
  impressionId: string;
  impressionString: string;
};
type Tombstone = {
  text: {
    rtl: boolean;
    text: string;
  };
  __typename: 'TextTombstone';
};
type Legacy_Entity = {
  media?: Array<Legacy_Entity_Media>;
};
type Legacy_Entity_Media = {
  allow_download_status: {
    allow_download: boolean;
  };
  media_url_https: string;
};

type Item_TimelineTweet = {
  entryId: string;
  item: {
    itemContent: {
      itemType: 'TimelineTweet';
      tweetDisplayType: 'Tweet' | 'SelfThread';
      tweet_results: Tweet_results;
      __typename: 'TimelineTweet';
    };
  };
};

export type ItemContent_TimelineTweet = {
  itemType: 'TimelineTweet';
  tweetDisplayType: 'Tweet';
  tweet_results: Tweet_results;
  promotedMetadata?: PromotedMetadata;
};
// 「スパムの可能性がある返信を表示」というリプライに表示されるラベル
type ItemContent_TimelineLabel = {
  display_type: 'InlineHeader';
  itemType: 'TimelineLabel';
  text: string;
  __typename: 'TimelineLabel';
};
// カーソルデータ
// cursorType: Bottom: 一番下までスクロールしたときに表示される
// cursorType: ShowMoreThreads: ツイートのリプライのとこに「スパムの可能性がある返信を表示」と表示されるラベル
type ItemContent_TimelineTimelineCursor = {
  cursorType: 'Bottom' | 'ShowMoreThreads';
  itemType: 'TimelineTimelineCursor';
  value: string;
  displayTreatment?: {
    actionText: string;
  };
  __typename: 'TimelineTimelineCursor';
};

export type Entry_TimelineTimelineItem_ItemContent =
  | ItemContent_TimelineTweet
  | ItemContent_TimelineLabel
  | ItemContent_TimelineTimelineCursor;

// ツイート内容本体など
export type Entry_TimelineTimelineItem = {
  content: {
    clientEventInfo: {
      details: {
        timelinesDetails: string;
      };
    };
    entryType: 'TimelineTimelineItem';
    itemContent: Entry_TimelineTimelineItem_ItemContent;
    __typename: 'TimelineTimelineItem';
  };
  entryId: string;
  sortIndex: string;
};
export type Entry_TimelineTimelineCursor = {
  content: {
    cursorType: 'Top' | 'Bottom';
    entryType: 'TimelineTimelineCursor';
    value: string;
    __typename: 'TimelineTimelineCursor';
  };
  entryId: string;
  sortIndex: string;
};
// ツイートのリプライなど
export type Entry_TimelineTimelineModule = {
  content: {
    displayType: 'VerticalConversation';
    entryType: 'TimelineTimelineModule';
    items: Array<Item_TimelineTweet>;
    __typename: 'TimelineTimelineModule';
  };
  entryId: string;
  sortIndex: string;
};

export type Instruction_TimelineAddEntries = {
  type: 'TimelineAddEntries';
  entries: Array<
    | Entry_TimelineTimelineItem
    | Entry_TimelineTimelineModule
    | Entry_TimelineTimelineCursor
  >;
};
export type Instruction_TimelineReplaceEntry = {
  type: 'TimelineReplaceEntry';
  entry_id_to_replace: string;
  entry: {
    content: Entry_TimelineTimelineCursor;
    entryId: string;
    sortIndex: string;
  };
};
type Instruction_TimelineTerminateTimeline = {
  direction: 'Top';
  type: 'TimelineTerminateTimeline';
};

export type HomeTimelineVariables = {
  count: number;
  cursor?: string;
  includePromotedContent: boolean;
  latestControlAvailable: boolean;
  requestContext?: 'launch';
  seenTweetIds?: Array<string>;
  withCommunity: boolean;
};
type Instruction_HomeTimeline =
  | Instruction_TimelineAddEntries
  | Entry_TimelineTimelineCursor;
export type HomeTimelineResponse = {
  data: {
    home: {
      home_timeline_urt: {
        instructions: Array<Instruction_HomeTimeline>;
      };
    };
  };
};

export type HomeLatestTimelineVariables = {
  count?: number;
  cursor?: string | null;
  requestContext?: string;
  includePromotedContent: boolean;
  latestControlAvailable: boolean;
  withCommunity: boolean;
  seenTweetIds: Array<string>;
};
type Instruction_HomeLatestTimeline =
  | Instruction_TimelineAddEntries
  | Instruction_TimelineTerminateTimeline;
export type HomeLatestTimelineResponse = {
  home: {
    home_timeline_urt: {
      instructions: Array<Instruction_HomeLatestTimeline>;
      metadata: {
        scribeConfig: {
          page: string;
        };
      };
    };
  };
};

export type CreateTweetVariables = {
  conversation_control?: {
    // Community: フォローしているユーザーのみ
    // ByInvitation: @ポストしたユーザーのみ
    // Verified: 認証済みユーザーのみ
    mode: 'Community' | 'ByInvitation' | 'Verified';
  };
  dark_request: boolean;
  disallowed_reply_options: Array<string> | null;
  media: {
    media_entities: Array<{
      media_id: string;
      tagged_users: Array<string>; // タグ続けするユーザーID
    }>;
    possibly_sensitive: boolean;
  };
  semantic_annotation_ids: Array<string>;
  tweet_text: string;
};

type RichtextOption = {
  from_index: number;
  richtext_types: Array<'Bold' | 'Italic'>;
  to_index: number;
};
export type DraftTweetVariables = {
  post_tweet_request: {
    auto_populate_reply_metadata: boolean;
    exclude_reply_user_ids: Array<string>;
    media_ids: Array<string>;
    richtext_options?: Array<RichtextOption>;
    status: string;
  };
};
export type DraftTweetResponse = {
  data: {
    tweet: {
      rest_id: string;
    };
  };
};

export type FavoriteTweetVariables = {
  tweet_id: string;
};
export type FavoriteTweetResponse = {
  data: {
    favorite_tweet: 'Done';
  };
};

export type UnfavoriteTweetVariables = {
  tweet_id: string;
};
export type UnfavoriteTweetResponse = {
  data: {
    unfavorite_tweet: 'Done';
  };
};

export type SearchTimelineVariables = {
  rawQuery: string;
  count: number;
  cursor?: string;
  querySource: 'typed_query' | 'recent_search_click';
  product: 'Top' | 'Latest' | 'People' | 'Media' | 'Lists';
};
type Instruction_SearchTimeline =
  | Instruction_TimelineAddEntries
  | Instruction_TimelineReplaceEntry;
export type SearchTimelineResponse = {
  data: {
    search_by_raw_query: {
      search_timeline: {
        timeline: {
          instructions: Array<Instruction_SearchTimeline>;
        };
      };
    };
  };
};

export type TweetDetailVariables = {
  focalTweetId: string;
  referrer?: 'tweet' | 'search';
  cursor?: string;
  controller_data?: string;
  with_rux_injections: boolean;
  rankingMode: 'Relevance';
  includePromotedContent: boolean;
  withCommunity: boolean;
  withQuickPromoteEligibilityTweetFields: boolean;
  withBirdwatchNotes: boolean;
  withVoice: boolean;
};
export type Instruction_TweetDetail =
  | Instruction_TimelineAddEntries
  | Instruction_TimelineTerminateTimeline;
export type TweetDetailResponse = {
  data: {
    threaded_conversation_with_injections_v2: {
      instructions: Array<Instruction_TweetDetail>;
    };
  };
};

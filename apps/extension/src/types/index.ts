import {
  Entry_TimelineTimelineCursor,
  Entry_TimelineTimelineItem,
  Entry_TimelineTimelineItem_ItemContent,
  Entry_TimelineTimelineModule,
  Instruction_TweetDetail,
  ItemContent_TimelineTweet,
  Tweet_results,
} from './tweet';

export * from './tweet';

export const isInstruction_TimelineAddEntries = (
  content: Instruction_TweetDetail,
) => {
  return content.type === 'TimelineAddEntries';
};

export const isEntry_TimelineTimelineItem = (
  entry:
    | Entry_TimelineTimelineItem
    | Entry_TimelineTimelineModule
    | Entry_TimelineTimelineCursor,
): entry is Entry_TimelineTimelineItem => {
  return (
    'content' in entry && entry.content.entryType === 'TimelineTimelineItem'
  );
};

export const isEntry_TimelineTimelineModule = (
  entry:
    | Entry_TimelineTimelineItem
    | Entry_TimelineTimelineModule
    | Entry_TimelineTimelineCursor,
): entry is Entry_TimelineTimelineModule => {
  return (
    'content' in entry && entry.content.entryType === 'TimelineTimelineModule'
  );
};

export const isItemContent_TimelineTweet = (
  content: Entry_TimelineTimelineItem_ItemContent,
) => {
  return content.itemType === 'TimelineTweet';
};

export const isPromoteTimeLineTweet = (tweet: ItemContent_TimelineTweet) => {
  return 'promotedMetadata' in tweet;
};

export const isTombstoneAccount = (tweet: Tweet_results) => {
  return tweet.result.tombstone?.__typename === 'TextTombstone';
};

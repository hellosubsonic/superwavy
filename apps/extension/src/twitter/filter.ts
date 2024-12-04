import type { HomeTimelineResponse, Tweet_results } from "../types/tweet"
import invariant from "tiny-invariant"
import type { Filters, NumericFilter } from "../bg/state"
import { generate, type CriterionConfig, type EnrichedTweet } from "./ai-filter"
export type ComparisonOperator = "gt" | "gte" | "lt" | "lte" | "eq"
import type { IAIService } from "../bg/example-service"
import { getRPCService } from "@webext-pegasus/rpc"

export function tweetMatchesFilters(
  tweet: EnrichedTweet,
  filters: Filters
): boolean {
  if (!tweet.result.legacy) {
    return false
  }

  const legacy = tweet.result.legacy
  const views = tweet.result.views.count
  const enriched = tweet.criterions

  const checkNumericFilter = (
    value: number | null | undefined,
    filter: NumericFilter | undefined | null
  ): boolean => {
    if (!filter || value === undefined || value === null) {
      return true
    }

    switch (filter.operator) {
      case "gt":
        return value > filter.value
      case "gte":
        return value >= filter.value
      case "lt":
        return value < filter.value
      case "lte":
        return value <= filter.value
      case "eq":
        return value === filter.value
    }
  }

  // Check numeric filters
  const numericChecks = [
    { value: legacy.bookmark_count, filter: filters.bookmarkCount },
    { value: legacy.favorite_count, filter: filters.likeCount },
    { value: legacy.reply_count, filter: filters.replyCount },
    { value: legacy.retweet_count, filter: filters.retweetCount },
    { value: views, filter: filters.viewCount }
  ]

  const numericFiltersMatch = numericChecks.every(({ value, filter }) =>
    checkNumericFilter(value, filter)
  )

  // Only check boolean filters that are explicitly set (not null)
  const booleanChecks = [
    { value: enriched.isStatusUpdate, filter: filters.isStatusUpdate },
    { value: enriched.isQuestion, filter: filters.isQuestion },
    { value: enriched.isOpinion, filter: filters.isOpinion },
    { value: enriched.isUnderrated, filter: filters.isUnderrated },
    { value: enriched.isTwitterOG, filter: filters.isTwitterOG }
  ].filter(({ filter }) => filter !== null)

  const booleanFiltersMatch = booleanChecks.every(
    ({ value, filter }) => value === filter
  )

  return numericFiltersMatch && booleanFiltersMatch
}

export async function parseTimeline(
  response: HomeTimelineResponse,
  filters: Filters,
  options: {
    onlineModel: boolean
  }
) {
  const aiService = getRPCService<IAIService>(
    // Same ID that was used for registration
    // We may have multiple instances of the same service executed independently
    "AIService",
    // Where sevice was registered
    "background"
  )
  const inst = response.data.home.home_timeline_urt.instructions[0]
  invariant(
    "type" in inst && inst.type === "TimelineAddEntries",
    "Not TimelineAddEntries"
  )

  // Create an array of promises for processing each entry
  const processedEntries = await Promise.all(
    inst.entries.map(async (entry) => {
      // Keep cursor entries
      if (entry.content.entryType === "TimelineTimelineCursor") {
        return { keep: true, entry }
      }

      // Only apply tweet filters to actual tweet entries
      try {
        if (entry.content.entryType === "TimelineTimelineItem") {
          if (entry.content.itemContent.itemType === "TimelineTweet") {
            // @ts-ignore
            let tweet: EnrichedTweet = entry.content.itemContent.tweet_results

            const enabledCriterions: CriterionConfig = {}

            if (filters.isQuestion) {
              enabledCriterions.isQuestion = true
            }

            if (filters.isStatusUpdate) {
              enabledCriterions.status = true
            }

            if (filters.isTwitterOG) {
              enabledCriterions.isTwitterOG = true
            }

            if (filters.isOpinion) {
              enabledCriterions.isOpinion = true
            }

            if (filters.isUnderrated) {
              enabledCriterions.isUnderrated = true
            }

            if (
              filters.isStatusUpdate ||
              filters.isTwitterOG ||
              filters.isQuestion ||
              filters.isOpinion ||
              filters.isUnderrated
            ) {
              const enriched = await aiService.generate(
                tweet,
                enabledCriterions,
                options.onlineModel
              )
              tweet = {
                ...tweet,
                criterions: enriched.criterions
              }

              console.log({
                tweet: tweet.result.legacy?.full_text,
                criterions: enriched.criterions
              })

              return {
                keep: tweetMatchesFilters(tweet, filters),
                entry
              }
            } else {
              return {
                keep: tweetMatchesFilters(tweet, filters),
                entry
              }
            }
          }
        }
        // Keep all other non-tweet entries
        return { keep: true, entry }
      } catch (error) {
        // Keep entries if there's an error parsing them
        console.error("Error parsing tweet:", error)
        return { keep: true, entry }
      }
    })
  )

  // Filter the entries based on the results
  inst.entries = processedEntries
    .filter((result) => result.keep)
    .map((result) => result.entry)

  console.log(
    `Filtered entries: ${inst.entries.length}, Cursors: ${
      inst.entries.filter(
        (e) => e.content.entryType === "TimelineTimelineCursor"
      ).length
    }`
  )
}

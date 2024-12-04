import { generateObject } from "ai"
import { chromeai } from "chrome-ai"
import { object, z } from "zod"
import type { Tweet_results } from "../types/tweet"
import { createGoogleGenerativeAI } from "@ai-sdk/google"

// Define all possible criterions
export const criterionDefinitions = {
  status: {
    schema: z.boolean(),
    description:
      "true if tweet is sharing primarily their status (what they are doing right now) as per the original intention of twitter, false if they are sharing anything else or are at all sharing 'whats on their mind' or beliefs regarding current events (however sharing interests is ok), even if it seems initially like sharing status. Be more weighted towards false."
  },

  isQuestion: {
    schema: z.boolean(),
    description: "True if the tweet is a question, false otherwise"
  },
  isOpinion: {
    schema: z.boolean(),
    description: "True if the tweet is an opinion, false otherwise"
  },
  isUnderrated: {
    schema: z.boolean(),
    description: "True if the tweet is underrated, false otherwise"
  },
  isTwitterOG: {
    schema: z.boolean(),
    description: "True if the tweet is a Twitter OG, false otherwise"
  }
}

export type CriterionKey = keyof typeof criterionDefinitions
export type CriterionConfig = Partial<Record<CriterionKey, boolean>>

function createEnrichedSchema(enabledCriterions: CriterionConfig) {
  const criterionsObject: Record<string, any> = {}

  Object.entries(criterionDefinitions).forEach(([key, definition]) => {
    if (enabledCriterions[key as CriterionKey]) {
      criterionsObject[key] = definition.schema.describe(definition.description)
    }
  })

  return z.object({
    criterions: z.object(criterionsObject)
  })
}

export async function generate(
  tweet: any,
  enabledCriterions: CriterionConfig,
  onlineModel: boolean
) {
  const enrichedSchema = createEnrichedSchema(enabledCriterions)

  let model

  if (onlineModel) {
    const google = createGoogleGenerativeAI({
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY
    })
    model = google("gemini-1.5-flash")
  } else {
    model = chromeai("text", {
      temperature: 1
    })
  }

  const { object } = await generateObject({
    model: model,
    schema: enrichedSchema,
    prompt: `
    <tweet>
    
        ${tweet}
    
    </tweet>`,
    system:
      "You are tasked with analyzing tweets based on their content and style. Respond according to the instructions for each criterion as defined in the schema. Only answer true if you are 100% sure of it. If you are unsure, respond false."
  })

  return object
}

export type EnrichedTweet = Tweet_results &
  z.infer<ReturnType<typeof createEnrichedSchema>>

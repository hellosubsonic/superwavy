import { IPegasusRPCService, PegasusRPCMessage } from "@webext-pegasus/rpc"
import type { CriterionConfig } from "../twitter/ai-filter"
import { generate as generateAI } from "../twitter/ai-filter"
export type IAIService = InstanceType<typeof AIService>

export class AIService implements IPegasusRPCService<AIService> {
  // Every public method shall:
  // - accept "sender: PegasusRPCMessage" as first parameter, if it accepts any params
  // - accept / return only serializable values, as RPC messages must be serialized as they move between extension contexts
  // See "./src/types.test.ts" for more examples
  async generate(
    sender: PegasusRPCMessage,
    tweet: any,
    enabledCriterions: CriterionConfig,
    onlineModel: boolean
  ) {
    return this.#generateImpl(tweet, enabledCriterions, onlineModel)
  }

  // We keep implemenation in private method as we don't need sender information here
  async #generateImpl(
    tweet: any,
    enabledCriterions: CriterionConfig,
    onlineModel: boolean
  ) {
    return await generateAI(tweet, enabledCriterions, onlineModel)
  }
}

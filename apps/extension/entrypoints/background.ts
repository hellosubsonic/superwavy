import { initPegasusTransport } from "@webext-pegasus/transport/background"
import { twitterStoreBackendReady } from "../src/bg/state"
import { registerRPCService } from "@webext-pegasus/rpc"
import { AIService } from "../src/bg/example-service"

export default defineBackground(() => {
  initPegasusTransport()
  registerRPCService("AIService", new AIService())

  twitterStoreBackendReady().then((store: any) => {
    // Initialize store with empty state if needed
    const currentState = store.getState()
    if (!currentState) {
      store.setState({
        bookmarkCount: undefined,
        likeCount: undefined,
        replyCount: undefined,
        retweetCount: undefined,
        viewCount: undefined
      })
    }

    // Log state changes for debugging
    store.subscribe((state: any) => {
      console.log("Twitter store state updated:", state)
    })
  })
})

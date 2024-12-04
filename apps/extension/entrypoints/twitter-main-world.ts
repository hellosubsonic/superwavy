import { initPegasusTransport } from "@webext-pegasus/transport/window"
import { twitterStoreReady, useTwitterStore, Filters } from "../src/bg/state"
import { parseTimeline } from "../src/twitter/filter"

function interceptTimeline(
  filters: Filters,
  options: {
    onlineModel: boolean
  }
) {
  const TIMELINE_PATTERN =
    /^https:\/\/(twitter\.com|x\.com)\/i\/api\/graphql\/[^/]+\/(HomeTimeline|UserTweets|SearchTimeline)/

  // Store the original XHR prototype methods
  const originalOpen = XMLHttpRequest.prototype.open
  const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader
  const originalSend = XMLHttpRequest.prototype.send

  // Override the XHR prototype
  XMLHttpRequest.prototype.open = function (
    method: string,
    url: string | URL,
    async: boolean = true,
    username?: string | null,
    password?: string | null
  ) {
    // Store the URL for later use
    this._customUrl = url.toString()
    return originalOpen.call(this, method, url, async, username, password)
  }

  XMLHttpRequest.prototype.send = function (
    body?: Document | XMLHttpRequestBodyInit | null
  ) {
    if (TIMELINE_PATTERN.test(this._customUrl)) {
      const originalReadyStateChange = this.onreadystatechange

      this.onreadystatechange = async function (
        this: XMLHttpRequest,
        ev: Event
      ) {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          try {
            // Store original response
            const originalResponse = this.responseText
            const response = JSON.parse(originalResponse)

            // Wait for the async filtering to complete
            await parseTimeline(response, filters, options)
            console.log("Parsed timeline")

            // Override the response after filtering
            const filteredResponse = JSON.stringify(response)
            Object.defineProperty(this, "responseText", {
              get: () => filteredResponse
            })
            Object.defineProperty(this, "response", {
              get: () => filteredResponse
            })
          } catch (error) {
            console.error("Error in XHR filter:", error)
          }
        }

        // Call the original readystatechange handler if it exists
        if (originalReadyStateChange) {
          originalReadyStateChange.call(this, ev)
        }
      }
    }

    return originalSend.call(this, body)
  }
}

export default defineUnlistedScript(() => {
  initPegasusTransport({ namespace: "twitter" })

  twitterStoreReady().then((store) => {
    interceptTimeline(store.getState().filters, {
      onlineModel: store.getState().options.onlineModel
    })

    store.subscribe((state) => {
      console.log(state, "state changed")
      interceptTimeline(store.getState().filters, store.getState().options)

      window.location.reload()
    })
  })
})

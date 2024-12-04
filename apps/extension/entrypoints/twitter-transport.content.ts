import { initPegasusTransport } from "@webext-pegasus/transport/content-script"

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",
  runAt: "document_start",

  async main(ctx) {
    initPegasusTransport({
      allowWindowMessagingForNamespace: "twitter"
    })
    await injectScript("/twitter-main-world.js", {
      keepInDom: true
    })
  }
})

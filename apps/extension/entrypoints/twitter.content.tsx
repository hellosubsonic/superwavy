import React from "react"
import ReactDOM from "react-dom/client"
import { UI_SELECTOR, withAppProviders } from "../src/cs/Content"
import { initPegasusTransport } from "@webext-pegasus/transport/content-script"
import useTwitterStore, { twitterStoreReady } from "../src/bg/state"
import { Superwavy } from "@repo/ui/components/super-wavvy"
const App: React.FC = () => {
  const state = useTwitterStore()
  return <Superwavy state={state} />
}

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",
  runAt: "document_end",

  async main(ctx) {
    const waitForElement = (selector: string) => {
      return new Promise<Element | null>((resolve) => {
        if (document.querySelector(selector)) {
          return resolve(document.querySelector(selector))
        }

        const observer = new MutationObserver(() => {
          if (document.querySelector(selector)) {
            resolve(document.querySelector(selector))
            observer.disconnect()
          }
        })

        observer.observe(document.body, {
          childList: true,
          subtree: true
        })
      })
    }

    initPegasusTransport({
      allowWindowMessagingForNamespace: "twitter"
    })

    waitForElement('[data-testid="primaryColumn"]').then(
      async (primaryColumn) => {
        if (!primaryColumn) return

        const ui = await createShadowRootUi(ctx, {
          name: UI_SELECTOR,
          position: "inline",
          anchor: '[data-testid="primaryColumn"]',
          append: "first",
          onMount: (container) => {
            console.log("Mounted")
            const app = document.createElement("div")
            app.id = "root"
            app.style.height = "106px"
            container.append(app)
            let root: ReactDOM.Root
            const AppWithProviders = withAppProviders(App)
            root = ReactDOM.createRoot(app)
            twitterStoreReady().then(() => {
              root.render(<AppWithProviders container={container} />)
            })
            return root
          },
          onRemove: (root) => {
            root?.unmount()
          }
        })

        ui.mount()
      }
    )
  }
})

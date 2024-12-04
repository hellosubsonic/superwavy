import React from "react"
import ReactDOM from "react-dom/client"
import { BaseApp } from "./Base"
import { initPegasusTransport } from "@webext-pegasus/transport/options"
import { twitterStoreReady } from "../bg/state"
initPegasusTransport()
function AppWrapper({ AppComponent }: { AppComponent: React.ComponentType }) {
  return (
    <BaseApp>
      <AppComponent />
    </BaseApp>
  )
}

export function renderApp(App: React.ComponentType) {
  twitterStoreReady()
    .then(() => {
      ReactDOM.createRoot(document.getElementById("root")!).render(
        <AppWrapper AppComponent={App} />
      )
    })
    .catch(console.error)
}

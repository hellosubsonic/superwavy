import React, { useEffect, useState } from "react"
import { BaseApp } from "./Base"

interface WithAppProvidersProps {
  container: HTMLElement
}

export const UI_SELECTOR = "repo-ui"

export function withAppProviders<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AppProviders(props: P & WithAppProvidersProps) {
    const { container, ...rest } = props

    useEffect(() => {
      const repoUI = document.querySelector(UI_SELECTOR)
      if (!repoUI || !(repoUI.shadowRoot instanceof ShadowRoot)) {
        console.error("Could not find longlist-ui element or its ShadowRoot")
        return
      }

      const shadowHead = repoUI.shadowRoot.querySelector("head")
      if (!shadowHead) {
        console.error("Could not find head in shadow DOM")
        return
      }

      const styleElement = document.createElement("style")
      shadowHead.appendChild(styleElement)

      return () => {
        shadowHead.removeChild(styleElement)
      }
    }, [])

    return (
      <BaseApp>
        <WrappedComponent {...(rest as P)} />
      </BaseApp>
    )
  }
}

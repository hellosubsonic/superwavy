<!-- Generated by scripts/generate-diffs.ts -->

# React Content Script UI

> Based off the [`react`](https://github.com/wxt-dev/wxt/tree/main/templates/react) template.
>
> ```sh
> npx wxt@latest init --template react
> ```

This example will walk you through creating a UI inside a content script with isolated styles inside a ShadowRoot using React.

To add a content script to the extension, create a file named `content/index.tsx` inside the `entrypoints/` directory.

> See https://wxt.dev/entrypoints/content-scripts.html for alternatie names.

###### entrypoints/content/index.tsx

```tsx
import "./style.css"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"

export default defineContentScript({
  matches: ["*://*/*"],
  cssInjectionMode: "ui",

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: "wxt-react-example",
      position: "inline",
      anchor: "body",
      append: "first",
      onMount: (container) => {
        const root = ReactDOM.createRoot(container)
        root.render(<App />)
        return root
      },
      onRemove: (root) => {
        root?.unmount()
      }
    })

    ui.mount()
  }
})
```

There's lots of stuff going on there:

1. We're importing a CSS file containing styles for the entire UI and using `cssInjectionMode: "ui"` to automatically load it into our UI when mounted.
2. We're calling `createShadowRootUi`, defining a UI that will be mounted as the first child of the `body` element.
3. Inside `onMount` and `onRemove`, we're creating and unmounting a react app.
4. Finally, we're actually mounting the ui on the page by calling `ui.mount()`

Don't forget to add the CSS file:

###### entrypoints/content/style.css

```css
* {
  padding: 0;
  margin: 0;
}

body {
  background-color: black;
  padding: 16px;
}
```

Next, let's create the app:

###### entrypoints/content/App.tsx

```tsx
import { useState } from "react"
import "./App.module.css"

export default () => {
  const [count, setCount] = useState(1)
  const increment = () => setCount((count) => count + 1)

  return (
    <div>
      <p>This is React. {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  )
}
```

###### entrypoints/content/App.module.css

```css
p {
  color: yellow;
  font-weight: bold;
}
```

It's just a basic counter app with scoped styles, nothing special here.

And that's it! Just run `pnpm dev` to start the app for development, visit a website, like <https://google.com>, and you should see a black and yellow UI show up at the top of the page.
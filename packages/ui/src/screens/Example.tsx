import React from "react"
import { Button } from "../components/ui/button"

interface ExampleComponentProps {
  text: string
  onClick: () => void
}

export const ExampleComponent: React.FC<ExampleComponentProps> = ({
  text,
  onClick
}) => {
  return (
    <div className="p-4 bg-gray-200 rounded">
      <h2 className="text-xl font-semibold mb-2">{text}</h2>
      <Button variant="destructive" onClick={onClick}>
        Click me
      </Button>
    </div>
  )
}

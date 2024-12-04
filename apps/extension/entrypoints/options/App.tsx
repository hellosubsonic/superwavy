import React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@repo/ui/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@repo/ui/components/ui/select"
import { Input } from "@repo/ui/components/ui/input"
import { Button } from "@repo/ui/components/ui/button"
import { Switch } from "@repo/ui/components/ui/switch"
import {
  useTwitterStore,
  type Filters,
  type NumericFilter
} from "../../src/bg/state"
import { Label } from "@repo/ui/components/ui/label"

// Type utility to extract boolean keys from Filters type
type BooleanKeys<T> = {
  [K in keyof T]: T[K] extends boolean | null ? K : never
}[keyof T]

const FilterOptions = () => {
  const filters = useTwitterStore((state) => state.filters)
  const setFilter = useTwitterStore((state) => state.setFilter)
  const clearFilters = useTwitterStore((state) => state.clearFilters)
  const hasFilters = useTwitterStore((state) => state.hasFilters)

  const metrics = [
    { value: "likeCount", label: "Likes" },
    { value: "bookmarkCount", label: "Bookmarks" },
    { value: "replyCount", label: "Replies" },
    { value: "retweetCount", label: "Retweets" },
    { value: "viewCount", label: "Views" }
  ]

  const operators = [
    { value: "gt", label: "Greater than" },
    { value: "gte", label: "Greater than or equal" },
    { value: "lt", label: "Less than" },
    { value: "lte", label: "Less than or equal" },
    { value: "eq", label: "Equal to" }
  ]

  // Automatically derive toggle filters from Filters type
  const toggleFilters = (Object.keys(filters) as Array<keyof Filters>)
    .filter((key): key is BooleanKeys<Filters> => 
      typeof filters[key] === 'boolean' || filters[key] === null
    )
    .map(key => ({
      key,
      label: key
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
        .trim()
    }))

  const [selectedMetric, setSelectedMetric] = React.useState("")
  const [selectedOperator, setSelectedOperator] = React.useState("")
  const [filterValue, setFilterValue] = React.useState("")
  const [error, setError] = React.useState("")

  const validateAndAddFilter = () => {
    setError("")

    if (!selectedMetric) {
      setError("Please select a metric")
      return
    }
    if (!selectedOperator) {
      setError("Please select an operator")
      return
    }
    if (!filterValue || isNaN(Number(filterValue))) {
      setError("Please enter a valid number")
      return
    }

    handleFilterChange(selectedMetric, selectedOperator, filterValue)
    // Reset inputs
    setSelectedMetric("")
    setSelectedOperator("")
    setFilterValue("")
  }

  const handleFilterChange = (metric, operator, value) => {
    if (!operator || !value) return
    const numValue = parseInt(value)
    if (isNaN(numValue)) return
    setFilter(metric, { operator, value: numValue })
  }

  const handleToggleFilter = (key: keyof Filters) => {
    const currentValue = filters[key] as boolean | null
    setFilter(key, currentValue === null ? true : currentValue ? false : null)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      validateAndAddFilter()
    }
  }

  const renderActiveFilters = () => {
    const numericFilters = Object.entries(filters).filter(
      ([key, value]) => value && typeof value === "object"
    )

    const booleanFilters = Object.entries(filters).filter(
      ([key, value]) => typeof value === "boolean"
    )

    return (
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Active Filters:</div>
        <div className="space-y-1">
          {numericFilters.map(
            ([key, filter]) =>
              filter && (
                <div
                  key={key}
                  className="flex items-center justify-between text-sm">
                  <span>
                    {metrics.find((m) => m.value === key)?.label}{" "}
                    {operators
                      .find(
                        (o) => o.value === (filter as NumericFilter).operator
                      )
                      ?.label.toLowerCase()}{" "}
                    {(filter as NumericFilter).value}
                  </span>
                  <button
                    className="text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setFilter(key as keyof Filters, null)
                    }}
                    aria-label="Remove filter">
                    ×
                  </button>
                </div>
              )
          )}
          {booleanFilters.map(
            ([key, value]) =>
              value && (
                <div
                  key={key}
                  className="flex items-center justify-between text-sm">
                  <span>{toggleFilters.find((t) => t.key === key)?.label}</span>
                  <button
                    className="text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setFilter(key as keyof Filters, null)
                    }}
                    aria-label="Remove filter">
                    ×
                  </button>
                </div>
              )
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Tweet Filter Options</CardTitle>
          <CardDescription>
            Configure filters to customize your tweet feed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {hasFilters() && renderActiveFilters()}

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Metric Filters</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="metric">Metric</Label>
                  <Select
                    value={selectedMetric}
                    onValueChange={setSelectedMetric}>
                    <SelectTrigger id="metric" className="w-full">
                      <SelectValue placeholder="Select metric" />
                    </SelectTrigger>
                    <SelectContent>
                      {metrics.map((metric) => (
                        <SelectItem key={metric.value} value={metric.value}>
                          {metric.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operator">Operator</Label>
                  <Select
                    value={selectedOperator}
                    onValueChange={setSelectedOperator}>
                    <SelectTrigger id="operator" className="w-full">
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder="Enter value"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full"
                  />
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-500 mt-2">{error}</div>
              )}

              <Button
                onClick={validateAndAddFilter}
                className="w-full sm:w-auto">
                Add Metric Filter
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Toggle Filters</h3>
              <div className="space-y-4">
                {toggleFilters.map((filter) => (
                  <div
                    key={filter.key}
                    className="flex items-center justify-between">
                    <Label htmlFor={filter.key} className="cursor-pointer">
                      {filter.label}
                    </Label>
                    <Switch
                      id={filter.key}
                      checked={filters[filter.key as keyof Filters] === true}
                      onCheckedChange={() =>
                        handleToggleFilter(filter.key as keyof Filters)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {hasFilters() && (
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault()
                  clearFilters()
                }}
                className="w-full sm:w-auto text-red-500 hover:text-red-600">
                Clear All Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default FilterOptions

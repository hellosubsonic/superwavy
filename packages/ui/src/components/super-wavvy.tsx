import React, { useState } from "react"
import {
  Settings,
  X,
  Eye,
  Globe,
  ChevronDown,
  Github,
  Languages,
  Grid
} from "lucide-react"
import { cn } from "../lib/utils"
// @ts-ignore
import { Store, type Store } from "../../../../apps/extension/src/bg/state"
interface FilterStyle {
  background: string
  pattern: string
  description: string
}

const getPattern = (
  type: string,
  enhancedPatterns: boolean,
  showPatterns: boolean
) => {
  if (!showPatterns) return ""

  const scale = enhancedPatterns ? "15px" : "10px"
  const contrast = enhancedPatterns ? "0.2" : "0.1"

  switch (type) {
    case "status":
      return `repeating-linear-gradient(45deg,transparent,transparent ${scale},rgba(255,255,255,${contrast}) ${scale},rgba(255,255,255,${contrast}) ${parseInt(scale) * 2}px)`
    case "opinions":
      return `repeating-radial-gradient(circle at center,transparent 0,transparent ${scale},rgba(255,255,255,${contrast}) ${scale},rgba(255,255,255,${contrast}) ${parseInt(scale) * 2}px)`
    case "questions":
      return `repeating-linear-gradient(-45deg,transparent,transparent ${scale},rgba(255,255,255,${contrast}) ${scale},rgba(255,255,255,${contrast}) ${parseInt(scale) * 2}px)`
    case "underrated":
      return `repeating-linear-gradient(90deg,transparent,transparent ${scale},rgba(255,255,255,${contrast}) ${scale},rgba(255,255,255,${contrast}) ${parseInt(scale) * 2}px)`
    case "twitter":
      return `repeating-linear-gradient(0deg,transparent,transparent ${scale},rgba(255,255,255,${contrast}) ${scale},rgba(255,255,255,${contrast}) ${parseInt(scale) * 2}px)`
    default:
      return ""
  }
}

interface SettingTileProps {
  enabled?: boolean
  onChange?: () => void
  description: string
  children?: React.ReactNode
}

const SettingTile = ({
  enabled,
  onChange,
  description,
  children
}: SettingTileProps) => (
  <div className="bg-gray-800/50 backdrop-blur flex flex-col items-center justify-center h-[53px] p-2 text-white rounded-lg">
    <div className="text-xs text-gray-300 text-center mb-1.5">
      {description}
    </div>
    {onChange ? (
      <button
        onClick={onChange}
        className={cn(
          "w-8 h-4 rounded-full transition-colors relative",
          enabled ? "bg-green-500" : "bg-gray-600"
        )}>
        <div
          className={cn(
            "w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform",
            enabled ? "translate-x-4" : "translate-x-0.5"
          )}
        />
      </button>
    ) : (
      children
    )}
  </div>
)

const LanguageSelect = ({
  value,
  onChange
}: {
  value: string
  onChange: (value: string) => void
}) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none bg-gray-700 text-white text-xs rounded-md px-2 py-1 pr-6 focus:outline-none focus:ring-1 focus:ring-purple-500">
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
      <option value="de">Deutsch</option>
    </select>
    <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
  </div>
)

const ModelSelect = ({
  value,
  onChange
}: {
  value: "local" | "server"
  onChange: (value: "local" | "server") => void
}) => (
  <div className="flex gap-3">
    <label className="flex items-center gap-1.5">
      <input
        type="radio"
        checked={value === "local"}
        onChange={() => onChange("local")}
        className="w-3 h-3 text-purple-500 bg-gray-700 border-gray-600"
      />
      <span className="text-xs text-gray-300">Local</span>
    </label>
    <label className="flex items-center gap-1.5">
      <input
        type="radio"
        checked={value === "server"}
        onChange={() => onChange("server")}
        className="w-3 h-3 text-purple-500 bg-gray-700 border-gray-600"
      />
      <span className="text-xs text-gray-300">Server</span>
    </label>
  </div>
)

// Add descriptions for each filter type
const filterDescriptions: Record<string, string> = {
  status: "Show only status updates and personal tweets",
  opinions: "Show tweets expressing opinions and thoughts",
  questions: "Show only tweets asking questions",
  underrated: "Show tweets from lesser-known accounts",
  "twitter-ogs": "Show tweets from accounts older than 5 years"
}

export function Superwavy({ state }: { state: Store }) {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
  const [isSettingsMode, setIsSettingsMode] = useState(false)
  const [enhancedPatterns, setEnhancedPatterns] = useState(false)
  const [autoTranslate, setAutoTranslate] = useState(false)
  const [language, setLanguage] = useState("en")
  const [translatePreviews, setTranslatePreviews] = useState(false)
  const [showPatterns, setShowPatterns] = useState(true)
  const [modelType, setModelType] = useState<"local" | "server">("local")

  const toggleFilter = (filter: string) => {
    setSelectedFilter(selectedFilter === filter ? null : filter)
  }

  const buttonClass = (filter: string) =>
    cn(
      selectedFilter === filter && "ring-4 ring-white ring-inset scale-95",
      "transition-all duration-200 ease-in-out"
    )

  return (
    <div className="w-[600px] h-[106px] grid grid-cols-3 grid-rows-2 gap-1 bg-slate-900 p-1">
      <div className="flex items-center justify-between bg-gradient-to-br from-purple-600 to-pink-500 text-white font-bold text-xl px-4">
        <span className="transform -rotate-6">Superwavy</span>
        <button
          onClick={() => setIsSettingsMode(!isSettingsMode)}
          className="p-2 hover:bg-white/20 rounded-full transition-colors">
          {isSettingsMode ? <X size={20} /> : <Settings size={20} />}
        </button>
      </div>

      {!isSettingsMode ? (
        <>
          <button
            onClick={() =>
              state.setFilter("isStatusUpdate", !state.filters.isStatusUpdate)
            }
            title={filterDescriptions.status}
            className={cn(
              "bg-emerald-500 hover:bg-emerald-600 transition-colors text-white font-medium p-4 flex items-center justify-center",
              cn(
                state.filters.isStatusUpdate &&
                  "ring-4 ring-white ring-inset scale-95",
                "transition-all duration-200 ease-in-out"
              )
            )}
            style={{
              backgroundImage: getPattern(
                "status",
                enhancedPatterns,
                showPatterns
              )
            }}>
            {autoTranslate ? "Estado" : "Status"}
          </button>

          <button
            onClick={() =>
              state.setFilter("isOpinion", !state.filters.isOpinion)
            }
            title={filterDescriptions.opinions}
            className={cn(
              "bg-amber-500 hover:bg-amber-600 transition-colors text-white font-medium p-4 flex items-center justify-center",
              cn(
                state.filters.isOpinion &&
                  "ring-4 ring-white ring-inset scale-95",
                "transition-all duration-200 ease-in-out"
              )
            )}
            style={{
              backgroundImage: getPattern(
                "opinions",
                enhancedPatterns,
                showPatterns
              )
            }}>
            {autoTranslate ? "Opiniones" : "Opinions"}
          </button>

          <button
            onClick={() =>
              state.setFilter("isQuestion", !state.filters.isQuestion)
            }
            title={filterDescriptions.questions}
            className={cn(
              "bg-blue-500 hover:bg-blue-600 transition-colors text-white font-medium p-4 flex items-center justify-center",
              cn(
                state.filters.isQuestion &&
                  "ring-4 ring-white ring-inset scale-95",
                "transition-all duration-200 ease-in-out"
              )
            )}
            style={{
              backgroundImage: getPattern(
                "questions",
                enhancedPatterns,
                showPatterns
              )
            }}>
            {autoTranslate ? "Preguntas" : "Questions"}
          </button>

          <button
            onClick={() =>
              state.setFilter("isUnderrated", !state.filters.isUnderrated)
            }
            title={filterDescriptions.underrated}
            className={cn(
              "bg-red-500 hover:bg-red-600 transition-colors text-white font-medium p-4 flex items-center justify-center",
              cn(
                state.filters.isUnderrated &&
                  "ring-4 ring-white ring-inset scale-95",
                "transition-all duration-200 ease-in-out"
              )
            )}
            style={{
              backgroundImage: getPattern(
                "underrated",
                enhancedPatterns,
                showPatterns
              )
            }}>
            {autoTranslate ? "Subvalorado" : "Underrated"}
          </button>

          <button
            onClick={() =>
              state.setFilter("isTwitterOG", !state.filters.isTwitterOG)
            }
            title={filterDescriptions["twitter-ogs"]}
            className={cn(
              "bg-violet-500 hover:bg-violet-600 transition-colors text-white font-medium p-4 flex items-center justify-center",
              cn(
                state.filters.isTwitterOG &&
                  "ring-4 ring-white ring-inset scale-95",
                "transition-all duration-200 ease-in-out"
              )
            )}
            style={{
              backgroundImage: getPattern(
                "twitter",
                enhancedPatterns,
                showPatterns
              )
            }}>
            Twitter OGs
          </button>
        </>
      ) : (
        <>
          <SettingTile
            enabled={showPatterns}
            onChange={() => setShowPatterns(!showPatterns)}
            description="Show decorative patterns"
          />

          <SettingTile description="Change UI language">
            <LanguageSelect value={language} onChange={setLanguage} />
          </SettingTile>

          <SettingTile
            enabled={translatePreviews}
            onChange={() => setTranslatePreviews(!translatePreviews)}
            description="Translate Tweet Previews"
          />

          <SettingTile description="Filter model type">
            <ModelSelect
              value={state.options.onlineModel ? "server" : "local"}
              onChange={(value) => {
                state.setOption(
                  "onlineModel",
                  state.options.onlineModel ? null : "server"
                )
              }}
            />
          </SettingTile>

          <a
            href="https://github.com/yourusername/superwavy"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800/50 backdrop-blur rounded-lg h-[53px] flex items-center justify-center gap-2 text-gray-300 hover:text-white hover:bg-gray-800/70 transition-all">
            <Github size={14} />
            <span className="text-xs">Contribute</span>
          </a>
        </>
      )}
    </div>
  )
}

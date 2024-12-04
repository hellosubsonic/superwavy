import { create } from "zustand"
import {
  initPegasusZustandStoreBackend,
  pegasusZustandStoreReady
} from "@webext-pegasus/store-zustand"

// Constants
export const STORE_NAME = "GlobalTwitterState"

// Types
export type NumericFilter = {
  operator: "gt" | "gte" | "lt" | "lte" | "eq"
  value: number
}

export type Filters = {
  bookmarkCount: NumericFilter | null
  likeCount: NumericFilter | null
  replyCount: NumericFilter | null
  retweetCount: NumericFilter | null
  viewCount: NumericFilter | null
  // Added boolean filters
  isStatusUpdate: boolean
  isQuestion: boolean
  isOpinion: boolean
  isUnderrated: boolean
  isTwitterOG: boolean
}

export type Options = {
  onlineModel: boolean
}

export type Store = {
  filters: Filters
  options: Options
  setFilter: (
    key: keyof Filters,
    filter: NumericFilter | boolean | null
  ) => void
  setOption: (key: keyof Options, value: boolean) => void
  clearFilters: () => void
  hasFilters: () => boolean
}

const initialState: Filters = {
  bookmarkCount: null,
  likeCount: null,
  replyCount: null,
  retweetCount: null,
  viewCount: null,
  isStatusUpdate: false,
  isQuestion: false,
  isOpinion: false,
  isUnderrated: false,
  isTwitterOG: false
}

const initialOptions: Options = {
  onlineModel: false
}

// Create store
export const useTwitterStore = create<Store>((set, get) => ({
  filters: initialState,
  options: initialOptions,

  setFilter: (key, filter) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: filter
      }
    }))
  },

  setOption: (key, value) => {
    set((state) => ({
      options: {
        ...state.options,
        [key]: value
      }
    }))
  },

  clearFilters: () => {
    set({ filters: initialState })
  },

  hasFilters: () => {
    const state = get()
    return Object.values(state.filters).some((filter) => filter !== null)
  }
}))

// Pegasus store initialization
export const twitterStoreBackendReady = () =>
  initPegasusZustandStoreBackend(STORE_NAME, useTwitterStore, {
    storageStrategy: "local"
  })

export const twitterStoreReady = () =>
  pegasusZustandStoreReady(STORE_NAME, useTwitterStore)

export default useTwitterStore

import { persist, createJSONStorage, StateStorage } from "zustand/middleware"
import { localExtStorage } from "@webext-core/storage"

// Custom storage object
export const webextStorage: StateStorage = {
  getItem: async (name: string) => {
    return (await localExtStorage.getItem(name)) || null
  },
  setItem: async (name: string, value: string) => {
    await localExtStorage.setItem(name, value)
  },
  removeItem: async (name: string) => {
    await localExtStorage.removeItem(name)
  }
}

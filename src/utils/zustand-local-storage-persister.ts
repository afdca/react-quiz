import type { PersistStorage, StorageValue } from "zustand/middleware"

// TODO enable the caller to indicate which keys should not be serialized
export function createLocalStoragePersister<T>(): PersistStorage<T> {
  return {
    getItem: (name: string) => {
      const str: string | null = localStorage.getItem(name)
      if (!str) return null
      return JSON.parse(str) as StorageValue<T>
    },
    setItem: (name: string, value: StorageValue<T>) => {
      localStorage.setItem(name, JSON.stringify(value))
    },
    removeItem: (name: string) => {
      localStorage.removeItem(name)
    },
  }
}

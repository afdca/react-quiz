import { createLocalStoragePersister } from "@/utils/zustand-local-storage-persister"
import { create } from "zustand"
import { persist } from "zustand/middleware"

const THEMES_MAP = {
  dim: "dark",
  dark: "dark",
  light: "light",
  synthwave: "dark",
  fantasy: "light",
  autumn: "light",
  business: "dark",
  emerald: "light",
  cupcake: "light",
  nord: "light",
  corporate: "light",
  lemonade: "light",
  forest: "dark",
  night: "dark",
  winter: "light",
  // "default",
  // "garden",
  // "pastel",
  // "bumblebee",
  // "retro",
  // "cyberpunk",
  // "valentine",
  // "halloween",
  // "aqua",
  // "lofi",
  // "wireframe",
  // "black",
  // "luxury",
  // "dracula",
  // "cmyk",
  // "acid",
  // "coffee",
  // "sunset",
} as const

type ITheme = keyof typeof THEMES_MAP

const DEFAULT_THEME = "dim" satisfies ITheme

interface IThemeState {
  currentTheme: ITheme
  currentThemeCategory: "light" | "dark"
  allThemes: ITheme[]
  setTheme: (theme: ITheme) => void
}

export const useTheme = create<IThemeState>()(
  persist(
    (set) => ({
      currentTheme: DEFAULT_THEME,
      currentThemeCategory: THEMES_MAP[DEFAULT_THEME],
      allThemes: Object.keys(THEMES_MAP) as ITheme[],
      setTheme: (theme: ITheme) => {
        set((state: IThemeState) => ({
          ...state,
          currentTheme: theme,
          currentThemeCategory: THEMES_MAP[theme],
        }))
      },
    }),
    {
      name: "react-quiz-theme-store",
      storage: createLocalStoragePersister(),
    }
  )
)

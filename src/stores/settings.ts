import { reactive, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Settings, SubtitleStyle } from '@/types/settings'
import { translationLanguages, type LanguageOption } from '@/lib/languages'
import { normalizeWeight } from '@/lib/fonts'

const STORAGE_KEY = 'captionflow.settings.v2'

function createDefaultStyle(): SubtitleStyle {
  return {
    font: 'Lato',
    color: '#ffd700',
    size: 37,
    shadowColor: '#000000',
    shadowOffset: 2,
    weight: 700,
  }
}

function createDefaultSettings(): Settings {
  return {
    showOriginal: true,
    sourceLang: 'es',
    isDarkMode: true,
    showSubtitleBox: true,
    subtitleBoxOpacity: 60,
    chromaWidth: 960,
    chromaHeight: 240,
    original: createDefaultStyle(),
    translations: [
      {
        active: true,
        lang: 'en',
        style: { ...createDefaultStyle(), font: 'Montserrat', color: '#ffffff', weight: 700 },
      },
      {
        active: false,
        lang: 'fr',
        style: { ...createDefaultStyle(), font: 'Noto Sans', color: '#4FC3F7', weight: 500 },
      },
    ],
  }
}

function loadFromStorage(): Settings {
  const defaults = createDefaultSettings()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaults
    const parsed = JSON.parse(raw) as Partial<Settings> | null
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !parsed.original ||
      !Array.isArray(parsed.translations)
    ) {
      return defaults
    }
    return {
      showOriginal: parsed.showOriginal ?? defaults.showOriginal,
      sourceLang: parsed.sourceLang ?? defaults.sourceLang,
      isDarkMode: parsed.isDarkMode ?? defaults.isDarkMode,
      showSubtitleBox: parsed.showSubtitleBox ?? defaults.showSubtitleBox,
      subtitleBoxOpacity: parsed.subtitleBoxOpacity ?? defaults.subtitleBoxOpacity,
      chromaWidth: parsed.chromaWidth ?? defaults.chromaWidth,
      chromaHeight: parsed.chromaHeight ?? defaults.chromaHeight,
      original: { ...defaults.original, ...parsed.original },
      translations: defaults.translations.map((def, i) => ({
        ...def,
        ...parsed.translations?.[i],
        style: { ...def.style, ...parsed.translations?.[i]?.style },
      })),
    }
  } catch {
    return defaults
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = reactive<Settings>(loadFromStorage())

  watch(
    settings,
    (value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      } catch {
        // Almacenamiento no disponible (cuota/privacidad): ignorar.
      }
    },
    { deep: true },
  )

  function restoreDefaults(): void {
    const defaults = createDefaultSettings()
    settings.showOriginal = defaults.showOriginal
    settings.sourceLang = defaults.sourceLang
    settings.isDarkMode = defaults.isDarkMode
    settings.showSubtitleBox = defaults.showSubtitleBox
    settings.subtitleBoxOpacity = defaults.subtitleBoxOpacity
    settings.chromaWidth = defaults.chromaWidth
    settings.chromaHeight = defaults.chromaHeight
    settings.original = { ...defaults.original }
    settings.translations = defaults.translations.map((t) => ({ ...t, style: { ...t.style } }))
  }

  function availableTranslationLanguages(index: 0 | 1): readonly LanguageOption[] {
    const source = settings.sourceLang
    const other = settings.translations[1 - index]?.lang ?? ''
    return translationLanguages.filter((lang) => lang.code !== source && lang.code !== other)
  }

  function syncWeightForFont(font: string, style: SubtitleStyle): void {
    style.weight = normalizeWeight(font, style.weight)
  }

  return { settings, restoreDefaults, availableTranslationLanguages, syncWeightForFont }
})

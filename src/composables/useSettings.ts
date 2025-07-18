import {
  reactive,
  watch,
  computed,
  readonly,
  provide,
  inject,
  type Ref,
} from 'vue'

/* ---------- Interfaces TypeScript ---------- */

export interface SubtitleStyle {
  font: string
  color: string
  size: number
  shadowColor: string
  shadowOffset: number
  weight: number
}

export interface TranslationSetting {
  active: boolean
  lang: string
  style: SubtitleStyle
}

export interface Settings {
  showOriginal: boolean
  sourceLang: string
  original: SubtitleStyle
  translations: TranslationSetting[]
  isDarkMode: boolean
}

/* ---------- Catálogos de configuración ---------- */

export const availableFonts: readonly string[] = [
  'Inter',
  'Roboto',
  'Lato',
  'Montserrat',
  'Open Sans',
  'Noto Sans'
] as const

export const fontWeightsByFont: Record<string, number[]> = {
  'Inter': [500, 600, 700, 800],
  'Roboto': [500, 700, 900],
  'Lato': [700, 900],
  'Montserrat': [600, 700, 800, 900],
  'Open Sans': [600, 700, 800],
  'Noto Sans': [500, 700, 900],
}

export const speechLanguages: readonly { code: string; name: string }[] = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'Inglés' },
  { code: 'fr', name: 'Francés' },
  { code: 'de', name: 'Alemán' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Portugués' },
  { code: 'ru', name: 'Ruso' },
  { code: 'zh-CN', name: 'Chino (simplificado)' },
  { code: 'zh-TW', name: 'Chino (tradicional)' },
  { code: 'ja', name: 'Japonés' },
  { code: 'ko', name: 'Coreano' },
  { code: 'ar', name: 'Árabe' },
  { code: 'hi', name: 'Hindi' },
  { code: 'tr', name: 'Turco' },
  { code: 'pl', name: 'Polaco' },
  { code: 'nl', name: 'Holandés' },
  { code: 'id', name: 'Indonesio' },
  { code: 'th', name: 'Tailandés' },
  { code: 'vi', name: 'Vietnamita' }
] as const

export const translationLanguages = speechLanguages

/* ---------- Valores por defecto actualizados ---------- */

const defaultSettings: Settings = {
  showOriginal: false,
  sourceLang: 'es',
  isDarkMode: true,
  original: {
    font: 'Lato',
    color: '#ffd700',
    size: 37,
    shadowColor: '#000000',
    shadowOffset: 2,
    weight: 700,
  },
  translations: [
    {
      active: true,
      lang: 'en',
      style: {
        font: 'Montserrat',
        color: '#ffffff',
        size: 37,
        shadowColor: '#000000',
        shadowOffset: 2,
        weight: 700,
      },
    },
    {
      active: false,
      lang: 'fr',
      style: {
        font: 'Noto Sans',
        color: '#1E90FF',
        size: 37,
        shadowColor: '#000000',
        shadowOffset: 2,
        weight: 500,
      },
    },
  ],
}

/* ---------- Gestión de persistencia con localStorage ---------- */

const STORAGE_KEY = 'captionFlowSettings' // ✅ Actualizado

function loadFromStorage(): Settings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed && typeof parsed === 'object' && parsed.original && parsed.translations) {
        if (parsed.isDarkMode === undefined) {
          parsed.isDarkMode = true
        }
        return parsed
      }
    }
  } catch (error) {
    console.warn('Error al cargar configuración desde localStorage:', error)
  }
  return defaultSettings
}

function saveToStorage(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('Error al guardar configuración en localStorage:', error)
  }
}

/* ---------- Estado reactivo con persistencia automática ---------- */

const state = reactive<Settings>(loadFromStorage())

document.documentElement.classList.toggle('dark', state.isDarkMode)

watch(
    state,
    (newSettings) => {
      saveToStorage(newSettings)
      document.documentElement.classList.toggle('dark', newSettings.isDarkMode)
    },
    { deep: true }
)

/* ---------- Funciones utilitarias ---------- */

function restoreDefaults(): void {
  state.showOriginal = defaultSettings.showOriginal
  state.sourceLang = defaultSettings.sourceLang
  state.isDarkMode = defaultSettings.isDarkMode

  state.original.font = defaultSettings.original.font
  state.original.color = defaultSettings.original.color
  state.original.size = defaultSettings.original.size
  state.original.shadowColor = defaultSettings.original.shadowColor
  state.original.shadowOffset = defaultSettings.original.shadowOffset
  state.original.weight = defaultSettings.original.weight

  state.translations[0].active = defaultSettings.translations[0].active
  state.translations[0].lang = defaultSettings.translations[0].lang
  state.translations[0].style.font = defaultSettings.translations[0].style.font
  state.translations[0].style.color = defaultSettings.translations[0].style.color
  state.translations[0].style.size = defaultSettings.translations[0].style.size
  state.translations[0].style.shadowColor = defaultSettings.translations[0].style.shadowColor
  state.translations[0].style.shadowOffset = defaultSettings.translations[0].style.shadowOffset
  state.translations[0].style.weight = defaultSettings.translations[0].style.weight

  state.translations[1].active = defaultSettings.translations[1].active
  state.translations[1].lang = defaultSettings.translations[1].lang
  state.translations[1].style.font = defaultSettings.translations[1].style.font
  state.translations[1].style.color = defaultSettings.translations[1].style.color
  state.translations[1].style.size = defaultSettings.translations[1].style.size
  state.translations[1].style.shadowColor = defaultSettings.translations[1].style.shadowColor
  state.translations[1].style.shadowOffset = defaultSettings.translations[1].style.shadowOffset
  state.translations[1].style.weight = defaultSettings.translations[1].style.weight

  saveToStorage(state)
}

function getValidTranslations(index: 0 | 1): typeof translationLanguages {
  const srcBase = state.sourceLang
  const otherLang = state.translations[1 - index].lang
  return translationLanguages.filter(
      lang => lang.code !== srcBase && lang.code !== otherLang
  )
}

/* ---------- Provide/Inject para gestión de estado ---------- */

const SETTINGS_KEY = Symbol('settings')
interface SettingsInjection {
  state: Settings
  restoreDefaults: () => void
  available1: Ref<typeof translationLanguages>
  available2: Ref<typeof translationLanguages>
}

export function provideSettings(): void {
  provide(SETTINGS_KEY, readonly(state))
  provide('settingsMutation', {
    state,
    restoreDefaults,
    available1: computed(() => getValidTranslations(0)),
    available2: computed(() => getValidTranslations(1)),
  })
}

export function useSettings(): SettingsInjection {
  const injection = inject('settingsMutation') as SettingsInjection | undefined
  if (!injection) {
    throw new Error('useSettings debe llamarse dentro de un componente que tenga provideSettings')
  }
  return injection
}

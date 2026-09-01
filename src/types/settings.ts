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
  showSubtitleBox: boolean
  subtitleBoxOpacity: number
  subtitleBoxColor: string
  chromaWidth: number
  chromaHeight: number
  soundsEnabled: boolean
  soundsVolume: number
}

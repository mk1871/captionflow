export interface LanguageOption {
  code: string
  name: string
}

export const speechLanguages: readonly LanguageOption[] = [
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
  { code: 'vi', name: 'Vietnamita' },
]

export const translationLanguages: readonly LanguageOption[] = speechLanguages

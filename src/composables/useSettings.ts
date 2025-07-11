import { reactive, watch, computed } from 'vue';

export const availableFonts = [
  'Roboto',
  'Bebas Neue',
  'Audiowide',
  'Black Ops One',
  'Russo One',
  'Orbitron',
  'Anton',
  'Teko',
  'Rajdhani',
  'Press Start 2P',
];

export interface SubtitleStyle {
  font: string;
  color: string;
  size: number;
  shadowColor: string;
  shadowOffset: number;
}

export interface TranslationSetting {
  active: boolean;
  lang: string;
  style: SubtitleStyle;
}

export interface Settings {
  showOriginal: boolean;
  sourceLang: string;
  original: SubtitleStyle;
  translations: TranslationSetting[];
}

// Lista de idiomas para reconocimiento de voz (con locale)
export const speechLanguages = [
  { code: 'es-ES', name: 'Español (España)' },
  { code: 'en-US', name: 'Inglés (Estados Unidos)' },
  { code: 'fr-FR', name: 'Francés (Francia)' },
  { code: 'de-DE', name: 'Alemán (Alemania)' },
  { code: 'it-IT', name: 'Italiano (Italia)' },
  { code: 'pt-PT', name: 'Portugués (Portugal)' },
  { code: 'pt-BR', name: 'Portugués (Brasil)' },
  { code: 'ja-JP', name: 'Japonés (Japón)' },
  { code: 'ko-KR', name: 'Coreano (Corea del Sur)' },
  { code: 'zh-CN', name: 'Chino (Mandarín, Simplificado)' },
  { code: 'ru-RU', name: 'Ruso (Rusia)' },
  { code: 'ar-SA', name: 'Árabe (Arabia Saudita)' },
  { code: 'hi-IN', name: 'Hindi (India)' },
  { code: 'tr-TR', name: 'Turco (Turquía)' },
  { code: 'nl-NL', name: 'Neerlandés (Países Bajos)' },
  { code: 'sv-SE', name: 'Sueco (Suecia)' },
  { code: 'pl-PL', name: 'Polaco (Polonia)' },
  { code: 'da-DK', name: 'Danés (Dinamarca)' },
  { code: 'fi-FI', name: 'Finlandés (Finlandia)' },
  { code: 'no-NO', name: 'Noruego (Noruega)' },
];

// Lista de idiomas para traducción (códigos ISO 639-1)
export const translationLanguages = [
  { code: 'en', name: 'Inglés' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Francés' },
  { code: 'de', name: 'Alemán' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Portugués' },
  { code: 'ja', name: 'Japonés' },
  { code: 'ko', name: 'Coreano' },
  { code: 'zh-CN', name: 'Chino Simplificado' },
  { code: 'ru', name: 'Ruso' },
  { code: 'ar', name: 'Árabe' },
  { code: 'hi', name: 'Hindi' },
  { code: 'tr', name: 'Turco' },
  { code: 'nl', name: 'Neerlandés' },
  { code: 'sv', name: 'Sueco' },
  { code: 'pl', name: 'Polaco' },
  { code: 'da', name: 'Danés' },
  { code: 'fi', name: 'Finlandés' },
  { code: 'no', name: 'Noruego' },
  { code: 'th', name: 'Tailandés' },
  { code: 'id', name: 'Indonesio' },
  { code: 'vi', name: 'Vietnamita' },
  { code: 'el', name: 'Griego' },
  { code: 'cs', name: 'Checo' },
  { code: 'hu', name: 'Húngaro' },
];

const defaultSettings: Settings = {
  showOriginal: true,
  sourceLang: 'es-ES',
  original: {
    font: 'Roboto',
    color: '#ffffff',
    size: 48,
    shadowColor: '#000000',
    shadowOffset: 2,
  },
  translations: [
    {
      active: true,
      lang: 'en',
      style: {
        font: 'Roboto',
        color: '#ffd700',
        size: 48,
        shadowColor: '#000000',
        shadowOffset: 2,
      },
    },
    {
      active: false,
      lang: 'fr',
      style: {
        font: 'Roboto',
        color: '#ff4444',
        size: 48,
        shadowColor: '#000000',
        shadowOffset: 2,
      },
    },
  ],
};

const storedSettings = localStorage.getItem('subtitleSettings');
const settings = reactive<Settings>(storedSettings ? JSON.parse(storedSettings) : defaultSettings);

watch(settings, (newSettings) => {
  localStorage.setItem('subtitleSettings', JSON.stringify(newSettings));
}, { deep: true });

export function useSettings() {
  const restoreDefaults = () => {
    Object.assign(settings, defaultSettings);
  };

  // Helper para obtener el código base del idioma (ej. 'es' de 'es-ES')
  const getBaseLangCode = (fullCode: string) => fullCode.split('-')[0];

  const getAvailableTranslationLangs = (currentTranslationIndex: number) => {
    const selectedSourceLangBase = getBaseLangCode(settings.sourceLang);
    const selectedTrans1Lang = settings.translations[0].lang;
    const selectedTrans2Lang = settings.translations[1].lang;

    return translationLanguages.filter(lang => {
      // Excluir si es el idioma de origen
      if (lang.code === selectedSourceLangBase) return false;

      // Excluir si es el idioma seleccionado en Traducción 1 (y estamos filtrando para Traducción 2)
      if (currentTranslationIndex === 1 && lang.code === selectedTrans1Lang) return false;

      // Excluir si es el idioma seleccionado en Traducción 2 (y estamos filtrando para Traducción 1)
      if (currentTranslationIndex === 0 && lang.code === selectedTrans2Lang) return false;

      return true;
    });
  };

  const availableTranslationLangs1 = computed(() => getAvailableTranslationLangs(0));
  const availableTranslationLangs2 = computed(() => getAvailableTranslationLangs(1));

  return { settings, restoreDefaults, speechLanguages, translationLanguages, availableTranslationLangs1, availableTranslationLangs2 };
}
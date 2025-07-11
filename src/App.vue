<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useSpeechRecognition } from './composables/useSpeechRecognition';
import { useTranslation } from './composables/useTranslation';
import { useSettings } from './composables/useSettings';
import SettingsPanel from './components/SettingsPanel.vue';

const { settings } = useSettings();

const originalText = ref('Texto reconocido de ejemplo'); // Restaurado texto de ejemplo
const translatedText1 = ref('Traducción primaria'); // Restaurado texto de ejemplo
const translatedText2 = ref('Traducción secundaria'); // Restaurado texto de ejemplo
const showSubtitles = ref(true); // Inicialmente visible

const clearSubtitles = () => {
  showSubtitles.value = false; // Inicia la transición de salida (opacidad a 0)
  setTimeout(() => {
    originalText.value = '';
    translatedText1.value = '';
    translatedText2.value = '';
  }, 500); // Duración de la transición en CSS
};

const { isListening, error: speechError, start, stop } = useSpeechRecognition(
  (result) => {
    originalText.value = result;
    showSubtitles.value = true; // Asegura que los subtítulos sean visibles al recibir texto
  },
  clearSubtitles,
  settings.sourceLang // Pasar el idioma de origen
);

const { translatedText: t1, error: translationError1, translate: translate1 } = useTranslation(); // Eliminado isLoading1
const { translatedText: t2, error: translationError2, translate: translate2 } = useTranslation(); // Eliminado isLoading2

// Watchers para actualizar los textos de traducción cuando cambian los resultados del composable
watch(t1, (newVal) => { translatedText1.value = newVal; });
watch(t2, (newVal) => { translatedText2.value = newVal; });

watch(originalText, (newText) => {
  if (newText) {
    if (settings.translations[0].active) {
      translate1(newText, settings.translations[0].lang);
    }
    if (settings.translations[1].active) {
      translate2(newText, settings.translations[1].lang);
    }
  }
});

// Observar cambios en el idioma de origen para reiniciar el reconocimiento
watch(() => settings.sourceLang, () => { // Eliminado 'newLang'
  if (isListening.value) {
    stop(); // Detener el reconocimiento actual
    // Dar un pequeño tiempo para que se detenga completamente antes de reiniciar
    setTimeout(() => {
      start();
    }, 100);
  }
});

// Función para generar el contorno del texto (borde)
const generateOutlineShadow = (offset: number, color: string) => {
  if (offset <= 0) return 'none';
  const shadows = [];
  for (let x = -offset; x <= offset; x++) {
    for (let y = -offset; y <= offset; y++) {
      if (x !== 0 || y !== 0) {
        shadows.push(`${x}px ${y}px 0 ${color}`);
      }
    }
  }
  return shadows.join(', ');
};

const originalStyle = computed(() => ({
  fontFamily: `'${settings.original.font}'`,
  color: settings.original.color,
  fontSize: `${settings.original.size}px`,
  textShadow: generateOutlineShadow(settings.original.shadowOffset, settings.original.shadowColor),
  transition: 'opacity 0.5s ease-out',
  opacity: showSubtitles.value ? 1 : 0,
}));

const translation1Style = computed(() => ({
  fontFamily: `'${settings.translations[0].style.font}'`,
  color: settings.translations[0].style.color,
  fontSize: `${settings.translations[0].style.size}px`,
  textShadow: generateOutlineShadow(settings.translations[0].style.shadowOffset, settings.translations[0].style.shadowColor),
  transition: 'opacity 0.5s ease-out',
  opacity: showSubtitles.value ? 1 : 0,
}));

const translation2Style = computed(() => ({
  fontFamily: `'${settings.translations[1].style.font}'`,
  color: settings.translations[1].style.color,
  fontSize: `${settings.translations[1].style.size}px`,
  textShadow: generateOutlineShadow(settings.translations[1].style.shadowOffset, settings.translations[1].style.shadowColor),
  transition: 'opacity 0.5s ease-out',
  opacity: showSubtitles.value ? 1 : 0,
}));

const googleFontsLink = computed(() => {
  const fonts = new Set<string>();
  fonts.add(settings.original.font);
  settings.translations.forEach(trans => fonts.add(trans.style.font));

  const fontFamilies = Array.from(fonts).map(font => {
    // Solicitar solo el nombre de la familia de la fuente, sin pesos específicos
    return font.replace(/ /g, '+');
  }).join('&family=');

  const url = `https://fonts.googleapis.com/css2?family=${fontFamilies}&display=swap`;
  console.log("Google Fonts URL:", url); // Log para depuración
  return url;
});

// Cargar las fuentes dinámicamente
watch(googleFontsLink, (newLink) => {
  const linkElement = document.getElementById('google-fonts-link');
  if (linkElement) {
    linkElement.setAttribute('href', newLink);
  } else {
    const newLinkElement = document.createElement('link');
    newLinkElement.id = 'google-fonts-link';
    newLinkElement.rel = 'stylesheet';
    newLinkElement.href = newLink;
    document.head.appendChild(newLinkElement);
  }
}, { immediate: true });

</script>

<template>
  <div class="flex flex-col h-screen">
    <!-- Sección superior: Pantalla verde para subtítulos -->
    <div class="w-full h-[40rem] bg-green-500 flex flex-col justify-end items-center p-10 relative">
      <div class="text-center">
        <p v-if="settings.showOriginal" :style="originalStyle">{{ originalText }}</p>
        <p v-if="settings.translations[0].active" :style="translation1Style">{{ translatedText1 }}</p>
        <p v-if="settings.translations[1].active" :style="translation2Style">{{ translatedText2 }}</p>
      </div>
    </div>

    <!-- Sección inferior: Controles y botón de inicio/detención -->
    <div class="flex-grow bg-gray-100 p-5 overflow-auto flex flex-col items-center">
      <div class="mb-5">
        <button @click="isListening ? stop() : start()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {{ isListening ? 'Detener Subtítulos' : 'Iniciar Subtítulos' }}
        </button>
        <p v-if="speechError" class="text-red-500 mt-2 text-center">Error de reconocimiento: {{ speechError }}</p>
        <p v-if="translationError1" class="text-red-500 mt-2 text-center">Error de traducción 1: {{ translationError1 }}</p>
        <p v-if="translationError2" class="text-red-500 mt-2 text-center">Error de traducción 2: {{ translationError2 }}</p>
      </div>
      <SettingsPanel />
    </div>
  </div>
</template>

<style>
/* Estilos globales si son necesarios */
</style>

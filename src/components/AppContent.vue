<script lang="ts" setup>
import {computed, ref, watch} from 'vue'
import SettingsPanel from '@/components/SettingsPanel.vue'
import SubtitlesOverlay from '@/components/SubtitlesOverlay.vue'
import AppFooter from '@/components/AppFooter.vue'
import {useSettings} from '@/composables/useSettings'
import {useSpeechRecognition} from '@/composables/useSpeechRecognition'
import {useTranslation} from '@/composables/useTranslation'

// Estado reactivo para los textos originales y traducciones
const original = ref<string>('')
const trans1 = ref<string>('')
const trans2 = ref<string>('')

// Acceso al estado global para el idioma de entrada y traducciones
const {state} = useSettings()

// Computed para los idiomas de traducción seleccionados
const lang1 = computed(() => state.translations[0]?.lang ?? 'en')
const lang2 = computed(() => state.translations[1]?.lang ?? 'fr')

// Instancias independientes de traducción
const {
  translate: translateToLang1,
  translatedText: translatedText1
} = useTranslation()
const {
  translate: translateToLang2,
  translatedText: translatedText2
} = useTranslation()

// ✅ RECONOCIMIENTO DE VOZ ACTUALIZADO CON PARÁMETRO isFinal
const {isListening, error, start} = useSpeechRecognition(
    async (text: string, isFinal: boolean) => {
      // Actualiza el texto original
      original.value = text

      // Log opcional para debugging
      if (isFinal) {
        console.log('Texto finalizado:', text)
      } else {
        console.log('Texto intermedio:', text)
      }

      // Traduce a ambos idiomas
      await translateToLang1(text, lang1.value)
      await translateToLang2(text, lang2.value)
    },
    () => {
      // Callback de limpieza (ejecutado después de 3 segundos de silencio)
      console.log('Limpiando por inactividad prolongada')
      original.value = ''
      trans1.value = ''
      trans2.value = ''
    },
    computed(() => state.sourceLang)
)

// Sincroniza las traducciones reactivamente
watch(translatedText1, (newValue) => {
  trans1.value = newValue
})
watch(translatedText2, (newValue) => {
  trans2.value = newValue
})

// Inicia el reconocimiento de voz al montar
start()
</script>

<template>
  <main class="h-screen w-screen grid grid-rows-[45vh_1fr] overflow-hidden bg-background text-foreground font-sans">
    <section class="relative w-full h-full">
      <SubtitlesOverlay
          :original="original"
          :trans1="trans1"
          :trans2="trans2"
      />
    </section>
    <aside class="w-full h-full overflow-y-auto bg-background text-foreground">
      <div class="p-4">
        <div class="max-w-7xl mx-auto">
          <SettingsPanel/>
          <div :class="[
                  isListening
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-destructive/10 text-destructive'
                ]"
               class="mt-4 p-3 rounded-[var(--radius)] shadow-sm">
            <div class="flex items-center">
              <div :class="[
                      isListening ? 'bg-secondary' : 'bg-destructive'
                    ]"
                   class="w-2 h-2 rounded-full mr-2"></div>
              <span class="text-sm font-medium">
                {{ isListening ? 'Escuchando...' : 'Micrófono desactivado' }}
              </span>
            </div>
            <p v-if="error" class="text-xs text-destructive mt-1">
              {{ error }}
            </p>
          </div>
        </div>
      </div>
      <!-- Footer integrado -->
      <AppFooter/>
    </aside>
  </main>
</template>

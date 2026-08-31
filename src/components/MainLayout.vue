<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { toast } from 'vue-sonner'
import { useSettingsStore } from '@/stores/settings'
import { useSubtitlesStore } from '@/stores/subtitles'
import { useSpeechRecognition } from '@/composables/useSpeechRecognition'
import { useTranslation } from '@/composables/useTranslation'
import { useChromaBroadcaster } from '@/composables/useChromaBroadcaster'
import { Toaster } from '@/components/ui/sonner'
import SubtitlesOverlay from '@/components/overlay/SubtitlesOverlay.vue'
import ControlPanel from '@/components/panel/ControlPanel.vue'
import AppFooter from '@/components/panel/AppFooter.vue'

const settings = useSettingsStore()
const subtitles = useSubtitlesStore()

useChromaBroadcaster()

const lang1 = computed(() => settings.settings.translations[0]?.lang ?? 'en')
const lang2 = computed(() => settings.settings.translations[1]?.lang ?? 'fr')

const {
  translate: translateToLang1,
  translatedText: text1,
  error: translationError1,
} = useTranslation()
const {
  translate: translateToLang2,
  translatedText: text2,
  error: translationError2,
} = useTranslation()

const TRANSLATION_DEBOUNCE = 400
let translateDebounce: ReturnType<typeof setTimeout> | null = null

function scheduleTranslation(text: string, isFinal: boolean): void {
  if (translateDebounce) clearTimeout(translateDebounce)
  const run = (): void => {
    const source = settings.settings.sourceLang
    void translateToLang1(text, lang1.value, source)
    void translateToLang2(text, lang2.value, source)
  }
  if (isFinal) {
    run()
  } else {
    translateDebounce = setTimeout(run, TRANSLATION_DEBOUNCE)
  }
}

const { isListening, error, start, stop } = useSpeechRecognition(
  (text, isFinal) => {
    subtitles.original = text
    scheduleTranslation(text, isFinal)
  },
  () => subtitles.clearAll(),
  computed(() => settings.settings.sourceLang),
)

watch(text1, (value) => {
  subtitles.trans1 = value
})

watch(text2, (value) => {
  subtitles.trans2 = value
})

const FATAL_SPEECH_ERRORS = new Set(['not-allowed', 'service-not-allowed', 'audio-capture'])

watch(error, (value) => {
  if (value && FATAL_SPEECH_ERRORS.has(value)) {
    toast.error('Micrófono', { id: 'mic-error', description: value })
  }
})

watch([translationError1, translationError2], ([e1, e2]) => {
  const value = e1 ?? e2
  if (value) {
    toast.error('Traducción', { id: 'translation-error', description: value })
  }
})

function applyDarkMode(): void {
  document.documentElement.classList.toggle('dark', settings.settings.isDarkMode)
}

watch(() => settings.settings.isDarkMode, applyDarkMode)

function toggleListening(): void {
  if (isListening.value) {
    stop()
  } else {
    start()
  }
}

onMounted(() => {
  applyDarkMode()
  start()
})

onUnmounted(() => {
  if (translateDebounce) clearTimeout(translateDebounce)
  stop()
})
</script>

<template>
  <main class="grid h-screen w-screen grid-rows-[30vh_1fr] overflow-hidden">
    <SubtitlesOverlay :chroma="false" />

    <div class="min-h-0 overflow-y-auto bg-background text-foreground">
      <div class="mx-auto w-full max-w-3xl p-4">
        <ControlPanel
          :is-listening="isListening"
          :error="error"
          @toggle-listening="toggleListening"
        />
      </div>
      <AppFooter />
    </div>

    <Toaster position="top-center" rich-colors />
  </main>
</template>

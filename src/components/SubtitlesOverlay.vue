<script lang="ts" setup>
import {computed, ref, watch} from 'vue'
import {useSettings} from '@/composables/useSettings'

interface Props {
  original: string
  trans1: string
  trans2: string
}

const props = defineProps<Props>()
const {state} = useSettings()

const showOriginal = computed(() =>
    state.showOriginal && props.original.trim() !== ''
)

const getTextStyle = (style: typeof state.original) => ({
  fontFamily: `${style.font}, sans-serif`,
  fontWeight: style.weight,
  fontSize: `${style.size}px`,
  color: style.color,
  textShadow: style.shadowOffset > 0
      ? `0 0 ${style.shadowOffset}px ${style.shadowColor}`
      : 'none',
  lineHeight: 1.2,
  letterSpacing: '0.01em',
})

// === LÓGICA YOUTUBE CORREGIDA CON LÍMITE DE CARACTERES ===
const trans1Lines = ref<string[]>([])
const lastFullText = ref<string>('')
const MAX_CHARS_PER_LINE = 42 // Límite de caracteres por línea como YouTube

// Función para dividir texto en líneas respetando límite de caracteres
const splitIntoLines = (text: string): string[] => {
  if (!text || text.trim() === '') return []

  const words = text.trim().split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word

    if (testLine.length <= MAX_CHARS_PER_LINE) {
      currentLine = testLine
    } else {
      if (currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        // Palabra muy larga, la dividimos
        lines.push(word.slice(0, MAX_CHARS_PER_LINE))
        currentLine = word.slice(MAX_CHARS_PER_LINE)
      }
    }
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}

// Función para detectar si es una nueva frase basada en puntuación
const isNewSentence = (newText: string, oldText: string): boolean => {
  if (!oldText) return true

  // Detecta si el texto nuevo es significativamente diferente
  const newWords = newText.trim().split(' ')
  const oldWords = oldText.trim().split(' ')

  // Si el nuevo texto es más corto, es una nueva frase
  if (newWords.length < oldWords.length) return true

  // Si las primeras palabras son completamente diferentes, es nueva frase
  const firstWordsMatch = newWords.slice(0, 3).join(' ') === oldWords.slice(0, 3).join(' ')
  return !firstWordsMatch
}

// Watcher principal corregido
watch(
    () => props.trans1,
    (newTrans1) => {
      if (!state.translations[0].active || !newTrans1?.trim()) {
        trans1Lines.value = []
        lastFullText.value = ''
        return
      }

      // Detecta si es una nueva frase completamente diferente
      if (isNewSentence(newTrans1, lastFullText.value)) {
        // Nueva frase: divide en líneas y mantiene solo las últimas 2
        const newLines = splitIntoLines(newTrans1)

        if (newLines.length > 0) {
          // Mantiene solo las últimas 2 líneas
          trans1Lines.value = newLines.slice(-2)
          lastFullText.value = newTrans1
        }
      } else {
        // Actualización de la frase actual: solo actualiza las líneas
        const updatedLines = splitIntoLines(newTrans1)

        if (updatedLines.length > 0) {
          // Mantiene solo las últimas 2 líneas
          trans1Lines.value = updatedLines.slice(-2)
          lastFullText.value = newTrans1
        }
      }
    },
    {immediate: true}
)

// Limpia cuando cambia el idioma
watch(
    () => state.translations[0].lang,
    () => {
      trans1Lines.value = []
      lastFullText.value = ''
    }
)

const originalKey = computed(() => `original-${props.original}`)
const trans2Key = computed(() => `trans2-${props.trans2}`)
</script>

<template>
  <div class="obs-chroma w-screen h-full flex flex-col justify-end items-center p-8">
    <div class="w-full max-w-[1280px] mx-auto space-y-4">

      <!-- Subtítulo Original -->
      <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-2 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition-all duration-250 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 -translate-y-1 scale-105"
          mode="out-in"
      >
        <p
            v-if="showOriginal"
            :key="originalKey"
            :style="getTextStyle(state.original)"
            class="text-center will-change-transform"
        >
          {{ original }}
        </p>
      </Transition>

      <!-- Subtítulo Principal (trans1) - LÓGICA YOUTUBE CORREGIDA -->
      <div
          v-if="state.translations[0].active"
          :style="{ minHeight: `${state.translations[0].style.size * 2.6}px` }"
          class="flex flex-col items-center justify-end"
      >
        <TransitionGroup
            class="flex flex-col items-center gap-1"
            enter-active-class="transition-all duration-400 ease-out"
            enter-from-class="opacity-0 translate-y-4 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 -translate-y-2 scale-105"
            move-class="transition-transform duration-300 ease-out"
            tag="div"
        >
          <p
              v-for="(line, index) in trans1Lines"
              :key="`line-${index}`"
              :style="getTextStyle(state.translations[0].style)"
              class="text-center will-change-transform"
          >
            {{ line }}
          </p>
        </TransitionGroup>
      </div>

      <!-- Subtítulo Secundario (trans2) -->
      <Transition
          enter-active-class="transition-all duration-300 ease-out delay-75"
          enter-from-class="opacity-0 translate-y-3 scale-90"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition-all duration-250 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 -translate-y-2 scale-110"
          mode="out-in"
      >
        <p
            v-if="state.translations[1].active && trans2"
            :key="trans2Key"
            :style="getTextStyle(state.translations[1].style)"
            class="text-center will-change-transform"
        >
          {{ trans2 }}
        </p>
      </Transition>

    </div>
  </div>
</template>

<style scoped>
.obs-chroma {
  backface-visibility: hidden;
  transform-style: preserve-3d;
}
</style>

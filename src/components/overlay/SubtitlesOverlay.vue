<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { SubtitleStyle } from '@/types/settings'
import { useSettingsStore } from '@/stores/settings'
import { useSubtitlesStore } from '@/stores/subtitles'

const settings = useSettingsStore()
const subtitles = useSubtitlesStore()

const translation1 = computed(() => settings.settings.translations[0]!)
const translation2 = computed(() => settings.settings.translations[1]!)

const showOriginal = computed(
  () => settings.settings.showOriginal && subtitles.original.trim() !== '',
)

function getTextStyle(style: SubtitleStyle): Record<string, string> {
  return {
    fontFamily: `'${style.font}', sans-serif`,
    fontWeight: String(style.weight),
    fontSize: `${style.size}px`,
    color: style.color,
    textShadow:
      style.shadowOffset > 0 ? `0 0 ${style.shadowOffset}px ${style.shadowColor}` : 'none',
    lineHeight: '1.2',
    letterSpacing: '0.01em',
  }
}

const MAX_CHARS_PER_LINE = 42

const trans1Lines = ref<string[]>([])
const lastFullText = ref('')

function splitIntoLines(text: string): string[] {
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

watch(
  () => subtitles.trans1,
  (newTrans1) => {
    if (!translation1.value.active || !newTrans1?.trim()) {
      trans1Lines.value = []
      lastFullText.value = ''
      return
    }
    const newLines = splitIntoLines(newTrans1)
    if (newLines.length > 0) {
      trans1Lines.value = newLines.slice(-2)
      lastFullText.value = newTrans1
    }
  },
  { immediate: true },
)

watch(
  () => translation1.value.lang,
  () => {
    trans1Lines.value = []
    lastFullText.value = ''
  },
)

const originalKey = computed(() => `original-${subtitles.original}`)
const trans2Key = computed(() => `trans2-${subtitles.trans2}`)
</script>

<template>
  <div class="flex h-full w-full flex-col items-center justify-end bg-[#00ff00] p-8">
    <div class="mx-auto w-full max-w-[1280px] space-y-4">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="translate-y-2 scale-95 opacity-0"
        enter-to-class="translate-y-0 scale-100 opacity-100"
        leave-active-class="transition-all duration-250 ease-in"
        leave-from-class="translate-y-0 scale-100 opacity-100"
        leave-to-class="-translate-y-1 scale-105 opacity-0"
        mode="out-in"
      >
        <p
          v-if="showOriginal"
          :key="originalKey"
          :style="getTextStyle(settings.settings.original)"
          class="text-center will-change-transform"
        >
          {{ subtitles.original }}
        </p>
      </Transition>

      <div
        v-if="translation1.active"
        :style="{ minHeight: `${translation1.style.size * 2.6}px` }"
        class="flex flex-col items-center justify-end"
      >
        <TransitionGroup
          tag="div"
          class="flex flex-col items-center gap-1"
          enter-active-class="transition-all duration-400 ease-out"
          enter-from-class="translate-y-4 scale-95 opacity-0"
          enter-to-class="translate-y-0 scale-100 opacity-100"
          leave-active-class="transition-all duration-300 ease-in"
          leave-from-class="translate-y-0 scale-100 opacity-100"
          leave-to-class="-translate-y-2 scale-105 opacity-0"
          move-class="transition-transform duration-300 ease-out"
        >
          <p
            v-for="(line, index) in trans1Lines"
            :key="`line-${index}`"
            :style="getTextStyle(translation1.style)"
            class="text-center will-change-transform"
          >
            {{ line }}
          </p>
        </TransitionGroup>
      </div>

      <Transition
        enter-active-class="transition-all duration-300 ease-out delay-75"
        enter-from-class="translate-y-3 scale-90 opacity-0"
        enter-to-class="translate-y-0 scale-100 opacity-100"
        leave-active-class="transition-all duration-250 ease-in"
        leave-from-class="translate-y-0 scale-100 opacity-100"
        leave-to-class="-translate-y-2 scale-110 opacity-0"
        mode="out-in"
      >
        <p
          v-if="translation2.active && subtitles.trans2"
          :key="trans2Key"
          :style="getTextStyle(translation2.style)"
          class="text-center will-change-transform"
        >
          {{ subtitles.trans2 }}
        </p>
      </Transition>
    </div>
  </div>
</template>

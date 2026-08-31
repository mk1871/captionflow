<script setup lang="ts">
import { ref, watch } from 'vue'
import type { SubtitleStyle } from '@/types/settings'

const props = withDefaults(
  defineProps<{
    text: string
    style: SubtitleStyle
    maxLines?: number
    maxCharsPerLine?: number
  }>(),
  {
    maxLines: 2,
    maxCharsPerLine: 42,
  },
)

const lines = ref<string[]>([])

function splitIntoLines(text: string): string[] {
  const words = text.trim().split(' ')
  const out: string[] = []
  let current = ''

  for (const word of words) {
    const test = current ? `${current} ${word}` : word
    if (test.length <= props.maxCharsPerLine) {
      current = test
    } else if (current) {
      out.push(current)
      current = word
    } else {
      out.push(word.slice(0, props.maxCharsPerLine))
      current = word.slice(props.maxCharsPerLine)
    }
  }

  if (current) out.push(current)
  return out
}

function getTextStyle(): Record<string, string> {
  return {
    fontFamily: `'${props.style.font}', sans-serif`,
    fontWeight: String(props.style.weight),
    fontSize: `${props.style.size}px`,
    color: props.style.color,
    textShadow:
      props.style.shadowOffset > 0
        ? `0 0 ${props.style.shadowOffset}px ${props.style.shadowColor}`
        : 'none',
    lineHeight: '1.2',
    letterSpacing: '0.01em',
  }
}

watch(
  () => props.text,
  (text) => {
    if (!text || text.trim() === '') {
      lines.value = []
      return
    }
    lines.value = splitIntoLines(text).slice(-props.maxLines)
  },
  { immediate: true },
)
</script>

<template>
  <TransitionGroup
    tag="div"
    class="flex flex-col items-center gap-1"
    enter-active-class="transition-all duration-200 ease-out"
    enter-from-class="translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    move-class="transition-transform duration-200 ease-out"
  >
    <p
      v-for="(line, index) in lines"
      :key="index"
      :style="getTextStyle()"
      class="text-center whitespace-pre-wrap"
    >
      {{ line }}
    </p>
  </TransitionGroup>
</template>

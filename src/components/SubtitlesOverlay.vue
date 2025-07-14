<script setup lang="ts">
import { computed } from 'vue'
import { useSettings } from '@/composables/useSettings'

interface Props {
  original: string
  trans1: string
  trans2: string
}

const props = defineProps<Props>()
const { state } = useSettings()

const showOriginal = computed(() =>
    state.showOriginal && props.original.trim() !== ''
)

// Estilos dinámicos para subtítulos
const getTextStyle = (style: typeof state.original) => ({
  fontFamily: `${style.font}, 'Noto Sans', 'Roboto', 'Open Sans', 'Montserrat', 'Lato', sans-serif`,
  fontWeight: style.weight,
  fontSize: `${style.size}px`,
  color: style.color,
  textShadow: style.shadowOffset > 0
      ? `0 0 ${style.shadowOffset}px ${style.shadowColor}, 0 0 ${style.shadowOffset * 2}px ${style.shadowColor}`
      : 'none',
  lineHeight: 1.2,
  letterSpacing: '0.01em',
})

// Keys para forzar re-renderizado en transiciones
const originalKey = computed(() => `original-${props.original}`)
const trans1Key = computed(() => `trans1-${props.trans1}`)
const trans2Key = computed(() => `trans2-${props.trans2}`)
</script>

<template>
  <div class="obs-chroma w-screen h-full flex flex-col justify-end items-center p-8">
    <div class="w-full max-w-[1280px] mx-auto space-y-3">

      <!-- Texto original con transición suave -->
      <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-2 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition-all duration-250 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 -translate-y-1 scale-102"
          mode="out-in"
      >
        <p
            v-if="showOriginal"
            :key="originalKey"
            class="subtitle-outline text-center transition-all duration-200"
            :style="getTextStyle(state.original)"
        >
          {{ original }}
        </p>
      </Transition>

      <!-- Traducción 1 con transición escalonada -->
      <Transition
          enter-active-class="transition-all duration-280 ease-out delay-50"
          enter-from-class="opacity-0 translate-y-3 scale-92"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition-all duration-220 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 -translate-y-2 scale-105"
          mode="out-in"
      >
        <p
            v-if="state.translations[0].active && trans1"
            :key="trans1Key"
            class="subtitle-outline text-center transition-all duration-200"
            :style="getTextStyle(state.translations[0].style)"
        >
          {{ trans1 }}
        </p>
      </Transition>

      <!-- Traducción 2 con transición escalonada -->
      <Transition
          enter-active-class="transition-all duration-280 ease-out delay-100"
          enter-from-class="opacity-0 translate-y-3 scale-92"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition-all duration-220 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 -translate-y-2 scale-105"
          mode="out-in"
      >
        <p
            v-if="state.translations[1].active && trans2"
            :key="trans2Key"
            class="subtitle-outline text-center transition-all duration-200"
            :style="getTextStyle(state.translations[1].style)"
        >
          {{ trans2 }}
        </p>
      </Transition>

    </div>
  </div>
</template>

<style scoped>
/* Optimizaciones para transiciones suaves */
.subtitle-outline {
  will-change: transform, opacity;
  backface-visibility: hidden;
  transform-style: preserve-3d;
}
</style>

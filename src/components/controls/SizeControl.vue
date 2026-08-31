<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    modelValue: number
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    ariaLabel?: string
    class?: string
  }>(),
  {
    min: 24,
    max: 96,
    step: 1,
    disabled: false,
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: number] }>()

const sliderValue = computed<number[]>({
  get: () => [props.modelValue],
  set: (v) => emit('update:modelValue', clamp(v[0] ?? props.min)),
})

const text = ref(String(props.modelValue))

watch(
  () => props.modelValue,
  (v) => {
    text.value = String(v)
  },
)

function clamp(v: number): number {
  if (Number.isNaN(v)) return props.min
  return Math.min(props.max, Math.max(props.min, Math.round(v)))
}

function commit(): void {
  const parsed = parseInt(text.value, 10)
  if (Number.isNaN(parsed)) {
    text.value = String(props.modelValue)
    return
  }
  const normalized = clamp(parsed)
  emit('update:modelValue', normalized)
  text.value = String(normalized)
}
</script>

<template>
  <div :class="cn('flex min-w-0 flex-1 items-center gap-2', props.class)">
    <Slider
      v-model="sliderValue"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :aria-label="ariaLabel"
      class="min-w-0 flex-1"
    />
<div class="relative w-12 shrink-0">
      <Input
        v-model="text"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        name="subtitle-size"
        :disabled="disabled"
        class="h-8 pr-4 text-right font-mono text-xs"
        :aria-label="ariaLabel"
        @change="commit"
        @keydown.enter.prevent="commit"
      />
      <span class="pointer-events-none absolute inset-y-0 right-1 flex items-center text-[9px] text-muted-foreground">
        px
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { availableFonts, fontWeightsByFont, normalizeWeight } from '@/lib/fonts'
import SelectField from '@/components/controls/SelectField.vue'
import ColorField from '@/components/controls/ColorField.vue'
import SizeControl from '@/components/controls/SizeControl.vue'

withDefaults(
  defineProps<{
    disabled?: boolean
  }>(),
  { disabled: false },
)

const font = defineModel<string>('font', { required: true })
const weight = defineModel<number>('weight', { required: true })
const color = defineModel<string>('color', { required: true })
const size = defineModel<number>('size', { required: true })
const shadowColor = defineModel<string>('shadowColor', { required: true })
const shadowOffset = defineModel<number>('shadowOffset', { required: true })

const fontOptions = availableFonts.map((f) => ({
  value: f,
  label: f,
  previewStyle: { fontFamily: `'${f}', sans-serif` },
}))

const weightOptions = computed(() =>
  (fontWeightsByFont[font.value as keyof typeof fontWeightsByFont] ?? [700]).map((w) => ({
    value: String(w),
    label: String(w),
  })),
)

const weightText = computed<string>({
  get: () => String(weight.value),
  set: (value) => {
    const parsed = parseInt(value, 10)
    if (!Number.isNaN(parsed)) weight.value = parsed
  },
})

watch(font, (newFont) => {
  weight.value = normalizeWeight(newFont, weight.value)
})
</script>

<template>
  <div class="grid w-full grid-cols-4 gap-x-4 gap-y-3">
    <slot name="extra" />

    <div class="flex flex-col gap-1.5">
      <span class="text-xs font-medium text-muted-foreground">Fuente</span>
      <SelectField v-model="font" :options="fontOptions" size="sm" class="w-full" aria-label="Fuente" />
    </div>

    <div class="flex flex-col gap-1.5">
      <span class="text-xs font-medium text-muted-foreground">Peso</span>
      <SelectField v-model="weightText" :options="weightOptions" size="sm" class="w-full" aria-label="Peso" />
    </div>

    <div class="flex flex-col gap-1.5">
      <span class="text-xs font-medium text-muted-foreground">Color</span>
      <ColorField v-model="color" class="w-full" aria-label="Color del texto" />
    </div>

    <div class="flex flex-col gap-1.5">
      <span class="text-xs font-medium text-muted-foreground">Tamaño</span>
      <SizeControl v-model="size" :min="24" :max="96" aria-label="Tamaño del texto" />
    </div>

    <div class="flex flex-col gap-1.5">
      <span class="text-xs font-medium text-muted-foreground">Contorno</span>
      <ColorField v-model="shadowColor" class="w-full" aria-label="Color del contorno" />
    </div>

    <div class="flex flex-col gap-1.5">
      <span class="text-xs font-medium text-muted-foreground">Grosor</span>
      <SizeControl v-model="shadowOffset" :min="0" :max="10" aria-label="Grosor del contorno" />
    </div>
  </div>
</template>
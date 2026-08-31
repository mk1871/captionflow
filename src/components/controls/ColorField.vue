<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    modelValue: string
    disabled?: boolean
    ariaLabel?: string
    class?: string
  }>(),
  { disabled: false },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const PRESET_COLORS = [
  '#FFFFFF',
  '#FFD700',
  '#1E90FF',
  '#00FF00',
  '#FF6B6B',
  '#FFA500',
  '#00CED1',
  '#FF69B4',
  '#90EE90',
  '#FFFF00',
  '#C0C0C0',
  '#FF0000',
  '#0000FF',
  '#000000',
]

const hexInput = ref(props.modelValue.toUpperCase())

watch(
  () => props.modelValue,
  (v) => {
    hexInput.value = v.toUpperCase()
  },
)

function setColor(color: string): void {
  emit('update:modelValue', color)
}

function onNativeInput(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function commitHex(): void {
  const value = hexInput.value.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(value)) {
    emit('update:modelValue', value.toLowerCase())
  } else {
    hexInput.value = props.modelValue.toUpperCase()
  }
}
</script>

<template>
  <Popover>
    <PopoverTrigger as-child :disabled="disabled">
      <Button
        variant="outline"
        :disabled="disabled"
        :aria-label="ariaLabel"
        :class="cn('h-8 w-auto justify-start gap-2 px-2', props.class)"
      >
        <span
          class="size-4 shrink-0 rounded-sm border border-border"
          :style="{ backgroundColor: modelValue }"
        />
        <span class="font-mono text-xs">{{ modelValue.toUpperCase() }}</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-56" align="start">
      <div class="grid grid-cols-7 gap-1.5">
        <button
          v-for="color in PRESET_COLORS"
          :key="color"
          type="button"
          class="size-6 rounded-md border border-border transition-transform hover:scale-110"
          :class="color === modelValue ? 'ring-2 ring-ring' : ''"
          :style="{ backgroundColor: color }"
          :aria-label="`Color ${color}`"
          :title="color"
          @click="setColor(color)"
        />
      </div>

      <div class="mt-3 flex items-center gap-2">
        <label class="relative size-8 shrink-0 overflow-hidden rounded-md border border-border">
          <input
            type="color"
            name="subtitle-color"
            class="absolute -inset-1 size-12 cursor-pointer"
            :value="modelValue"
            :disabled="disabled"
            :aria-label="'Color personalizado'"
            @input="onNativeInput"
          />
        </label>
        <Input
          v-model="hexInput"
          class="h-8 font-mono text-xs"
          :disabled="disabled"
          maxlength="7"
          aria-label="Color en hexadecimal"
          @change="commitHex"
          @keydown.enter.prevent="commitHex"
        />
      </div>
    </PopoverContent>
  </Popover>
</template>

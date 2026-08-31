<script setup lang="ts">
import { computed } from 'vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
  previewStyle?: Record<string, string>
}

const props = withDefaults(
  defineProps<{
    options: SelectOption[]
    modelValue?: string
    placeholder?: string
    disabled?: boolean
    size?: 'sm' | 'default'
    ariaLabel?: string
    class?: string
  }>(),
  {
    placeholder: 'Selecciona…',
    disabled: false,
    size: 'default',
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const value = computed<string | undefined>({
  get: () => props.modelValue,
  set: (v) => {
    if (v) emit('update:modelValue', v)
  },
})
</script>

<template>
  <Select v-model="value" :disabled="disabled">
    <SelectTrigger :size="size" :aria-label="ariaLabel" :class="cn(props.class)">
      <SelectValue :placeholder="placeholder" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :style="option.previewStyle"
      >
        {{ option.label }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>

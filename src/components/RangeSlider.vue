<script setup lang="ts">
interface Props {
  modelValue: number
  min: number
  max: number
  disabled?: boolean // Nueva prop
}

interface Emits {
  (event: 'update:modelValue', value: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleValueChange = (event: Event): void => {
  if (props.disabled) return
  const target = event.target as HTMLInputElement
  emit('update:modelValue', Number(target.value))
}
</script>

<template>
  <input
      type="range"
      :min="min"
      :max="max"
      :value="modelValue"
      :disabled="disabled"
      @input="handleValueChange"
      class="w-full accent-primary disabled:opacity-50 disabled:cursor-not-allowed"
  />
</template>

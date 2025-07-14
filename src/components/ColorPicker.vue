<script setup lang="ts">
interface Props {
  modelValue: string
  disabled?: boolean // Nueva prop
}

interface Emits {
  (event: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleColorChange = (event: Event): void => {
  if (props.disabled) return
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="relative">
    <input
        type="color"
        :value="modelValue"
        :disabled="disabled"
        @input="handleColorChange"
        class="w-full h-10 rounded-md border border-input bg-card cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        aria-label="Selector de color"
    />
    <!-- Indicador visual del color seleccionado -->
    <div
        class="absolute inset-1 rounded-sm pointer-events-none"
        :style="{ backgroundColor: modelValue }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Tipado estricto para las props
interface BaseSelectOption {
  value: string | number
  label: string
}

interface Props {
  modelValue: string | number
  options: BaseSelectOption[]
  id?: string
  name?: string
  placeholder?: string
  disabled?: boolean
}

interface Emits {
  (event: 'update:modelValue', value: string | number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Maneja el cambio de selección y emite el nuevo valor
const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}

// Computa las opciones disponibles
const computedOptions = computed(() => props.options || [])
</script>

<template>
  <select
      :id="id"
      :name="name"
      :disabled="disabled"
      :value="modelValue"
      @change="handleChange"
      class="w-full px-3 py-2 rounded-[var(--radius)] border border-input bg-card text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      aria-label="Selector"
  >
    <!-- Opción de placeholder si se define -->
    <option v-if="placeholder" value="" disabled selected hidden>{{ placeholder }}</option>
    <option
        v-for="opt in computedOptions"
        :key="opt.value"
        :value="opt.value"
    >
      {{ opt.label }}
    </option>
  </select>
</template>

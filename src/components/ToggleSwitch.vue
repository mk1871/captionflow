<script setup lang="ts">
// Interface para props tipadas
interface Props {
  modelValue: boolean
  label: string
}

// Interface para eventos emitidos
interface Emits {
  (event: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const toggleValue = (): void => {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <!-- ✅ Solución: Usar div como contenedor principal -->
  <div class="inline-flex items-center cursor-pointer select-none gap-2">
    <span class="text-sm font-medium leading-none text-foreground">
      {{ label }}
    </span>
    <!-- Input oculto para funcionalidad -->
    <input
        type="checkbox"
        :checked="props.modelValue"
        @change="toggleValue"
        class="sr-only peer"
        :id="`toggle-${label.replace(/\s+/g, '-').toLowerCase()}`"
    />
    <!-- Label que actúa como trigger visual -->
    <label
        :for="`toggle-${label.replace(/\s+/g, '-').toLowerCase()}`"
        class="relative w-11 h-6 bg-input rounded-full peer-checked:bg-primary transition-colors cursor-pointer"
    >
      <!-- Slider visual usando pseudo-elemento CSS -->
      <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform peer-checked:translate-x-full peer-checked:border-white"></span>
    </label>
  </div>
</template>

<style scoped>
/* Estilos para el slider usando CSS puro */
input:checked + label span {
  transform: translateX(100%);
}
</style>

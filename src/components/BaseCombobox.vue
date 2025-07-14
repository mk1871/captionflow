<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, isRef } from 'vue'
import type { Ref, ComputedRef } from 'vue'

interface ComboboxOption {
  value: string | number
  label: string
  fontFamily?: string
}

interface Props {
  modelValue: string | number
  options: ComboboxOption[] | Ref<ComboboxOption[]> | ComputedRef<ComboboxOption[]>
  placeholder?: string
  disabled?: boolean
  id?: string
  name?: string
  showFontPreview?: boolean
}

interface Emits {
  (event: 'update:modelValue', value: string | number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = ref(false)
const highlightedIndex = ref(-1)
const triggerRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)

// Opciones reactivas
const availableOptions = computed(() => {
  return isRef(props.options) ? props.options.value : props.options
})

// Etiqueta seleccionada con preview de fuente
const selectedLabel = computed(() => {
  const found = availableOptions.value.find((opt: ComboboxOption) => opt.value === props.modelValue)
  return found ? found.label : ''
})

// Estilo dinámico para preview de fuente
const selectedFontStyle = computed(() => {
  if (!props.showFontPreview) return {}
  const found = availableOptions.value.find((opt: ComboboxOption) => opt.value === props.modelValue)
  return found?.fontFamily ? { fontFamily: found.fontFamily } : {}
})

// Función para obtener estilo de opción
const getOptionFontStyle = (option: ComboboxOption) => {
  if (!props.showFontPreview || !option.fontFamily) return {}
  return { fontFamily: option.fontFamily }
}

// Toggle del menú sin saltos bruscos
const toggleMenu = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    highlightedIndex.value = availableOptions.value.findIndex((opt: ComboboxOption) => opt.value === props.modelValue)
    // No usar nextTick para evitar saltos del cursor
  } else {
    // Remover foco para que desaparezca el ring
    if (triggerRef.value) {
      triggerRef.value.blur()
    }
  }
}

// Selección de opción
const selectOption = (option: ComboboxOption) => {
  if (props.disabled) return
  emit('update:modelValue', option.value)
  isOpen.value = false
  // Remover foco después de seleccionar
  if (triggerRef.value) {
    triggerRef.value.blur()
  }
}

// Navegación con teclado
const onTriggerKeydown = (e: KeyboardEvent) => {
  if (props.disabled) return
  if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    isOpen.value = true
    highlightedIndex.value = availableOptions.value.findIndex((opt: ComboboxOption) => opt.value === props.modelValue)
  }
}

const onMenuKeydown = (e: KeyboardEvent) => {
  if (props.disabled) return
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    highlightedIndex.value = (highlightedIndex.value + 1) % availableOptions.value.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    highlightedIndex.value = (highlightedIndex.value - 1 + availableOptions.value.length) % availableOptions.value.length
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (highlightedIndex.value >= 0) {
      selectOption(availableOptions.value[highlightedIndex.value])
    }
  } else if (e.key === 'Escape') {
    isOpen.value = false
    if (triggerRef.value) {
      triggerRef.value.blur()
    }
  }
}

// Click fuera para cerrar y remover foco
const handleClickOutside = (event: MouseEvent) => {
  if (
      triggerRef.value &&
      !triggerRef.value.contains(event.target as Node) &&
      menuRef.value &&
      !menuRef.value.contains(event.target as Node)
  ) {
    isOpen.value = false
    // Remover foco para que desaparezca el ring
    if (triggerRef.value) {
      triggerRef.value.blur()
    }
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

// Sincronizar highlightedIndex
watch(() => props.modelValue, (newVal) => {
  if (isOpen.value) {
    highlightedIndex.value = availableOptions.value.findIndex((opt: ComboboxOption) => opt.value === newVal)
  }
})
</script>

<template>
  <div class="relative w-full">
    <!-- Trigger con transiciones suaves usando Tailwind 4.1 -->
    <button
        ref="triggerRef"
        :id="id"
        :name="name"
        type="button"
        :disabled="disabled"
        class="flex h-10 w-full items-center justify-between rounded-[var(--radius)] border border-input bg-card px-3 py-2 text-sm text-foreground shadow-sm ring-offset-background transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 hover:bg-accent/5"
        role="combobox"
        :aria-haspopup="true"
        :aria-expanded="isOpen"
        :aria-controls="id + '-listbox'"
        @click="toggleMenu"
        @keydown="onTriggerKeydown"
    >
      <span
          class="truncate transition-all duration-150"
          :style="selectedFontStyle"
      >
        {{ selectedLabel || placeholder || 'Selecciona una opción' }}
      </span>
      <!-- Flecha con rotación suave -->
      <svg
          class="h-4 w-4 ml-2 opacity-60 transition-transform duration-200 ease-in-out"
          :class="{ 'rotate-180': isOpen }"
          viewBox="0 0 20 20"
          stroke="currentColor"
          stroke-width="2"
          fill="none"
      >
        <path d="M6 8l4 4 4-4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Menú con transiciones avanzadas de Tailwind 4.1 -->
    <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 scale-95 -translate-y-1"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 -translate-y-1"
    >
      <ul
          v-if="isOpen && !disabled"
          ref="menuRef"
          :id="id + '-listbox'"
          tabindex="-1"
          role="listbox"
          :aria-labelledby="id"
          class="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-[var(--radius)] bg-card border border-border shadow-xl py-1 focus:outline-none"
          @keydown="onMenuKeydown"
      >
        <li
            v-for="(option, idx) in availableOptions"
            :key="option.value"
            :class="[
              'px-3 py-2 cursor-pointer text-sm rounded-sm mx-1 transition-all duration-150 ease-out select-none',
              idx === highlightedIndex
                ? 'bg-accent text-accent-foreground shadow-sm'
                : 'text-foreground hover:bg-accent/10'
            ]"
            :style="getOptionFontStyle(option)"
            role="option"
            :aria-selected="props.modelValue === option.value"
            @mouseenter="highlightedIndex = idx"
            @mouseleave="highlightedIndex = -1"
            @mousedown.prevent="selectOption(option)"
        >
          {{ option.label }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

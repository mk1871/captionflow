<script setup lang="ts">
import { computed, watch } from 'vue'
import { useSettings, availableFonts, fontWeightsByFont, speechLanguages } from '@/composables/useSettings'
import BaseCombobox from './BaseCombobox.vue'
import ColorPicker from './ColorPicker.vue'
import RangeSlider from './RangeSlider.vue'

// Estado global reactivo
const { state } = useSettings()

// Opciones para el selector de idioma
const languageOptions = speechLanguages.map(lang => ({
  value: lang.code,
  label: lang.name
}))

// Opciones para el selector de fuente con preview
const fontOptions = availableFonts.map(font => ({
  value: font,
  label: font,
  fontFamily: font
}))

// Opciones de peso válidas para la fuente seleccionada
const weightOptions = computed(() =>
    (fontWeightsByFont[state.original.font] || [700]).map(w => ({
      value: w,
      label: w.toString()
    }))
)

// Sincroniza el peso si cambia la fuente y el peso actual no es válido
watch(
    () => state.original.font,
    (newFont) => {
      const available = fontWeightsByFont[newFont] || [700]
      if (!available.includes(state.original.weight)) {
        state.original.weight = available[0]
      }
    }
)
</script>

<template>
  <section class="flex flex-col gap-4 border border-border rounded-[var(--radius)] p-4 shadow-sm bg-card">
    <!-- Encabezado con toggle corregido -->
    <div class="flex items-center justify-between">
      <div class="font-semibold leading-none tracking-tight text-lg text-foreground">
        Texto Original
      </div>

      <!-- ✅ Toggle switch corregido -->
      <div class="inline-flex items-center cursor-pointer select-none">
        <input
            type="checkbox"
            v-model="state.showOriginal"
            class="sr-only peer"
            id="toggle-original"
            :aria-checked="state.showOriginal"
            aria-label="Mostrar texto original"
        />
        <label
            for="toggle-original"
            class="relative w-11 h-6 bg-input rounded-full peer-checked:bg-primary transition-colors cursor-pointer"
        >
          <span class="absolute top-0.5 left-0.5 w-5 h-5 bg-white border border-gray-300 rounded-full transition-transform peer-checked:translate-x-full peer-checked:border-white"></span>
        </label>
      </div>
    </div>

    <!-- Controles deshabilitados cuando el original está inactivo -->
    <fieldset :disabled="!state.showOriginal" class="contents">
      <template v-if="state.showOriginal">
        <!-- Selector de idioma -->
        <div class="space-y-2">
          <label
              for="original-lang"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
          >
            Idioma
          </label>
          <BaseCombobox
              v-model="state.sourceLang"
              :options="languageOptions"
              :disabled="!state.showOriginal"
              id="original-lang"
              placeholder="Selecciona idioma"
          />
        </div>

        <!-- Fuente y peso en la misma fila -->
        <div class="flex gap-2">
          <div class="flex-1 space-y-2">
            <label
                for="original-font"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
            >
              Fuente
            </label>
            <BaseCombobox
                v-model="state.original.font"
                :options="fontOptions"
                :show-font-preview="true"
                :disabled="!state.showOriginal"
                id="original-font"
                placeholder="Selecciona fuente"
            />
          </div>
          <div class="flex-1 space-y-2">
            <label
                for="original-weight"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
            >
              Peso
            </label>
            <BaseCombobox
                v-model="state.original.weight"
                :options="weightOptions"
                :disabled="!state.showOriginal"
                id="original-weight"
                placeholder="Selecciona peso"
            />
          </div>
        </div>

        <!-- Color y tamaño en la misma fila -->
        <div class="flex gap-2 items-end">
          <div class="flex-1 space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
              Color
            </label>
            <ColorPicker
                v-model="state.original.color"
                :disabled="!state.showOriginal"
            />
          </div>
          <div class="flex-1 space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
              Tamaño <span class="ml-1 text-xs text-muted-foreground font-mono">{{ state.original.size }}px</span>
            </label>
            <RangeSlider
                v-model="state.original.size"
                :min="30"
                :max="70"
                :disabled="!state.showOriginal"
            />
          </div>
        </div>

        <!-- Contorno (shadow) color y grosor -->
        <div class="flex gap-2 items-end">
          <div class="flex-1 space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
              Color contorno
            </label>
            <ColorPicker
                v-model="state.original.shadowColor"
                :disabled="!state.showOriginal"
            />
          </div>
          <div class="flex-1 space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
              Grosor contorno <span class="ml-1 text-xs text-muted-foreground font-mono">{{ state.original.shadowOffset }}px</span>
            </label>
            <RangeSlider
                v-model="state.original.shadowOffset"
                :min="0"
                :max="10"
                :disabled="!state.showOriginal"
            />
          </div>
        </div>
      </template>

      <!-- Estado deshabilitado -->
      <template v-else>
        <div class="opacity-50 pointer-events-none space-y-2">
          <p class="text-sm text-muted-foreground italic">
            Activa el texto original para configurar sus opciones
          </p>
        </div>
      </template>
    </fieldset>
  </section>
</template>

<style scoped>
/* Estilos para el toggle switch */
input:checked + label span {
  transform: translateX(100%);
}
</style>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useSettings, availableFonts, fontWeightsByFont } from '@/composables/useSettings'
import BaseCombobox from './BaseCombobox.vue'
import ColorPicker from './ColorPicker.vue'
import RangeSlider from './RangeSlider.vue'

interface Props {
  index: 0 | 1
  label: string
}

const props = defineProps<Props>()
const { state, available1, available2 } = useSettings()

const translation = state.translations[props.index]
const availableLanguages = props.index === 0 ? available1 : available2

// Opciones para selectores
const languageOptions = computed(() =>
    availableLanguages.value.map(lang => ({
      value: lang.code,
      label: lang.name
    }))
)

// Opciones de fuente con preview
const fontOptions = availableFonts.map(font => ({
  value: font,
  label: font,
  fontFamily: font // Preview de fuente
}))

const weightOptions = computed(() =>
    (fontWeightsByFont[translation.style.font] || [700]).map(w => ({
      value: w,
      label: w.toString()
    }))
)

// Sincroniza el peso si cambia la fuente
watch(
    () => translation.style.font,
    (newFont) => {
      const available = fontWeightsByFont[newFont] || [700]
      if (!available.includes(translation.style.weight)) {
        translation.style.weight = available[0]
      }
    }
)
</script>
<template>
  <section class="flex flex-col gap-4 border border-border rounded-[var(--radius)] p-4 shadow-sm bg-card">
    <div class="flex items-center justify-between">
      <!-- Título de sección mejorado -->
      <div class="font-semibold leading-none tracking-tight text-lg text-foreground">{{ label }}</div>
      <!-- Toggle switch mejorado -->
      <label class="inline-flex items-center cursor-pointer">
        <input
            type="checkbox"
            v-model="translation.active"
            class="sr-only peer"
            :aria-checked="translation.active"
            :aria-label="`Habilitar ${label}`"
        />
        <div class="relative w-11 h-6 bg-input rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
      </label>
    </div>

    <fieldset :disabled="!translation.active" class="contents">
      <template v-if="translation.active">
        <!-- Selector de idioma -->
        <div class="space-y-2">
          <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
            Idioma
          </label>
          <BaseCombobox
              v-model="translation.lang"
              :options="languageOptions"
              :disabled="!translation.active"
              placeholder="Selecciona idioma"
          />
        </div>

        <!-- Fuente y peso en la misma fila -->
        <div class="flex gap-2">
          <div class="flex-1 space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
              Fuente
            </label>
            <BaseCombobox
                v-model="translation.style.font"
                :options="fontOptions"
                :show-font-preview="true"
                :disabled="!translation.active"
                placeholder="Selecciona fuente"
            />
          </div>
          <div class="flex-1 space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
              Peso
            </label>
            <BaseCombobox
                v-model="translation.style.weight"
                :options="weightOptions"
                :disabled="!translation.active"
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
                v-model="translation.style.color"
                :disabled="!translation.active"
            />
          </div>
          <div class="flex-1 space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
              Tamaño <span class="ml-1 text-xs text-muted-foreground font-mono">{{ translation.style.size }}px</span>
            </label>
            <RangeSlider
                v-model="translation.style.size"
                :min="30"
                :max="70"
                :disabled="!translation.active"
            />
          </div>
        </div>

        <!-- Contorno color y grosor -->
        <div class="flex gap-2 items-end">
          <div class="flex-1 space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
              Color contorno
            </label>
            <ColorPicker
                v-model="translation.style.shadowColor"
                :disabled="!translation.active"
            />
          </div>
          <div class="flex-1 space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
              Grosor contorno <span class="ml-1 text-xs text-muted-foreground font-mono">{{ translation.style.shadowOffset }}px</span>
            </label>
            <RangeSlider
                v-model="translation.style.shadowOffset"
                :min="0"
                :max="10"
                :disabled="!translation.active"
            />
          </div>
        </div>
      </template>

      <!-- Estado deshabilitado -->
      <template v-else>
        <div class="opacity-50 pointer-events-none space-y-2">
          <p class="text-sm text-muted-foreground italic">
            Activa la traducción para configurar sus opciones
          </p>
        </div>
      </template>
    </fieldset>
  </section>
</template>



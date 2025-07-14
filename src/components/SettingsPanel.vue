<script setup lang="ts">
import { useSettings } from '@/composables/useSettings'
import ToggleSwitch from './ToggleSwitch.vue'
import { useTheme } from "@/composables/useTheme"
import OriginalControls from './OriginalControls.vue'
import TranslationControls from './TranslationControls.vue'

// Uso del composable de configuración
const { restoreDefaults } = useSettings()
const { isDark } = useTheme()
</script>

<template>
  <div class="bg-card border border-border p-6 rounded-[var(--radius)] shadow-lg flex flex-col gap-6 transition-colors">
    <!-- Encabezado simplificado -->
    <header class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-foreground">Configuración</h2>
      <div class="flex items-center gap-4">
        <ToggleSwitch
            v-model="isDark"
            label="Modo oscuro"
        />
        <!-- Botón mejorado con clases de shadcn/ui -->
        <button
            @click="restoreDefaults"
            class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground shadow hover:bg-destructive/90 px-4 py-2 h-9"
        >
          <!-- Ícono de reset -->
          <svg class="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          Restaurar
        </button>
      </div>
    </header>

    <!-- Información sobre persistencia automática -->
    <div class="text-sm text-muted-foreground bg-muted/20 p-3 rounded-[var(--radius)] border border-border/50">
      💾 <strong>Guardado automático:</strong> Todos los cambios se guardan automáticamente. Usa "Restaurar" para volver a los valores por defecto.
    </div>

    <!-- Grid responsivo de controles -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <OriginalControls />
      <TranslationControls
          :index="0"
          label="Traducción 1"
      />
      <TranslationControls
          :index="1"
          label="Traducción 2"
      />
    </div>
  </div>
</template>

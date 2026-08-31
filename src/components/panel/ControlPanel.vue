<script setup lang="ts">
import { ref } from 'vue'
import { MicIcon, MoonIcon, RotateCcwIcon, SquareIcon, SunIcon } from '@lucide/vue'
import { useSettingsStore } from '@/stores/settings'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import RecordingStatus from '@/components/panel/RecordingStatus.vue'
import SubtitleSection from '@/components/panel/SubtitleSection.vue'

defineProps<{
  isListening: boolean
  error: string | null
}>()

defineEmits<{ 'toggle-listening': [] }>()

const settings = useSettingsStore()
const activeTab = ref('original')
</script>

<template>
  <section class="rounded-lg border border-border bg-card p-4 shadow-sm">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <h2 class="text-base font-bold tracking-tight">CaptionFlow</h2>
        <RecordingStatus :is-listening="isListening" :error="error" />
      </div>

      <div class="flex items-center gap-2">
        <Button
          :variant="isListening ? 'secondary' : 'default'"
          size="sm"
          @click="$emit('toggle-listening')"
        >
          <MicIcon v-if="!isListening" class="size-4" />
          <SquareIcon v-else class="size-4" />
          {{ isListening ? 'Detener' : 'Escuchar' }}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          :title="settings.settings.isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
          :aria-label="settings.settings.isDarkMode ? 'Modo claro' : 'Modo oscuro'"
          @click="settings.settings.isDarkMode = !settings.settings.isDarkMode"
        >
          <SunIcon v-if="settings.settings.isDarkMode" class="size-4" />
          <MoonIcon v-else class="size-4" />
        </Button>

        <Button variant="outline" size="sm" @click="settings.restoreDefaults()">
          <RotateCcwIcon class="size-4" />
          Restaurar
        </Button>
      </div>
    </header>

    <Tabs v-model="activeTab" class="mt-4">
      <TabsList class="grid w-full grid-cols-3">
        <TabsTrigger value="original">Original</TabsTrigger>
        <TabsTrigger value="trans1">Traducción 1</TabsTrigger>
        <TabsTrigger value="trans2">Traducción 2</TabsTrigger>
      </TabsList>
      <TabsContent value="original">
        <SubtitleSection kind="original" />
      </TabsContent>
      <TabsContent value="trans1">
        <SubtitleSection kind="translation" :index="0" />
      </TabsContent>
      <TabsContent value="trans2">
        <SubtitleSection kind="translation" :index="1" />
      </TabsContent>
    </Tabs>
  </section>
</template>

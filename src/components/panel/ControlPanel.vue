<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  MicIcon,
  MoonIcon,
  PresentationIcon,
  RotateCcwIcon,
  SquareIcon,
  SunIcon,
  Volume2Icon,
  VolumeXIcon,
} from '@lucide/vue'
import { useSettingsStore } from '@/stores/settings'
import { play } from 'cuelume'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import RecordingStatus from '@/components/panel/RecordingStatus.vue'
import SubtitleSection from '@/components/panel/SubtitleSection.vue'
import ColorField from '@/components/controls/ColorField.vue'

defineProps<{
  isListening: boolean
  error: string | null
}>()

defineEmits<{ 'toggle-listening': [] }>()

const settings = useSettingsStore()
const activeTab = ref('original')

function openChromaWindow(): void {
  const url = `${window.location.origin}${window.location.pathname}?chroma=1`
  const width = settings.settings.chromaWidth
  const height = settings.settings.chromaHeight
  window.open(url, 'captionflow-chroma', `popup=yes,width=${width},height=${height},resizable=yes`)
  play('success')
}

function restoreDefaults(): void {
  settings.restoreDefaults()
  play('success')
}

const chromaWText = ref(String(settings.settings.chromaWidth))
const chromaHText = ref(String(settings.settings.chromaHeight))

watch(
  () => [settings.settings.chromaWidth, settings.settings.chromaHeight],
  ([w, h]) => {
    chromaWText.value = String(w)
    chromaHText.value = String(h)
  },
)

function commitChromaSize(): void {
  const w = parseInt(chromaWText.value, 10)
  const h = parseInt(chromaHText.value, 10)
  if (Number.isNaN(w) || w <= 0) chromaWText.value = String(settings.settings.chromaWidth)
  else settings.settings.chromaWidth = w
  if (Number.isNaN(h) || h <= 0) chromaHText.value = String(settings.settings.chromaHeight)
  else settings.settings.chromaHeight = h
}

const boxOpacity = computed<number[]>({
  get: () => [settings.settings.subtitleBoxOpacity],
  set: (v) => {
    settings.settings.subtitleBoxOpacity = v[0] ?? 0
  },
})
</script>

<template>
  <Card class="rounded-lg">
    <CardHeader>
      <div class="flex items-center gap-3">
        <CardTitle class="text-base font-bold tracking-tight">CaptionFlow</CardTitle>
        <RecordingStatus :is-listening="isListening" :error="error" />
      </div>

      <CardAction>
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
            :title="'Abrir ventana de subtítulos (chroma) para OBS'"
            :aria-label="'Abrir ventana de subtítulos (chroma) para OBS'"
            @click="openChromaWindow"
          >
            <PresentationIcon class="size-4" />
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

          <Button
            variant="ghost"
            size="icon"
            :title="settings.settings.soundsEnabled ? 'Desactivar sonidos' : 'Activar sonidos'"
            :aria-label="settings.settings.soundsEnabled ? 'Desactivar sonidos' : 'Activar sonidos'"
            @click="settings.settings.soundsEnabled = !settings.settings.soundsEnabled"
          >
            <Volume2Icon v-if="settings.settings.soundsEnabled" class="size-4" />
            <VolumeXIcon v-else class="size-4" />
          </Button>

          <Button variant="outline" size="sm" @click="restoreDefaults">
            <RotateCcwIcon class="size-4" />
            Restaurar
          </Button>
        </div>
      </CardAction>
    </CardHeader>

    <CardContent>
      <div class="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-3">
        <div class="flex items-center gap-1.5">
          <Label class="shrink-0 text-xs font-medium text-muted-foreground">Ventana croma</Label>
          <Input
            v-model="chromaWText"
            inputmode="numeric"
            class="h-8 w-14 text-right text-xs"
            :aria-label="'Ancho de la ventana croma'"
            @change="commitChromaSize"
            @keydown.enter.prevent="commitChromaSize"
          />
          <span class="text-xs text-muted-foreground">×</span>
          <Input
            v-model="chromaHText"
            inputmode="numeric"
            class="h-8 w-14 text-right text-xs"
            :aria-label="'Alto de la ventana croma'"
            @change="commitChromaSize"
            @keydown.enter.prevent="commitChromaSize"
          />
          <span class="text-xs text-muted-foreground">px</span>
        </div>

        <div class="flex items-center gap-2">
          <Label class="shrink-0 text-xs font-medium text-muted-foreground">Fondo</Label>
          <Switch
            v-model="settings.settings.showSubtitleBox"
            :aria-label="'Mostrar fondo de subtítulos'"
          />
          <Slider
            v-model="boxOpacity"
            :min="0"
            :max="100"
            :step="5"
            :disabled="!settings.settings.showSubtitleBox"
            :aria-label="'Opacidad del fondo'"
            class="w-28"
          />
          <span class="w-8 text-xs text-muted-foreground"
            >{{ settings.settings.subtitleBoxOpacity }}%</span
          >
          <ColorField
            v-model="settings.settings.subtitleBoxColor"
            :disabled="!settings.settings.showSubtitleBox"
            aria-label="Color del fondo"
          />
        </div>
      </div>

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
    </CardContent>
  </Card>
</template>

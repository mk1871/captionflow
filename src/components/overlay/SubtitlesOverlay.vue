<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useSubtitlesStore } from '@/stores/subtitles'
import SubtitleLines from '@/components/overlay/SubtitleLines.vue'

withDefaults(
  defineProps<{
    chroma?: boolean
  }>(),
  { chroma: true },
)

const settings = useSettingsStore()
const subtitles = useSubtitlesStore()

const translation1 = computed(() => settings.settings.translations[0]!)
const translation2 = computed(() => settings.settings.translations[1]!)

const showOriginal = computed(
  () => settings.settings.showOriginal && subtitles.original.trim() !== '',
)

const boxStyle = computed(() =>
  settings.settings.showSubtitleBox
    ? { backgroundColor: `rgba(0, 0, 0, ${settings.settings.subtitleBoxOpacity / 100})` }
    : {},
)
</script>

<template>
  <div
    :class="chroma ? 'bg-[#00ff00]' : 'bg-muted'"
    class="flex h-full w-full flex-col items-center justify-end p-8"
  >
    <div class="mx-auto w-full max-w-[1280px] space-y-4">
      <div v-if="showOriginal" class="rounded-lg px-3 py-1" :style="boxStyle">
        <SubtitleLines :text="subtitles.original" :style="settings.settings.original" />
      </div>

      <div
        v-if="translation1.active"
        :style="{
          minHeight: `${translation1.style.size * 2.6}px`,
          ...(subtitles.trans1.trim() !== '' ? boxStyle : {}),
        }"
        class="rounded-lg px-3 py-1"
      >
        <SubtitleLines :text="subtitles.trans1" :style="translation1.style" />
      </div>

      <div
        v-if="translation2.active && subtitles.trans2"
        class="rounded-lg px-3 py-1"
        :style="boxStyle"
      >
        <SubtitleLines :text="subtitles.trans2" :style="translation2.style" />
      </div>
    </div>
  </div>
</template>

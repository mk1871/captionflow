import { onUnmounted, watch } from 'vue'
import type { Settings } from '@/types/settings'
import { useSubtitlesStore } from '@/stores/subtitles'
import { useSettingsStore } from '@/stores/settings'

const CHANNEL_NAME = 'captionflow:chroma'

/**
 * Emite el estado en vivo (subtítulos + configuración) hacia la ventana
 * pop-up de chroma vía BroadcastChannel. La ventana secundaria solo
 * escucha: el audio y la traducción ocurren siempre en la ventana principal.
 */
export function useChromaBroadcaster(): void {
  const subtitles = useSubtitlesStore()
  const settings = useSettingsStore()

  const channel = new BroadcastChannel(CHANNEL_NAME)

  function broadcastSubtitles(): void {
    channel.postMessage({
      type: 'subtitles',
      original: subtitles.original,
      trans1: subtitles.trans1,
      trans2: subtitles.trans2,
    })
  }

  function broadcastSettings(): void {
    const snapshot = JSON.parse(JSON.stringify(settings.settings)) as Settings
    channel.postMessage({ type: 'settings', settings: snapshot })
  }

  watch(() => [subtitles.original, subtitles.trans1, subtitles.trans2], broadcastSubtitles)

  watch(settings.settings, broadcastSettings, { deep: true })

  channel.onmessage = (event: MessageEvent) => {
    if (event.data?.type === 'ready') {
      broadcastSubtitles()
      broadcastSettings()
    }
  }

  onUnmounted(() => channel.close())
}

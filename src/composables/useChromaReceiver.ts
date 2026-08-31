import { onMounted, onUnmounted } from 'vue'
import { useSubtitlesStore } from '@/stores/subtitles'
import { useSettingsStore } from '@/stores/settings'

const CHANNEL_NAME = 'captionflow:chroma'

/**
 * Recibe el estado en vivo desde la ventana principal (BroadcastChannel)
 * y actualiza los stores de subtítulos y configuración de la ventana pop-up.
 * Al montar avisa a la ventana principal con `ready` para recibir el estado
 * completo inicial (BroadcastChannel no conserva el último mensaje).
 */
export function useChromaReceiver(): void {
  const subtitles = useSubtitlesStore()
  const settings = useSettingsStore()

  let channel: BroadcastChannel | null = null

  function handleMessage(event: MessageEvent): void {
    const data = event.data
    if (!data || typeof data !== 'object') return
    switch (data.type) {
      case 'subtitles':
        subtitles.original = data.original ?? ''
        subtitles.trans1 = data.trans1 ?? ''
        subtitles.trans2 = data.trans2 ?? ''
        break
      case 'settings':
        if (data.settings && typeof data.settings === 'object') {
          Object.assign(settings.settings, data.settings)
        }
        break
    }
  }

  onMounted(() => {
    channel = new BroadcastChannel(CHANNEL_NAME)
    channel.onmessage = handleMessage
    channel.postMessage({ type: 'ready' })
  })

  onUnmounted(() => channel?.close())
}

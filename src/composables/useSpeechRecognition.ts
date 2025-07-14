import { ref, onUnmounted, watch, type Ref } from 'vue'

// Interfaces para tipado estricto
interface SpeechRecognitionState {
  isListening: Ref<boolean>
  error: Ref<string | null>
  start: () => void
  stop: () => void
}

type OnResultCallback = (text: string) => void
type OnClearCallback = () => void

/**
 * Composable para reconocimiento de voz continuo con idioma reactivo.
 * @param onResult - Callback cuando se detecta texto.
 * @param onClear - Callback cuando hay inactividad o error.
 * @param sourceLang - Ref reactivo con el código de idioma (ej: 'es', 'en', 'zh-CN').
 */
export function useSpeechRecognition(
    onResult: OnResultCallback,
    onClear: OnClearCallback,
    sourceLang: Ref<string>
): SpeechRecognitionState {
  const isListening = ref<boolean>(false)
  const error = ref<string | null>(null)

  const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
  let recognition: SpeechRecognition | null = null
  let inactivityTimer: ReturnType<typeof setTimeout> | null = null

  const TIMEOUT_DURATION = 4000 // 4 segundos sin voz para limpiar

  if (SpeechRecognition) {
    recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = sourceLang.value

    // Reactividad: cambia el idioma en caliente si el usuario lo modifica
    watch(sourceLang, (newLang, oldLang) => {
      if (recognition && isListening.value && newLang !== oldLang) {
        recognition.stop()
        setTimeout(() => {
          recognition!.lang = newLang
          recognition!.start()
        }, 150)
      }
    })

    recognition.onstart = () => {
      isListening.value = true
      error.value = null
      resetInactivityTimer()
    }

    recognition.onend = () => {
      isListening.value = false
      setTimeout(() => {
        try {
          recognition?.start()
        } catch (e) {
          error.value = 'No se pudo reiniciar el reconocimiento'
        }
      }, 120)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      error.value = event.error
      isListening.value = false
      clearTimer()
      onClear()
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = ''
      let interimText = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalText += result[0].transcript
        } else {
          interimText += result[0].transcript
        }
      }

      const currentText = finalText || interimText
      if (currentText && currentText.trim() !== '') {
        onResult(currentText)
        resetInactivityTimer()
      }
    }
  } else {
    error.value = 'La API Web Speech no está disponible en este navegador'
  }

  function resetInactivityTimer(): void {
    clearTimer()
    inactivityTimer = setTimeout(() => {
      onClear()
    }, TIMEOUT_DURATION)
  }

  function clearTimer(): void {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer)
      inactivityTimer = null
    }
  }

  function start(): void {
    if (recognition && !isListening.value) {
      recognition.lang = sourceLang.value
      recognition.start()
    }
  }

  function stop(): void {
    if (recognition && isListening.value) {
      recognition.stop()
      clearTimer()
      onClear()
    }
  }

  onUnmounted(() => {
    stop()
  })

  return {
    isListening,
    error,
    start,
    stop,
  }
}

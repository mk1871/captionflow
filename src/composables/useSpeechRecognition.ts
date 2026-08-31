import { onUnmounted, ref, watch, type Ref } from 'vue'

export interface SpeechRecognitionState {
  isListening: Ref<boolean>
  error: Ref<string | null>
  start: () => void
  stop: () => void
}

type OnResultCallback = (text: string, isFinal: boolean) => void
type OnClearCallback = () => void

const LINE_FINALIZATION_TIMEOUT = 800
const COMPLETE_CLEAR_TIMEOUT = 3000

/**
 * Reconocimiento de voz continuo con la Web Speech API (Chromium).
 * Timing optimizado para subtítulos estilo YouTube: finaliza la línea tras
 * una pausa corta y limpia todo tras silencio prolongado.
 */
export function useSpeechRecognition(
  onResult: OnResultCallback,
  onClear: OnClearCallback,
  sourceLang: Ref<string>,
): SpeechRecognitionState {
  const isListening = ref(false)
  const error = ref<string | null>(null)

  const SpeechRecognitionCtor = window.SpeechRecognition ?? window.webkitSpeechRecognition

  let recognition: SpeechRecognition | null = null
  let lineFinalizationTimer: ReturnType<typeof setTimeout> | null = null
  let completeClearTimer: ReturnType<typeof setTimeout> | null = null
  let shouldRestart = false

  if (SpeechRecognitionCtor) {
    recognition = new SpeechRecognitionCtor()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = sourceLang.value

    watch(sourceLang, (newLang, oldLang) => {
      if (!recognition || !isListening.value || newLang === oldLang) return
      recognition.stop()
      setTimeout(() => {
        if (!recognition) return
        recognition.lang = newLang
        recognition.start()
      }, 150)
    })

    recognition.onstart = () => {
      isListening.value = true
      error.value = null
      resetTimers()
    }

    recognition.onend = () => {
      isListening.value = false
      if (!shouldRestart) return
      setTimeout(() => {
        if (!recognition) return
        try {
          recognition.start()
        } catch {
          error.value = 'No se pudo reiniciar el reconocimiento'
        }
      }, 120)
    }

    recognition.onerror = (event) => {
      error.value = event.error
      isListening.value = false
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        shouldRestart = false
      }
      clearAllTimers()
      onClear()
    }

    recognition.onresult = (event) => {
      let finalText = ''
      let interimText = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (!result) continue
        const transcript = result[0]?.transcript ?? ''
        if (result.isFinal) {
          finalText += finalText ? ` ${transcript}` : transcript
        } else {
          interimText += interimText ? ` ${transcript}` : transcript
        }
      }

      const currentText = finalText || interimText
      const isFinalResult = finalText !== ''

      if (currentText && currentText.trim() !== '') {
        onResult(currentText, isFinalResult)
        if (isFinalResult) {
          resetLineFinalizationTimer()
        } else {
          resetTimers()
        }
      }
    }
  } else {
    error.value = 'La API Web Speech no está disponible en este navegador'
  }

  function clearLineFinalizationTimer(): void {
    if (lineFinalizationTimer) {
      clearTimeout(lineFinalizationTimer)
      lineFinalizationTimer = null
    }
  }

  function clearCompleteClearTimer(): void {
    if (completeClearTimer) {
      clearTimeout(completeClearTimer)
      completeClearTimer = null
    }
  }

  function clearAllTimers(): void {
    clearLineFinalizationTimer()
    clearCompleteClearTimer()
  }

  function resetCompleteClearTimer(): void {
    clearCompleteClearTimer()
    completeClearTimer = setTimeout(onClear, COMPLETE_CLEAR_TIMEOUT)
  }

  function resetLineFinalizationTimer(): void {
    clearLineFinalizationTimer()
    lineFinalizationTimer = setTimeout(resetCompleteClearTimer, LINE_FINALIZATION_TIMEOUT)
  }

  function resetTimers(): void {
    clearAllTimers()
    resetCompleteClearTimer()
  }

  function start(): void {
    if (!recognition || isListening.value) return
    shouldRestart = true
    recognition.lang = sourceLang.value
    recognition.start()
  }

  function stop(): void {
    if (!recognition || !isListening.value) return
    shouldRestart = false
    recognition.stop()
    clearAllTimers()
    onClear()
  }

  onUnmounted(stop)

  return { isListening, error, start, stop }
}

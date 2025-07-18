import {onUnmounted, ref, type Ref, watch} from 'vue'

// Interfaces para tipado estricto
interface SpeechRecognitionState {
    isListening: Ref<boolean>
    error: Ref<string | null>
    start: () => void
    stop: () => void
}

type OnResultCallback = (text: string, isFinal: boolean) => void
type OnClearCallback = () => void

/**
 * Composable para reconocimiento de voz continuo con timing optimizado para YouTube.
 * @param onResult - Callback cuando se detecta texto (ahora incluye isFinal).
 * @param onClear - Callback cuando hay inactividad prolongada.
 * @param sourceLang - Ref reactivo con el código de idioma.
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
    let lineFinalizationTimer: ReturnType<typeof setTimeout> | null = null
    let completeClearTimer: ReturnType<typeof setTimeout> | null = null

    // Timeouts optimizados para comportamiento YouTube
    const LINE_FINALIZATION_TIMEOUT = 800   // 0.8s - finaliza línea actual
    const COMPLETE_CLEAR_TIMEOUT = 3000     // 3s - limpia todo el historial

    if (SpeechRecognition) {
        recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = sourceLang.value

        // Reactividad: cambia el idioma en caliente
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
            resetTimers()
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
            clearAllTimers()
            onClear()
        }

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let finalText = ''
            let interimText = ''

            // Procesa todos los resultados
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i]
                if (result.isFinal) {
                    finalText += result[0].transcript
                } else {
                    interimText += result[0].transcript
                }
            }

            const currentText = finalText || interimText
            const isFinalResult = finalText !== ''

            if (currentText && currentText.trim() !== '') {
                // Envía el resultado con información de si es final
                onResult(currentText, isFinalResult)

                if (isFinalResult) {
                    // Resultado final: inicia timer para finalizar línea
                    resetLineFinalizationTimer()
                } else {
                    // Resultado intermedio: continúa actualizando
                    resetTimers()
                }
            }
        }
    } else {
        error.value = 'La API Web Speech no está disponible en este navegador'
    }

    // Timer para finalizar la línea actual (pausa corta)
    function resetLineFinalizationTimer(): void {
        clearLineFinalizationTimer()
        lineFinalizationTimer = setTimeout(() => {
            // Aquí podrías emitir un evento específico para "finalizar línea"
            // Por ahora, simplemente reseteamos el timer de limpieza completa
            resetCompleteClearTimer()
        }, LINE_FINALIZATION_TIMEOUT)
    }

    // Timer para limpiar completamente (silencio prolongado)
    function resetCompleteClearTimer(): void {
        clearCompleteClearTimer()
        completeClearTimer = setTimeout(() => {
            onClear()
        }, COMPLETE_CLEAR_TIMEOUT)
    }

    // Resetea ambos timers
    function resetTimers(): void {
        clearAllTimers()
        resetCompleteClearTimer()
    }

    // Funciones de limpieza
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

    function start(): void {
        if (recognition && !isListening.value) {
            recognition.lang = sourceLang.value
            recognition.start()
        }
    }

    function stop(): void {
        if (recognition && isListening.value) {
            recognition.stop()
            clearAllTimers()
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

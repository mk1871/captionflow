import { ref, readonly, type Ref } from 'vue'

/* ---------- Interfaces TypeScript ---------- */
interface TranslationState {
  translatedText: Ref<string>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  translate: (text: string, targetLang: string, sourceLang?: string) => Promise<void>
}

interface GoogleTranslateResponse {
  0: Array<[string, string, null, null, number]>
}

/**
 * Composable para traducción usando la API pública de Google Translate.
 * Soporta cancelación de peticiones anteriores y opción de idioma origen.
 */
export function useTranslation(): TranslationState {
  const translatedText = ref<string>('')
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  let abortController: AbortController | null = null

  const translate = async (
      text: string,
      targetLang: string,
      sourceLang: string = 'auto'
  ): Promise<void> => {
    if (!text || text.trim() === '') {
      translatedText.value = ''
      error.value = null
      return
    }

    // Cancela cualquier petición anterior
    if (abortController) {
      abortController.abort()
    }
    abortController = new AbortController()

    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`,
          { signal: abortController.signal }
      )

      if (!response.ok) {
        // ✅ Crear error específico sin lanzar excepción innecesaria
        error.value = `Error en la traducción: ${response.statusText}`
        translatedText.value = ''
        return
      }

      const data: GoogleTranslateResponse = await response.json()
      const result = data[0][0][0]

      if (result !== translatedText.value) {
        translatedText.value = result
      }
    } catch (caughtError: unknown) {
      // ✅ Type guard para manejo seguro de errores
      if (caughtError instanceof Error) {
        if (caughtError.name === 'AbortError') {
          // Petición cancelada, no hacer nada
          return
        }
        error.value = caughtError.message
      } else if (typeof caughtError === 'string') {
        error.value = caughtError
      } else {
        error.value = 'Error desconocido en la traducción'
      }
      translatedText.value = ''
    } finally {
      isLoading.value = false
    }
  }

  return {
    translatedText: readonly(translatedText),
    isLoading: readonly(isLoading),
    error: readonly(error),
    translate,
  }
}

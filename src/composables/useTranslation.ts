import { readonly, ref, type Ref } from 'vue'

export interface TranslationState {
  translatedText: Ref<string>
  isLoading: Ref<boolean>
  error: Ref<string | null>
  translate: (text: string, targetLang: string, sourceLang?: string) => Promise<void>
  clear: () => void
}

type Provider = 'gtx' | 'clients5' | 'mymemory'

interface ProviderResult {
  text: string
}

const cache = new Map<string, string>()
const MAX_CACHE_SIZE = 300

const providerCoolDowns = new Map<Provider, number>()
const COOLDOWN_MS: Record<Provider, number> = {
  gtx: 120_000,
  clients5: 120_000,
  mymemory: 60_000,
}

const PROVIDER_ORDER: Provider[] = ['clients5', 'gtx', 'mymemory']

function cacheKey(text: string, targetLang: string, sourceLang: string): string {
  return `${sourceLang}|${targetLang}|${text}`
}

function isOnCooldown(provider: Provider): boolean {
  const until = providerCoolDowns.get(provider)
  return until !== undefined && Date.now() < until
}

function markCooldown(provider: Provider): void {
  providerCoolDowns.set(provider, Date.now() + COOLDOWN_MS[provider])
}

async function fetchGtx(
  text: string,
  targetLang: string,
  sourceLang: string,
): Promise<ProviderResult> {
  const url =
    `https://translate.googleapis.com/translate_a/single` +
    `?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`gtx ${response.status}`)
  const data = (await response.json()) as { 0: Array<[string] | null> }
  const segments = data[0]?.map((seg) => seg?.[0] ?? '').join('')
  if (!segments) throw new Error('gtx empty')
  return { text: segments }
}

function parseClients5(data: unknown): string | null {
  if (!Array.isArray(data) || data.length === 0) return null
  if (typeof data[0] === 'string') return data[0]
  const parts: string[] = []
  for (const segment of data) {
    if (Array.isArray(segment) && typeof segment[0] === 'string') {
      parts.push(segment[0])
    }
  }
  return parts.join('') || null
}

async function fetchClients5(
  text: string,
  targetLang: string,
  sourceLang: string,
): Promise<ProviderResult> {
  const url =
    `https://clients5.google.com/translate_a/t` +
    `?client=dict-chrome-ex&sl=${sourceLang}&tl=${targetLang}&q=${encodeURIComponent(text)}`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`clients5 ${response.status}`)
  const data = (await response.json()) as unknown
  const translated = parseClients5(data)
  if (!translated) throw new Error('clients5 empty')
  return { text: translated }
}

async function fetchMyMemory(
  text: string,
  targetLang: string,
  sourceLang: string,
): Promise<ProviderResult> {
  const langpair = `${sourceLang}|${targetLang}`
  const url =
    `https://api.mymemory.translated.net/get` +
    `?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langpair)}`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`mymemory ${response.status}`)
  const data = (await response.json()) as {
    responseData?: { translatedText?: string }
    responseStatus?: number
  }
  const translated = data.responseData?.translatedText
  if (!translated) throw new Error('mymemory empty')
  return { text: translated }
}

const fetchers: Record<
  Provider,
  (text: string, targetLang: string, sourceLang: string) => Promise<ProviderResult>
> = {
  gtx: fetchGtx,
  clients5: fetchClients5,
  mymemory: fetchMyMemory,
}

/**
 * Traducción multi-proveedor, gratuita y sin API key.
 *
 * Cadena de respaldo automática ante bloqueos:
 *   1. `clients5.google.com` — el endpoint que usa el propio Chrome para traducir.
 *   2. `translate.googleapis.com` (gtx) — la API pública del traductor de Google.
 *   3. MyMemory — API de traducción libre con CORS estable.
 * Cada proveedor entra en cooldown (120s/60s) tras un fallo, evitando
 * martillear servicios limitados por IP.
 *
 * Estrategias anti-rate-limit:
 * - Caché por (origen, destino, texto): no repite peticiones del mismo texto.
 * - Ante un error transitorio conserva la última traducción válida.
 */
export function useTranslation(): TranslationState {
  const translatedText = ref('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const translate = async (
    text: string,
    targetLang: string,
    sourceLang = 'auto',
  ): Promise<void> => {
    if (!text || text.trim() === '') {
      translatedText.value = ''
      error.value = null
      return
    }

    const key = cacheKey(text, targetLang, sourceLang)
    const cached = cache.get(key)
    if (cached !== undefined) {
      translatedText.value = cached
      return
    }

    isLoading.value = true

    for (const provider of PROVIDER_ORDER) {
      if (isOnCooldown(provider)) continue
      try {
        const result = await fetchers[provider](text, targetLang, sourceLang)
        translatedText.value = result.text
        error.value = null
        if (cache.size >= MAX_CACHE_SIZE) cache.clear()
        cache.set(key, result.text)
        return
      } catch {
        markCooldown(provider)
      }
    }

    error.value = 'Traducción no disponible (límite temporal de los servicios gratuitos)'
  }

  function clear(): void {
    translatedText.value = ''
    error.value = null
  }

  return {
    translatedText: readonly(translatedText),
    isLoading: readonly(isLoading),
    error: readonly(error),
    translate,
    clear,
  }
}

import { ref } from 'vue';

export function useTranslation() {
  const translatedText = ref('');
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const translate = async (text: string, lang: string) => {
    if (!text) {
      translatedText.value = '';
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(
          text
        )}`
      );

      if (!response.ok) {
        throw new Error(`Error en la solicitud de traducción: ${response.statusText}`);
      }

      const data = await response.json();
      translatedText.value = data[0][0][0];
    } catch (e: any) {
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    translatedText,
    isLoading,
    error,
    translate,
  };
}

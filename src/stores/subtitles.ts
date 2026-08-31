import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSubtitlesStore = defineStore('subtitles', () => {
  const original = ref('')
  const trans1 = ref('')
  const trans2 = ref('')

  function clearAll(): void {
    original.value = ''
    trans1.value = ''
    trans2.value = ''
  }

  return { original, trans1, trans2, clearAll }
})

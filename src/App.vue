<script setup lang="ts">
import { computed } from 'vue'
import MainLayout from '@/components/MainLayout.vue'
import ChromaPopup from '@/components/chroma/ChromaPopup.vue'

const isChroma = computed(() => new URLSearchParams(window.location.search).get('chroma') === '1')

document.title = isChroma.value ? 'CaptionFlow Croma' : 'CaptionFlow'
</script>

<template>
  <ChromaPopup v-if="isChroma" />
  <MainLayout v-else />
</template>

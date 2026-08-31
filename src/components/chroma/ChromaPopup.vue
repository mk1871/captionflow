<script setup lang="ts">
import SubtitlesOverlay from '@/components/overlay/SubtitlesOverlay.vue'
import { useChromaReceiver } from '@/composables/useChromaReceiver'

useChromaReceiver()
</script>

<template>
  <div class="h-screen w-screen overflow-hidden bg-[#00ff00]">
    <SubtitlesOverlay :chroma="true" />
  </div>
</template>

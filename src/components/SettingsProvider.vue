<script setup lang="ts">
import { provideSettings } from '@/composables/useSettings'

provideSettings()
</script>

<template>
  <slot />
</template>

<script setup lang="ts">
// Importa el provider y el nuevo componente principal
import SettingsProvider from "@/components/SettingsProvider.vue"
import AppContent from "@/components/AppContent.vue"
</script>

<template>
  <SettingsProvider>
    <AppContent />
  </SettingsProvider>
</template>

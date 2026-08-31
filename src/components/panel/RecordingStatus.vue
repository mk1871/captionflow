<script setup lang="ts">
import { Badge } from '@/components/ui/badge'

defineProps<{
  isListening: boolean
  error: string | null
}>()
</script>

<template>
  <div class="flex items-center gap-2">
    <Badge :variant="isListening ? 'default' : 'secondary'" class="gap-1.5 font-normal">
      <span class="relative flex size-2">
        <span
          v-if="isListening"
          class="absolute inline-flex size-2 animate-ping rounded-full bg-primary-foreground opacity-75"
        />
        <span
          class="relative inline-flex size-2 rounded-full"
          :class="isListening ? 'bg-primary-foreground' : 'bg-muted-foreground/60'"
        />
      </span>
      {{ isListening ? 'Escuchando' : 'Micrófono inactivo' }}
    </Badge>
  </div>
  <p v-if="error" class="mt-1 text-xs text-destructive">{{ error }}</p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { speechLanguages } from '@/lib/languages'
import { Switch } from '@/components/ui/switch'
import SelectField from '@/components/controls/SelectField.vue'
import SubtitleStyleFields from '@/components/controls/SubtitleStyleFields.vue'

const props = withDefaults(
  defineProps<{
    kind: 'original' | 'translation'
    index?: 0 | 1
  }>(),
  { index: 0 },
)

const settings = useSettingsStore()

const isOriginal = computed(() => props.kind === 'original')
const translation = computed(() => settings.settings.translations[props.index]!)

const style = computed(() =>
  isOriginal.value ? settings.settings.original : translation.value.style,
)

const title = computed(() => {
  if (isOriginal.value) return 'Texto Original'
  return props.index === 0 ? 'Traducción 1' : 'Traducción 2'
})

const enabled = computed(() =>
  isOriginal.value ? settings.settings.showOriginal : translation.value.active,
)

const enabledModel = computed<boolean>({
  get: () => enabled.value,
  set: (value) => {
    if (isOriginal.value) {
      settings.settings.showOriginal = value
    } else {
      translation.value.active = value
    }
  },
})

const disabledHint = computed(() =>
  isOriginal.value
    ? 'Activa el texto original para configurar sus opciones'
    : 'Activa la traducción para configurar sus opciones',
)

const language = computed<string>({
  get: () => (isOriginal.value ? settings.settings.sourceLang : translation.value.lang),
  set: (value) => {
    if (isOriginal.value) {
      settings.settings.sourceLang = value
    } else {
      translation.value.lang = value
    }
  },
})

const languageOptions = computed(() => {
  if (isOriginal.value) {
    return speechLanguages.map((l) => ({ value: l.code, label: l.name }))
  }
  return settings.availableTranslationLanguages(props.index).map((l) => ({
    value: l.code,
    label: l.name,
  }))
})
</script>

<template>
  <section class="space-y-4">
    <div class="flex items-center justify-end">
      <Switch v-model="enabledModel" :aria-label="`Mostrar ${title}`" />
    </div>

    <div v-if="enabled" class="space-y-4">
      <SubtitleStyleFields
        v-model:font="style.font"
        v-model:weight="style.weight"
        v-model:color="style.color"
        v-model:size="style.size"
        v-model:shadow-color="style.shadowColor"
        v-model:shadow-offset="style.shadowOffset"
      >
        <template #extra>
          <div class="flex flex-col gap-1.5">
            <span class="text-xs font-medium text-muted-foreground">
              {{ isOriginal ? 'Entrada' : 'Idioma' }}
            </span>
            <SelectField
              v-model="language"
              :options="languageOptions"
              size="sm"
              class="w-full"
              aria-label="Idioma"
            />
          </div>
        </template>
      </SubtitleStyleFields>
    </div>

    <p v-else class="text-sm text-muted-foreground">{{ disabledHint }}</p>
  </section>
</template>
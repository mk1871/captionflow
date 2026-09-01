import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { watch } from 'vue'
import { bind, setEnabled, setVolume } from 'cuelume'
import App from './App.vue'
import { useSettingsStore } from '@/stores/settings'
import '@fontsource-variable/outfit/wght.css'
import '@fontsource-variable/inter/wght.css'
import '@fontsource-variable/roboto/wght.css'
import '@fontsource/lato/700.css'
import '@fontsource/lato/900.css'
import '@fontsource-variable/montserrat/wght.css'
import '@fontsource-variable/open-sans/wght.css'
import '@fontsource-variable/noto-sans/wght.css'

import './style.css'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

const settings = useSettingsStore(pinia)
bind()
setEnabled(settings.settings.soundsEnabled)
setVolume(settings.settings.soundsVolume / 100)
watch(() => settings.settings.soundsEnabled, setEnabled)
watch(
  () => settings.settings.soundsVolume,
  (volume) => setVolume(volume / 100),
)

app.mount('#app')

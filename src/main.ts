import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
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

app.use(createPinia())

app.mount('#app')

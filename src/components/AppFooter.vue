<script setup lang="ts">
// Información de la aplicación
const appInfo = {
  name: 'CaptionFlow',
  version: '1.0.0',
  author: 'Manuel Kas',
  location: 'Bucaramanga, Colombia',
  year: new Date().getFullYear()
}

// Enlaces de contacto
const contactInfo = {
  whatsapp: {
    number: '+573156046142',
    message: encodeURIComponent('¡Hola Manuel! Muchas gracias por CaptionFlow, es una aplicación increíble. Me gustaría conocer más sobre tus otros proyectos y servicios de desarrollo. ¿Podrías contarme qué más haces?')
  },
  email: 'manuelkas2022@gmail.com'
}

// Función para abrir WhatsApp
const openWhatsApp = () => {
  const url = `https://wa.me/${contactInfo.whatsapp.number.replace(/\D/g, '')}?text=${contactInfo.whatsapp.message}`
  window.open(url, '_blank')
}

// Función para abrir email
const openEmail = () => {
  const subject = encodeURIComponent('Consulta sobre CaptionFlow y otros servicios')
  const body = encodeURIComponent('Hola Manuel,\n\nMe ha gustado mucho CaptionFlow. Me gustaría conocer más sobre tus otros proyectos y servicios de desarrollo.\n\nSaludos!')
  const url = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`
  window.open(url, '_blank')
}
</script>

<template>
  <footer class="bg-card border-t border-border">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Logo y nombre de la app -->
      <div class="flex flex-col items-center space-y-6">
        <!-- Logo SVG actualizado para CaptionFlow -->
        <div class="flex items-center space-x-3">
          <svg class="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <!-- Ícono que representa flujo de subtítulos -->
            <path d="M3 7h18M3 12h18M3 17h12"/>
            <path d="M21 7v10l-3-3"/>
            <circle cx="18" cy="12" r="2"/>
          </svg>
          <div class="text-center">
            <h3 class="text-lg font-semibold text-foreground">
              {{ appInfo.name }} <span class="text-sm text-muted-foreground">v{{ appInfo.version }}</span>
            </h3>
            <p class="text-sm text-muted-foreground">Flujo continuo de subtítulos multiidioma para streaming profesional</p>
          </div>
        </div>

        <!-- Información de contacto -->
        <div class="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
          <!-- Botón WhatsApp -->
          <button
              @click="openWhatsApp"
              class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            WhatsApp
          </button>

          <!-- Botón Email -->
          <button
              @click="openEmail"
              class="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors duration-200"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            Email
          </button>
        </div>

        <!-- Copyright -->
        <div class="text-center text-sm text-muted-foreground border-t border-border pt-6 w-full">
          <p>
            © {{ appInfo.year }} {{ appInfo.name }} - Desarrollado por
            <span class="font-medium text-foreground">{{ appInfo.author }}</span>
          </p>
          <p class="mt-1">{{ appInfo.location }}</p>
          <p class="mt-2 text-xs">
            Aplicación de código abierto para subtítulos multiidioma en tiempo real
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { MailIcon } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const author = 'Manuel Kas'
const location = 'Bucaramanga, Colombia'
const year = new Date().getFullYear()

const whatsappHref =
  'https://wa.me/573156046142?text=' +
  encodeURIComponent(
    '¡Hola Manuel! Muchas gracias por CaptionFlow. Me gustaría conocer más sobre tus otros proyectos y servicios de desarrollo.',
  )

const emailAddress = 'manuelkas2022@gmail.com'

function openWhatsApp(): void {
  window.open(whatsappHref, '_blank', 'noopener')
}

function openEmail(): void {
  const subject = encodeURIComponent('Consulta sobre CaptionFlow y otros servicios')
  const body = encodeURIComponent(
    'Hola Manuel,\n\nMe ha gustado mucho CaptionFlow. Me gustaría conocer más sobre tus otros proyectos y servicios de desarrollo.\n\nSaludos!',
  )
  window.open(`mailto:${emailAddress}?subject=${subject}&body=${body}`, '_self')
}
</script>

<template>
  <footer class="border-t border-border bg-card">
    <div class="mx-auto w-full max-w-3xl px-4 py-8">
      <div class="flex flex-col items-center gap-6">
        <div class="flex items-center gap-3">
          <Avatar class="size-9 rounded-md">
            <AvatarFallback class="bg-primary/10 text-primary">
              <svg
                class="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M3 7h18M3 12h18M3 17h12" />
                <path d="M21 7v10l-3-3" />
                <circle cx="18" cy="12" r="2" />
              </svg>
            </AvatarFallback>
          </Avatar>
          <div class="text-center">
            <h3 class="text-base font-semibold tracking-tight">
              CaptionFlow <span class="text-sm font-normal text-muted-foreground">v1.0.0</span>
            </h3>
            <p class="text-xs text-muted-foreground">
              Subtítulos multiidioma en tiempo real para streaming
            </p>
          </div>
        </div>

        <Separator class="w-full max-w-xs" />

        <div class="flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" size="sm" class="gap-2" @click="openWhatsApp">
            <svg
              class="size-4 text-[#25D366]"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.885 3.488"
              />
            </svg>
            WhatsApp
          </Button>

          <Button variant="outline" size="sm" class="gap-2" @click="openEmail">
            <MailIcon class="size-4" />
            Email
          </Button>
        </div>

        <div class="text-center text-xs text-muted-foreground">
          <p>
            © {{ year }} CaptionFlow · Desarrollado por
            <span class="font-medium text-foreground">{{ author }}</span>
          </p>
          <p class="mt-1">{{ location }}</p>
        </div>
      </div>
    </div>
  </footer>
</template>

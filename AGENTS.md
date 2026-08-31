# AGENTS.md

## Qué es este proyecto

**CaptionFlow** — subtitulador en tiempo real para streaming: recibe voz por la **Web Speech API** (solo navegadores Chromium: Chrome/Edge/Brave), la transcribe y traduce (Google Translate gratuito, sin API key) y muestra los subtítulos en un overlay con **chroma key** (verde #00FF00) para capturar en OBS.

> **Estado actual:** el repo está en la base migrada desde cero (scaffold limpio). La lógica de voz/traducción/overlay todavía **no está portada**: `src/` solo tiene el scaffold + componentes shadcn-vue. La implementación legada está disponible en el historial de git como referencia para portarla.

## Stack

Vue 3.5 (`<script setup>` + TS estricto) · Vite 8 · TypeScript 6 · Tailwind CSS **v4** (config en CSS, sin `tailwind.config.js`) · shadcn-vue 2.x · Pinia 4 · pnpm 12.

## Comandos

```sh
pnpm dev          # dev server + HMR
pnpm build        # pnpm type-check && pnpm build-only
pnpm type-check   # vue-tsc --build
pnpm lint         # oxlint . --fix  +  eslint . --fix --cache
pnpm format       # prettier
pnpm deploy       # build + gh-pages -d dist  (rama gh-pages)
```

## Gotchas (importantes)

- **pnpm ≥11 bloquea build scripts de dependencias** por defecto. `vue-demi` ya está aprobado en `pnpm-workspace.yaml` (`allowBuilds`). Si una dependencia nueva necesita build script, añádela ahí (o `pnpm approve-builds`).
- **shadcn-vue CLI SIEMPRE con el flag** (si no, falla con `ERR_PNPM_IGNORED_BUILDS`):
  ```sh
  pnpm dlx --allow-build=vue-demi shadcn-vue@latest add <componente>
  ```
- **No añadir `baseUrl`** a los tsconfig: TypeScript 6 lo deprecó (error TS5101) y `paths` funciona sin él.
- **`vite.config.ts` tiene `base: '/captionflow/'` fijo** (GitHub Pages project site). No quitarlo.

## Arquitectura / convenciones

- Alias `@` → `src/` (en `vite.config.ts`, `tsconfig.app.json` y `tsconfig.json`).
- **Componentes UI:** shadcn-vue en `src/components/ui/` (config en `components.json`, estilo `new-york`, iconos `@lucide/vue`). **No reinventar primitivos** — usar `shadcn-vue add`.
- La regla ESLint `vue/multi-word-component-names` está desactivada **solo para `src/components/ui/**`** (`eslint.config.ts`); los componentes propios deben seguir nombre multi-word.
- **Tema:** definido en `src/style.css` como variables OKLCH en `:root` y `.dark` (tema tweakcn "supabase"). Dark mode = clase `.dark` en `<html>`. Fuente UI: **Outfit** (import de Google Fonts al inicio del CSS).
- **Estado global:** Pinia, stores en `src/stores/`.
- `cn()` para unir clases: `src/lib/utils.ts`.
- Primitivos base (Switch, Slider, Select/Combobox, Sonner, Tooltip, etc.) ya instalados para el panel de control; el overlay de subtítulos usa su propia configuración de colores, aparte del tema UI.

## Skills de opencode (locales)

opencode anuncia automáticamente las skills instaladas (`skill` tool). Cuando una tarea coincida, **cargar la skill con la herramienta `skill`** en vez de improvisar:

- Componentes/SFC Vue, reactividad, Pinia → `vue`, `vue-best-practices`, `vue-debug-guides`
- Estilos Tailwind v4 y diseño de UI → `tailwind-css-patterns`, `frontend-design`
- Lógica TS (traducción/voz) → `typescript-advanced-types`
- Configuración de Vite → `vite`
- Accesibilidad del panel/overlay → `accessibility`

> Las skills **no se versionan** (`.agents/` y `skills-lock.json` están en `.gitignore`): solo existen localmente. En un clone fresco pueden faltar; en ese caso se sigue la guía oficial de la herramienta correspondiente.

## Git / despliegue

- Rama desplegada en GitHub Pages: **`gh-pages`**.
- **`.agents/` y `skills-lock.json` están en `.gitignore`**: son skills locales de opencode, no se suben al repo remoto.
- La app requiere navegador Chromium (la Web Speech API no existe en Firefox/Safari).
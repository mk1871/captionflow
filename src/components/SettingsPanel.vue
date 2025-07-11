<script setup lang="ts">
import { useSettings, availableFonts, speechLanguages } from '../composables/useSettings';

const { settings, restoreDefaults, availableTranslationLangs1, availableTranslationLangs2 } = useSettings();

</script>

<template>
  <div class="bg-white p-5 rounded-lg shadow-lg w-full max-w-full mx-auto flex flex-col gap-5">
    <!-- Encabezado del panel de configuración -->
    <div class="flex justify-between items-center w-full">
      <h2 class="text-2xl font-bold">Configuración</h2>
      <div class="flex items-center space-x-4">
        <label for="show-original" class="font-medium text-gray-700">Mostrar Texto Original</label>
        <input id="show-original" type="checkbox" v-model="settings.showOriginal" class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
        <button @click="restoreDefaults" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Restaurar
        </button>
      </div>
    </div>

    <!-- Contenedor de las tres secciones de control -->
    <div class="flex flex-col lg:flex-row lg:flex-nowrap justify-center gap-5">
      <!-- Controles de Texto Original y Estilo -->
      <div class="flex-1 p-4 border rounded-lg shadow-sm">
        <h3 class="text-xl font-bold mb-4">Texto Original y Estilo</h3>
        <div class="mb-4">
          <label for="source-lang" class="block text-sm font-medium text-gray-700">Idioma Original</label>
          <select id="source-lang" v-model="settings.sourceLang" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option v-for="lang in speechLanguages" :key="lang.code" :value="lang.code">{{ lang.name }}</option>
          </select>
        </div>
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Fuente</label>
            <select v-model="settings.original.font" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option v-for="font in availableFonts" :key="font" :value="font">{{ font }}</option>
            </select>
          </div>
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700">Color</label>
            <input type="color" v-model="settings.original.color" class="w-8 h-8 rounded-full p-0 border-none cursor-pointer">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Tamaño ({{ settings.original.size }}px)</label>
            <input type="range" min="20" max="100" v-model="settings.original.size" class="mt-1 block w-full">
          </div>
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700">Borde</label>
            <input type="color" v-model="settings.original.shadowColor" class="w-8 h-8 rounded-full p-0 border-none cursor-pointer">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Grosor ({{ settings.original.shadowOffset }}px)</label>
            <input type="range" min="0" max="10" v-model="settings.original.shadowOffset" class="mt-1 block w-full">
          </div>
        </div>
      </div>

      <!-- Controles de Traducción 1 -->
      <div class="flex-1 p-4 border rounded-lg shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold">Traducción 1</h3>
          <input type="checkbox" v-model="settings.translations[0].active" class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
        </div>
        <div v-if="settings.translations[0].active">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Idioma</label>
            <select v-model="settings.translations[0].lang" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option v-for="lang in availableTranslationLangs1" :key="lang.code" :value="lang.code">{{ lang.name }}</option>
            </select>
          </div>
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Fuente</label>
              <select v-model="settings.translations[0].style.font" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option v-for="font in availableFonts" :key="font" :value="font">{{ font }}</option>
              </select>
            </div>
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Color</label>
              <input type="color" v-model="settings.translations[0].style.color" class="w-8 h-8 rounded-full p-0 border-none cursor-pointer">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Tamaño ({{ settings.translations[0].style.size }}px)</label>
              <input type="range" min="20" max="100" v-model="settings.translations[0].style.size" class="mt-1 block w-full">
            </div>
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Borde</label>
              <input type="color" v-model="settings.translations[0].style.shadowColor" class="w-8 h-8 rounded-full p-0 border-none cursor-pointer">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Grosor ({{ settings.translations[0].style.shadowOffset }}px)</label>
              <input type="range" min="0" max="10" v-model="settings.translations[0].style.shadowOffset" class="mt-1 block w-full">
            </div>
          </div>
        </div>
      </div>

      <!-- Controles de Traducción 2 -->
      <div class="flex-1 p-4 border rounded-lg shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold">Traducción 2</h3>
          <input type="checkbox" v-model="settings.translations[1].active" class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
        </div>
        <div v-if="settings.translations[1].active">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Idioma</label>
            <select v-model="settings.translations[1].lang" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option v-for="lang in availableTranslationLangs2" :key="lang.code" :value="lang.code">{{ lang.name }}</option>
            </select>
          </div>
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Fuente</label>
              <select v-model="settings.translations[1].style.font" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option v-for="font in availableFonts" :key="font" :value="font">{{ font }}</option>
              </select>
            </div>
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Color</label>
              <input type="color" v-model="settings.translations[1].style.color" class="w-8 h-8 rounded-full p-0 border-none cursor-pointer">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Tamaño ({{ settings.translations[1].style.size }}px)</label>
              <input type="range" min="20" max="100" v-model="settings.translations[1].style.size" class="mt-1 block w-full">
            </div>
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Borde</label>
              <input type="color" v-model="settings.translations[1].style.shadowColor" class="w-8 h-8 rounded-full p-0 border-none cursor-pointer">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Grosor ({{ settings.translations[1].style.shadowOffset }}px)</label>
              <input type="range" min="0" max="10" v-model="settings.translations[1].style.shadowOffset" class="mt-1 block w-full">
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
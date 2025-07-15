# CaptionFlow v1.0.0

**Flujo continuo de subtítulos multiidioma para streaming profesional**

CaptionFlow es una aplicación web que utiliza la **Web Speech API nativa de Chrome** para reconocimiento de voz en tiempo real, combinada con traducción automática para generar subtítulos multiidioma optimizados para streaming.

## ⚠️ Requisitos de Navegador

### Navegadores Compatibles

- **Google Chrome** 25+ (recomendado)
- **Microsoft Edge** 79+ (basado en Chromium)
- **Opera** 27+ (basado en Chromium)
- **Brave Browser** (cualquier versión)
- **Samsung Internet** 4.0+


### Navegadores NO Compatibles

- Mozilla Firefox (no implementa Web Speech API)
- Safari (soporte experimental limitado)
- Internet Explorer (no soportado)

> **Nota Importante**: CaptionFlow utiliza la Web Speech API nativa del navegador, la misma tecnología que utiliza Chrome para el subtitulado automático. Esta API es completamente gratuita y no requiere servicios externos.

## 🎯 Características Principales

- **Reconocimiento de voz nativo** usando Web Speech API de Chrome
- **Traducción automática** con Google Translate (gratuita)
- **Tipografías profesionales** optimizadas para streaming
- **Integración con OBS Studio** mediante chroma key
- **Sin costos de API** - utiliza recursos del navegador del usuario
- **Personalización completa** de colores, tamaños y contornos
- **Tema oscuro/claro** con persistencia automática
- **Configuración persistente** en localStorage


## 🚀 Tecnologías Utilizadas

- **Vue 3** con Composition API + TypeScript estricto
- **Tailwind CSS 4.1** con sistema de temas personalizable
- **Vite 7.0** como build tool optimizado
- **Web Speech API** para reconocimiento de voz
- **Google Translate API** para traducciones
- **GitHub Pages** para deploy automático


## 📦 Instalación y Uso

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Google Chrome o navegador basado en Chromium


### Instalación

```bash
git clone https://github.com/mk1871/captionflow.git
cd captionflow
npm install
```


### Desarrollo

```bash
npm run dev
```


### Build para producción

```bash
npm run build
npm run deploy
```


## 🔧 Configuración Recomendada

### Navegador

1. Usar Google Chrome (versión 88+ recomendada)
2. Habilitar permisos de micrófono para el sitio
3. Verificar que el idioma del sistema coincida con el idioma de entrada

### Configuración de Chrome

1. Ir a `chrome://settings/content/microphone`
2. Asegurar que el sitio tenga permisos de micrófono
3. Verificar que no hay otros programas bloqueando el micrófono

## 🎬 Integración con OBS Studio

> **Importante**: Usar "Captura de Ventana" en lugar de "Fuente del navegador" en OBS, ya que la fuente del navegador puede interferir con los permisos del micrófono.

### Configuración Paso a Paso

#### 1. Preparación (Chrome requerido)

1. Abrir CaptionFlow en Google Chrome
2. Conceder permisos de micrófono cuando se solicite
3. Verificar que el reconocimiento de voz esté funcionando

#### 2. Captura de Ventana en OBS

1. Agregar Fuente → Captura de Ventana
2. Seleccionar la ventana del navegador con CaptionFlow
3. Nombrar la fuente como "Subtítulos CaptionFlow"
4. ⚠️ **NO usar "Fuente del navegador"** (interferirá con el micrófono)

#### 3. Recortar al Área Verde

1. Clic derecho en la fuente → Filtros
2. Agregar → Recortar/Rellenar
3. Configurar para mostrar solo el área verde superior (45% de la pantalla)
4. Ajustar posición según tu layout

#### 4. Aplicar Chroma Key

1. Agregar filtro → Clave de Color
2. Tipo de clave: Color
3. Color clave: Verde (\#00FF00)
4. Similitud: 400-600
5. Suavidad: 80-120
6. Derrame de clave: 100-150

#### 5. Posicionamiento Final

1. Redimensionar la fuente según necesidades
2. Posicionar en la parte inferior de la pantalla
3. Ajustar opacidad si es necesario (80-90%)
4. Probar con diferentes fuentes de fondo

### Configuración Recomendada

#### Orden de Capas en OBS (de arriba hacia abajo):

1. **Fuente de Subtítulos** (CaptionFlow con chroma key)
2. **Cámara principal** o contenido secundario
3. **Fondo** o pantalla compartida

#### Configuración de Audio:

- **Micrófono**: Configurar como fuente de audio principal
- **Monitoreo**: Activar para verificar que CaptionFlow recibe audio
- **Filtros**: Aplicar reducción de ruido y normalización


## ⚙️ Configuración Avanzada

### Fuentes Disponibles

- **Inter** (pesos: 500, 600, 700, 800)
- **Roboto** (pesos: 500, 700, 900)
- **Lato** (pesos: 700, 900)
- **Montserrat** (pesos: 600, 700, 800, 900)
- **Open Sans** (pesos: 600, 700, 800)
- **Noto Sans** (pesos: 500, 700, 900)


### Idiomas Soportados

Español, Inglés, Francés, Alemán, Italiano, Portugués, Ruso, Chino (simplificado/tradicional), Japonés, Coreano, Árabe, Hindi, Turco, Polaco, Holandés, Indonesio, Tailandés, Vietnamita

### Valores por Defecto

- **Texto Original**: Lato 700, 33px, blanco, deshabilitado
- **Traducción 1**: Montserrat 700, 33px, dorado, inglés (activa)
- **Traducción 2**: Noto Sans 500, 33px, azul claro, francés (deshabilitada)
- **Contorno**: 2px negro para máxima legibilidad


## 🛠️ Troubleshooting

### El reconocimiento de voz no funciona

#### Verificar navegador:

- ✅ ¿Estás usando Chrome/Edge/Opera?
- ❌ Firefox y Safari no son compatibles
- ✅ ¿Tienes permisos de micrófono habilitados?


#### Verificar configuración:

- Comprobar que el micrófono funciona en otras aplicaciones
- Verificar el idioma de entrada en la configuración
- Reiniciar Chrome si es necesario


### Los subtítulos no aparecen

- Verificar que el reconocimiento de voz está activo
- Comprobar la configuración de idioma de entrada
- Asegurarse de que las traducciones estén habilitadas


### Chroma key no funciona correctamente

- Ajustar valores de similitud y suavidad
- Verificar que el área verde está completamente visible
- Comprobar la iluminación del área de captura


### Problemas de compatibilidad

#### Si usas Firefox o Safari:

- Cambiar a Google Chrome, Edge, o Opera
- La Web Speech API no está disponible en estos navegadores
- No hay alternativas sin cambiar a APIs de pago


## 🔍 Información Técnica

### APIs Utilizadas

- **Web Speech API**: Reconocimiento de voz nativo del navegador
- **Google Translate API**: Traducción gratuita (sin autenticación)
- **Fetch API**: Para comunicación con servicios de traducción


### Ventajas de la Web Speech API

- **Gratuita**: No hay cobros por uso
- **Privacidad**: Procesamiento local en el navegador
- **Baja latencia**: Reconocimiento en tiempo real
- **Multiidioma**: 19 idiomas soportados nativamente


## 🌐 Compatibilidad Detallada

| Navegador | Versión Mínima | Soporte        | Notas                        |
|:----------|:---------------|:---------------|:-----------------------------|
| Chrome    | 25+            | ✅ Completo     | Recomendado                  |
| Edge      | 79+            | ✅ Completo     | Basado en Chromium           |
| Opera     | 27+            | ✅ Completo     | Basado en Chromium           |
| Brave     | Cualquiera     | ✅ Completo     | Basado en Chromium           |
| Firefox   | N/A            | ❌ No soportado | No implementa Web Speech API |
| Safari    | N/A            | ❌ Limitado     | Soporte experimental         |

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/mejora`)
3. Commit tus cambios (`git commit -am 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/mejora`)
5. Crea un Pull Request

## 📝 Licencia

Este proyecto es de código abierto bajo la licencia MIT.

## 👨‍💻 Autor

**Manuel Kas** - Desarrollador Full Stack
📧 manuelkas2022@gmail.com
📍 Bucaramanga, Colombia
📱 WhatsApp: +57 315 604 6142

**Nota del Desarrollador**: Esta aplicación aprovecha la Web Speech API nativa de Chrome para ofrecer reconocimiento de voz completamente gratuito. La limitación a navegadores Chromium es una decisión técnica que permite mantener el servicio sin costos para los usuarios.

**CaptionFlow v1.0.0** - Desarrollado con ❤️ para la comunidad de streaming
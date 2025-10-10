# Plan de Integración de Cloudinary para Upload de Imágenes

## 📦 Paso 1: Instalación de Dependencias

```bash
# Instalar SDK de Cloudinary para Node.js (para API routes)
npm install cloudinary

# Instalar widget de Cloudinary (opcional, para UI pre-construido)
npm install @cloudinary/react @cloudinary/url-gen

# O usar Upload Widget vanilla JS
# No requiere instalación, se carga desde CDN
```

## 🔧 Paso 2: Configuración de Variables de Entorno

Agregar al archivo `.env.local`:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=tu-upload-preset
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret
```

### Obtener Credenciales:

1. Crear cuenta en https://cloudinary.com
2. Ir al Dashboard
3. Copiar:
   - Cloud Name
   - API Key
   - API Secret
4. Crear Upload Preset:
   - Settings → Upload → Upload Presets
   - Add upload preset
   - Signing Mode: **Unsigned** (para uploads desde cliente)
   - Folder: `ecommerce/products`
   - Transformaciones: Opcional (resize, calidad, etc.)

## 🏗️ Paso 3: Arquitectura Modular

### Estructura de Archivos

```
src/
├── types/
│   └── image.types.ts              # Tipos compartidos
├── services/
│   └── cloudinary/
│       ├── cloudinaryConfig.ts     # Configuración
│       └── cloudinaryService.ts    # Servicio de upload
├── hooks/
│   └── useImageUpload.ts           # Hook personalizado
└── components/
    └── products/
        └── productForm/
            ├── ProductForm.tsx              # Componente principal
            ├── ImageUploader.tsx            # Módulo de upload
            └── ImagePreviewGrid.tsx         # Módulo de previews
```

## 📝 Paso 4: Implementación por Fases

### Fase 1: Tipos y Configuración

1. Crear tipos compartidos para imágenes
2. Configurar Cloudinary
3. Crear servicio de upload

### Fase 2: Hook Personalizado

1. Crear `useImageUpload` hook
2. Manejar estado de uploads
3. Gestionar errores y progreso

### Fase 3: Componentes Modulares

1. Extraer `ImageUploader` del formulario principal
2. Crear `ImagePreviewGrid` reutilizable
3. Integrar con el formulario existente

### Fase 4: Testing y Optimización

1. Probar uploads múltiples
2. Implementar progress bars
3. Optimizar transformaciones de imagen

## 🎯 Estrategia de Upload

### Opción A: Upload Directo desde Cliente (Recomendado)

**Ventajas:**

- ✅ Más rápido (no pasa por tu servidor)
- ✅ Menos carga en tu backend
- ✅ Progress tracking nativo
- ✅ Transformaciones automáticas

**Desventajas:**

- ⚠️ Expone el upload preset (pero es seguro si está unsigned)
- ⚠️ Requiere configuración de CORS en Cloudinary

**Flujo:**

```
Cliente → Cloudinary → Respuesta (URL) → Tu API
```

### Opción B: Upload vía API Route

**Ventajas:**

- ✅ Más control sobre el proceso
- ✅ Puede validar imagen antes de subir
- ✅ No expone credenciales

**Desventajas:**

- ⚠️ Más lento (doble upload)
- ⚠️ Mayor carga en servidor

**Flujo:**

```
Cliente → Tu API Route → Cloudinary → Tu API → Cliente
```

### Opción C: Widget de Cloudinary (Más Simple)

**Ventajas:**

- ✅ UI pre-construida y probada
- ✅ Crop, filtros, múltiples fuentes
- ✅ Manejo de errores incorporado

**Desventajas:**

- ⚠️ Menos personalizable
- ⚠️ Añade peso al bundle

## 🚀 Implementación Recomendada

### Para este Proyecto: **Opción A + Opción C (Híbrido)**

1. **Upload Manual** (Opción A): Para la funcionalidad básica
   - Usar FormData y fetch
   - Más control sobre UI
   - Integración con preview existente

2. **Widget como Alternativa** (Opción C): Para usuarios avanzados
   - Botón opcional para abrir widget
   - Acceso a crop, efectos, etc.
   - Mejor UX para múltiples imágenes

## 📊 Flujo Propuesto

```
1. Usuario selecciona archivos locales
    ↓
2. Hook valida tamaño, tipo, cantidad
    ↓
3. Se muestran previews locales (como ahora)
    ↓
4. Usuario click "Crear Producto"
    ↓
5. ANTES de enviar al backend:
   a. Upload de imágenes a Cloudinary (paralelo)
   b. Progress bar por imagen
   c. Obtener URLs de Cloudinary
    ↓
6. Enviar producto con URLs de Cloudinary al backend
    ↓
7. Backend solo guarda URLs (no maneja archivos)
```

## 🎨 Mejoras de UX

### Durante Upload:

```
┌─────────────────────────────────┐
│  📤 Subiendo Imágenes...        │
│                                 │
│  Imagen 1/3 ████████░░ 80%     │
│  Imagen 2/3 ██████████ 100%    │
│  Imagen 3/3 ██░░░░░░░░ 20%     │
│                                 │
│  [Cancelar Upload]              │
└─────────────────────────────────┘
```

### Optimizaciones de Cloudinary:

```javascript
// Transformaciones automáticas
const imageUrl = cloudinary.url('product-image', {
  transformation: [
    { width: 800, height: 800, crop: 'limit' },
    { quality: 'auto' },
    { fetch_format: 'auto' },
  ],
});

// Genera URLs optimizadas automáticamente:
// - WebP para navegadores compatibles
// - Calidad automática según conexión
// - Resize inteligente
```

## 🔒 Seguridad

### Upload Preset Unsigned:

```javascript
// Configuración en Cloudinary Dashboard:
{
  "upload_preset": "ecommerce_products",
  "signing_mode": "unsigned",
  "folder": "products",
  "allowed_formats": ["jpg", "png", "webp"],
  "max_file_size": 5242880, // 5MB
  "max_image_width": 2000,
  "max_image_height": 2000
}
```

### Validaciones Cliente:

```javascript
const validateImage = (file: File) => {
  // Tamaño máximo: 5MB
  if (file.size > 5 * 1024 * 1024) {
    return 'Imagen muy grande (máx 5MB)';
  }

  // Formatos permitidos
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return 'Formato no permitido';
  }

  return null;
};
```

## 💰 Consideraciones de Costos

### Plan Free de Cloudinary:

- ✅ 25 GB de almacenamiento
- ✅ 25 GB de bandwidth/mes
- ✅ Transformaciones ilimitadas
- ✅ Hasta 1000 transformaciones únicas

### Optimizaciones para Reducir Costos:

1. Transformar imágenes en upload (no bajo demanda)
2. Usar formato auto (WebP cuando sea posible)
3. Implementar lazy loading
4. Cachear URLs transformadas

## 📈 Escalabilidad

### Para Crecimiento Futuro:

```javascript
// Organización por proveedor
folder: `products/${providerId}`

// Versionado de imágenes
version: Date.now()

// Tags para búsqueda
tags: ['product', 'categoria', 'proveedor-id']

// Metadata personalizada
context: {
  productId: '123',
  provider: 'ABC Store',
  category: 'motor'
}
```

## 🎯 Siguiente Paso

**¿Qué implementamos primero?**

1. **Opción Rápida** (2-3 horas):
   - Setup básico de Cloudinary
   - Upload directo desde cliente
   - Integración con formulario actual

2. **Opción Completa** (5-6 horas):
   - Arquitectura modular completa
   - Progress bars
   - Widget como alternativa
   - Optimizaciones avanzadas

3. **Opción Profesional** (1-2 días):
   - Todo lo anterior +
   - API route para validaciones
   - Crop y edición de imágenes
   - Gestión de errores avanzada
   - Tests

**Recomendación:** Empezar con Opción 1, luego iterar a Opción 2.

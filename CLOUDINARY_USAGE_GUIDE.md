# Guía de Integración de Cloudinary - Implementación Modular

## ✅ Archivos Creados

### 1. **Tipos y Configuración**

- ✅ `/src/types/image.types.ts` - Tipos TypeScript compartidos
- ✅ `/src/services/cloudinary/cloudinaryConfig.ts` - Configuración de Cloudinary
- ✅ `/src/services/cloudinary/cloudinaryService.ts` - Servicio de upload

### 2. **Hook Personalizado**

- ✅ `/src/hooks/useImageUpload.ts` - Hook para manejar estado de imágenes

### 3. **Componentes Modulares**

- ✅ `/src/components/products/productForm/ImagePreviewGrid.tsx` - Grid de previews
- ✅ `/src/components/products/productForm/ImageUploader.tsx` - Módulo de upload completo

## 🚀 Cómo Usar en ProductForm.tsx

### Opción 1: Integración Básica (Sin Cloudinary todavía)

Reemplaza la sección de imágenes en `ProductForm.tsx`:

\`\`\`tsx
import { useImageUpload } from '@/hooks/useImageUpload';
import ImageUploader from './ImageUploader';

const SellProductForm = () => {
const {
images,
uploadState,
addLocalFiles,
addImageUrl,
removeImage,
clearImages,
getMainImageUrl,
} = useImageUpload();

// ... rest of form code ...

const handleSubmit = async (values: ProductFormData) => {
setLoading(true);
setError(null);

    try {
      const token = localStorage.getItem('authToken');

      // Get main image URL (no Cloudinary upload yet)
      const mainImageUrl = getMainImageUrl();

      if (!mainImageUrl) {
        setError('Debes agregar al menos una imagen');
        return;
      }

      const productData: ProductFormData = {
        ...values,
        imagenUrl: mainImageUrl,
      };

      const result = await createProductAction(productData, token);

      if (result.success) {
        setSuccess(true);
        form.reset();
        clearImages(); // Clear images
      }
    } catch (err) {
      setError('Error al crear producto');
    } finally {
      setLoading(false);
    }

};

return (
<Paper shadow="sm" p="xl" radius="md">
<form onSubmit={form.onSubmit(handleSubmit)}>
{/_ ... other fields ... _/}

        {/* Replace image section with modular component */}
        <ImageUploader
          images={images}
          onAddFiles={addLocalFiles}
          onAddUrl={addImageUrl}
          onRemove={removeImage}
          maxImages={5}
          error={uploadState.error}
        />

        {/* ... submit buttons ... */}
      </form>
    </Paper>

);
};
\`\`\`

### Opción 2: Con Cloudinary (Funcionalidad Completa)

\`\`\`tsx
import { useImageUpload } from '@/hooks/useImageUpload';
import ImageUploader from './ImageUploader';

const SellProductForm = () => {
const {
images,
uploadState,
addLocalFiles,
addImageUrl,
removeImage,
clearImages,
uploadToCloudinary,
} = useImageUpload({
maxFiles: 5,
maxSize: 5 _ 1024 _ 1024, // 5MB
folder: 'ecommerce/products',
});

const handleSubmit = async (values: ProductFormData) => {
setLoading(true);
setError(null);

    try {
      const token = localStorage.getItem('authToken');

      // 1. Upload images to Cloudinary first
      const imageUrls = await uploadToCloudinary();

      if (imageUrls.length === 0) {
        setError('Debes agregar al menos una imagen');
        return;
      }

      // 2. Use first image URL for the product
      const productData: ProductFormData = {
        ...values,
        imagenUrl: imageUrls[0], // Cloudinary URL
      };

      // 3. Create product with Cloudinary URL
      const result = await createProductAction(productData, token);

      if (result.success) {
        setSuccess(true);
        form.reset();
        clearImages();
      }
    } catch (err) {
      setError(err.message || 'Error al crear producto');
    } finally {
      setLoading(false);
    }

};

return (
<Paper shadow="sm" p="xl" radius="md">
<form onSubmit={form.onSubmit(handleSubmit)}>
{/_ ... other fields ... _/}

        <ImageUploader
          images={images}
          onAddFiles={addLocalFiles}
          onAddUrl={addImageUrl}
          onRemove={removeImage}
          maxImages={5}
          uploading={uploadState.uploading}
          uploadProgress={uploadState.progress}
          error={uploadState.error}
        />

        <Button
          type="submit"
          loading={loading || uploadState.uploading}
          disabled={images.length === 0}
        >
          Crear Producto
        </Button>
      </form>
    </Paper>

);
};
\`\`\`

## ⚙️ Configuración de Environment Variables

Crea o actualiza `.env.local`:

\`\`\`env

# Cloudinary Configuration

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
\`\`\`

## 📋 Pasos para Habilitar Cloudinary

### 1. Crear Cuenta

1. Visita https://cloudinary.com
2. Crea cuenta gratuita
3. Accede al Dashboard

### 2. Configurar Upload Preset

1. Settings → Upload → Upload Presets
2. Click "Add upload preset"
3. Configuración:
   - **Signing Mode**: Unsigned
   - **Upload preset name**: ecommerce_products
   - **Folder**: products
   - **Allowed formats**: jpg, png, webp
   - **Max file size**: 5242880 (5MB)
4. Save

### 3. Copiar Credenciales

1. Dashboard → Product Environment Credentials
2. Copiar:
   - Cloud Name
   - Upload Preset name
3. Agregar a `.env.local`

### 4. Actualizar ProductForm.tsx

- Importar `useImageUpload`
- Importar `ImageUploader`
- Reemplazar lógica de imágenes actual
- Usar `uploadToCloudinary()` antes de submit

## 🎯 Ventajas de esta Arquitectura

### ✅ Modularidad

- Componentes reutilizables
- Fácil de mantener y testear
- Separación de responsabilidades

### ✅ Flexibilidad

- Puede funcionar sin Cloudinary (URLs directas)
- Fácil de cambiar proveedor de storage
- Configurable por opciones

### ✅ UX Mejorada

- Progress bars en tiempo real
- Preview de imágenes antes de subir
- Validación de archivos
- Manejo de errores específico

### ✅ Performance

- Upload paralelo de múltiples imágenes
- Lazy loading de previews
- Transformaciones optimizadas

## 🔄 Flujo de Datos

\`\`\`

1. Usuario selecciona archivos
   ↓
2. useImageUpload.addLocalFiles()
   - Valida archivos
   - Crea previews locales
   - Actualiza estado
     ↓
3. Usuario ve previews
   ↓
4. Usuario submit formulario
   ↓
5. useImageUpload.uploadToCloudinary()
   - Sube archivos a Cloudinary
   - Tracking de progreso
   - Retorna URLs
     ↓
6. URLs enviadas al backend
   ↓
7. Backend guarda producto con URLs
   \`\`\`

## 📊 Comparación de Opciones

| Aspecto              | Sin Cloudinary       | Con Cloudinary            |
| -------------------- | -------------------- | ------------------------- |
| **Setup**            | ⚡ Inmediato         | ⏱️ 15 minutos             |
| **Costo**            | 🆓 Gratis            | 🆓 Gratis (plan free)     |
| **Storage**          | ❌ URLs externas     | ✅ Cloudinary CDN         |
| **Optimización**     | ❌ Manual            | ✅ Automática             |
| **Transformaciones** | ❌ No                | ✅ Sí (resize, crop, etc) |
| **Performance**      | ⚠️ Depende de origen | ✅ CDN global             |
| **Upload Progress**  | ❌ No                | ✅ Sí                     |

## 🧪 Testing

### Test 1: Validación de Archivos

\`\`\`tsx
// Intentar subir archivo > 5MB
// ✅ Debe mostrar error

// Intentar subir PDF
// ✅ Debe rechazar
\`\`\`

### Test 2: Upload Exitoso

\`\`\`tsx
// Seleccionar 3 imágenes válidas
// ✅ Debe mostrar 3 previews

// Submit form
// ✅ Debe subir a Cloudinary
// ✅ Debe mostrar progress
// ✅ Debe crear producto con URLs
\`\`\`

### Test 3: Límite de Imágenes

\`\`\`tsx
// Seleccionar 6 imágenes
// ✅ Debe aceptar solo 5
// ✅ Debe mostrar warning
\`\`\`

## 🎨 Personalización

### Cambiar Transformaciones

\`\`\`tsx
const { uploadToCloudinary } = useImageUpload({
transformation: {
width: 1000,
height: 1000,
crop: 'fill',
quality: 90,
},
});
\`\`\`

### Cambiar Límites

\`\`\`tsx
const { addLocalFiles } = useImageUpload({
maxFiles: 10,
maxSize: 10 _ 1024 _ 1024, // 10MB
});
\`\`\`

## 📚 Próximos Pasos

1. **Implementar Opción 1** (Sin Cloudinary)
   - Familiarizarse con componentes modulares
   - Probar funcionalidad básica

2. **Configurar Cloudinary**
   - Crear cuenta
   - Obtener credenciales
   - Configurar upload preset

3. **Implementar Opción 2** (Con Cloudinary)
   - Actualizar `.env.local`
   - Cambiar a `uploadToCloudinary()`
   - Probar uploads reales

4. **Optimizar**
   - Ajustar transformaciones
   - Mejorar UX de progress
   - Implementar retry logic

## 🆘 Troubleshooting

### Error: "Cloudinary configuration is missing"

**Solución:** Verificar que `.env.local` tenga las variables correctas

### Error: "Upload failed"

**Solución:**

1. Verificar que upload preset sea "unsigned"
2. Revisar CORS en Cloudinary dashboard
3. Verificar que el archivo sea válido

### Imágenes no se suben

**Solución:**

1. Abrir DevTools → Network
2. Buscar request a cloudinary.com
3. Ver respuesta de error
4. Verificar credenciales

## 📞 Soporte

- Cloudinary Docs: https://cloudinary.com/documentation
- Community: https://community.cloudinary.com
- Status: https://status.cloudinary.com

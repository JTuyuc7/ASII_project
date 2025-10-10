# 🧪 Guía de Prueba - Subida de Imágenes a Cloudinary

## ✅ Checklist Pre-Prueba

### 1. Configuración de Cloudinary

- [x] Cuenta creada en Cloudinary
- [x] Cloud Name: `dox3pn0yg`
- [x] API Key: `411629237867392`
- [x] API Secret configurado
- [ ] **Upload Preset creado** (⚠️ PENDIENTE - Ver instrucciones abajo)

### 2. Variables de Entorno

Tu archivo `.env.local` debe tener:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dox3pn0yg
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=ecommerce_products
```

---

## 📋 Paso 1: Crear Upload Preset (REQUERIDO)

### Instrucciones:

1. Ve a tu dashboard de Cloudinary: https://console.cloudinary.com/
2. En el menú lateral, ve a **Settings** (Configuración)
3. Click en **Upload** (Subida)
4. Busca la sección **Upload presets**
5. Click en **"Add upload preset"** (Agregar preset de subida)

### Configuración del Preset:

```
Upload preset name: ecommerce_products
Signing Mode: Unsigned ⚠️ (MUY IMPORTANTE)
Folder: products (opcional, para organizar)
```

6. **Guarda el preset**

⚠️ **CRÍTICO**: El modo debe ser **"Unsigned"** para permitir subidas desde el cliente sin autenticación.

---

## 🚀 Paso 2: Probar la Subida

### 1. Reiniciar el Servidor de Desarrollo

```bash
# Detener el servidor si está corriendo (Ctrl+C)
# Reiniciar para cargar las nuevas variables de entorno
npm run dev
```

### 2. Navegar al Formulario

1. Inicia sesión en tu aplicación
2. Ve a **Cuenta** → **Configuración**
3. Click en la pestaña **"Crear Producto"**

### 3. Llenar el Formulario

```
Nombre: Motor 1.6L Toyota
Precio: 15000
Stock: 5
Categoría: Motor
Descripción: Motor en excelente estado, compatible con Toyota Corolla 2015-2020
```

### 4. Agregar Imágenes

#### Opción A: Subir desde tu computadora

1. Click en **"Subir Imágenes"**
2. Selecciona 1-5 imágenes (máximo 5MB cada una)
3. Formatos permitidos: JPG, PNG, WEBP

#### Opción B: Usar URL

1. Click en **"Agregar URL"**
2. Pega una URL de imagen pública, por ejemplo:
   - `https://images.unsplash.com/photo-1486262715619-67b85e0b08d3`
   - `https://picsum.photos/800/600`

### 5. Ver el Progreso

- Verás badges de estado en cada imagen:
  - 🟦 **"Pendiente"** - Imagen agregada pero no subida
  - 🔵 **"Subiendo..."** - Upload en progreso (con barra de progreso)
  - 🟢 **"✓ Subido"** - Upload exitoso
  - 🔴 **"Error"** - Falló la subida

### 6. Crear el Producto

1. Click en **"Crear Producto"**
2. El sistema automáticamente:
   - Sube todas las imágenes a Cloudinary
   - Obtiene las URLs de Cloudinary
   - Crea el producto con la primera imagen

---

## 🔍 Verificar que Funcionó

### En la Consola del Navegador (F12)

Deberías ver logs como:

```
🚀 Iniciando subida de imágenes a Cloudinary...
Uploading image to Cloudinary: image-1.jpg
✅ Imágenes subidas exitosamente: ["https://res.cloudinary.com/dox3pn0yg/image/upload/..."]
📦 Creando producto con datos: {...}
```

### En Cloudinary Dashboard

1. Ve a **Media Library**
2. Busca la carpeta `products/` (si configuraste folder)
3. Deberías ver tus imágenes subidas

### En el Producto Creado

- La URL de la imagen principal debe ser de Cloudinary:
  ```
  https://res.cloudinary.com/dox3pn0yg/image/upload/v1234567890/products/abc123.jpg
  ```

---

## 🐛 Solución de Problemas

### Error: "Cloudinary configuration is missing"

**Causa**: Falta el `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`  
**Solución**:

1. Crea el upload preset en Cloudinary
2. Actualiza `.env.local`
3. Reinicia el servidor (`npm run dev`)

### Error: "Upload failed: 401 Unauthorized"

**Causa**: El preset no está configurado como "Unsigned"  
**Solución**:

1. Ve a Cloudinary → Settings → Upload → Upload presets
2. Edita tu preset
3. Cambia **Signing Mode** a **"Unsigned"**
4. Guarda

### Error: "Upload failed: 400 Bad Request"

**Causa**: Nombre del preset incorrecto  
**Solución**:

1. Verifica que el preset se llame exactamente `ecommerce_products`
2. O actualiza `.env.local` con el nombre correcto
3. Reinicia el servidor

### Las imágenes se quedan en "Subiendo..." por siempre

**Causa**: Upload preset no existe o cloud name incorrecto  
**Solución**:

1. Verifica en la consola del navegador (F12) el error específico
2. Verifica `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dox3pn0yg`
3. Asegúrate de que el preset existe

### Error: "File too large"

**Causa**: Imagen mayor a 5MB  
**Solución**:

- Usa imágenes más pequeñas
- O modifica `maxSize` en `image.types.ts`

---

## 📊 Pruebas Sugeridas

### Prueba 1: Upload Simple

- [x] Agregar 1 imagen desde computadora
- [x] Crear producto
- [x] Verificar URL de Cloudinary en producto

### Prueba 2: Múltiples Imágenes

- [ ] Agregar 3 imágenes
- [ ] Verificar que la primera sea la principal
- [ ] Crear producto
- [ ] Verificar que todas se suban

### Prueba 3: Imagen por URL

- [ ] Agregar imagen por URL
- [ ] Ver preview en modal
- [ ] Crear producto
- [ ] Verificar que se suba a Cloudinary

### Prueba 4: Límite de Imágenes

- [ ] Intentar agregar 6 imágenes
- [ ] Verificar que solo permita 5

### Prueba 5: Progreso de Subida

- [ ] Agregar imagen grande (cerca de 5MB)
- [ ] Observar barra de progreso
- [ ] Verificar badge de "Subiendo..."

### Prueba 6: Manejo de Errores

- [ ] Intentar subir archivo no permitido (.pdf, .txt)
- [ ] Verificar mensaje de error
- [ ] Intentar subir imagen muy grande (>5MB)
- [ ] Verificar error de tamaño

---

## 🎯 Resultado Esperado

Cuando todo funcione correctamente:

1. ✅ Puedes agregar hasta 5 imágenes
2. ✅ Las imágenes se previsual izan antes de subir
3. ✅ Al crear el producto, las imágenes se suben automáticamente a Cloudinary
4. ✅ Ves el progreso de cada subida
5. ✅ El producto se crea con la URL de Cloudinary
6. ✅ Las imágenes están disponibles en Cloudinary Dashboard

---

## 📸 URLs de Prueba

Si no tienes imágenes propias, usa estas URLs públicas para probar:

```
https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800
https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800
https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800
https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800
https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800
```

---

## 📝 Notas Adicionales

### Transformaciones de Cloudinary

Las imágenes se suben con transformaciones automáticas:

- Máximo 800x800px
- Calidad: Auto
- Formato: Auto (convierte a WebP si es soportado)

### Seguridad

- ✅ Client-side: Solo cloud_name y upload_preset (públicos)
- ✅ Server-side: API key y secret (protegidos, no expuestos al navegador)

### Costos

- Plan Free de Cloudinary incluye:
  - 25 créditos mensuales
  - 25GB de almacenamiento
  - 25GB de ancho de banda

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas:

1. Revisa la consola del navegador (F12)
2. Verifica el archivo `.env.local`
3. Confirma que el upload preset existe y es "Unsigned"
4. Reinicia el servidor de desarrollo

**¡Listo para probar!** 🚀

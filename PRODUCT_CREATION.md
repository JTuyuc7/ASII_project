# Sistema de Creación de Productos - Documentación

## Descripción General

Sistema completo para que los proveedores puedan agregar nuevos productos al catálogo del e-commerce, con soporte para múltiples imágenes y validación robusta.

## Archivos Creados/Modificados

### Nuevos Archivos

#### 1. `/src/app/account/actions/ProductAction.ts`

Action del servidor para crear productos con validación Zod.

**Funcionalidades:**

- Validación completa de campos usando Zod
- Manejo de errores específicos (401, 403, 400)
- Comunicación con API backend
- Respuestas tipadas

**Schema de Validación:**

```typescript
{
  nombre: string (3-100 caracteres)
  precio: number (> 0, <= 999999.99)
  stock: number (>= 0, <= 999999, entero)
  descripcion: string (10-1000 caracteres)
  categoria: string (requerido)
  imagenUrl: string (URL válida, requerida)
}
```

#### 2. `/src/components/products/productForm/ProductForm.tsx`

Formulario completo para crear productos con interfaz de usuario avanzada.

**Características:**

- ✅ Validación en tiempo real
- ✅ Soporte para hasta 5 imágenes
- ✅ Preview de imágenes
- ✅ Subida de archivos o URL
- ✅ Selección de categoría
- ✅ Formateo de precio con separadores
- ✅ Mensajes de éxito/error
- ✅ Reset de formulario

### Archivos Modificados

#### `/src/app/account/settings/page.tsx`

- Ya incluye el tab "sell" para proveedores
- Renderiza el componente `SellProductForm`

## Campos del Formulario

### 1. **Nombre del Producto**

- **Tipo:** TextInput
- **Validación:**
  - Mínimo 3 caracteres
  - Máximo 100 caracteres
- **Ejemplo:** "Filtro de aceite para Toyota Corolla"

### 2. **Precio**

- **Tipo:** NumberInput
- **Validación:**
  - Debe ser mayor a 0
  - Máximo 999,999.99
  - 2 decimales
- **Formato:** Q 1,234.56
- **Ejemplo:** Q 150.00

### 3. **Stock Disponible**

- **Tipo:** NumberInput
- **Validación:**
  - No puede ser negativo
  - Máximo 999,999
  - Debe ser entero
- **Ejemplo:** 50

### 4. **Categoría**

- **Tipo:** Select (searchable)
- **Opciones:**
  - Motor
  - Transmisión
  - Suspensión
  - Frenos
  - Sistema Eléctrico
  - Carrocería
  - Interior
  - Neumáticos
  - Aceites y Lubricantes
  - Filtros
  - Otros

### 5. **Descripción**

- **Tipo:** Textarea (4-8 filas)
- **Validación:**
  - Mínimo 10 caracteres
  - Máximo 1,000 caracteres
- **Ejemplo:** "Filtro de aceite de alta calidad compatible con Toyota Corolla 2015-2023..."

### 6. **Imágenes**

- **Límite:** 5 imágenes máximo
- **Formatos:** PNG, JPEG, JPG, WEBP
- **Opciones:**
  - Subir archivos locales
  - Agregar URLs de imágenes
- **Nota:** Solo la primera imagen se envía al backend actualmente

## Sistema de Imágenes

### Funcionalidades

#### **Subir Imágenes Locales**

```typescript
handleImageUpload(files: File[])
```

- Acepta múltiples archivos
- Crea previews con `URL.createObjectURL()`
- Limita a 5 imágenes total
- Establece la primera como principal

#### **Agregar por URL**

```typescript
handleImageUrlAdd(url: string)
```

- Valida que sea una URL válida
- Verifica el límite de 5 imágenes
- Agrega a la lista de previews

#### **Eliminar Imagen**

```typescript
handleRemoveImage(index: number)
```

- Elimina la imagen del array
- Actualiza la imagen principal si es necesaria
- Limpia el campo si no quedan imágenes

### Estado de Imágenes

```typescript
interface ImagePreview {
  url: string; // URL de preview o URL externa
  file?: File; // Archivo local (si fue subido)
  isUploaded: boolean; // true si es URL, false si es archivo
}
```

## Flujo de Creación de Producto

```
1. Usuario (PROVEEDOR) accede a Settings → Tab "Agregar un producto"
    ↓
2. Completa el formulario:
   - Nombre del producto
   - Precio y stock
   - Categoría
   - Descripción
   - Agrega imágenes (mínimo 1, máximo 5)
    ↓
3. Validación en tiempo real (Mantine Form)
    ↓
4. Click en "Crear Producto"
    ↓
5. Se ejecuta handleSubmit:
   - Obtiene token del localStorage
   - Prepara datos con primera imagen
   - Llama a createProductAction()
    ↓
6. ProductAction valida con Zod
    ↓
7. POST request a /products con Bearer token
    ↓
8. Respuesta del servidor:
   ✅ Éxito: Muestra alerta verde y resetea formulario
   ❌ Error: Muestra alerta roja con mensaje específico
```

## API Endpoint

### `POST /products`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <token>"
}
```

**Body:**

```json
{
  "nombre": "Filtro de aceite Toyota",
  "precio": 150.0,
  "stock": 50,
  "descripcion": "Filtro de aceite de alta calidad...",
  "categoria": "filtros",
  "imagenUrl": "https://example.com/image.jpg"
}
```

**Respuestas:**

**200 Success:**

```json
{
  "id": "uuid",
  "nombre": "Filtro de aceite Toyota",
  ...
}
```

**400 Bad Request:**

```json
{
  "message": "Datos inválidos"
}
```

**401 Unauthorized:**

```json
{
  "message": "Token inválido o expirado"
}
```

**403 Forbidden:**

```json
{
  "message": "No tienes permisos para crear productos"
}
```

## Manejo de Errores

### Errores de Validación (Zod)

```typescript
{
  success: false,
  message: "Error de validación",
  errors: {
    "nombre": ["El nombre debe tener al menos 3 caracteres"],
    "precio": ["El precio debe ser mayor a 0"]
  }
}
```

### Errores de API

- **401**: Sesión expirada, solicita re-login
- **403**: Usuario no es proveedor
- **400**: Datos inválidos según el backend

### Errores Genéricos

```typescript
{
  success: false,
  message: "Error inesperado",
  error: "Ocurrió un error inesperado..."
}
```

## Estados del Formulario

### Estados

- `loading`: Indica si está enviando la solicitud
- `success`: Indica si el producto fue creado exitosamente
- `error`: Mensaje de error si algo falló
- `images`: Array de previews de imágenes

### Alertas Visuales

- **Success (Verde)**: Producto creado exitosamente
- **Error (Rojo)**: Error en validación o API
- **Warning (Amarillo)**: Límite de imágenes alcanzado
- **Info (Amarillo)**: Debe agregar al menos una imagen

## Categorías Disponibles

```typescript
const CATEGORIES = [
  'Motor',
  'Transmisión',
  'Suspensión',
  'Frenos',
  'Sistema Eléctrico',
  'Carrocería',
  'Interior',
  'Neumáticos',
  'Aceites y Lubricantes',
  'Filtros',
  'Otros',
];
```

## Futuras Mejoras

### Funcionalidades Planificadas

1. **Múltiples Imágenes en Backend**
   - Modificar endpoint para aceptar array de URLs
   - Implementar upload a cloud storage (S3, Cloudinary)
   - Enviar todas las 5 imágenes

2. **Drag & Drop**
   - Área de drag & drop para subir imágenes
   - Reordenar imágenes arrastrando

3. **Edición de Productos**
   - Formulario pre-llenado para editar
   - Endpoint PUT /products/:id

4. **Vista Previa del Producto**
   - Modal con preview de cómo se verá en el catálogo
   - Antes de enviar el formulario

5. **Upload Directo**
   - Integración con servicio de storage
   - Subir imágenes directamente sin URLs

6. **Campos Adicionales**
   - Marca del vehículo compatible
   - Año/modelo
   - Tags/etiquetas
   - Descuentos

## Seguridad

### Validaciones

- ✅ Validación cliente (Mantine Form)
- ✅ Validación servidor (Zod)
- ✅ Autenticación requerida (Bearer token)
- ✅ Verificación de rol (PROVEEDOR)
- ✅ URLs sanitizadas

### Permisos

- Solo usuarios con rol "PROVEEDOR" pueden crear productos
- Token JWT verificado en cada request
- El tab solo es visible para proveedores

## Pruebas

### Caso de Prueba 1: Creación Exitosa

1. Login como proveedor
2. Ir a Settings → "Agregar un producto"
3. Completar todos los campos
4. Agregar al menos 1 imagen
5. Click "Crear Producto"
6. ✅ Ver alerta verde de éxito
7. ✅ Formulario reseteado

### Caso de Prueba 2: Validación de Campos

1. Intentar enviar con nombre corto (< 3 caracteres)
2. ✅ Ver error "El nombre debe tener al menos 3 caracteres"
3. Intentar precio negativo
4. ✅ Ver error "El precio debe ser mayor a 0"
5. Intentar sin categoría
6. ✅ Ver error "Debe seleccionar una categoría"

### Caso de Prueba 3: Límite de Imágenes

1. Agregar 5 imágenes
2. ✅ Botones de agregar deshabilitados
3. ✅ Ver mensaje "Has alcanzado el límite de 5 imágenes"
4. Eliminar una imagen
5. ✅ Botones habilitados nuevamente

### Caso de Prueba 4: Sin Autenticación

1. Eliminar token de localStorage
2. Intentar crear producto
3. ✅ Ver error "Debe iniciar sesión para crear un producto"

## Notas Técnicas

- El formulario usa `@mantine/form` para validación
- Las imágenes locales se convierten a ObjectURL para preview
- Solo la primera imagen se envía al backend (por ahora)
- El componente es client-side (`'use client'`)
- El action es server-side (`'use server'`)

## Variables de Entorno Requeridas

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

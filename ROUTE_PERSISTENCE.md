# Sistema de Persistencia de Rutas - Documentación

## Problema Original

Cuando un usuario iniciaba sesión, la información se guardaba en localStorage, pero al recargar la página, aunque se validaba el token, el usuario era redirigido a la página de login en lugar de mantener la página en la que estaba.

## Solución Implementada

### 1. **Hook Personalizado: `useRouteGuard.ts`**

- Ubicación: `/src/hooks/useRouteGuard.ts`
- Funcionalidad:
  - Guarda automáticamente la ruta actual en localStorage
  - Distingue entre rutas públicas y privadas
  - Proporciona métodos para recuperar y limpiar la última ruta visitada
  - Permite redireccionar al usuario a su última ruta guardada

### 2. **Componente RouteTracker**

- Ubicación: `/src/components/RouteTracker.tsx`
- Funcionalidad:
  - Se ejecuta en todas las páginas (incluido en el layout principal)
  - Rastrea automáticamente los cambios de ruta
  - Guarda la ruta actual **solo si**:
    - El usuario está autenticado
    - No es una ruta de autenticación (`/auth/*`)
    - Es una ruta protegida (`/account/*` o `/admin/*`)
  - **NO guarda**:
    - La ruta raíz `/` (para preservar el comportamiento del logout)
    - Rutas públicas como `/category/*` o `/product/*`

### 3. **Actualizaciones en AuthContext**

- Ubicación: `/src/contexts/AuthContext.tsx`
- Nuevas funcionalidades:
  - `saveCurrentRoute(route: string)`: Guarda una ruta específica con validaciones:
    - No guarda rutas de autenticación (`/auth/*`)
    - No permite guardar `/` cuando el usuario no está autenticado (protege el logout)
  - `getLastRoute(): string | null`: Recupera la última ruta guardada
  - El método `login` ahora acepta un parámetro opcional `redirectTo` para redireccionar después del login
  - El método `logout` establece `lastVisitedRoute = '/'` para forzar redirección a home en próximo login

### 4. **Actualizaciones en Layouts Protegidos**

#### Account Layout (`/src/app/account/layout.tsx`)

- Ahora guarda la ruta cuando el usuario intenta acceder
- Si no está autenticado, guarda la ruta antes de redirigir al login
- Muestra un loading state mientras verifica la autenticación

#### Admin Layout (`/src/app/admin/layout.tsx`)

- Similar al Account Layout
- Verifica tanto autenticación como permisos de admin
- Guarda la ruta para restaurarla después del login

### 5. **Actualizaciones en LoginPage**

- Ubicación: `/src/components/auth/login/loginPage.tsx`
- Después de un login exitoso:
  - Recupera la última ruta visitada
  - Redirige al usuario a esa ruta si existe y no es una ruta de autenticación
  - Si no hay ruta guardada, redirige a `/main` por defecto

## Flujo de Trabajo

### Caso 1: Usuario navega normalmente en rutas protegidas

1. Usuario está en `/account/profile`
2. RouteTracker detecta que es una ruta protegida y la guarda en localStorage
3. Usuario navega a `/account/orders`
4. RouteTracker actualiza la ruta guardada
5. Usuario navega a `/category/repuestos` (ruta pública)
6. RouteTracker **NO** guarda esta ruta (solo guarda rutas protegidas)

### Caso 2: Usuario recarga la página

1. Usuario está en `/account/profile`
2. Usuario recarga la página (F5 o Cmd+R)
3. AuthContext verifica el token en localStorage
4. Si el token es válido, el usuario permanece en `/account/profile`
5. Si el token no es válido, redirige a `/auth/login` pero guarda `/account/profile`

### Caso 3: Usuario cierra sesión y vuelve a iniciar

1. Usuario estaba en `/account/orders` y cierra sesión
2. Sistema **guarda `/` como lastVisitedRoute** (reemplazando `/account/orders`)
3. Usuario es redirigido a `/` (página principal)
4. Usuario vuelve a iniciar sesión
5. Sistema recupera la última ruta guardada (`/`) y redirige allí
6. Usuario permanece en `/` mostrando el contenido principal

### Caso 4: Usuario intenta acceder a ruta protegida sin autenticación

1. Usuario (no autenticado) intenta acceder a `/admin/products`
2. Layout guarda la ruta y redirige a `/auth/login`
3. Usuario inicia sesión
4. Sistema recupera `/admin/products` y redirige allí (si tiene permisos)

## Configuración

### Rutas Públicas (no se guardan)

Las siguientes rutas están configuradas como públicas:

- `/` - Página principal que muestra login/registro o contenido según autenticación
- `/main` - Vista principal del sitio
- `/category/*` - Páginas de categorías
- `/product/*` - Páginas de productos

**Nota importante**: No existe `/auth/login` como ruta separada. El login se muestra en `/` cuando `currentView === 'login'`.

Puedes modificar esta lista en `/src/hooks/useRouteGuard.ts`:

```typescript
const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/main',
  '/',
  '/category',
  '/product',
];
```

### Clave de LocalStorage

La ruta se guarda con la clave: `lastVisitedRoute`

## Beneficios

1. **Experiencia de Usuario Mejorada**: Los usuarios no pierden su posición al recargar
2. **Navegación Intuitiva**: Después del login, vuelven a donde estaban
3. **Manejo de Rutas Protegidas**: Si intentan acceder a una ruta protegida, los redirige ahí después del login
4. **Persistencia**: La información sobrevive a recargas y cierres de sesión

## Comportamiento del Logout

Cuando el usuario hace logout:

1. Se limpian los datos de autenticación en localStorage:
   - `authToken`
   - `userRole`
   - `userData`
2. Se establece `lastVisitedRoute = '/'` ⚠️ **Se guarda `/` como última ruta**
   - Esto garantiza que el próximo login redirija a la página principal
3. Se resetea el estado de autenticación
4. Se establece `currentView = 'main'`
5. Se redirige a `/` (página principal)
6. La página principal mostrará el contenido público/landing page

## Notas de Seguridad

- El sistema solo guarda rutas, no datos sensibles
- Las rutas se validan antes de redirigir
- Las rutas de autenticación nunca se guardan para evitar loops
- La validación del token sigue siendo responsabilidad del backend
- Al hacer logout, se limpia completamente la ruta guardada para evitar accesos no deseados

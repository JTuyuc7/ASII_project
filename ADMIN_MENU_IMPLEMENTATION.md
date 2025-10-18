# Implementación del Menú de Administrador

## 📋 Resumen

Se ha actualizado el sistema de autenticación para mostrar correctamente el menú de administrador **solo cuando el usuario tiene rol `ADMINISTRADOR`**.

## 🔧 Cambios Realizados

### 1. **AuthContext.tsx** - Contexto de Autenticación

✅ **Actualizaciones:**

- Cambiado `isAdmin` de `true` (pruebas) a `false` por defecto
- El estado `isAdmin` ahora se actualiza correctamente basándose en `user.role === 'ADMINISTRADOR'`
- Eliminada la dependencia de `localStorage.getItem('userRole')` obsoleta
- Actualizada la verificación en 3 puntos críticos:
  1. **useEffect inicial**: Al cargar la página, verifica si hay userData y si el rol es 'ADMINISTRADOR'
  2. **setUserSession**: Al establecer los datos del usuario, actualiza isAdmin
  3. **login**: Verifica el rol del usuario al hacer login

```typescript
// ✅ Verificación correcta del rol de administrador
if (userData.role === 'ADMIN') {
  setIsAdmin(true);
} else {
  setIsAdmin(false);
}
```

### 2. **loginPage.tsx** - Componente de Login

✅ **Actualizaciones:**

- Actualizado para pasar el rol real del usuario desde la respuesta del backend
- **Mapea la respuesta del backend** al formato del contexto (telefono → phone)
- Cambiado de `login(result.token, 'user', redirectTo)` a `login(result.token, result.user.role, redirectTo)`

```typescript
// ✅ Mapear la respuesta del backend al formato del contexto
const userData = {
  id: result.user.id,
  name: result.user.name,
  email: result.user.email,
  phone: result.user.telefono || null, // Mapear telefono -> phone
  direccion: result.user.direccion || null,
  role: result.user.role, // ADMIN, USER, SUPPLIER
};

setUserSession(userData);
login(result.token, result.user.role, redirectTo);
```

### 3. **MenuIcons.tsx** - Menú de Usuario

✅ **Ya estaba correcto:**
El componente ya tenía la validación necesaria:

```tsx
{
  isAdmin && (
    <>
      <Menu.Divider />
      <Menu.Item
        leftSection={<IconShield size={14} />}
        onClick={() => handleNavigation('/admin')}
        color="orange"
      >
        Panel de Admin
      </Menu.Item>
    </>
  );
}
```

## 🎯 Flujo de Autenticación Actualizado

### Al Iniciar Sesión:

1. Usuario ingresa credenciales
2. Backend responde con `token` y datos del `user` (incluyendo `role`)
3. `setUserSession(result.user)` guarda los datos en localStorage y context
4. Se verifica si `user.role === 'ADMINISTRADOR'` y actualiza `isAdmin`
5. Se guarda el token y se redirige al usuario
6. El menú muestra "Panel de Admin" solo si `isAdmin === true`

### Al Recargar la Página:

1. `useEffect` en AuthContext se ejecuta
2. Lee `userData` de localStorage
3. Parsea los datos del usuario
4. Verifica si `user.role === 'ADMINISTRADOR'`
5. Actualiza `isAdmin` y `isAuthenticated`
6. El menú se renderiza con la opción de admin si corresponde

## 🔐 Roles Soportados

```typescript
type UserRole = 'USER' | 'SUPPLIER' | 'ADMIN';
```

- **USER**: Usuario estándar (no ve menú admin)
- **SUPPLIER**: Proveedor de productos (no ve menú admin)
- **ADMIN**: Administrador del sistema (✅ ve menú admin)

### 📊 Respuesta del Backend (API):

```json
{
  "id": 23,
  "name": "ADMIN",
  "email": "admin@admin.com",
  "role": "ADMIN", // ← Este es el rol que se verifica
  "telefono": null,
  "direccion": null,
  "createdAt": "2025-10-18T18:00:20.944Z"
}
```

**Nota:** El backend usa `telefono` pero el frontend lo mapea a `phone` en el contexto.

## 🧪 Cómo Probar

### 1. Iniciar sesión con usuario ADMIN:

```json
{
  "email": "admin@admin.com",
  "password": "tu_password"
}
```

### 2. Verificar en el menú de usuario (icono de usuario en el header):

- ✅ Debe aparecer "Panel de Admin" con ícono de escudo naranja
- ✅ Al hacer clic debe redirigir a `/admin`

### 3. Iniciar sesión con usuario normal:

```json
{
  "email": "usuario@example.com",
  "password": "tu_password"
}
```

### 4. Verificar en el menú:

- ❌ NO debe aparecer "Panel de Admin"
- ✅ Solo debe mostrar opciones normales (Mi Cuenta, Pedidos, etc.)

## 🔍 Debugging

Si el menú de admin no aparece, verifica:

```javascript
// En el navegador (DevTools Console):
localStorage.getItem('userData');
// Debe contener: { "role": "ADMIN", "phone": null, ... }

// También puedes verificar el contexto:
console.log(useAuth().isAdmin); // Debe ser true para admins
console.log(useAuth().user.role); // Debe ser "ADMIN"
```

## 📝 Notas Importantes

1. **Seguridad Frontend vs Backend:**
   - ⚠️ Ocultar el menú en el frontend NO es suficiente para seguridad
   - ✅ El backend DEBE validar el rol en cada endpoint protegido
   - ✅ Implementar middleware de autorización en el servidor

2. **localStorage vs Estado:**
   - Los datos del usuario se guardan en localStorage para persistencia
   - El estado se sincroniza al cargar y al actualizar la sesión

3. **Roles Case-Sensitive:**
   - Los roles DEBEN coincidir exactamente: `'ADMIN'` (mayúsculas)
   - No funcionará con: `'admin'`, `'Admin'`, `'ADMINISTRADOR'`, etc.

4. **Mapeo de Campos:**
   - El backend usa `telefono` pero el frontend lo almacena como `phone`
   - Esta transformación ocurre en `loginPage.tsx` antes de llamar a `setUserSession`

## ⚠️ Próximos Pasos de Seguridad

1. **Implementar Sanitización de Inputs** (Como se discutió previamente)
2. **Validar Roles en el Backend:**

   ```typescript
   // Ejemplo de middleware
   const requireAdmin = (req, res, next) => {
     if (req.user.role !== 'ADMIN') {
       return res.status(403).json({ error: 'No autorizado' });
     }
     next();
   };
   ```

3. **Proteger Rutas de Admin:**
   ```typescript
   // En Next.js middleware
   if (pathname.startsWith('/admin') && user.role !== 'ADMIN') {
     return NextResponse.redirect('/');
   }
   ```

## ✅ Checklist de Implementación

- [x] Actualizar AuthContext para verificar rol ADMINISTRADOR
- [x] Actualizar login para usar rol del backend
- [x] Cambiar isAdmin por defecto a false
- [x] Verificar que MenuIcons use isAdmin correctamente
- [x] Documentar cambios
- [ ] Probar con usuario administrador
- [ ] Probar con usuario normal
- [ ] Implementar protección de rutas en el backend
- [ ] Agregar middleware de autorización

---

**Fecha de actualización:** 18 de Octubre, 2025

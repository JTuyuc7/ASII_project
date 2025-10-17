# Configuración de Google reCAPTCHA v2

## 📋 Pasos para Obtener las Claves de reCAPTCHA

### 1. Accede a la Consola de reCAPTCHA

Ve a: [https://www.google.com/recaptcha/admin/create](https://www.google.com/recaptcha/admin/create)

### 2. Registra un Nuevo Sitio

Completa el formulario con la siguiente información:

- **Etiqueta**: Un nombre descriptivo (ej: "E-commerce Frontend")
- **Tipo de reCAPTCHA**: Selecciona **reCAPTCHA v2** → **Casilla "No soy un robot"**
- **Dominios**:
  - Para desarrollo: `localhost`
  - Para producción: Tu dominio (ej: `mitienda.com`)
- **Propietarios**: Tu correo de Google
- **Acepta los términos de servicio**

### 3. Obtén tus Claves

Después de crear el sitio, Google te proporcionará:

- **Clave del sitio (Site Key)**: Clave pública que se usa en el frontend
- **Clave secreta (Secret Key)**: Clave privada para validar en el backend (no se usa actualmente en este proyecto)

### 4. Configura las Variables de Entorno

Agrega la siguiente línea a tu archivo `.env.local`:

```bash
# Google reCAPTCHA v2
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=tu_clave_del_sitio_aqui
```

**Ejemplo:**

```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
```

⚠️ **Nota**: La clave del ejemplo anterior es una clave de prueba de Google que siempre funciona en localhost pero no en producción.

### 5. Reinicia el Servidor de Desarrollo

Después de agregar la variable de entorno, reinicia tu servidor:

```bash
npm run dev
```

## 🔒 Seguridad

- ✅ `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` es segura para exponer en el cliente
- ❌ Nunca expongas la `Secret Key` en el código frontend
- 🔐 La validación del captcha actualmente es del lado del cliente (considera agregar validación del servidor en producción)

## 🧪 Modo de Prueba

Google proporciona claves de prueba que siempre pasan la validación (útil para desarrollo):

**Site Key de Prueba:**

```
6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
```

**Secret Key de Prueba:**

```
6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
```

## 📚 Características Implementadas

### Login (`/src/components/auth/login/loginPage.tsx`)

- ✅ Validación de reCAPTCHA antes de enviar el formulario
- ✅ Mensajes de error específicos (credenciales incorrectas, usuario no encontrado, etc.)
- ✅ Mensaje de éxito con redirección automática
- ✅ Reset automático del captcha en caso de error
- ✅ Deshabilitar campos y botón durante el proceso
- ✅ Deshabilitar botón si el captcha no está completo

### Registro (`/src/components/auth/register/registerPage.tsx`)

- ✅ Validación de reCAPTCHA antes de crear la cuenta
- ✅ Mensajes de error específicos (email duplicado, validación, etc.)
- ✅ Mensaje de éxito con auto-login
- ✅ Descripción de requisitos de contraseña
- ✅ Reset automático del captcha en caso de error
- ✅ Deshabilitar campos y botón durante el proceso

## 🎨 Personalización del reCAPTCHA

El componente actualmente usa el tema `light`. Puedes cambiarlo a `dark` editando:

```tsx
<ReCAPTCHA
  ref={recaptchaRef}
  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
  onChange={handleCaptchaChange}
  theme="dark" // Cambia a "dark" si prefieres el tema oscuro
/>
```

## 🌐 Dominios Permitidos

Recuerda agregar todos los dominios donde tu aplicación estará disponible:

- Development: `localhost`
- Staging: `staging.mitienda.com`
- Production: `mitienda.com`, `www.mitienda.com`

## 📖 Referencias

- [Documentación oficial de reCAPTCHA](https://developers.google.com/recaptcha/docs/display)
- [react-google-recaptcha en NPM](https://www.npmjs.com/package/react-google-recaptcha)

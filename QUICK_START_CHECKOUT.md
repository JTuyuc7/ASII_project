# 🎉 QUICK START - Prueba el Checkout Ahora

## ⚡ Inicio Rápido (2 minutos)

### 1. Asegúrate de que el servidor esté corriendo

```bash
npm run dev
```

### 2. Navega al sitio

```
http://localhost:3000
```

### 3. Flujo de Prueba Rápido

```
🏠 Inicio
  ↓
🛍️ Agrega productos al carrito
  ↓
🛒 Ve al carrito (/cart)
  ↓
💳 Click "Proceder al Pago"
  ↓
📍 Paso 1: Completa dirección
  ↓
💰 Paso 2: Selecciona método de pago
  ↓
✅ Paso 3: Confirma pedido
  ↓
⏳ Loading simulado (1.5s)
  ↓
🎊 ¡Pedido creado! → Redirige a /account/orders
```

## 🎮 Datos de Prueba - Copia y Pega

### 📍 Paso 1: Dirección de Envío

| Campo         | Valor                     |
| ------------- | ------------------------- |
| Nombre        | Juan                      |
| Apellido      | Pérez                     |
| Teléfono      | 5555-1234                 |
| Email         | juan.perez@email.com      |
| Dirección     | 5a Avenida 10-20, Zona 1  |
| Ciudad        | Guatemala                 |
| Departamento  | Guatemala                 |
| Código Postal | 01001                     |
| Referencia    | Casa verde, portón blanco |

### 💳 Paso 2: Método de Pago

**Opción A - Tarjeta:**

- Número: `4242424242424242`
- Nombre: `JUAN PEREZ`
- Expiración: `12/25`
- CVV: `123`

**Opción B - Transferencia:**

- Banco: `Banco Industrial`
- Número: `TRF123456789`

**Opción C - Contra Entrega:**

- ¡No requiere datos adicionales!

## 📱 ¿Qué Esperar?

### ✅ Indicadores de Éxito

1. **Paso a paso funciona:**
   - Puedes avanzar entre pasos
   - Las validaciones funcionan
   - Puedes volver atrás y editar

2. **Loading aparece:**
   - Overlay de carga por ~1.5 segundos

3. **Notificación verde:**
   - "¡Pedido realizado con éxito!"

4. **Carrito se limpia:**
   - El contador del carrito vuelve a 0

5. **Redirección automática:**
   - Te lleva a `/account/orders`

6. **Consola del navegador:**
   ```
   📦 Simulando creación de pedido: {...}
   ✅ Pedido creado exitosamente (simulado): {...}
   ```

### ❌ Si Algo Sale Mal

**Error: "Tu carrito está vacío"**

- Solución: Agrega productos primero

**No avanza al siguiente paso:**

- Solución: Verifica que todos los campos requeridos estén llenos

**No aparece la notificación:**

- Solución: Revisa la consola del navegador (F12) por errores

## 🎨 Características para Probar

- [ ] **Stepper visual** - Los 3 pasos están claramente marcados
- [ ] **Validación en tiempo real** - Campos marcados en rojo si son inválidos
- [ ] **Resumen sticky** - El resumen del pedido siempre visible
- [ ] **Envío gratis** - Si el total ≥ Q200, el envío es gratis
- [ ] **Cálculo automático** - IVA 12% calculado automáticamente
- [ ] **3 métodos de pago** - Prueba cada uno
- [ ] **Edición fácil** - Botones "Editar" en el paso de confirmación
- [ ] **Responsive** - Prueba en móvil (DevTools → Toggle Device)
- [ ] **Loading state** - Overlay mientras se "procesa"
- [ ] **Limpieza de carrito** - Se vacía después de confirmar

## 🔍 Abrir DevTools

### Chrome/Edge/Brave

```
Windows/Linux: F12 o Ctrl+Shift+I
Mac: Cmd+Option+I
```

### Firefox

```
Windows/Linux: F12 o Ctrl+Shift+K
Mac: Cmd+Option+K
```

### Safari

```
Primero activa menú Desarrollador en Preferencias
Luego: Cmd+Option+I
```

## 📊 Lo Que Verás en la Consola

```javascript
// Cuando haces click en "Confirmar Pedido"
📦 Simulando creación de pedido: {
  clienteId: 1,
  proveedorId: 10,
  estadoId: 1,
  fecha: "2025-10-23T...",
  total: 250.75,
  items: [
    {
      productoId: 101,
      cantidad: 2,
      precio: 125.375
    }
  ],
  shippingInfo: {
    nombre: "Juan",
    apellido: "Pérez",
    // ... más campos
  },
  paymentInfo: {
    metodoPago: "tarjeta",
    notas: ""
  }
}

// Después de ~1.5 segundos
✅ Pedido creado exitosamente (simulado): {
  id: 7542,
  numeroOrden: "ORD-7542",
  // ... todos los datos del pedido
  fechaCreacion: "2025-10-23T...",
  estado: "Pendiente"
}
```

## 🎯 Casos de Prueba Sugeridos

### Test 1: Flujo Completo Feliz

- ✅ Agrega 2-3 productos
- ✅ Completa todos los pasos
- ✅ Usa tarjeta de crédito
- ✅ Confirma pedido
- **Resultado esperado:** Éxito, carrito limpio, redirige a órdenes

### Test 2: Validaciones

- ❌ Deja campos vacíos
- ❌ Intenta avanzar
- **Resultado esperado:** No avanza, muestra errores en rojo

### Test 3: Método de Pago - Transferencia

- ✅ Agrega productos
- ✅ Completa dirección
- ✅ Selecciona "Transferencia Bancaria"
- ✅ Completa datos de transferencia
- **Resultado esperado:** Éxito con método de transferencia

### Test 4: Contra Entrega

- ✅ Agrega productos
- ✅ Completa dirección
- ✅ Selecciona "Pago Contra Entrega"
- **Resultado esperado:** Éxito sin pedir datos de pago

### Test 5: Envío Gratis

- ✅ Agrega productos por más de Q200
- ✅ Verifica en resumen que "Envío: Gratis"
- **Resultado esperado:** Badge verde "Gratis" en lugar de Q10.00

### Test 6: Editar Información

- ✅ Completa todos los pasos
- ✅ En paso 3, click "Editar" en dirección
- ✅ Cambia algo
- ✅ Vuelve al paso 3
- **Resultado esperado:** Los cambios se reflejan

### Test 7: Carrito Vacío

- ✅ Vacía el carrito completamente
- ✅ Intenta ir a `/checkout`
- **Resultado esperado:** Mensaje "Tu carrito está vacío"

## 🚀 Siguiente Nivel

Cuando quieras conectar con el backend real:

1. Lee `SIMULATION_MODE.md`
2. Sigue las instrucciones de "🚀 Migrar a Modo Real"
3. Asegúrate de que tu backend esté corriendo
4. Prueba con datos reales

## 💡 Tips Pro

- 💾 **No cierres DevTools:** Siempre ten la consola abierta para ver logs
- 🎨 **Prueba responsive:** Use Ctrl+Shift+M (Cmd+Shift+M en Mac) para modo móvil
- 🔄 **Limpia el carrito:** Si quieres empezar de nuevo, usa el botón "Limpiar carrito"
- 📸 **Toma screenshots:** Documenta lo que funciona para tu proyecto
- 🐛 **Reporta bugs:** Si encuentras algo, revisa la consola primero

## ✨ Features Destacadas

| Feature              | Descripción                            | Estado |
| -------------------- | -------------------------------------- | ------ |
| 🎨 UI/UX             | Diseño profesional con Mantine         | ✅     |
| 📋 Validación        | Formularios con validación completa    | ✅     |
| 💳 3 Métodos de Pago | Tarjeta, Transferencia, Contra Entrega | ✅     |
| 🚚 Envío Gratis      | Automático para compras ≥ Q200         | ✅     |
| 🧮 Cálculo Auto      | IVA 12%, subtotal, total               | ✅     |
| 📱 Responsive        | Mobile, tablet, desktop                | ✅     |
| ⏳ Loading States    | Feedback visual durante procesos       | ✅     |
| 🔔 Notificaciones    | Alertas de éxito/error                 | ✅     |
| 🎭 Simulación        | Funciona sin backend                   | ✅     |
| 🔐 TypeScript        | Type-safe en todo el código            | ✅     |

---

**¿Listo?** ¡Abre tu navegador y prueba ahora! 🚀

```bash
npm run dev
```

Luego ve a: `http://localhost:3000`

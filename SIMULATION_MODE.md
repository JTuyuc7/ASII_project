# 🎭 Modo Simulación - Sistema de Pedidos

## Estado Actual

El sistema de checkout y pedidos está configurado en **MODO SIMULACIÓN** ✨

Esto significa que puedes probar toda la funcionalidad sin necesidad de tener el backend corriendo.

## ¿Qué está simulado?

### ✅ Función `createOrder()`

**Ubicación:** `/src/app/actions/OrderAction.ts`

**Comportamiento actual:**

1. Recibe los datos del pedido
2. Simula un delay de 1.5 segundos (para imitar la red)
3. Genera un ID aleatorio para el pedido
4. Retorna una respuesta exitosa con todos los datos
5. Registra información en la consola del navegador

**Ejemplo de respuesta simulada:**

```json
{
  "success": true,
  "data": {
    "id": 8542,
    "numeroOrden": "ORD-8542",
    "clienteId": 1,
    "proveedorId": 10,
    "estadoId": 1,
    "fecha": "2025-10-23T10:30:00Z",
    "total": 250.75,
    "items": [
      {
        "productoId": 101,
        "cantidad": 2,
        "precio": 125.375
      }
    ],
    "shippingInfo": {
      "nombre": "Juan",
      "apellido": "Pérez",
      "direccion": "Calle Principal, Zona 1",
      "ciudad": "Guatemala",
      "departamento": "Guatemala"
    },
    "paymentInfo": {
      "metodoPago": "tarjeta"
    },
    "fechaCreacion": "2025-10-23T10:30:15Z",
    "estado": "Pendiente"
  },
  "message": "Pedido creado exitosamente"
}
```

## 🧪 Cómo Probar

1. **Agrega productos al carrito**
   - Navega a la tienda
   - Agrega uno o más productos

2. **Ve al carrito**
   - Click en el ícono del carrito
   - Verifica tus productos

3. **Procede al checkout**
   - Click en "Proceder al Pago"
   - Serás redirigido a `/checkout`

4. **Completa el proceso**
   - **Paso 1:** Llena la información de envío
   - **Paso 2:** Selecciona un método de pago (puedes usar datos ficticios)
   - **Paso 3:** Revisa y confirma

5. **Observa el resultado**
   - Verás un loading de ~1.5 segundos
   - Recibirás una notificación de éxito
   - El carrito se limpiará automáticamente
   - Serás redirigido a la página de pedidos

6. **Revisa la consola**
   - Abre DevTools (F12)
   - Ve a la pestaña Console
   - Verás logs con toda la información del pedido

## 📊 Datos de Prueba Sugeridos

### Paso 1 - Dirección de Envío

```
Nombre: Juan
Apellido: Pérez
Teléfono: 5555-1234
Email: juan.perez@email.com
Dirección: 5a Avenida 10-20, Zona 1
Ciudad: Guatemala
Departamento: Guatemala
Código Postal: 01001
Referencia: Casa verde con portón blanco
```

### Paso 2 - Método de Pago

**Opción 1: Tarjeta**

```
Número de Tarjeta: 4242424242424242
Nombre en Tarjeta: JUAN PEREZ
Fecha de Expiración: 12/25
CVV: 123
```

**Opción 2: Transferencia**

```
Banco: Banco Industrial
Número de Transferencia: TRF123456789
```

**Opción 3: Contra Entrega**

```
No requiere datos adicionales
```

## 🔍 Debug y Logs

### Consola del Navegador

Busca estos mensajes:

```
📦 Simulando creación de pedido: {objeto con datos}
✅ Pedido creado exitosamente (simulado): {respuesta completa}
```

### Notificaciones

Verás una notificación verde con:

- Título: "¡Pedido realizado con éxito!"
- Mensaje: "Tu pedido ha sido procesado correctamente"
- Ícono: Check verde

## 🚀 Migrar a Modo Real

Cuando tu backend esté listo:

### 1. Edita `OrderAction.ts`

```typescript
// Comenta este bloque (líneas ~30-50):
// MODO SIMULACIÓN
await new Promise(resolve => setTimeout(resolve, 1500));
// ... resto del código simulado

// Descomenta este bloque (líneas ~52-80):
const response = await fetch(`${API_URL}/pedidos`, {
  method: 'POST',
  // ... resto del código real
});
```

### 2. Configura `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 3. Reinicia el servidor

```bash
npm run dev
```

### 4. ¡Listo!

Ahora tus pedidos se enviarán al backend real.

## ⚠️ Notas Importantes

1. **No se guardan pedidos:** En modo simulación, los pedidos no se guardan en ninguna base de datos

2. **IDs aleatorios:** Cada pedido simulado tiene un ID diferente entre 1000-11000

3. **Sin validación de stock:** No se verifica disponibilidad de productos

4. **Sin procesamiento de pago:** Los datos de pago no se procesan realmente

5. **Carrito se limpia:** Después de confirmar, el carrito se vacía (esto es correcto)

## 💡 Consejos

- **Usa la consola:** Revisa siempre la consola para ver qué datos se están enviando
- **Prueba todos los métodos:** Intenta los 3 métodos de pago para verificar validaciones
- **Datos ficticios:** Usa datos de prueba, no datos reales
- **Varios productos:** Prueba con diferentes cantidades y productos
- **Edge cases:** Prueba con 1 producto, muchos productos, precios altos, etc.

## 🎯 Próximos Pasos

Una vez que el backend esté listo:

1. ✅ Verifica que el endpoint `POST /api/pedidos` exista
2. ✅ Confirma el formato del request body
3. ✅ Configura autenticación si es necesario
4. ✅ Activa el modo real siguiendo las instrucciones arriba
5. ✅ Prueba con casos reales
6. ✅ Maneja errores del backend apropiadamente

---

**Última actualización:** Octubre 23, 2025  
**Modo:** SIMULACIÓN ✨  
**Estado:** Funcional y listo para pruebas

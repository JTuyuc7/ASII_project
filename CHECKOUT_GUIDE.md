# Funcionalidad de Checkout y Pedidos

## Descripción General

Se ha implementado un sistema completo de checkout y gestión de pedidos que permite a los usuarios completar sus compras de manera intuitiva y profesional.

## Características Implementadas

### 1. Página de Checkout (`/checkout`)

La página de checkout incluye un proceso de 3 pasos:

#### **Paso 1: Dirección de Envío**

- Formulario completo con validación
- Campos incluidos:
  - Nombre y apellido
  - Teléfono y email
  - Dirección completa
  - Ciudad y departamento (selector con todos los departamentos de Guatemala)
  - Código postal (opcional)
  - Referencias adicionales de ubicación

#### **Paso 2: Método de Pago**

Tres opciones disponibles:

1. **Tarjeta de Crédito/Débito**
   - Número de tarjeta
   - Nombre en la tarjeta
   - Fecha de expiración
   - CVV
   - Mensaje de seguridad SSL

2. **Transferencia Bancaria**
   - Selector de banco origen
   - Número de transferencia/confirmación
   - Información de cuenta destino
   - Bancos soportados:
     - Banco Industrial
     - Banrural
     - BAC Credomatic
     - Banco G&T Continental
     - Banco de Desarrollo Rural
     - Banco Agromercantil
     - Banco Promerica
     - Vivibanco
     - Bantrab

3. **Pago Contra Entrega**
   - Pago en efectivo al recibir el pedido
   - Información del monto total a pagar

#### **Paso 3: Confirmación**

- Resumen completo del pedido
- Información de envío
- Método de pago seleccionado
- Lista de productos con cantidades y precios
- Botón para confirmar y enviar el pedido

### 2. Resumen del Pedido (Sidebar)

Componente sticky que muestra:

- Subtotal de productos
- Costo de envío (gratis para compras mayores a Q200)
- IVA (12%)
- Total final
- Alerta de envío gratis

### 3. Action de Pedidos (`OrderAction.ts`)

Funciones implementadas:

#### `createOrder(orderData)` - ⚠️ MODO SIMULACIÓN

Crea un nuevo pedido en el sistema.

**🔧 Estado Actual:** La función está configurada en **modo simulación** para permitir pruebas sin backend.

**¿Qué hace en modo simulación?**

- ✅ Simula un delay de red de 1.5 segundos (realismo)
- ✅ Genera un ID aleatorio para el pedido
- ✅ Retorna una respuesta exitosa simulada
- ✅ Registra toda la información en la consola
- ✅ No hace peticiones reales al backend

**Respuesta Simulada:**

```json
{
  "success": true,
  "data": {
    "id": 5847,
    "numeroOrden": "ORD-5847",
    "clienteId": 1,
    "proveedorId": 10,
    "estadoId": 1,
    "fecha": "2024-01-01T12:00:00Z",
    "total": 51,
    "items": [...],
    "shippingInfo": {...},
    "paymentInfo": {...},
    "fechaCreacion": "2024-01-01T12:00:00Z",
    "estado": "Pendiente"
  },
  "message": "Pedido creado exitosamente"
}
```

**🚀 Para activar el modo real:**
En el archivo `OrderAction.ts`, simplemente descomenta el bloque de código marcado como "CÓDIGO REAL" y elimina/comenta el bloque de "MODO SIMULACIÓN".

**Request Body (cuando uses el backend real):**

```json
{
  "clienteId": 1,
  "proveedorId": 10,
  "estadoId": 1,
  "fecha": "2024-01-01T12:00:00Z",
  "total": 51,
  "items": [
    {
      "productoId": 101,
      "cantidad": 2,
      "precio": 25.5
    }
  ],
  "shippingInfo": {
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "1234-5678",
    "email": "juan@email.com",
    "direccion": "Calle Principal, Zona 1",
    "ciudad": "Guatemala",
    "departamento": "Guatemala",
    "codigoPostal": "01001",
    "referencia": "Casa azul, portón negro"
  },
  "paymentInfo": {
    "metodoPago": "tarjeta",
    "notas": "Entregar en horario matutino"
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": { ... },
  "message": "Pedido creado exitosamente"
}
```

#### Otras Funciones:

- `getClientOrders(clienteId)` - Obtiene pedidos de un cliente
- `getOrderById(pedidoId)` - Obtiene detalle de un pedido
- `updateOrderStatus(pedidoId, estadoId)` - Actualiza estado de pedido
- `cancelOrder(pedidoId)` - Cancela un pedido

### 4. Integración con el Carrito

- Botón "Proceder al Pago" actualizado en `/cart`
- Redirección automática a `/checkout`
- Validación de carrito vacío
- Limpieza automática del carrito después de confirmar pedido

### 5. CartContext Mejorado

Se actualizó el `CartContext` para incluir:

- Propiedad `price` como alias de `precio` para compatibilidad
- Propiedad `proveedorId` en items para identificar el proveedor
- Normalización automática de precios

## Flujo de Usuario

1. **Ver Carrito** → Usuario revisa sus productos en `/cart`
2. **Proceder al Pago** → Click en botón redirige a `/checkout`
3. **Completar Información** → Usuario completa 3 pasos:
   - Dirección de envío
   - Método de pago
   - Confirmación
4. **Confirmar Pedido** → Sistema envía datos al backend
5. **Redirección** → Usuario es redirigido a `/account/orders`
6. **Confirmación** → Notificación de éxito y carrito limpiado

## Estados de Pedido

Los estados posibles (según `estadoId`):

- `1` - Pendiente
- `2` - Procesando
- `3` - Enviado
- `4` - Entregado
- `5` - Cancelado

## Validaciones Implementadas

### Paso 1 - Dirección:

- ✓ Nombre (requerido)
- ✓ Apellido (requerido)
- ✓ Teléfono (requerido)
- ✓ Email (requerido, formato válido)
- ✓ Dirección (requerida)
- ✓ Ciudad (requerida)
- ✓ Departamento (requerido)

### Paso 2 - Pago:

**Tarjeta:**

- ✓ Número de tarjeta (16 dígitos)
- ✓ Nombre en tarjeta (requerido)
- ✓ Fecha de expiración (MM/AA)
- ✓ CVV (3-4 dígitos)

**Transferencia:**

- ✓ Banco origen (requerido)
- ✓ Número de transferencia (requerido)

**Contra Entrega:**

- ✓ Sin validaciones adicionales

## Notificaciones

El sistema muestra notificaciones para:

- ✓ Pedido creado exitosamente (verde)
- ✗ Error al crear pedido (rojo)
- ⚠ Validación de formularios (amarillo)

## Cálculos Automáticos

- **Subtotal**: Suma de precio × cantidad de todos los items
- **Envío**: Q10.00 (gratis si subtotal ≥ Q200)
- **IVA**: 12% del subtotal
- **Total**: Subtotal + Envío + IVA

## Configuración Requerida

### Modo Actual: SIMULACIÓN ✨

El sistema está configurado en **modo simulación** para permitir pruebas sin necesidad de backend.

**Ventajas del modo simulación:**

- ✅ Prueba toda la interfaz y flujo de usuario
- ✅ Valida formularios y lógica del frontend
- ✅ Simula respuestas realistas del servidor
- ✅ No requiere configuración adicional
- ✅ Funciona inmediatamente

### Variables de Entorno (Para modo producción)

Cuando estés listo para conectar con el backend real, configura en tu `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Backend Endpoint

El endpoint del backend debe estar disponible en:

```
POST /api/pedidos
```

## Ejemplo de Uso en Código

```tsx
import { createOrder } from '@/app/actions/OrderAction';

const handleSubmitOrder = async () => {
  const orderData = {
    clienteId: 1,
    proveedorId: 10,
    estadoId: 1,
    fecha: new Date().toISOString(),
    total: 150.5,
    items: [
      {
        productoId: 101,
        cantidad: 2,
        precio: 75.25,
      },
    ],
  };

  const response = await createOrder(orderData);

  if (response.success) {
    console.log('Pedido creado:', response.data);
  } else {
    console.error('Error:', response.error);
  }
};
```

## Mejoras Futuras Sugeridas

1. **Integración Real de Pagos**
   - Stripe
   - PayPal
   - Visanet Guatemala
   - Credomatic

2. **Tracking de Pedidos**
   - Seguimiento en tiempo real
   - Notificaciones por email/SMS
   - Mapa de ubicación del repartidor

3. **Facturación**
   - Generación de facturas PDF
   - Integración con FEL (Factura Electrónica en Línea - Guatemala)

4. **Guardado de Direcciones**
   - Múltiples direcciones por usuario
   - Dirección predeterminada
   - Selector rápido de direcciones guardadas

5. **Métodos de Pago Guardados**
   - Tarjetas guardadas (tokenización)
   - Cuentas bancarias favoritas

6. **Cupones y Descuentos**
   - Sistema de códigos promocionales
   - Descuentos por primera compra
   - Programas de lealtad

## Soporte

Para problemas o preguntas sobre esta funcionalidad, contacta al equipo de desarrollo.

## 🔄 Cambiar de Modo Simulación a Modo Real

Cuando tu backend esté listo, sigue estos pasos:

### Paso 1: Configurar Variables de Entorno

Crea o actualiza `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
# O tu URL de producción
# NEXT_PUBLIC_API_URL=https://api.tudominio.com
```

### Paso 2: Activar Código Real

Abre `/src/app/actions/OrderAction.ts` y:

1. **Comenta o elimina** el bloque marcado como:

   ```typescript
   // ============================================
   // MODO SIMULACIÓN - Simular delay de red
   // ============================================
   ```

2. **Descomenta** el bloque marcado como:
   ```typescript
   // ============================================
   // CÓDIGO REAL - Descomentar cuando el backend esté listo
   // ============================================
   ```

### Paso 3: Agregar Autenticación (Opcional)

Si tu API requiere autenticación, descomenta y configura:

```typescript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
}
```

### Paso 4: Probar

1. Reinicia el servidor de desarrollo: `npm run dev`
2. Realiza una orden de prueba
3. Verifica que se cree correctamente en tu backend
4. Revisa la consola del navegador para logs

## Capturas de Pantalla

### Vista del Checkout - Paso 1

![Dirección de Envío]

### Vista del Checkout - Paso 2

![Método de Pago]

### Vista del Checkout - Paso 3

![Confirmación]

### Vista de Pedidos

![Mis Pedidos]

---

**Versión:** 1.0.0  
**Última actualización:** Octubre 2025

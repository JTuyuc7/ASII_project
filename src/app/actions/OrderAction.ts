'use server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

interface OrderItem {
  productoId: number;
  cantidad: number;
  precio: number;
}

interface OrderData {
  id?: number; // Opcional, se definirá en el backend
  clienteId: number;
  proveedorId: number;
  estadoId: number;
  fecha: string;
  total: number;
  items: OrderItem[];
  shippingInfo?: any;
  paymentInfo?: any;
}

interface OrderResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

/**
 * Crea un nuevo pedido en el sistema (MODO SIMULACIÓN)
 * @param orderData - Datos del pedido a crear
 * @returns Respuesta con el pedido creado o error
 */
export async function createOrder(
  orderData: OrderData
): Promise<OrderResponse> {
  try {
    // Preparar el body del request según el formato esperado por el backend
    const requestBody = {
      // id es opcional y se genera en el backend
      clienteId: orderData.clienteId,
      proveedorId: orderData.proveedorId,
      estadoId: orderData.estadoId,
      fecha: orderData.fecha,
      total: orderData.total,
      items: orderData.items.map(item => ({
        productoId: item.productoId,
        cantidad: item.cantidad,
        precio: item.precio,
      })),
      // Campos adicionales si el backend los soporta
      ...(orderData.shippingInfo && { shippingInfo: orderData.shippingInfo }),
      ...(orderData.paymentInfo && { paymentInfo: orderData.paymentInfo }),
    };

    console.log('📦 Simulando creación de pedido:', requestBody);

    // ============================================
    // MODO SIMULACIÓN - Simular delay de red
    // ============================================
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generar ID aleatorio para el pedido
    const generatedOrderId = Math.floor(Math.random() * 10000) + 1000;

    // Simular respuesta exitosa del backend
    const simulatedResponse = {
      id: generatedOrderId,
      ...requestBody,
      numeroOrden: `ORD-${generatedOrderId}`,
      fechaCreacion: new Date().toISOString(),
      estado: 'Pendiente',
    };

    console.log('✅ Pedido creado exitosamente (simulado):', simulatedResponse);

    return {
      success: true,
      data: simulatedResponse,
      message: 'Pedido creado exitosamente',
    };

    // ============================================
    // CÓDIGO REAL - Descomentar cuando el backend esté listo
    // ============================================
    /*
    const response = await fetch(`${API_URL}/pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Si necesitas autenticación, agrégala aquí
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message ||
        errorData?.error ||
        `Error ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();

    return {
      success: true,
      data: data,
      message: 'Pedido creado exitosamente',
    };
    */
  } catch (error: any) {
    console.error('❌ Error al crear el pedido:', error);

    return {
      success: false,
      error: error.message || 'Error desconocido al crear el pedido',
    };
  }
}

/**
 * Obtiene los pedidos de un cliente
 * @param clienteId - ID del cliente
 * @returns Lista de pedidos del cliente
 */
export async function getClientOrders(
  clienteId: number
): Promise<OrderResponse> {
  try {
    const response = await fetch(`${API_URL}/pedidos/cliente/${clienteId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Error al obtener pedidos: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    console.error('Error al obtener pedidos:', error);

    return {
      success: false,
      error: error.message || 'Error al obtener los pedidos',
    };
  }
}

/**
 * Obtiene el detalle de un pedido específico
 * @param pedidoId - ID del pedido
 * @returns Detalle del pedido
 */
export async function getOrderById(pedidoId: number): Promise<OrderResponse> {
  try {
    const response = await fetch(`${API_URL}/pedidos/${pedidoId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Error al obtener el pedido: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    console.error('Error al obtener el pedido:', error);

    return {
      success: false,
      error: error.message || 'Error al obtener el pedido',
    };
  }
}

/**
 * Actualiza el estado de un pedido
 * @param pedidoId - ID del pedido
 * @param estadoId - Nuevo estado del pedido
 * @returns Respuesta de la actualización
 */
export async function updateOrderStatus(
  pedidoId: number,
  estadoId: number
): Promise<OrderResponse> {
  try {
    const response = await fetch(`${API_URL}/pedidos/${pedidoId}/estado`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ estadoId }),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar el pedido: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      success: true,
      data: data,
      message: 'Estado del pedido actualizado',
    };
  } catch (error: any) {
    console.error('Error al actualizar el pedido:', error);

    return {
      success: false,
      error: error.message || 'Error al actualizar el estado del pedido',
    };
  }
}

/**
 * Cancela un pedido
 * @param pedidoId - ID del pedido a cancelar
 * @returns Respuesta de la cancelación
 */
export async function cancelOrder(pedidoId: number): Promise<OrderResponse> {
  try {
    const response = await fetch(`${API_URL}/pedidos/${pedidoId}/cancelar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Error al cancelar el pedido: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      success: true,
      data: data,
      message: 'Pedido cancelado exitosamente',
    };
  } catch (error: any) {
    console.error('Error al cancelar el pedido:', error);

    return {
      success: false,
      error: error.message || 'Error al cancelar el pedido',
    };
  }
}

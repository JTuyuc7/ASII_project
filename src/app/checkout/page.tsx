'use client';

import { createOrder } from '@/app/actions/OrderAction';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { customColors } from '@/theme/colors';
import {
  Alert,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  Image,
  LoadingOverlay,
  Paper,
  Radio,
  Select,
  Stack,
  Stepper,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconArrowLeft,
  IconCheck,
  IconCreditCard,
  IconInfoCircle,
  IconMapPin,
  IconShoppingCart,
  IconTruck,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface OrderFormValues {
  // Información de envío
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  codigoPostal: string;
  referencia: string;

  // Método de pago
  metodoPago: 'tarjeta' | 'transferencia' | 'contraentrega';

  // Datos de tarjeta (si aplica)
  numeroTarjeta?: string;
  nombreTarjeta?: string;
  fechaExpiracion?: string;
  cvv?: string;

  // Datos de transferencia (si aplica)
  bancoOrigen?: string;
  numeroTransferencia?: string;

  // Notas adicionales
  notas: string;
}

export default function CheckoutPage() {
  const { state, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);

  const form = useForm<OrderFormValues>({
    initialValues: {
      nombre: user?.name?.split(' ')[0] || '',
      apellido: user?.name?.split(' ').slice(1).join(' ') || '',
      telefono: user?.phone || '',
      email: user?.email || '',
      direccion: '',
      ciudad: '',
      departamento: '',
      codigoPostal: '',
      referencia: '',
      metodoPago: 'tarjeta',
      numeroTarjeta: '',
      nombreTarjeta: '',
      fechaExpiracion: '',
      cvv: '',
      bancoOrigen: '',
      numeroTransferencia: '',
      notas: '',
    },
    validate: values => {
      if (active === 0) {
        return {
          nombre: values.nombre.trim() === '' ? 'El nombre es requerido' : null,
          apellido:
            values.apellido.trim() === '' ? 'El apellido es requerido' : null,
          telefono:
            values.telefono.trim() === '' ? 'El teléfono es requerido' : null,
          email: !values.email.includes('@') ? 'Email inválido' : null,
          direccion:
            values.direccion.trim() === '' ? 'La dirección es requerida' : null,
          ciudad: values.ciudad.trim() === '' ? 'La ciudad es requerida' : null,
          departamento:
            values.departamento.trim() === ''
              ? 'El departamento es requerido'
              : null,
        };
      }

      if (active === 1) {
        if (values.metodoPago === 'tarjeta') {
          return {
            numeroTarjeta:
              !values.numeroTarjeta || values.numeroTarjeta.length < 16
                ? 'Número de tarjeta inválido'
                : null,
            nombreTarjeta:
              !values.nombreTarjeta || values.nombreTarjeta.trim() === ''
                ? 'Nombre en tarjeta requerido'
                : null,
            fechaExpiracion:
              !values.fechaExpiracion || values.fechaExpiracion.length < 5
                ? 'Fecha de expiración inválida'
                : null,
            cvv: !values.cvv || values.cvv.length < 3 ? 'CVV inválido' : null,
          };
        }

        if (values.metodoPago === 'transferencia') {
          return {
            bancoOrigen:
              !values.bancoOrigen || values.bancoOrigen.trim() === ''
                ? 'Selecciona tu banco'
                : null,
            numeroTransferencia:
              !values.numeroTransferencia ||
              values.numeroTransferencia.trim() === ''
                ? 'Número de transferencia requerido'
                : null,
          };
        }
      }

      return {};
    },
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(price);
  };

  const shippingCost = state.total >= 200 ? 0 : 10.0;
  const tax = state.total * 0.12; // 12% IVA
  const finalTotal = state.total + shippingCost + tax;

  const nextStep = () => {
    const validation = form.validate();
    if (!validation.hasErrors) {
      setActive(current => (current < 2 ? current + 1 : current));
    }
  };

  const prevStep = () =>
    setActive(current => (current > 0 ? current - 1 : current));

  const handleSubmitOrder = async () => {
    const validation = form.validate();
    if (validation.hasErrors) {
      notifications.show({
        title: 'Error',
        message: 'Por favor completa todos los campos requeridos',
        color: 'red',
      });
      return;
    }

    if (state.items.length === 0) {
      notifications.show({
        title: 'Error',
        message: 'Tu carrito está vacío',
        color: 'red',
      });
      return;
    }

    setLoading(true);

    try {
      // Preparar los items del pedido
      const items = state.items.map(item => ({
        productoId: parseInt(item.id),
        cantidad: item.quantity,
        precio:
          typeof item.precio === 'string'
            ? parseFloat(item.precio)
            : item.precio,
      }));

      const orderData = {
        clienteId:
          typeof user?.id === 'number'
            ? user.id
            : parseInt(String(user?.id || '1')), // Usar el ID del usuario autenticado
        proveedorId: state.items[0]?.proveedorId || 10, // Tomar del primer producto o usar default
        estadoId: 1, // Estado inicial: Pendiente
        fecha: new Date().toISOString(),
        total: finalTotal,
        items: items,
        // Información adicional que puedes guardar en un campo de metadata
        shippingInfo: {
          nombre: form.values.nombre,
          apellido: form.values.apellido,
          telefono: form.values.telefono,
          email: form.values.email,
          direccion: form.values.direccion,
          ciudad: form.values.ciudad,
          departamento: form.values.departamento,
          codigoPostal: form.values.codigoPostal,
          referencia: form.values.referencia,
        },
        paymentInfo: {
          metodoPago: form.values.metodoPago,
          notas: form.values.notas,
        },
      };

      const response = await createOrder(orderData);

      if (response.success) {
        notifications.show({
          title: '¡Pedido realizado con éxito!',
          message: 'Tu pedido ha sido procesado correctamente',
          color: 'green',
          icon: <IconCheck />,
        });

        // Limpiar el carrito
        clearCart();

        // Redirigir a página de confirmación o cuenta
        setTimeout(() => {
          router.push(`/account/orders`);
        }, 2000);
      } else {
        throw new Error(response.error || 'Error al procesar el pedido');
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message:
          error.message || 'No se pudo procesar tu pedido. Intenta nuevamente.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <Container size="lg" py="xl">
        <Stack align="center" gap="xl">
          <IconShoppingCart size={80} color={customColors.neutral[4]} />
          <Stack align="center" gap="md">
            <Title order={2} c={customColors.brand[8]}>
              Tu carrito está vacío
            </Title>
            <Text size="lg" c={customColors.neutral[6]} ta="center">
              Agrega productos a tu carrito antes de proceder al checkout.
            </Text>
          </Stack>
          <Button
            size="lg"
            color="brand"
            onClick={() => router.push('/main')}
            leftSection={<IconArrowLeft size={20} />}
          >
            Ir a Comprar
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="center">
          <Stack gap="xs">
            <Title order={1} c={customColors.brand[8]}>
              Finalizar Compra
            </Title>
            <Text c={customColors.neutral[6]}>
              Completa los siguientes pasos para realizar tu pedido
            </Text>
          </Stack>
          <Button
            variant="outline"
            color="brand"
            onClick={() => router.push('/cart')}
            leftSection={<IconArrowLeft size={16} />}
          >
            Volver al carrito
          </Button>
        </Group>

        {/* Stepper */}
        <Stepper active={active} onStepClick={setActive} color="brand">
          <Stepper.Step
            label="Dirección de envío"
            description="Información de entrega"
            icon={<IconMapPin size={18} />}
          >
            <Grid mt="xl">
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Paper shadow="sm" p="xl" radius="md" withBorder>
                  <Stack gap="md">
                    <Title order={3} c={customColors.brand[8]}>
                      Información de Envío
                    </Title>

                    <Grid>
                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <TextInput
                          label="Nombre"
                          placeholder="Tu nombre"
                          required
                          {...form.getInputProps('nombre')}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <TextInput
                          label="Apellido"
                          placeholder="Tu apellido"
                          required
                          {...form.getInputProps('apellido')}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <TextInput
                          label="Teléfono"
                          placeholder="1234-5678"
                          required
                          {...form.getInputProps('telefono')}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <TextInput
                          label="Email"
                          placeholder="tu@email.com"
                          type="email"
                          required
                          {...form.getInputProps('email')}
                        />
                      </Grid.Col>
                      <Grid.Col span={12}>
                        <TextInput
                          label="Dirección"
                          placeholder="Calle, número, zona"
                          required
                          {...form.getInputProps('direccion')}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <TextInput
                          label="Ciudad"
                          placeholder="Ciudad"
                          required
                          {...form.getInputProps('ciudad')}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <Select
                          label="Departamento"
                          placeholder="Selecciona departamento"
                          required
                          data={[
                            'Alta Verapaz',
                            'Baja Verapaz',
                            'Chimaltenango',
                            'Chiquimula',
                            'El Progreso',
                            'Escuintla',
                            'Guatemala',
                            'Huehuetenango',
                            'Izabal',
                            'Jalapa',
                            'Jutiapa',
                            'Petén',
                            'Quetzaltenango',
                            'Quiché',
                            'Retalhuleu',
                            'Sacatepéquez',
                            'San Marcos',
                            'Santa Rosa',
                            'Sololá',
                            'Suchitepéquez',
                            'Totonicapán',
                            'Zacapa',
                          ]}
                          {...form.getInputProps('departamento')}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 6 }}>
                        <TextInput
                          label="Código Postal"
                          placeholder="01001"
                          {...form.getInputProps('codigoPostal')}
                        />
                      </Grid.Col>
                      <Grid.Col span={12}>
                        <Textarea
                          label="Referencia de dirección"
                          placeholder="Referencias adicionales para encontrar tu dirección..."
                          minRows={2}
                          {...form.getInputProps('referencia')}
                        />
                      </Grid.Col>
                    </Grid>
                  </Stack>
                </Paper>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                {/* Resumen del pedido */}
                <OrderSummary
                  items={state.items}
                  subtotal={state.total}
                  shipping={shippingCost}
                  tax={tax}
                  total={finalTotal}
                  formatPrice={formatPrice}
                />
              </Grid.Col>
            </Grid>
          </Stepper.Step>

          <Stepper.Step
            label="Método de pago"
            description="Elige cómo pagar"
            icon={<IconCreditCard size={18} />}
          >
            <Grid mt="xl">
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Paper shadow="sm" p="xl" radius="md" withBorder>
                  <Stack gap="md">
                    <Title order={3} c={customColors.brand[8]}>
                      Método de Pago
                    </Title>

                    <Radio.Group
                      value={form.values.metodoPago}
                      onChange={value =>
                        form.setFieldValue('metodoPago', value as any)
                      }
                    >
                      <Stack gap="md">
                        <Paper p="md" withBorder style={{ cursor: 'pointer' }}>
                          <Radio
                            value="tarjeta"
                            label={
                              <Group>
                                <IconCreditCard
                                  size={20}
                                  color={customColors.brand[6]}
                                />
                                <div>
                                  <Text fw={500}>
                                    Tarjeta de Crédito/Débito
                                  </Text>
                                  <Text size="sm" c="dimmed">
                                    Visa, Mastercard, American Express
                                  </Text>
                                </div>
                              </Group>
                            }
                          />
                        </Paper>

                        <Paper p="md" withBorder style={{ cursor: 'pointer' }}>
                          <Radio
                            value="transferencia"
                            label={
                              <Group>
                                <IconTruck
                                  size={20}
                                  color={customColors.secondary[6]}
                                />
                                <div>
                                  <Text fw={500}>Transferencia Bancaria</Text>
                                  <Text size="sm" c="dimmed">
                                    Transferencia directa a nuestra cuenta
                                  </Text>
                                </div>
                              </Group>
                            }
                          />
                        </Paper>

                        <Paper p="md" withBorder style={{ cursor: 'pointer' }}>
                          <Radio
                            value="contraentrega"
                            label={
                              <Group>
                                <IconTruck
                                  size={20}
                                  color={customColors.success[6]}
                                />
                                <div>
                                  <Text fw={500}>Pago Contra Entrega</Text>
                                  <Text size="sm" c="dimmed">
                                    Paga cuando recibas tu pedido
                                  </Text>
                                </div>
                              </Group>
                            }
                          />
                        </Paper>
                      </Stack>
                    </Radio.Group>

                    <Divider />

                    {/* Formularios de pago según el método seleccionado */}
                    {form.values.metodoPago === 'tarjeta' && (
                      <Stack gap="md">
                        <Title order={4} size="h5" c={customColors.brand[7]}>
                          Información de Tarjeta
                        </Title>
                        <TextInput
                          label="Número de Tarjeta"
                          placeholder="1234 5678 9012 3456"
                          maxLength={16}
                          required
                          {...form.getInputProps('numeroTarjeta')}
                        />
                        <TextInput
                          label="Nombre en la Tarjeta"
                          placeholder="Como aparece en la tarjeta"
                          required
                          {...form.getInputProps('nombreTarjeta')}
                        />
                        <Grid>
                          <Grid.Col span={6}>
                            <TextInput
                              label="Fecha de Expiración"
                              placeholder="MM/AA"
                              maxLength={5}
                              required
                              {...form.getInputProps('fechaExpiracion')}
                            />
                          </Grid.Col>
                          <Grid.Col span={6}>
                            <TextInput
                              label="CVV"
                              placeholder="123"
                              maxLength={4}
                              required
                              {...form.getInputProps('cvv')}
                            />
                          </Grid.Col>
                        </Grid>
                        <Alert
                          icon={<IconInfoCircle />}
                          color="blue"
                          variant="light"
                        >
                          <Text size="sm">
                            Tu información es segura. Usamos encriptación SSL
                            para proteger tus datos.
                          </Text>
                        </Alert>
                      </Stack>
                    )}

                    {form.values.metodoPago === 'transferencia' && (
                      <Stack gap="md">
                        <Title order={4} size="h5" c={customColors.brand[7]}>
                          Información de Transferencia
                        </Title>
                        <Select
                          label="Banco Origen"
                          placeholder="Selecciona tu banco"
                          required
                          data={[
                            'Banco Industrial',
                            'Banrural',
                            'BAC Credomatic',
                            'Banco G&T Continental',
                            'Banco de Desarrollo Rural',
                            'Banco Agromercantil',
                            'Banco Promerica',
                            'Vivibanco',
                            'Bantrab',
                          ]}
                          {...form.getInputProps('bancoOrigen')}
                        />
                        <TextInput
                          label="Número de Transferencia"
                          placeholder="Número de confirmación de la transferencia"
                          required
                          {...form.getInputProps('numeroTransferencia')}
                        />
                        <Alert
                          icon={<IconInfoCircle />}
                          color="blue"
                          variant="light"
                        >
                          <Stack gap="xs">
                            <Text size="sm" fw={500}>
                              Datos para transferencia:
                            </Text>
                            <Text size="sm">Banco: Banco Industrial</Text>
                            <Text size="sm">Cuenta: 1234567890</Text>
                            <Text size="sm">
                              A nombre de: E-Commerce Guatemala S.A.
                            </Text>
                          </Stack>
                        </Alert>
                      </Stack>
                    )}

                    {form.values.metodoPago === 'contraentrega' && (
                      <Alert
                        icon={<IconInfoCircle />}
                        color="green"
                        variant="light"
                      >
                        <Stack gap="xs">
                          <Text size="sm" fw={500}>
                            Pago Contra Entrega
                          </Text>
                          <Text size="sm">
                            Pagarás en efectivo al momento de recibir tu pedido.
                            Asegúrate de tener el monto exacto.
                          </Text>
                          <Text size="sm" c="dimmed">
                            Monto total: {formatPrice(finalTotal)}
                          </Text>
                        </Stack>
                      </Alert>
                    )}

                    <Textarea
                      label="Notas adicionales (opcional)"
                      placeholder="Instrucciones especiales para tu pedido..."
                      minRows={3}
                      {...form.getInputProps('notas')}
                    />
                  </Stack>
                </Paper>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <OrderSummary
                  items={state.items}
                  subtotal={state.total}
                  shipping={shippingCost}
                  tax={tax}
                  total={finalTotal}
                  formatPrice={formatPrice}
                />
              </Grid.Col>
            </Grid>
          </Stepper.Step>

          <Stepper.Step
            label="Confirmar pedido"
            description="Revisa tu pedido"
            icon={<IconCheck size={18} />}
          >
            <Grid mt="xl">
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Stack gap="md">
                  {/* Información de envío */}
                  <Paper shadow="sm" p="xl" radius="md" withBorder>
                    <Stack gap="md">
                      <Group justify="space-between">
                        <Title order={3} c={customColors.brand[8]}>
                          Dirección de Envío
                        </Title>
                        <Button
                          variant="subtle"
                          size="xs"
                          onClick={() => setActive(0)}
                        >
                          Editar
                        </Button>
                      </Group>
                      <Stack gap="xs">
                        <Text fw={500}>
                          {form.values.nombre} {form.values.apellido}
                        </Text>
                        <Text size="sm" c="dimmed">
                          {form.values.direccion}
                        </Text>
                        <Text size="sm" c="dimmed">
                          {form.values.ciudad}, {form.values.departamento}
                        </Text>
                        {form.values.codigoPostal && (
                          <Text size="sm" c="dimmed">
                            CP: {form.values.codigoPostal}
                          </Text>
                        )}
                        <Text size="sm" c="dimmed">
                          Tel: {form.values.telefono}
                        </Text>
                        <Text size="sm" c="dimmed">
                          {form.values.email}
                        </Text>
                        {form.values.referencia && (
                          <>
                            <Divider />
                            <Text size="sm" c="dimmed">
                              <strong>Referencia:</strong>{' '}
                              {form.values.referencia}
                            </Text>
                          </>
                        )}
                      </Stack>
                    </Stack>
                  </Paper>

                  {/* Método de pago */}
                  <Paper shadow="sm" p="xl" radius="md" withBorder>
                    <Stack gap="md">
                      <Group justify="space-between">
                        <Title order={3} c={customColors.brand[8]}>
                          Método de Pago
                        </Title>
                        <Button
                          variant="subtle"
                          size="xs"
                          onClick={() => setActive(1)}
                        >
                          Editar
                        </Button>
                      </Group>
                      <Group>
                        <Badge size="lg" color="brand" variant="light">
                          {form.values.metodoPago === 'tarjeta' &&
                            'Tarjeta de Crédito/Débito'}
                          {form.values.metodoPago === 'transferencia' &&
                            'Transferencia Bancaria'}
                          {form.values.metodoPago === 'contraentrega' &&
                            'Pago Contra Entrega'}
                        </Badge>
                      </Group>
                      {form.values.metodoPago === 'tarjeta' &&
                        form.values.numeroTarjeta && (
                          <Text size="sm" c="dimmed">
                            Tarjeta terminada en{' '}
                            {form.values.numeroTarjeta.slice(-4)}
                          </Text>
                        )}
                      {form.values.metodoPago === 'transferencia' &&
                        form.values.bancoOrigen && (
                          <Text size="sm" c="dimmed">
                            {form.values.bancoOrigen} - #
                            {form.values.numeroTransferencia}
                          </Text>
                        )}
                    </Stack>
                  </Paper>

                  {/* Productos */}
                  <Paper shadow="sm" p="xl" radius="md" withBorder>
                    <Stack gap="md">
                      <Title order={3} c={customColors.brand[8]}>
                        Productos ({state.itemCount})
                      </Title>
                      <Stack gap="sm">
                        {state.items.map(item => (
                          <Group
                            key={item.id}
                            justify="space-between"
                            wrap="nowrap"
                          >
                            <Group gap="sm" wrap="nowrap">
                              <Box
                                w={60}
                                h={60}
                                bg={customColors.neutral[1]}
                                style={{
                                  borderRadius: 8,
                                  overflow: 'hidden',
                                  flexShrink: 0,
                                }}
                              >
                                {item.image ? (
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    w="100%"
                                    h="100%"
                                    fit="cover"
                                  />
                                ) : (
                                  <Box
                                    h="100%"
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <IconShoppingCart
                                      size={24}
                                      color={customColors.neutral[4]}
                                    />
                                  </Box>
                                )}
                              </Box>
                              <Box>
                                <Text size="sm" fw={500} lineClamp={1}>
                                  {item.name}
                                </Text>
                                <Text size="xs" c="dimmed">
                                  Cantidad: {item.quantity}
                                </Text>
                              </Box>
                            </Group>
                            <Text size="sm" fw={500} style={{ flexShrink: 0 }}>
                              {formatPrice(
                                (typeof item.price === 'string'
                                  ? parseFloat(item.price)
                                  : item.price) * item.quantity
                              )}
                            </Text>
                          </Group>
                        ))}
                      </Stack>
                    </Stack>
                  </Paper>

                  {form.values.notas && (
                    <Paper shadow="sm" p="xl" radius="md" withBorder>
                      <Stack gap="sm">
                        <Title order={4} size="h5" c={customColors.brand[8]}>
                          Notas del Pedido
                        </Title>
                        <Text size="sm" c="dimmed">
                          {form.values.notas}
                        </Text>
                      </Stack>
                    </Paper>
                  )}
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <OrderSummary
                  items={state.items}
                  subtotal={state.total}
                  shipping={shippingCost}
                  tax={tax}
                  total={finalTotal}
                  formatPrice={formatPrice}
                  showButton
                  onConfirm={handleSubmitOrder}
                  loading={loading}
                />
              </Grid.Col>
            </Grid>
          </Stepper.Step>

          <Stepper.Completed>
            <Stack align="center" gap="xl" py="xl">
              <IconCheck size={80} color={customColors.success[6]} />
              <Title order={2} c={customColors.brand[8]}>
                ¡Pedido Confirmado!
              </Title>
              <Text size="lg" c={customColors.neutral[6]} ta="center">
                Tu pedido ha sido procesado exitosamente.
              </Text>
            </Stack>
          </Stepper.Completed>
        </Stepper>

        {/* Botones de navegación */}
        {active < 3 && (
          <Group justify="space-between" mt="xl">
            <Button
              variant="default"
              onClick={prevStep}
              disabled={active === 0}
            >
              Anterior
            </Button>
            {active < 2 ? (
              <Button onClick={nextStep} color="brand">
                Siguiente
              </Button>
            ) : (
              <Button onClick={nextStep} color="brand">
                Revisar Pedido
              </Button>
            )}
          </Group>
        )}
      </Stack>
    </Container>
  );
}

// Componente para el resumen del pedido
interface OrderSummaryProps {
  items: any[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  formatPrice: (price: number) => string;
  showButton?: boolean;
  onConfirm?: () => void;
  loading?: boolean;
}

function OrderSummary({
  items,
  subtotal,
  shipping,
  tax,
  total,
  formatPrice,
  showButton = false,
  onConfirm,
  loading = false,
}: OrderSummaryProps) {
  return (
    <Stack gap="md" pos="sticky" top={20}>
      <Paper shadow="sm" p="lg" radius="md" withBorder>
        <Stack gap="md">
          <Title order={3} c={customColors.brand[8]}>
            Resumen del Pedido
          </Title>

          <Stack gap="xs">
            <Group justify="space-between">
              <Text c={customColors.neutral[6]}>
                Subtotal ({items.length}{' '}
                {items.length === 1 ? 'producto' : 'productos'}):
              </Text>
              <Text fw={500}>{formatPrice(subtotal)}</Text>
            </Group>
            <Group justify="space-between">
              <Text c={customColors.neutral[6]}>Envío:</Text>
              <Text fw={500}>
                {shipping === 0 ? (
                  <Badge color="green" variant="light">
                    Gratis
                  </Badge>
                ) : (
                  formatPrice(shipping)
                )}
              </Text>
            </Group>
            <Group justify="space-between">
              <Text c={customColors.neutral[6]}>IVA (12%):</Text>
              <Text fw={500}>{formatPrice(tax)}</Text>
            </Group>
            <Divider />
            <Group justify="space-between">
              <Text size="lg" fw={700} c={customColors.brand[8]}>
                Total:
              </Text>
              <Text size="lg" fw={700} c={customColors.brand[6]}>
                {formatPrice(total)}
              </Text>
            </Group>
          </Stack>

          {showButton && onConfirm && (
            <Button
              fullWidth
              size="lg"
              color="brand"
              onClick={onConfirm}
              loading={loading}
              leftSection={<IconCheck size={20} />}
            >
              Confirmar Pedido
            </Button>
          )}
        </Stack>
      </Paper>

      {shipping > 0 && (
        <Alert icon={<IconTruck />} color="blue" variant="light">
          <Text size="sm">¡Envío gratis en compras mayores a Q200!</Text>
        </Alert>
      )}
    </Stack>
  );
}

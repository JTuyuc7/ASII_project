'use client';
import {
  Badge,
  Card,
  Grid,
  Group,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconCash,
  IconPackage,
  IconShoppingCart,
  IconTrendingDown,
  IconTrendingUp,
  IconUsers,
} from '@tabler/icons-react';

const salesData = [
  { month: 'Enero', sales: 12500, orders: 145 },
  { month: 'Febrero', sales: 15800, orders: 167 },
  { month: 'Marzo', sales: 18200, orders: 189 },
  { month: 'Abril', sales: 16900, orders: 156 },
  { month: 'Mayo', sales: 21300, orders: 198 },
  { month: 'Junio', sales: 19800, orders: 175 },
];

const topProducts = [
  { name: 'Laptop Gaming ROG', sales: 45, revenue: '$58,455' },
  { name: 'Smartphone Pro Max', sales: 38, revenue: '$34,199' },
  { name: 'Monitor 4K Ultra', sales: 29, revenue: '$13,047' },
  { name: 'Auriculares Bluetooth', sales: 52, revenue: '$8,319' },
  { name: 'Teclado Mecánico', sales: 35, revenue: '$5,250' },
];

const metrics = [
  {
    title: 'Tasa de Conversión',
    value: '3.24%',
    change: '+0.5%',
    trend: 'up',
    icon: IconTrendingUp,
    color: 'green',
  },
  {
    title: 'Valor Promedio del Pedido',
    value: '$127.50',
    change: '+$12.30',
    trend: 'up',
    icon: IconCash,
    color: 'blue',
  },
  {
    title: 'Tasa de Abandono',
    value: '68.5%',
    change: '-2.1%',
    trend: 'down',
    icon: IconTrendingDown,
    color: 'orange',
  },
  {
    title: 'Productos Más Vendidos',
    value: '234',
    change: '+15',
    trend: 'up',
    icon: IconPackage,
    color: 'teal',
  },
];

export default function AnalyticsAdminPage() {
  const currentMonth = salesData[salesData.length - 1];
  const previousMonth = salesData[salesData.length - 2];
  const salesGrowth =
    ((currentMonth.sales - previousMonth.sales) / previousMonth.sales) * 100;

  return (
    <Stack gap="xl">
      <Title order={1}>Analytics y Reportes</Title>

      {/* Key Metrics */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        {metrics.map(metric => (
          <Card
            key={metric.title}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
          >
            <Group justify="space-between" mb="xs">
              <metric.icon
                size={24}
                color={`var(--mantine-color-${metric.color}-6)`}
              />
              <Badge
                color={metric.trend === 'up' ? 'green' : 'red'}
                variant="light"
                leftSection={
                  metric.trend === 'up' ? (
                    <IconTrendingUp size={12} />
                  ) : (
                    <IconTrendingDown size={12} />
                  )
                }
              >
                {metric.change}
              </Badge>
            </Group>
            <Text fw={500} size="lg" mb={5}>
              {metric.value}
            </Text>
            <Text size="sm" c="dimmed">
              {metric.title}
            </Text>
          </Card>
        ))}
      </SimpleGrid>

      <Grid>
        {/* Sales Overview */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={3}>Ventas por Mes</Title>
              <Badge color="green" variant="light">
                {salesGrowth > 0 ? '+' : ''}
                {salesGrowth.toFixed(1)}%
              </Badge>
            </Group>

            <Stack gap="sm">
              {salesData.map(data => {
                const maxSales = Math.max(...salesData.map(d => d.sales));
                const percentage = (data.sales / maxSales) * 100;

                return (
                  <div key={data.month}>
                    <Group justify="space-between" mb={5}>
                      <Text size="sm">{data.month}</Text>
                      <Text size="sm" fw={500}>
                        ${data.sales.toLocaleString()}
                      </Text>
                    </Group>
                    <Progress value={percentage} color="blue" size="sm" />
                  </div>
                );
              })}
            </Stack>
          </Card>
        </Grid.Col>

        {/* Top Products */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} mb="md">
              Productos Más Vendidos
            </Title>

            <Stack gap="md">
              {topProducts.map((product, index) => (
                <Group key={product.name} justify="space-between">
                  <div style={{ flex: 1 }}>
                    <Group>
                      <Badge color="blue" variant="light" size="sm">
                        #{index + 1}
                      </Badge>
                      <div>
                        <Text size="sm" fw={500}>
                          {product.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {product.sales} vendidos
                        </Text>
                      </div>
                    </Group>
                  </div>
                  <Text size="sm" fw={500} c="green">
                    {product.revenue}
                  </Text>
                </Group>
              ))}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Quick Stats */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={3} mb="md">
          Resumen del Mes Actual
        </Title>

        <SimpleGrid cols={{ base: 2, sm: 4 }}>
          <div style={{ textAlign: 'center' }}>
            <IconUsers size={32} color="var(--mantine-color-blue-6)" />
            <Text fw={500} size="lg" mt="xs">
              1,234
            </Text>
            <Text size="sm" c="dimmed">
              Usuarios Activos
            </Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <IconShoppingCart size={32} color="var(--mantine-color-green-6)" />
            <Text fw={500} size="lg" mt="xs">
              198
            </Text>
            <Text size="sm" c="dimmed">
              Pedidos Totales
            </Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <IconCash size={32} color="var(--mantine-color-orange-6)" />
            <Text fw={500} size="lg" mt="xs">
              $21,300
            </Text>
            <Text size="sm" c="dimmed">
              Ingresos
            </Text>
          </div>
          <div style={{ textAlign: 'center' }}>
            <IconPackage size={32} color="var(--mantine-color-teal-6)" />
            <Text fw={500} size="lg" mt="xs">
              567
            </Text>
            <Text size="sm" c="dimmed">
              Productos
            </Text>
          </div>
        </SimpleGrid>
      </Card>
    </Stack>
  );
}

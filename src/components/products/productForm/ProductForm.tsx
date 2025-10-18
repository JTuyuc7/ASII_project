'use client';
import {
  createProductAction,
  ProductFormData,
} from '@/app/account/actions/ProductAction';
import { useImageUpload } from '@/hooks/useImageUpload';
import {
  Alert,
  Badge,
  Button,
  FileButton,
  Grid,
  Group,
  Image,
  Modal,
  NumberInput,
  Paper,
  Progress,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconAlertCircle,
  IconCheck,
  IconCloudUpload,
  IconLink,
  IconPhoto,
  IconTrash,
  IconUpload,
  IconX,
} from '@tabler/icons-react';
import { useState } from 'react';

const CATEGORIES = [
  { value: 'motor', label: 'Motor' },
  { value: 'transmision', label: 'Transmisión' },
  { value: 'suspension', label: 'Suspensión' },
  { value: 'frenos', label: 'Frenos' },
  { value: 'electrico', label: 'Sistema Eléctrico' },
  { value: 'carroceria', label: 'Carrocería' },
  { value: 'interior', label: 'Interior' },
  { value: 'neumaticos', label: 'Neumáticos' },
  { value: 'aceites', label: 'Aceites y Lubricantes' },
  { value: 'filtros', label: 'Filtros' },
  { value: 'otros', label: 'Otros' },
];

const SellProductForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlModalOpened, setUrlModalOpened] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);

  // Use the image upload hook
  const {
    images,
    addLocalFiles,
    addImageUrl,
    removeImage,
    clearImages,
    uploadToCloudinary,
  } = useImageUpload({ maxFiles: 5 });

  const form = useForm<ProductFormData>({
    initialValues: {
      nombre: '',
      precio: 0,
      stock: 0,
      descripcion: '',
      categoria: '',
      imagenUrl: [],
    },
    validate: {
      nombre: value => {
        if (!value || value.length < 3) {
          return 'El nombre debe tener al menos 3 caracteres';
        }
        if (value.length > 100) {
          return 'El nombre no puede exceder 100 caracteres';
        }
        return null;
      },
      precio: value => {
        if (value <= 0) return 'El precio debe ser mayor a 0';
        if (value > 999999.99) return 'El precio es demasiado alto';
        return null;
      },
      stock: value => {
        if (value < 0) return 'El stock no puede ser negativo';
        if (value > 999999) return 'El stock es demasiado alto';
        return null;
      },
      descripcion: value => {
        if (!value || value.length < 10) {
          return 'La descripción debe tener al menos 10 caracteres';
        }
        if (value.length > 1000) {
          return 'La descripción no puede exceder 1000 caracteres';
        }
        return null;
      },
      categoria: value => (!value ? 'Debe seleccionar una categoría' : null),
      imagenUrl: value => {
        if (!Array.isArray(value)) return 'Las imágenes deben ser un arreglo';
        if (value.length === 0) return 'Debe proporcionar al menos una imagen';
        if (value.length > 5) return 'No puede agregar más de 5 imágenes';

        // Validate each URL
        for (const url of value) {
          if (url === 'pending-upload') continue; // Allow placeholder
          try {
            new URL(url);
          } catch {
            return 'Todas las URLs deben ser válidas';
          }
        }
        return null;
      },
    },
  });

  const handleImageUpload = (files: File[]) => {
    if (files && files.length > 0) {
      addLocalFiles(files);
      // Add placeholders for each file being uploaded
      const currentUrls = form.values.imagenUrl || [];
      const newPlaceholders = files.map(() => 'pending-upload');
      form.setFieldValue('imagenUrl', [...currentUrls, ...newPlaceholders]);
    }
  };

  const handleImageUrlAdd = (url: string) => {
    if (!url || url.trim() === '') {
      setUrlError('La URL no puede estar vacía');
      return false;
    }

    try {
      new URL(url);
      const success = addImageUrl(url);

      if (!success) {
        setUrlError('Solo puedes agregar hasta 5 imágenes');
        return false;
      }

      // Add the URL to the array
      const currentUrls = form.values.imagenUrl || [];
      form.setFieldValue('imagenUrl', [...currentUrls, url]);

      return true;
    } catch {
      setUrlError(
        'URL de imagen inválida. Debe ser una URL completa (ejemplo: https://...)'
      );
      return false;
    }
  };

  const handleUrlModalSubmit = () => {
    setUrlError(null);
    const success = handleImageUrlAdd(tempImageUrl);

    if (success) {
      // Close modal and reset
      setUrlModalOpened(false);
      setTempImageUrl('');
      setUrlError(null);
    }
  };

  const handleUrlModalClose = () => {
    setUrlModalOpened(false);
    setTempImageUrl('');
    setUrlError(null);
  };

  const handleRemoveImage = (imageId: string) => {
    const imageIndex = images.findIndex(img => img.id === imageId);
    removeImage(imageId);

    // Remove the corresponding URL from the array
    const currentUrls = form.values.imagenUrl || [];
    const newUrls = currentUrls.filter((_, index) => index !== imageIndex);
    form.setFieldValue('imagenUrl', newUrls);
  };

  const handleSubmit = async (values: ProductFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('authToken');
      const uploadedUrls = await uploadToCloudinary();
      if (uploadedUrls.length === 0) {
        setError('Debes subir al menos una imagen antes de crear el producto');
        setLoading(false);
        return;
      }

      // Step 2: Create product with all uploaded image URLs
      const productData: ProductFormData = {
        ...values,
        imagenUrl: uploadedUrls, // Use all uploaded images
      };
      const result = await createProductAction(productData, token);

      if (result.success) {
        setSuccess(true);
        setError(null);

        // Reset form after successful submission
        form.reset();

        // Clear all images and their previews
        clearImages();

        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError(result.error || result.message);

        // Handle field-specific errors
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, errors]) => {
            form.setFieldError(field, errors[0]);
          });
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error inesperado al crear el producto'
      );
      console.error('❌ Product creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper shadow="sm" p="xl" radius="md">
      <Stack gap="lg">
        <div>
          <Title order={2} mb="xs">
            Agregar Nuevo Producto
          </Title>
          <Text size="sm" c="dimmed">
            Completa los datos del producto que deseas vender
          </Text>
        </div>

        {success && (
          <Alert
            icon={<IconCheck size="1rem" />}
            title="¡Producto creado exitosamente!"
            color="green"
            onClose={() => setSuccess(false)}
            withCloseButton
          >
            Tu producto ha sido agregado al catálogo y estará visible para los
            compradores.
          </Alert>
        )}

        {error && (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Error"
            color="red"
            onClose={() => setError(null)}
            withCloseButton
          >
            {error}
          </Alert>
        )}

        <form
          onSubmit={e => {
            form.onSubmit(handleSubmit)(e);
          }}
        >
          <Stack gap="md">
            {/* Product Name */}
            <TextInput
              label="Nombre del Producto"
              placeholder="Ej: Filtro de aceite para Toyota Corolla"
              required
              {...form.getInputProps('nombre')}
            />

            {/* Price and Stock */}
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <NumberInput
                  label="Precio"
                  placeholder="0.00"
                  required
                  prefix="Q "
                  decimalScale={2}
                  fixedDecimalScale
                  thousandSeparator=","
                  {...form.getInputProps('precio')}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <NumberInput
                  label="Stock Disponible"
                  placeholder="0"
                  required
                  min={0}
                  {...form.getInputProps('stock')}
                />
              </Grid.Col>
            </Grid>

            {/* Category */}
            <Select
              label="Categoría"
              placeholder="Selecciona una categoría"
              required
              data={CATEGORIES}
              searchable
              {...form.getInputProps('categoria')}
            />

            {/* Description */}
            <Textarea
              label="Descripción"
              placeholder="Describe las características, compatibilidad y detalles importantes del producto..."
              required
              minRows={4}
              maxRows={8}
              {...form.getInputProps('descripcion')}
            />

            {/* Images Section */}
            <div>
              <Text size="sm" fw={500} mb="xs">
                Imágenes del Producto
              </Text>
              <Text size="xs" c="dimmed" mb="md">
                Puedes agregar hasta 5 imágenes. La primera será la imagen
                principal.
              </Text>

              {/* Image Previews */}
              {images.length > 0 && (
                <Grid mb="md">
                  {images.map((image, index) => (
                    <Grid.Col key={image.id} span={{ base: 6, sm: 4, md: 3 }}>
                      <Paper withBorder p="xs" pos="relative">
                        <Image
                          src={image.cloudinaryUrl || image.url}
                          alt={`Preview ${index + 1}`}
                          height={120}
                          fit="cover"
                          radius="sm"
                        />

                        {/* Status Badge */}
                        <Badge
                          size="xs"
                          color={
                            image.isUploaded
                              ? 'green'
                              : image.isUploading
                                ? 'blue'
                                : image.error
                                  ? 'red'
                                  : 'gray'
                          }
                          style={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                          }}
                        >
                          {image.isUploaded
                            ? '✓ Subido'
                            : image.isUploading
                              ? 'Subiendo...'
                              : image.error
                                ? 'Error'
                                : 'Pendiente'}
                        </Badge>

                        {index === 0 && (
                          <Text size="xs" c="blue" fw={500} ta="center" mt="xs">
                            Principal
                          </Text>
                        )}

                        {/* Upload Progress */}
                        {image.isUploading &&
                          image.uploadProgress !== undefined && (
                            <Progress
                              value={image.uploadProgress}
                              size="sm"
                              mt="xs"
                              animated
                            />
                          )}

                        {/* Error Message */}
                        {image.error && (
                          <Text size="xs" c="red" mt="xs" ta="center">
                            {image.error}
                          </Text>
                        )}

                        <Button
                          size="xs"
                          color="red"
                          variant="filled"
                          style={{
                            position: 'absolute',
                            bottom: 4,
                            right: 4,
                          }}
                          onClick={() => handleRemoveImage(image.id)}
                          disabled={image.isUploading}
                        >
                          <IconTrash size={14} />
                        </Button>
                      </Paper>
                    </Grid.Col>
                  ))}
                </Grid>
              )}

              {/* Upload Options */}
              <Group>
                <FileButton
                  onChange={handleImageUpload}
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  multiple
                  disabled={images.length >= 5}
                >
                  {props => (
                    <Button
                      {...props}
                      leftSection={<IconUpload size={16} />}
                      variant="light"
                      disabled={images.length >= 5}
                    >
                      Subir Imágenes
                    </Button>
                  )}
                </FileButton>

                <Text size="xs" c="dimmed">
                  o
                </Text>

                <Button
                  leftSection={<IconLink size={16} />}
                  variant="light"
                  disabled={images.length >= 5}
                  onClick={() => setUrlModalOpened(true)}
                >
                  Agregar URL
                </Button>
              </Group>

              {images.length >= 5 && (
                <Text size="xs" c="orange" mt="xs">
                  Has alcanzado el límite de 5 imágenes
                </Text>
              )}

              {images.length === 0 && (
                <Alert
                  icon={<IconAlertCircle size="1rem" />}
                  color="yellow"
                  mt="md"
                >
                  Debes agregar al menos una imagen del producto
                </Alert>
              )}
            </div>

            {/* Hidden field for imagenUrl (used for validation) */}
            <input type="hidden" {...form.getInputProps('imagenUrl')} />

            {/* Submit Button */}
            <Group justify="flex-end" mt="md">
              <Button
                type="button"
                variant="subtle"
                onClick={() => {
                  form.reset();
                  // Clear all images and previews
                  clearImages();
                  setError(null);
                  setSuccess(false);
                }}
              >
                Limpiar Formulario
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={images.length === 0}
                size="md"
                leftSection={<IconCloudUpload size={18} />}
              >
                {loading ? 'Subiendo imágenes...' : 'Crear Producto'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>

      {/* Modal para agregar URL de imagen */}
      <Modal
        opened={urlModalOpened}
        onClose={handleUrlModalClose}
        title={
          <Group gap="xs">
            <IconLink size={20} />
            <Text fw={500}>Agregar Imagen por URL</Text>
          </Group>
        }
        size="md"
        centered
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Ingresa la URL completa de la imagen que deseas agregar. Asegúrate
            de que sea una URL pública y accesible.
          </Text>

          <TextInput
            label="URL de la Imagen"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={tempImageUrl}
            onChange={e => {
              setTempImageUrl(e.target.value);
              setUrlError(null); // Clear error on change
            }}
            error={urlError}
            leftSection={<IconPhoto size={16} />}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleUrlModalSubmit();
              }
            }}
          />

          {/* Preview de la imagen si la URL es válida */}
          {tempImageUrl && !urlError && (
            <Paper withBorder p="md" radius="md">
              <Text size="sm" fw={500} mb="xs">
                Vista Previa:
              </Text>
              <Image
                src={tempImageUrl}
                alt="Preview"
                height={200}
                fit="contain"
                fallbackSrc="https://placehold.co/400x300?text=Imagen+no+disponible"
                onError={() =>
                  setUrlError('No se pudo cargar la imagen. Verifica la URL.')
                }
              />
            </Paper>
          )}

          <Group justify="space-between" mt="md">
            <Button
              variant="subtle"
              color="gray"
              onClick={handleUrlModalClose}
              leftSection={<IconX size={16} />}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUrlModalSubmit}
              disabled={!tempImageUrl || tempImageUrl.trim() === ''}
              leftSection={<IconCheck size={16} />}
            >
              Agregar Imagen
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Paper>
  );
};

export default SellProductForm;

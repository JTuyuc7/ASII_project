'use client';
import { ImageFile } from '@/types/image.types';
import {
  Alert,
  Button,
  FileButton,
  Group,
  Image as MantineImage,
  Modal,
  Paper,
  Progress,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconCheck,
  IconLink,
  IconPhoto,
  IconUpload,
  IconX,
} from '@tabler/icons-react';
import { useState } from 'react';
import ImagePreviewGrid from './ImagePreviewGrid';

interface ImageUploaderProps {
  images: ImageFile[];
  onAddFiles: (files: File[]) => void;
  onAddUrl: (url: string) => boolean;
  onRemove: (imageId: string) => void;
  maxImages?: number;
  uploading?: boolean;
  uploadProgress?: number;
  error?: string | null;
}

export default function ImageUploader({
  images,
  onAddFiles,
  onAddUrl,
  onRemove,
  maxImages = 5,
  uploading = false,
  uploadProgress = 0,
  error = null,
}: ImageUploaderProps) {
  const [urlModalOpened, setUrlModalOpened] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);

  const canAddMore = images.length < maxImages;

  const handleUrlModalSubmit = () => {
    setUrlError(null);
    const success = onAddUrl(tempImageUrl);

    if (success) {
      setUrlModalOpened(false);
      setTempImageUrl('');
      setUrlError(null);
    } else {
      setUrlError('No se pudo agregar la imagen');
    }
  };

  const handleUrlModalClose = () => {
    setUrlModalOpened(false);
    setTempImageUrl('');
    setUrlError(null);
  };

  return (
    <Stack gap="md">
      <div>
        <Text size="sm" fw={500} mb="xs">
          Imágenes del Producto
        </Text>
        <Text size="xs" c="dimmed" mb="md">
          Puedes agregar hasta {maxImages} imágenes. La primera será la imagen
          principal.
        </Text>

        {/* Upload Progress */}
        {uploading && (
          <Paper
            withBorder
            p="md"
            mb="md"
            style={{ backgroundColor: '#f1f3f5' }}
          >
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" fw={500}>
                  📤 Subiendo imágenes a Cloudinary...
                </Text>
                <Text size="sm" c="blue">
                  {uploadProgress}%
                </Text>
              </Group>
              <Progress value={uploadProgress} size="lg" radius="sm" animated />
              <Text size="xs" c="dimmed">
                Por favor espera mientras las imágenes se suben al servidor
              </Text>
            </Stack>
          </Paper>
        )}

        {/* Error Alert */}
        {error && (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Error"
            color="red"
            mb="md"
            withCloseButton
          >
            {error}
          </Alert>
        )}

        {/* Image Preview Grid */}
        <ImagePreviewGrid
          images={images}
          onRemove={onRemove}
          maxImages={maxImages}
        />

        {/* Upload Controls */}
        <Group mt="md">
          <FileButton
            onChange={onAddFiles}
            accept="image/png,image/jpeg,image/jpg,image/webp"
            multiple
            disabled={!canAddMore || uploading}
          >
            {props => (
              <Button
                {...props}
                leftSection={<IconUpload size={16} />}
                variant="light"
                disabled={!canAddMore || uploading}
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
            disabled={!canAddMore || uploading}
            onClick={() => setUrlModalOpened(true)}
          >
            Agregar URL
          </Button>
        </Group>

        {/* Limit Warning */}
        {!canAddMore && (
          <Text size="xs" c="orange" mt="xs">
            Has alcanzado el límite de {maxImages} imágenes
          </Text>
        )}

        {/* No Images Warning */}
        {images.length === 0 && (
          <Alert icon={<IconAlertCircle size="1rem" />} color="yellow" mt="md">
            Debes agregar al menos una imagen del producto
          </Alert>
        )}
      </div>

      {/* URL Modal */}
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
              setUrlError(null);
            }}
            error={urlError}
            leftSection={<IconPhoto size={16} />}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleUrlModalSubmit();
              }
            }}
          />

          {/* Preview */}
          {tempImageUrl && !urlError && (
            <Paper withBorder p="md" radius="md">
              <Text size="sm" fw={500} mb="xs">
                Vista Previa:
              </Text>
              <MantineImage
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
    </Stack>
  );
}

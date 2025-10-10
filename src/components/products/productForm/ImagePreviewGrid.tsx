'use client';
import { ImageFile } from '@/types/image.types';
import {
  Badge,
  Button,
  Grid,
  Image,
  Paper,
  Progress,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconCheck, IconLoader, IconTrash, IconX } from '@tabler/icons-react';

interface ImagePreviewGridProps {
  images: ImageFile[];
  onRemove: (imageId: string) => void;
  maxImages?: number;
}

export default function ImagePreviewGrid({
  images,
  onRemove,
  maxImages = 5,
}: ImagePreviewGridProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <Grid>
      {images.map((image, index) => (
        <Grid.Col key={image.id} span={{ base: 6, sm: 4, md: 3 }}>
          <Paper withBorder p="xs" pos="relative">
            <Stack gap="xs">
              {/* Image Preview */}
              <div style={{ position: 'relative' }}>
                <Image
                  src={image.url}
                  alt={`Preview ${index + 1}`}
                  height={120}
                  fit="cover"
                  radius="sm"
                  fallbackSrc="https://placehold.co/300x300?text=Error"
                />

                {/* Upload Status Badge */}
                {image.isUploading && (
                  <Badge
                    color="blue"
                    variant="filled"
                    size="sm"
                    style={{
                      position: 'absolute',
                      top: 4,
                      left: 4,
                    }}
                    leftSection={<IconLoader size={12} />}
                  >
                    Subiendo...
                  </Badge>
                )}

                {image.isUploaded && !image.isUploading && (
                  <Badge
                    color="green"
                    variant="filled"
                    size="sm"
                    style={{
                      position: 'absolute',
                      top: 4,
                      left: 4,
                    }}
                    leftSection={<IconCheck size={12} />}
                  >
                    Subida
                  </Badge>
                )}

                {image.error && (
                  <Tooltip label={image.error}>
                    <Badge
                      color="red"
                      variant="filled"
                      size="sm"
                      style={{
                        position: 'absolute',
                        top: 4,
                        left: 4,
                      }}
                      leftSection={<IconX size={12} />}
                    >
                      Error
                    </Badge>
                  </Tooltip>
                )}

                {/* Remove Button */}
                <Button
                  size="xs"
                  color="red"
                  variant="filled"
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                  }}
                  onClick={() => onRemove(image.id)}
                  disabled={image.isUploading}
                >
                  <IconTrash size={14} />
                </Button>
              </div>

              {/* Progress Bar (if uploading) */}
              {image.isUploading && image.uploadProgress !== undefined && (
                <Progress
                  value={image.uploadProgress}
                  size="sm"
                  radius="sm"
                  animated
                  color="blue"
                />
              )}

              {/* Main Image Indicator */}
              {index === 0 && (
                <Text size="xs" c="blue" fw={500} ta="center">
                  Principal
                </Text>
              )}

              {/* Image Info */}
              {image.file && (
                <Text size="xs" c="dimmed" ta="center" lineClamp={1}>
                  {image.file.name}
                </Text>
              )}
            </Stack>
          </Paper>
        </Grid.Col>
      ))}

      {/* Empty Slots Indicator */}
      {images.length < maxImages && (
        <Grid.Col span={{ base: 6, sm: 4, md: 3 }}>
          <Paper
            withBorder
            p="xs"
            style={{
              border: '2px dashed #dee2e6',
              backgroundColor: '#f8f9fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 120,
            }}
          >
            <Text size="sm" c="dimmed" ta="center">
              {maxImages - images.length} más disponible
              {maxImages - images.length !== 1 ? 's' : ''}
            </Text>
          </Paper>
        </Grid.Col>
      )}
    </Grid>
  );
}

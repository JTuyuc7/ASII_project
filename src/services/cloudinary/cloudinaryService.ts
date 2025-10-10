// Service for uploading images to Cloudinary

import {
  CloudinaryUploadResponse,
  DEFAULT_IMAGE_OPTIONS,
  ImageUploadOptions,
} from '@/types/image.types';
import { cloudinaryConfig, validateCloudinaryConfig } from './cloudinaryConfig';

/**
 * Validates an image file before upload
 */
export const validateImageFile = (
  file: File,
  options: ImageUploadOptions = DEFAULT_IMAGE_OPTIONS
): string | null => {
  // Check file size
  if (options.maxSize && file.size > options.maxSize) {
    const maxSizeMB = (options.maxSize / (1024 * 1024)).toFixed(2);
    return `La imagen es muy grande. Máximo ${maxSizeMB}MB`;
  }

  // Check file type
  if (options.allowedFormats && !options.allowedFormats.includes(file.type)) {
    return 'Formato de imagen no permitido. Use JPG, PNG o WEBP';
  }

  return null;
};

/**
 * Uploads a single image to Cloudinary
 */
export const uploadImageToCloudinary = async (
  file: File,
  options: ImageUploadOptions = DEFAULT_IMAGE_OPTIONS,
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResponse> => {
  // Validate configuration
  if (!validateCloudinaryConfig()) {
    throw new Error('Configuración de Cloudinary incompleta');
  }

  // Validate file
  const validationError = validateImageFile(file, options);
  if (validationError) {
    throw new Error(validationError);
  }

  // Prepare form data
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);

  // Add optional parameters
  if (options.folder) {
    formData.append('folder', options.folder);
  }

  // Add transformation
  if (options.transformation) {
    const transformation = [];
    if (options.transformation.width)
      transformation.push(`w_${options.transformation.width}`);
    if (options.transformation.height)
      transformation.push(`h_${options.transformation.height}`);
    if (options.transformation.crop)
      transformation.push(`c_${options.transformation.crop}`);
    if (options.transformation.quality)
      transformation.push(`q_${options.transformation.quality}`);

    if (transformation.length > 0) {
      formData.append('transformation', transformation.join(','));
    }
  }

  // Upload with progress tracking
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', e => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      });
    }

    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (error) {
          console.log(error, 'error to process images');
          reject(new Error('Error al procesar respuesta de Cloudinary'));
        }
      } else {
        reject(new Error(`Error al subir imagen: ${xhr.statusText}`));
      }
    });

    // Handle errors
    xhr.addEventListener('error', () => {
      reject(new Error('Error de red al subir imagen'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload cancelado'));
    });

    // Send request
    xhr.open('POST', cloudinaryConfig.uploadUrl);
    xhr.send(formData);
  });
};

/**
 * Uploads multiple images to Cloudinary in parallel
 */
export const uploadMultipleImages = async (
  files: File[],
  options: ImageUploadOptions = DEFAULT_IMAGE_OPTIONS,
  onProgress?: (fileIndex: number, progress: number) => void
): Promise<CloudinaryUploadResponse[]> => {
  const uploadPromises = files.map((file, index) =>
    uploadImageToCloudinary(
      file,
      options,
      onProgress ? progress => onProgress(index, progress) : undefined
    )
  );

  return Promise.all(uploadPromises);
};

/**
 * Generates a thumbnail URL from Cloudinary public_id
 */
export const getThumbnailUrl = (
  publicId: string,
  width: number = 200,
  height: number = 200
): string => {
  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/w_${width},h_${height},c_fill,q_auto/${publicId}`;
};

/**
 * Generates an optimized image URL with transformations
 */
export const getOptimizedImageUrl = (
  publicId: string,
  width?: number,
  height?: number,
  quality: string | number = 'auto'
): string => {
  const transformations = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`q_${quality}`);
  transformations.push('f_auto'); // Auto format (WebP when supported)

  const transformationStr = transformations.join(',');

  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${transformationStr}/${publicId}`;
};

/**
 * Deletes an image from Cloudinary (requires backend API route with signed request)
 */
export const deleteImageFromCloudinary = async (
  publicId: string
): Promise<boolean> => {
  try {
    // This should call your backend API route that handles signed deletion
    const response = await fetch('/api/cloudinary/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error('Error al eliminar imagen');
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

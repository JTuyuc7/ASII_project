// Custom hook for image upload with Cloudinary integration

import {
  uploadMultipleImages,
  validateImageFile,
} from '@/services/cloudinary/cloudinaryService';
import {
  CloudinaryUploadResponse,
  DEFAULT_IMAGE_OPTIONS,
  ImageFile,
  ImageUploadOptions,
  UploadState,
} from '@/types/image.types';
import { useCallback, useState } from 'react';

export const useImageUpload = (
  options: ImageUploadOptions = DEFAULT_IMAGE_OPTIONS
) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
    uploadedCount: 0,
    totalCount: 0,
  });

  /**
   * Adds local files to the image list with preview URLs
   */
  const addLocalFiles = useCallback(
    (files: File[]) => {
      // Check if adding these files would exceed the limit
      const remainingSlots = (options.maxFiles || 5) - images.length;
      const filesToAdd = files.slice(0, remainingSlots);

      // Validate each file
      const validatedFiles: ImageFile[] = [];
      const errors: string[] = [];

      filesToAdd.forEach((file, index) => {
        const validationError = validateImageFile(file, options);
        if (validationError) {
          errors.push(`${file.name}: ${validationError}`);
        } else {
          validatedFiles.push({
            id: `local-${Date.now()}-${index}`,
            file: file,
            url: URL.createObjectURL(file),
            isUploaded: false,
            isUploading: false,
            uploadProgress: 0,
          });
        }
      });

      if (errors.length > 0) {
        setUploadState(prev => ({
          ...prev,
          error: errors.join(', '),
        }));
        return;
      }

      setImages(prev => [...prev, ...validatedFiles]);
      setUploadState(prev => ({ ...prev, error: null }));
    },
    [images, options]
  );

  /**
   * Adds an image from a URL
   */
  const addImageUrl = useCallback(
    (url: string): boolean => {
      if (images.length >= (options.maxFiles || 5)) {
        setUploadState(prev => ({
          ...prev,
          error: `Solo puedes agregar hasta ${options.maxFiles} imágenes`,
        }));
        return false;
      }

      try {
        new URL(url); // Validate URL

        const newImage: ImageFile = {
          id: `url-${Date.now()}`,
          url: url,
          cloudinaryUrl: url, // Already a URL, no need to upload
          isUploaded: true,
        };

        setImages(prev => [...prev, newImage]);
        setUploadState(prev => ({ ...prev, error: null }));
        return true;
      } catch {
        setUploadState(prev => ({
          ...prev,
          error: 'URL de imagen inválida',
        }));
        return false;
      }
    },
    [images, options.maxFiles]
  );

  /**
   * Removes an image from the list
   */
  const removeImage = useCallback((imageId: string) => {
    setImages(prev => {
      const image = prev.find(img => img.id === imageId);
      // Revoke object URL to prevent memory leaks
      if (image?.file && image.url.startsWith('blob:')) {
        URL.revokeObjectURL(image.url);
      }
      return prev.filter(img => img.id !== imageId);
    });
  }, []);

  /**
   * Clears all images
   */
  const clearImages = useCallback(() => {
    images.forEach(image => {
      if (image.file && image.url.startsWith('blob:')) {
        URL.revokeObjectURL(image.url);
      }
    });
    setImages([]);
    setUploadState({
      uploading: false,
      progress: 0,
      error: null,
      uploadedCount: 0,
      totalCount: 0,
    });
  }, [images]);

  /**
   * Uploads all local files to Cloudinary
   */
  const uploadToCloudinary = useCallback(async (): Promise<string[]> => {
    const filesToUpload = images.filter(img => img.file && !img.isUploaded);

    if (filesToUpload.length === 0) {
      // Return existing URLs if no files to upload
      return images
        .filter(img => img.cloudinaryUrl || img.url)
        .map(img => img.cloudinaryUrl || img.url);
    }

    setUploadState({
      uploading: true,
      progress: 0,
      error: null,
      uploadedCount: 0,
      totalCount: filesToUpload.length,
    });

    try {
      const files = filesToUpload.map(img => img.file!);
      const progressMap = new Map<number, number>();

      // Track individual file progress
      const onProgress = (fileIndex: number, progress: number) => {
        progressMap.set(fileIndex, progress);

        // Calculate overall progress
        const totalProgress = Array.from(progressMap.values()).reduce(
          (sum, val) => sum + val,
          0
        );
        const avgProgress = totalProgress / files.length;

        setUploadState(prev => ({
          ...prev,
          progress: Math.round(avgProgress),
          uploadedCount: Array.from(progressMap.values()).filter(p => p === 100)
            .length,
        }));
      };

      // Upload all files
      const responses: CloudinaryUploadResponse[] = await uploadMultipleImages(
        files,
        options,
        onProgress
      );

      // Update images with Cloudinary URLs
      setImages(prev =>
        prev.map(img => {
          if (img.file && !img.isUploaded) {
            const response =
              responses[filesToUpload.findIndex(f => f.id === img.id)];
            if (response) {
              return {
                ...img,
                cloudinaryUrl: response.secure_url,
                publicId: response.public_id,
                isUploaded: true,
                isUploading: false,
                uploadProgress: 100,
              };
            }
          }
          return img;
        })
      );

      setUploadState(prev => ({
        ...prev,
        uploading: false,
        progress: 100,
        uploadedCount: responses.length,
      }));

      // Return all URLs (uploaded + existing)
      const allUrls = [
        ...responses.map(r => r.secure_url),
        ...images
          .filter(img => img.cloudinaryUrl && img.isUploaded)
          .map(img => img.cloudinaryUrl!),
      ];

      return allUrls;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al subir imágenes';

      setUploadState(prev => ({
        ...prev,
        uploading: false,
        error: errorMessage,
      }));

      throw error;
    }
  }, [images, options]);

  /**
   * Gets the first uploaded or URL image
   */
  const getMainImageUrl = useCallback((): string | null => {
    const firstImage = images[0];
    if (!firstImage) return null;

    return firstImage.cloudinaryUrl || firstImage.url || null;
  }, [images]);

  /**
   * Gets all uploaded image URLs
   */
  const getAllImageUrls = useCallback((): string[] => {
    return images
      .filter(img => img.cloudinaryUrl || (img.isUploaded && img.url))
      .map(img => img.cloudinaryUrl || img.url);
  }, [images]);

  return {
    images,
    uploadState,
    addLocalFiles,
    addImageUrl,
    removeImage,
    clearImages,
    uploadToCloudinary,
    getMainImageUrl,
    getAllImageUrls,
    hasImages: images.length > 0,
    canAddMore: images.length < (options.maxFiles || 5),
  };
};

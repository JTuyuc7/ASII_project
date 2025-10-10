// Types for image handling across the application

export interface ImageFile {
  id: string;
  file?: File;
  url: string;
  cloudinaryUrl?: string;
  publicId?: string;
  isUploaded: boolean;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string;
  thumbnail?: string;
}

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
  resource_type: string;
  thumbnail_url?: string;
}

export interface ImageUploadOptions {
  maxSize?: number; // in bytes
  maxFiles?: number;
  allowedFormats?: string[];
  folder?: string;
  transformation?: CloudinaryTransformation;
}

export interface CloudinaryTransformation {
  width?: number;
  height?: number;
  crop?: 'limit' | 'fill' | 'scale' | 'fit';
  quality?: 'auto' | number;
  format?: 'auto' | 'jpg' | 'png' | 'webp';
}

export interface UploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
  uploadedCount: number;
  totalCount: number;
}

export const DEFAULT_IMAGE_OPTIONS: ImageUploadOptions = {
  maxSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 5,
  allowedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
  folder: 'ecommerce/products',
  transformation: {
    width: 800,
    height: 800,
    crop: 'limit',
    quality: 'auto',
    format: 'auto',
  },
};

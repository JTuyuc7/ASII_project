// Cloudinary configuration

/**
 * Client-side configuration (safe to expose in browser)
 * Used for unsigned uploads from the client
 */
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
  uploadUrl: `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
};

/**
 * Server-side configuration (NOT exposed to browser)
 * Used for authenticated operations like delete, rename, etc.
 * Only available in API routes and server components
 */
export const cloudinaryServerConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  apiKey: process.env.CLOUDINARY_API_KEY || '',
  apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  // Alternative: Parse from CLOUDINARY_URL
  // Format: cloudinary://api_key:api_secret@cloud_name
  url: process.env.CLOUDINARY_URL || '',
};

/**
 * Parses CLOUDINARY_URL into components
 * Format: cloudinary://api_key:api_secret@cloud_name
 */
export const parseCloudinaryUrl = (url: string) => {
  if (!url) return null;

  try {
    // Remove 'cloudinary://' prefix
    const withoutProtocol = url.replace('cloudinary://', '');

    // Split into credentials and cloud_name
    const [credentials, cloudName] = withoutProtocol.split('@');
    const [apiKey, apiSecret] = credentials.split(':');

    return {
      cloudName,
      apiKey,
      apiSecret,
    };
  } catch (error) {
    console.error('Error parsing CLOUDINARY_URL:', error);
    return null;
  }
};

/**
 * Validates client-side configuration
 */
export const validateCloudinaryConfig = (): boolean => {
  const { cloudName, uploadPreset } = cloudinaryConfig;

  if (!cloudName || !uploadPreset) {
    console.error(
      'Cloudinary configuration is missing. Please check environment variables.'
    );
    console.error(
      'Required: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET'
    );
    return false;
  }

  return true;
};

/**
 * Validates server-side configuration
 */
export const validateCloudinaryServerConfig = (): boolean => {
  // Try to parse CLOUDINARY_URL first
  if (cloudinaryServerConfig.url) {
    const parsed = parseCloudinaryUrl(cloudinaryServerConfig.url);
    if (parsed) {
      return true;
    }
  }

  // Fallback to individual variables
  const { cloudName, apiKey, apiSecret } = cloudinaryServerConfig;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('Cloudinary server configuration is missing.');
    console.error(
      'Provide either CLOUDINARY_URL or (CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET)'
    );
    return false;
  }

  return true;
};

/**
 * Gets server configuration (prioritizes CLOUDINARY_URL if available)
 */
export const getCloudinaryServerConfig = () => {
  // Try CLOUDINARY_URL first
  if (cloudinaryServerConfig.url) {
    const parsed = parseCloudinaryUrl(cloudinaryServerConfig.url);
    if (parsed) {
      return parsed;
    }
  }

  // Fallback to individual variables
  return {
    cloudName: cloudinaryServerConfig.cloudName,
    apiKey: cloudinaryServerConfig.apiKey,
    apiSecret: cloudinaryServerConfig.apiSecret,
  };
};

// Default transformation presets
export const transformationPresets = {
  thumbnail: {
    width: 200,
    height: 200,
    crop: 'fill' as const,
    quality: 'auto' as const,
  },
  product: {
    width: 800,
    height: 800,
    crop: 'limit' as const,
    quality: 'auto' as const,
    format: 'auto' as const,
  },
  productLarge: {
    width: 1200,
    height: 1200,
    crop: 'limit' as const,
    quality: 'auto' as const,
    format: 'auto' as const,
  },
};

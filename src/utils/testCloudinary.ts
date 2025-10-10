// Utility to test Cloudinary configuration

export const testCloudinaryConfig = () => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  console.log('🔍 Testing Cloudinary Configuration:');
  console.log('-----------------------------------');
  console.log('Cloud Name:', cloudName || '❌ NOT SET');
  console.log('Upload Preset:', uploadPreset || '❌ NOT SET');
  console.log(
    'Upload URL:',
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
  );
  console.log('-----------------------------------');

  if (!cloudName) {
    console.error('❌ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set!');
    return false;
  }

  if (!uploadPreset) {
    console.error('❌ NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is not set!');
    return false;
  }

  console.log('✅ Configuration looks good!');
  return true;
};

// Test upload endpoint
export const testCloudinaryEndpoint = async (cloudName: string) => {
  try {
    const testUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    console.log('🌐 Testing endpoint:', testUrl);

    const response = await fetch(testUrl, {
      method: 'POST',
      body: new FormData(), // Empty body just to test endpoint
    });

    console.log('📡 Response status:', response.status);

    // We expect 400 because we're not sending required fields
    // But if we get 400, it means the endpoint exists
    if (response.status === 400 || response.status === 401) {
      console.log('✅ Cloudinary endpoint is accessible');
      return true;
    }

    console.log('⚠️ Unexpected response:', response.status);
    return false;
  } catch (error) {
    console.error('❌ Error testing endpoint:', error);
    return false;
  }
};

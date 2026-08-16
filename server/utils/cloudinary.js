const cloudinary = require('cloudinary').v2;

// Configure Cloudinary from environment variables
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('[Cloudinary Service]: Configured with cloud:', process.env.CLOUDINARY_CLOUD_NAME);
} else {
  console.warn('[Cloudinary Service]: Cloudinary credentials missing in environment variables. Falling back to persistent URL storage.');
}

/**
 * Uploads an image (Base64 data string or URL) to Cloudinary.
 * If Cloudinary is not configured or fails, returns original string safely.
 * @param {string} imageStr - Base64 Data URL or HTTP Image URL
 * @param {string} folder - Target Cloudinary folder (default: 'torque/profile-images')
 * @returns {Promise<string>} Cloudinary HTTPS URL or original string
 */
const uploadToCloudinary = async (imageStr, folder = 'torque/profile-images') => {
  if (!imageStr) return '';

  // If already an HTTP/HTTPS URL and not a Base64 string, return directly
  if (imageStr.startsWith('http://') || imageStr.startsWith('https://')) {
    return imageStr;
  }

  // Check if Cloudinary credentials exist
  const isCloudinaryConfigured = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

  if (!isCloudinaryConfigured) {
    console.warn('[Cloudinary Upload]: Cloudinary credentials missing in env, saving image string directly.');
    return imageStr;
  }

  try {
    const result = await cloudinary.uploader.upload(imageStr, {
      folder,
      resource_type: 'image',
      transformation: [{ width: 500, height: 500, crop: 'limit', quality: 'auto' }]
    });

    console.log('[Cloudinary Upload Success]: Image uploaded to Cloudinary ->', result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error('[Cloudinary Upload Exception]:', error.message || error);
    // Fallback gracefully to returning the string without crashing
    return imageStr;
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary
};

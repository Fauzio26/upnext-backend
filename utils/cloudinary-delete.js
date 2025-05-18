import cloudinary from '../utils/cloudinary-config.js';

export const deleteResource = async (publicId, options = {}) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, options);
    return result;
  } catch (error) {
    throw error;
  }
};

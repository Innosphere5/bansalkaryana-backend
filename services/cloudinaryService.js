const cloudinary = require('../config/cloudinary');

/**
 * Uploads an image buffer to Cloudinary
 * @param {Buffer} fileBuffer - The image file buffer from Multer
 * @param {string} folder - The folder name in Cloudinary
 * @returns {Promise<Object>} - The upload result
 */
const uploadImage = async (fileBuffer, folder = 'karyana_products') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'auto',
                // Optimization is handled during delivery, but we can set defaults here
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        uploadStream.end(fileBuffer);
    });
};

/**
 * Deletes an image from Cloudinary
 * @param {string} publicId - The public ID of the image
 * @returns {Promise<Object>} - The deletion result
 */
const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw error;
    }
};

/**
 * Generates an optimized URL for a given public ID
 * @param {string} publicId - The public ID of the image
 * @returns {string} - The optimized URL
 */
const getOptimizedUrl = (publicId) => {
    return cloudinary.url(publicId, {
        fetch_format: 'auto',
        quality: 'auto',
        width: 300,
        height: 300,
        crop: 'fill',
        gravity: 'auto',
        dpr: 'auto'
    });
};

module.exports = {
    uploadImage,
    deleteImage,
    getOptimizedUrl
};

const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Uploads a file buffer to Cloudinary
 * @param {Buffer} buffer - The file buffer from Multer
 * @param {string} folder - The destination folder in Cloudinary
 * @returns {Promise<string>} - The secure URL of the uploaded image/document
 */
const uploadToCloudinary = (buffer, folder = 'swastik-solar') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder, resource_type: 'auto' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    // Create a readable stream from the buffer and pipe it to Cloudinary
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null); // End of stream
    stream.pipe(uploadStream);
  });
};

module.exports = { cloudinary, uploadToCloudinary };

const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { Readable } = require('stream');

// Use environment variables for credentials. `server.js` already loads dotenv.
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.warn('Cloudinary credentials missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in .env');
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME || 'dwyxmhkxi',
  api_key: CLOUDINARY_API_KEY || '413556159575677',
  api_secret: CLOUDINARY_API_SECRET || 'T56wtFcIPV9LF7FXLzB4z7qONOc',
});

const storage = new multer.memoryStorage();

function bufferToStream(buffer) {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
}

async function imageUploadUtil(fileOrBuffer, options = {}) {
  // If caller passed a Buffer, upload via stream (avoids base64 conversion and memory bloat)
  if (Buffer.isBuffer(fileOrBuffer)) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', ...options },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      bufferToStream(fileOrBuffer).pipe(uploadStream);
    });
  }

  // Fallback: allow passing a file path or data URI
  return cloudinary.uploader.upload(fileOrBuffer, { resource_type: 'auto', ...options });
}

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };

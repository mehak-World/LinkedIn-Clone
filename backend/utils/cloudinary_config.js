const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
require('dotenv').config();

cloudinary.config({
  cloud_name: 'dda1pwira',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

async function handleUpload(filePath) {
  try {
    const res = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    // Delete the local file after uploading to Cloudinary
    fs.unlinkSync(filePath);

    return res;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw err;
  }
}

module.exports = { handleUpload, cloudinary };
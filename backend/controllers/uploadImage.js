const cloudinary = require("cloudinary").v2;
const fs = require("fs/promises");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded." });

    const result = await cloudinary.uploader.upload(file.path);
    await fs.unlink(file.path);

    res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error("Image upload error:", err);
    res.status(500).json({ message: "Upload failed." });
  }
};

module.exports = uploadImage;

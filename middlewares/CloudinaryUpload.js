const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const uploadCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // console.log("File is uploaded", result.url);
        fs.unlinkSync(localFilePath); //if file upload to cloud then delete the file from storage
        return result;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        throw error;
    }
};

module.exports = uploadCloudinary;

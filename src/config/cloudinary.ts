// const cloudinary = require('cloudinary').v2;
import { v2 as cloudinary } from "cloudinary";
// Configuration
cloudinary.config({
  cloud_name: "etmedia",
  api_key: "198951455822186",
  api_secret: "TUy45D_ShhXCYZL7bzDIu0P4WdE",
});
const uploadImageToCloudinary = async (imagePath: string) => {
  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath);
    return result.url;
  } catch (error) {
    console.error(error);
  }
};
export default uploadImageToCloudinary;

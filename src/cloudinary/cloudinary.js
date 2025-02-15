import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"
import { console } from 'inspector';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME ,
    api_key : process.env.CLOUDINARY_API_KEY ,
    api_secret : process.env.CLOUDINARY_API_SECRET 
})

const uploadOnCloudinary = async (localFilePath) => {
    try {
        //console.log("clodname = ",process.env.CLOUDINARY_CLOUD_NAME)
        if(!localFilePath){
            return null;
        }
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        console.log("File upload successfull url is = ",response.url);
        return response;
    } catch (error) {
       fs.unlinkSync(localFilePath);
       console.log("Error while uploading file on cloudinary = ",error);
        return null;
    }
}

const deleteFileFromCloudinary = async (publicId) => {
    if (!publicId) {
      return { status: 400, message: 'Public ID is required.' };
    }
  
    // Regular expression to validate public ID format (alphanumeric with dashes/underscores)
    const validPublicIdRegex = /^[a-zA-Z0-9_-]+$/;
  
    if (!validPublicIdRegex.test(publicId)) {
      return { status: 400, message: 'Invalid Public ID format.' };
    }
  
    try {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
          if (error) {
            reject({ status: 500, message: error.message });
          } else if (result.result === 'ok') {
            resolve({ status: 200, message: 'File deleted successfully.' });
          } else {
            reject({ status: 400, message: 'Failed to delete file.' });
          }
        });
      });
    } catch (error) {
      return { status: 500, message: 'Internal server error.' };
    }
};
  
export {uploadOnCloudinary,deleteFileFromCloudinary}
import cloudinary from 'cloudinary';
import { v2 } from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: 'dvivzto6g',
  api_key: '277886899756773',
  api_secret: 'w7fzvlGo27IuYaexKc9_K91yT6A'
});

interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
}

export const uploadToCloudinary = async (filePath: string): Promise<CloudinaryUploadResult> => {
  try {
    const result = await v2.uploader.upload(filePath, {
      folder: 'onwork',
      resource_type: 'auto'
    });

    return {
      public_id: result.public_id,
      secure_url: result.secure_url
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Error uploading file');
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    // Try to delete as image first
    await v2.uploader.destroy(publicId, {
      resource_type: 'image'
    });
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    try {
      // If image deletion fails, try raw file
      await v2.uploader.destroy(publicId, {
        resource_type: 'raw'
      });
    } catch (error) {
      console.error('Error deleting raw file from Cloudinary:', error);
      throw new Error('Error deleting file from Cloudinary');
    }
  }
};

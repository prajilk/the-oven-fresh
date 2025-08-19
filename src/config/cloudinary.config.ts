import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteFile(publicId: string) {
  const response = await cloudinary.uploader.destroy(publicId);
  if (response.result === 'ok') {
    return true;
  }
  return false;
}

const regex = /\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z]+)?$/;
export function extractPublicId(url: string) {
  try {
    // Match the path after "upload/" and before the file extension
    const match = url.match(regex);
    const publicId = match?.[1]; // Extracted public ID
    if (publicId) {
      return publicId;
    }
    throw new Error('Public ID not found');
  } catch {
    return null;
  }
}

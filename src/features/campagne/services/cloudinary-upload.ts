"use server";
import cloudinary from "@/lib/cloudinary";

export async function cloudinaryUpload(base64: string) {
  try {
    // Upload via Cloudinary en base64
    const uploaded = await cloudinary.uploader.upload(base64, {
      folder: "saidiya",
    });

    return uploaded.secure_url;
  } catch (error) {
    console.error("[UPLOAD ERROR]", error);
    return "Échec de l’upload";
  }
}

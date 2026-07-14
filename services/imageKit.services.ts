import { imageKit } from "@/lib/imageKit";

export const ImageKitService = {
  async upload(file: string | Buffer, fileName: string, folder = "/users") {
    const result = await imageKit.upload({
      file,
      fileName,
      folder,
      useUniqueFileName: true,
    });

    return {
      url: result.url,
      fileId: result.fileId,
      thumbnailUrl: result.thumbnailUrl,
    };
  },

  async delete(fileId: string) {
    return imageKit.deleteFile(fileId);
  },
};
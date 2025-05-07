
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import sharp from "sharp";

export const server = {
    compressImage: defineAction({
        accept: 'form',
        input: z.object({
            file: z.instanceof(File),
            type: z.string().refine((val) => ['webp', 'avif']),
            quality: z.string()
        }),
        handler: async({file, type, quality}) => {

            const arrayBuffer = await file.arrayBuffer()
            let compressedImageBuffer: ArrayBuffer;
            if (type === 'webp') {
                compressedImageBuffer = await sharp(arrayBuffer).resize(1920).webp({quality: parseInt(quality)}).toBuffer();
            } else {
                compressedImageBuffer = await sharp(arrayBuffer).resize(1920).avif({quality: parseInt(quality)}).toBuffer();
            }

            return compressedImageBuffer
        }
    })
}

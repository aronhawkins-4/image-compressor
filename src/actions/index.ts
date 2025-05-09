
import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import sharp from "sharp";

export const server = {
    compressImage: defineAction({
        accept: 'form',
        input: z.object({
            file: z.instanceof(File),
            type: z.string().refine((val) => ['webp', 'avif']),
            quality: z.string(),
            width: z.string().optional()
        }),
        handler: async({file, type, quality, width}) => {

            const arrayBuffer = await file.arrayBuffer()
            let compressedImageBuffer: ArrayBuffer;
            if (type === 'webp') {
                compressedImageBuffer = width ? await sharp(arrayBuffer).resize(Number(width)).webp({quality: parseInt(quality)}).toBuffer() : await sharp(arrayBuffer).webp({quality: parseInt(quality)}).toBuffer();
            } else {
                compressedImageBuffer = width ? await sharp(arrayBuffer).resize(Number(width)).avif({quality: parseInt(quality)}).toBuffer() : await sharp(arrayBuffer).avif({quality: parseInt(quality)}).toBuffer();
            }

            return compressedImageBuffer
        }
    })
}

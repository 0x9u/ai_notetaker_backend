// todo! in main ensure a tmp folder is created
import ffmpeg from 'fluent-ffmpeg';
import fs, { existsSync, mkdirSync } from 'fs';
import path from 'path';

export async function extractAudio(file: Express.Multer.File): Promise<Buffer> {
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!existsSync(tmpDir)) {
        mkdirSync(tmpDir);
    }

    const filePath = path.join(tmpDir, file.originalname);
    const buffer = Buffer.from(await file.buffer);
    await fs.writeFile(filePath, buffer, (err) => {
        if (err) {
            throw err;
        }
    });

    const outputPath = path.join(
        tmpDir,
        file.originalname.replace(path.extname(file.originalname), '.mp3')
    );

    return new Promise((resolve, reject) => {
        ffmpeg(filePath)
            .noVideo()
            .audioCodec('libmp3lame')
            .on('end', async () => {
                try {
                    await fs.readFile(outputPath, async (err, data) => {
                        if (err) {
                            reject(err);
                        }
                        await fs.unlink(filePath, reject);
                        await fs.unlink(outputPath, reject);
                        resolve(data);
                    });

                } catch (err) {
                    reject(err);
                }
            })
            .on('error', reject)
            .save(outputPath);
    });
}

import { FileState, GoogleAIFileManager } from '@google/generative-ai/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const client = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
const fileManager = new GoogleAIFileManager(process.env.GOOGLE_GEMINI_API_KEY!);

export async function uploadFile(file: Express.Multer.File) {
    const fileBuffer = Buffer.from(await file.buffer);
    const uploadResult = await fileManager.uploadFile(fileBuffer, {
        displayName: file.originalname,
        mimeType: file.mimetype,
    });

    let uploadedFile;
    do {
        uploadedFile = await fileManager.getFile(uploadResult.file.name);
        await new Promise((resolve) => setTimeout(resolve, 1000));
    } while (uploadedFile.state === FileState.PROCESSING);

    if (uploadedFile.state === FileState.FAILED) {
        throw new Error('Failed to upload file for: ' + file.originalname);
    }

    return uploadResult.file.uri;
}

export default client;

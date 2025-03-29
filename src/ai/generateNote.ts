import Gemini from '@/helpers/gemini';
import Note from '@/types/note';
import { SchemaType } from '@google/generative-ai';

const model = Gemini.getGenerativeModel({
    model: process.env.GOOGLE_GEMINI_MODEL!,
    systemInstruction:
        'You must summarise the following files and/or transcript to help me understand it more. You are teaching me the notes! Format this summary in markdown.',
    generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
                content: {
                    type: SchemaType.STRING,
                },
                title: {
                    description:
                        'The title that is approprate for this summmary',
                    type: SchemaType.STRING,
                },
            },
            required: ['content', 'title'],
        },
    },
});

// Transcript if its a yt video

export type noteGenerateSchema =
    | {
          // data should be file uri
          data: string;
          type: 'file';
          mimeType: string;
      }
    | {
          data: string;
          type: 'transcript';
      };

// ! transcript should be raw text just pure information
export async function generateNote(data: noteGenerateSchema[]) {
    const {
        response: { text },
    } = await model.generateContent(
        data.map((item) => {
            if (item.type === 'file') {
                return {
                    fileData: {
                        fileUri: item.data,
                        mimeType: item.mimeType,
                    },
                };
            } else {
                return 'Transcript: ' + item.data;
            }
        })
    );

    const response = text();

    console.debug('Note Response: ', response);

    return JSON.parse(response) as Note;
}

import { SchemaType } from '@google/generative-ai';
import Gemini from '@/helpers/gemini';
import Transcript from '@/types/transcript';
import Summary from '@/types/summary';

const model = Gemini.getGenerativeModel({
    model: process.env.GOOGLE_GEMINI_MODEL!,
    systemInstruction:
        'Summarise the following transcript (given to you in json with start, end and text attributes in a array of objects). DO NOT PUT IT IN MARKDOWN.',
    generationConfig: {
        responseSchema: {
            type: SchemaType.ARRAY,
            items: {
                description:
                    'A summary for each object given to you that includes the attribute start, end, text',
                type: SchemaType.OBJECT,
                properties: {
                    start: {
                        type: SchemaType.NUMBER,
                    },
                    end: {
                        type: SchemaType.NUMBER,
                    },
                    content: {
                        type: SchemaType.STRING,
                    },
                    title: {
                        description: 'The title that is approprate for this summmary',
                        type: SchemaType.STRING,
                    }
                },
                required: ['start', 'end', 'content', 'title'],
            },
            minItems: 1,
        },
    },
});

export async function generateSummary(data: Transcript[]) : Promise<Summary[]> {
    const json = JSON.stringify(data);
    const {
        response: { text },
    } = await model.generateContent(json);

    const response = text();

    console.debug("Summary Response: ", response);
    
    return JSON.parse(response) as Summary[];
}

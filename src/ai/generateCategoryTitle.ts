import Gemini from '@/helpers/gemini';

const model = Gemini.getGenerativeModel({
    model: process.env.GOOGLE_GEMINI_MODEL!,
    systemInstruction:
        'Create a category title for the following summary',
});

export async function generateCategoryTitle(summary: string) {
    const { response: { text } } = await model.generateContent(summary);
    return text();
}


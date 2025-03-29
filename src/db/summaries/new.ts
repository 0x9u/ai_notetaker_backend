import { supabase } from "../supabase";

async function dbCreateSummary(content: string, title: string, start: number, end: number, fileId: number) {
    const { error } = await supabase
        .from('summaries')
        .insert({ content, title, start, end, file_id: fileId })
        .select('id')
        .single();
    
    if (error) {
        throw new Error("Failed to create summary in db: " + error.message);
    }
}

export default dbCreateSummary;

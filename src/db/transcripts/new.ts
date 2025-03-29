import { supabase } from "../supabase";

async function dbCreateTranscript(content: string, start: number, end: number, fileId: number) {
    const { error } = await supabase
        .from('transcripts')
        .insert({ content, start, end, file_id : fileId })
        .select('id')
        .single();
    
    if (error) {
        throw new Error("Failed to create transcript in db: " + error.message);
    }
}

export default dbCreateTranscript;

import { supabase } from "../supabase";

async function dbCreateNote(title: string, content: string, userId: string) {
    const { data, error } = await supabase
        .from('notes')
        .insert({ title, content, user_id: userId })
        .select('id')
        .single();
    
    if (error) {
        throw new Error("Failed to create note in db: " + error.message);
    }

    return data.id as number;
}

export default dbCreateNote;

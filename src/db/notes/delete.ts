import { supabase } from "../supabase";

async function dbDeleteNote(noteId: number) {
    const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);
    
    if (error) {
        throw new Error("Failed to delete note in db: " + error.message);
    }
}

export { dbDeleteNote };

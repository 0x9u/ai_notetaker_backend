import { supabase } from "../supabase";

async function dbDeleteFile(fileId: number) {
    const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);
    
    if (error) {
        throw new Error("Failed to delete file in db: " + error.message);
    }
}

export default dbDeleteFile;

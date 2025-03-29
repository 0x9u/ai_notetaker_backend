import { supabase } from "../supabase";

async function dbUploadFile(file: Express.Multer.File, noteId : number) {
    const fileBuffer = Buffer.from(await file.buffer);
    const randomHash = Math.random().toString(36).substring(2, 15);
    const name = randomHash + '-' + file.originalname;
    const { data, error } = await supabase.storage
        .from('files')
        .upload(name , fileBuffer, {
            upsert: false,
        });

    if (error) {
        throw new Error("Failed to upload file to supabase: " + error.message);
    }

    const { data: fileData, error: fileError } = await supabase
        .from('files')
        .insert({ path: data.path, note_id: noteId, name, mime_type: file.mimetype })
        .select('id')
        .single();
    
    if (fileError) {
        throw new Error("Failed to create file in db: " + fileError.message);
    }

    return fileData.id as number;
}

export default dbUploadFile;

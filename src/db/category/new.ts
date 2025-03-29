import { supabase } from '../supabase';

async function dbCreateCategory(title: string, userId: string) {
    const { data, error } = await supabase
        .from('categories')
        .insert({ title, user_id: userId })
        .select('id')
        .single();
    
    if (error) {
        throw new Error("Failed to create category in db: " + error.message);
    }

    return data.id as number;
}

export default dbCreateCategory;

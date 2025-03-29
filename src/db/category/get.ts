import { supabase } from "../supabase";

async function dbGetCategories(userId: string) {
    const { data, error } = await supabase.from('categories').select('*').eq('user_id', userId);
    if (error) {
        throw error;
    }

    // get all associated notes for each category
    const categoriesWithNotes = await Promise.all(data.map(async (category) => {
        const { data: notes, error: notesError } = await supabase
            .from('notes')
            .select('*')
            .eq('user_id', userId)
            .eq('category_id', category.id);

        if (notesError) {
            throw notesError;
        }

        return {
            ...category,
            notes,
        };
    }));

    return categoriesWithNotes;
}

export default dbGetCategories;

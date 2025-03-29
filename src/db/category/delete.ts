import { supabase } from "../supabase";

async function dbDeleteCategory(categoryId: number) {
    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);
    
    if (error) {
        throw new Error("Failed to delete category in db: " + error.message);
    }
}

export default dbDeleteCategory;

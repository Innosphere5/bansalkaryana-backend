const supabase = require('../supabase/supabaseClient');

async function checkCategories() {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*');
        
        if (error) {
            console.log('Categories table error (does it exist?):', error.message);
        } else {
            console.log('Categories table exists! Found:', data);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

checkCategories();

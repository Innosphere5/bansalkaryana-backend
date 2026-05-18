const supabase = require('../supabase/supabaseClient');

async function checkTable() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });
        
        if (error) {
            console.error('Error checking products table:', error);
        } else {
            console.log('Products table exists. Current count:', data);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

checkTable();

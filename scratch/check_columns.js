const supabase = require('../supabase/supabaseClient');

async function checkColumns() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .limit(1);
        
        if (error) {
            console.error('Error querying products:', error);
        } else {
            console.log('Successfully queried products table.');
            if (data.length > 0) {
                console.log('Columns:', Object.keys(data[0]));
            } else {
                console.log('Table is empty, cannot determine columns this way.');
            }
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

checkColumns();

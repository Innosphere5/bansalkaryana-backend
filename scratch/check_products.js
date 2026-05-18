const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

async function checkProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*');
    
    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Total Products:', data.length);
    data.forEach(p => {
        console.log(`- ${p.product_name}: Price=${p.price}, MRP=${p.mrp}, Stock=${p.stock_quantity}`);
    });
}

checkProducts();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

async function fixMrp() {
    console.log('Fixing MRP for existing products...');
    
    // Set some realistic MRPs for the existing products
    const updates = [
        { name: 'Wheel', mrp: 85 },
        { name: 'Surf excel', mrp: 75 },
        { name: 'Lux', mrp: 35 }
    ];

    for (const item of updates) {
        const { data, error } = await supabase
            .from('products')
            .update({ mrp: item.mrp })
            .ilike('product_name', `%${item.name}%`);
        
        if (error) {
            console.error(`Error updating ${item.name}:`, error);
        } else {
            console.log(`Updated ${item.name} with MRP: ${item.mrp}`);
        }
    }
}

fixMrp();

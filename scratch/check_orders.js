const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

async function checkOrders() {
    const { data: orders, error: err } = await supabase
        .from('orders')
        .select('*');
    
    if (err) {
        console.error('Error fetching orders:', err);
        return;
    }

    console.log('Total Orders:', orders.length);
    orders.forEach((o, index) => {
        console.log(`\nOrder #${index + 1} - ID: ${o.id}`);
        console.log(`- Customer: ${o.customer_name} (${o.customer_phone})`);
        console.log(`- Amount: ${o.total_amount}`);
        console.log(`- Status: ${o.status}`);
        console.log('- Items:');
        if (Array.isArray(o.items)) {
            o.items.forEach(item => {
                console.log(`  * ${item.product_name} (Qty: ${item.quantity}, Price: ${item.price}, ID: ${item.id || item.product_id || 'N/A'})`);
            });
        } else {
            console.log(`  * Raw items: ${JSON.stringify(o.items)}`);
        }
    });
}

checkOrders();

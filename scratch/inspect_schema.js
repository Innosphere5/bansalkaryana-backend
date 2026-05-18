const supabase = require('../supabase/supabaseClient');

async function inspectSchema() {
    try {
        const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/`, {
            headers: {
                'apikey': process.env.SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
            }
        });
        const data = await response.json();
        console.log('Raw REST response:', data);
    } catch (err) {
        console.error('Error fetching REST schema:', err);
    }
}

inspectSchema();

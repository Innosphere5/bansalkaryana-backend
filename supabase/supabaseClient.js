const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Key (SUPABASE_ANON_KEY or SUPABASE_KEY) are required in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

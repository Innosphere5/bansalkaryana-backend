const supabase = require('../supabase/supabaseClient');

// Get All Categories
exports.getAllCategories = async (req, res) => {
    try {

        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create Category
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: 'Category name is required' });
        }

        const { data, error } = await supabase
            .from('categories')
            .insert([{ name }])
            .select();

        if (error) throw error;

        res.status(201).json({ success: true, message: 'Category created successfully', data: data[0] });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

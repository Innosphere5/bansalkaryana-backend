const supabase = require('../supabase/supabaseClient');
const cloudinaryService = require('../services/cloudinaryService');

// Create Product
exports.createProduct = async (req, res) => {
    try {
        const { product_name, category, description, price, mrp, stock_quantity, unit } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Product image is required' });
        }

        // 1. Upload to Cloudinary
        const uploadResult = await cloudinaryService.uploadImage(req.file.buffer);
        
        // 2. Get Optimized URL
        const imageUrl = uploadResult.secure_url;
        const publicId = uploadResult.public_id;

        // 3. Save to Supabase
        const { data, error } = await supabase
            .from('products')
            .insert([
                {
                    product_name,
                    category,
                    description,
                    price: parseFloat(price),
                    mrp: parseFloat(mrp),
                    stock_quantity: parseInt(stock_quantity),
                    unit,
                    image_url: imageUrl,
                    cloudinary_public_id: publicId
                }
            ])
            .select();

        if (error) throw error;

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: data[0]
        });

    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message,
            details: error.details || error.hint || null
        });
    }
};

// Get All Products (with search, category filter, and pagination)
exports.getAllProducts = async (req, res) => {
    try {
        const { search, category, page = 1, limit = 10 } = req.query;
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const offset = (pageNum - 1) * limitNum;

        let query = supabase
            .from('products')
            .select('*', { count: 'exact' });

        if (search) {
            query = query.ilike('product_name', `%${search}%`);
        }

        if (category) {
            query = query.eq('category', category);
        }

        const { data, error, count } = await query
            .range(offset, offset + limitNum - 1)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Apply optimization to URLs if needed (optional, depends on if you want raw or transformed URLs from API)
        const productsWithOptimizedUrls = data.map(product => ({
            ...product,
            optimized_image_url: cloudinaryService.getOptimizedUrl(product.cloudinary_public_id)
        }));

        res.status(200).json({
            success: true,
            count,
            page: parseInt(page),
            totalPages: Math.ceil(count / limit),
            data: productsWithOptimizedUrls
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Product
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { product_name, category, description, price, mrp, stock_quantity, unit } = req.body;
        const updates = {};
        
        if (product_name) updates.product_name = product_name;
        if (category) updates.category = category;
        if (description) updates.description = description;
        if (price) updates.price = parseFloat(price);
        if (mrp) updates.mrp = parseFloat(mrp);
        if (stock_quantity) updates.stock_quantity = parseInt(stock_quantity);
        if (unit) updates.unit = unit;
        
        // Fetch current product to handle image replacement
        const { data: currentProduct, error: fetchError } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !currentProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (req.file) {
            // 1. Delete old image from Cloudinary
            if (currentProduct.cloudinary_public_id) {
                await cloudinaryService.deleteImage(currentProduct.cloudinary_public_id);
            }

            // 2. Upload new image
            const uploadResult = await cloudinaryService.uploadImage(req.file.buffer);
            updates.image_url = uploadResult.secure_url;
            updates.cloudinary_public_id = uploadResult.public_id;
        }

        // Update in Supabase
        const { data, error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: data[0]
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Get product details to delete image
        const { data: product, error: fetchError } = await supabase
            .from('products')
            .select('cloudinary_public_id')
            .eq('id', id)
            .single();

        if (fetchError || !product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // 2. Delete from Cloudinary
        if (product.cloudinary_public_id) {
            await cloudinaryService.deleteImage(product.cloudinary_public_id);
        }

        // 3. Delete from Supabase
        const { error: deleteError } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (deleteError) throw deleteError;

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

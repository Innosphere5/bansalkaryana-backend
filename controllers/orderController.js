const supabase = require('../supabase/supabaseClient');

exports.createOrder = async (req, res) => {
    try {
        const { customer_name, customer_address, customer_phone, total_amount, items } = req.body;

        if (!customer_name || !customer_address || !customer_phone || !items || items.length === 0) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (parseFloat(total_amount) < 500) {
            return res.status(400).json({ error: "Customer can't order less than ₹500" });
        }

        // 1. Insert order
        const { data, error } = await supabase
            .from('orders')
            .insert([
                {
                    customer_name,
                    customer_address,
                    customer_phone,
                    total_amount,
                    items,
                    status: 'pending'
                }
            ])
            .select();

        if (error) throw error;

        // 2. Decrement database stock for each item in the order
        for (const item of items) {
            const { data: prodData, error: prodErr } = await supabase
                .from('products')
                .select('stock_quantity')
                .eq('id', item.id)
                .single();

            if (!prodErr && prodData) {
                const currentStock = prodData.stock_quantity || 0;
                const newStock = Math.max(0, currentStock - item.quantity);

                await supabase
                    .from('products')
                    .update({ stock_quantity: newStock })
                    .eq('id', item.id);
            }
        }

        res.status(201).json({ message: 'Order placed successfully', order: data[0] });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Fetch current order to identify transitions
        const { data: orderData, error: orderErr } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single();

        if (orderErr) throw orderErr;

        const previousStatus = orderData.status;

        // Apply stock updates depending on transition
        if (status === 'cancelled' && previousStatus !== 'cancelled') {
            const items = orderData.items || [];
            for (const item of items) {
                const { data: prodData, error: prodErr } = await supabase
                    .from('products')
                    .select('stock_quantity')
                    .eq('id', item.id)
                    .single();

                if (!prodErr && prodData) {
                    const currentStock = prodData.stock_quantity || 0;
                    const newStock = currentStock + item.quantity;

                    await supabase
                        .from('products')
                        .update({ stock_quantity: newStock })
                        .eq('id', item.id);
                }
            }
        } else if (status !== 'cancelled' && previousStatus === 'cancelled') {
            const items = orderData.items || [];
            for (const item of items) {
                const { data: prodData, error: prodErr } = await supabase
                    .from('products')
                    .select('stock_quantity')
                    .eq('id', item.id)
                    .single();

                if (!prodErr && prodData) {
                    const currentStock = prodData.stock_quantity || 0;
                    const newStock = Math.max(0, currentStock - item.quantity);

                    await supabase
                        .from('products')
                        .update({ stock_quantity: newStock })
                        .eq('id', item.id);
                }
            }
        }

        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select();

        if (error) throw error;

        res.status(200).json({ message: 'Order status updated', order: data[0] });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: error.message });
    }
};

const userService = require('../service/service');  // Import user service

const getGroceries = async (req, res) => {
    try {
        const groceries = await userService.getAllGroceries();
        return res.status(200).json(groceries);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch groceries', message: err.message });
    }
};

const placeOrder = async (req, res) => {
    const { userId, items } = req.body;

    try {
        if (!userId || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Invalid order data' });
        }

        const order = await userService.placeOrder(userId, items);
        return res.status(201).json(order);
    } catch (err) {
        return res.status(500).json({ error: 'Failed to place order', message: err.message });
    }
};

// Export the controller functions
module.exports = {
    getGroceries,
    placeOrder,
};

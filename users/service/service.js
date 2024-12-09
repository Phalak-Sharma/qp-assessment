const mysqlLib = require('../../database/mysql');  // Assuming your mysqlLib.js is in the lib folder

let pool; 

async function initDB() {
    pool = await mysqlLib.initializeConnectionPool(); // Initialize the pool using config.js
}

// Initialize the database pool when the application starts
initDB().catch((err) => console.error('Failed to initialize DB pool', err));

const getAllGroceries = async () => {
    try {
        const query = 'SELECT id, name, description, price, stock FROM groceries WHERE stock > 0'; // Only get items with stock available
        const result = await mysqlLib.mysqlQueryPromise(pool, { api: 'getAllGroceries' }, 'Get All Groceries', query, []);
        return result;
    } catch (err) {
        throw new Error('Error fetching groceries: ' + err.message);
    }
};

const placeOrder = async (userId, items) => {
    try {
        if (!userId || !Array.isArray(items) || items.length === 0) {
            throw new Error('Invalid order data');
        }

        // Check if items are available in stock
        for (const item of items) {
            const checkStockQuery = 'SELECT stock FROM groceries WHERE id = ?';
            const checkStockParams = [item.id];
            const grocery = await mysqlLib.mysqlQueryPromise(pool, { api: 'placeOrder' }, 'Check Grocery Stock', checkStockQuery, checkStockParams);

            if (grocery.length === 0 || grocery[0].stock < item.quantity) {
                throw new Error(`Not enough stock for item: ${item.id}`);
            }
        }

        // Insert the order into the orders table
        const orderQuery = 'INSERT INTO orders (user_id, status, total_price) VALUES (?, ?, ?)';
        const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const orderParams = [userId, 'Pending', totalPrice];
        const result = await mysqlLib.mysqlQueryPromise(pool, { api: 'placeOrder' }, 'Insert Order', orderQuery, orderParams);

        const orderId = result.insertId; // The generated order ID

        // Insert order items into the order_items table
        const orderItemsPromises = items.map((item) => {
            const orderItemQuery = 'INSERT INTO order_items (order_id, grocery_id, quantity, price) VALUES (?, ?, ?, ?)';
            const orderItemParams = [orderId, item.id, item.quantity, item.price];
            return mysqlLib.mysqlQueryPromise(pool, { api: 'placeOrder' }, 'Insert Order Item', orderItemQuery, orderItemParams);
        });

        await Promise.all(orderItemsPromises); // Wait for all order items to be inserted

        // Update the stock for each grocery item in the order
        const updateStockPromises = items.map((item) => {
            const updateStockQuery = 'UPDATE groceries SET stock = stock - ? WHERE id = ?';
            const updateStockParams = [item.quantity, item.id];
            return mysqlLib.mysqlQueryPromise(pool, { api: 'placeOrder' }, 'Update Grocery Stock', updateStockQuery, updateStockParams);
        });

        await Promise.all(updateStockPromises); // Wait for stock updates

        // Return the placed order details
        return {
            orderId,
            userId,
            status: 'Pending',
            totalPrice,
            items,
        };
    } catch (err) {
        throw new Error('Error placing order: ' + err.message);
    }
};

// Export the service methods
module.exports = {
    getAllGroceries,
    placeOrder,
};

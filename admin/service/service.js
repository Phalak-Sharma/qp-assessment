const mysqlLib = require('../../database/mysql');  // Assuming your mysqlLib.js is in the lib folder

let pool; 

async function initDB() {
    pool = await mysqlLib.initializeConnectionPool(); // Initialize the pool
}

initDB().catch((err) => console.error('Failed to initialize DB pool', err));

const addGroceryItem = async ({ name, description, price, stock }) => {
    try {
        // Check if grocery item already exists
        const checkQuery = 'SELECT * FROM groceries WHERE name = ?';
        const checkParams = [name];
        const existingGrocery = await mysqlLib.mysqlQueryPromise(pool, { api: 'addGroceryItem' }, 'Check Grocery Existence', checkQuery, checkParams);

        if (existingGrocery.length > 0) {
            throw new Error('Grocery item already exists');
        }

        // Insert the new grocery item into the database
        const insertQuery = 'INSERT INTO groceries (name, description, price, stock) VALUES (?, ?, ?, ?)';
        const insertParams = [name, description, price, stock];
        const result = await mysqlLib.mysqlQueryPromise(pool, { api: 'addGroceryItem' }, 'Insert Grocery Item', insertQuery, insertParams);

        return {
            id: result.insertId, // The ID of the newly added grocery item
            name,
            description,
            price,
            stock,
        };
    } catch (err) {
        throw new Error('Error adding grocery item: ' + err.message);
    }
};

const getAllGroceries = async () => {
    try {
        const query = 'SELECT * FROM groceries';
        const result = await mysqlLib.mysqlQueryPromise(pool, { api: 'getAllGroceries' }, 'Get All Groceries', query, []);
        return result;
    } catch (err) {
        throw new Error('Error fetching groceries: ' + err.message);
    }
};

const updateGroceryItem = async (id, { name, description, price, stock }) => {
    try {
        // Check if the grocery item exists
        const checkQuery = 'SELECT * FROM groceries WHERE id = ?';
        const checkParams = [id];
        const grocery = await mysqlLib.mysqlQueryPromise(pool, { api: 'updateGroceryItem' }, 'Check Grocery Existence', checkQuery, checkParams);

        if (grocery.length === 0) {
            throw new Error('Grocery item not found');
        }

        // Update the grocery item
        const updateQuery = 'UPDATE groceries SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?';
        const updateParams = [name || grocery[0].name, description || grocery[0].description, price || grocery[0].price, stock !== undefined ? stock : grocery[0].stock, id];
        await mysqlLib.mysqlQueryPromise(pool, { api: 'updateGroceryItem' }, 'Update Grocery Item', updateQuery, updateParams);

        // Return the updated grocery item
        return {
            id,
            name: name || grocery[0].name,
            description: description || grocery[0].description,
            price: price || grocery[0].price,
            stock: stock !== undefined ? stock : grocery[0].stock,
        };
    } catch (err) {
        throw new Error('Error updating grocery item: ' + err.message);
    }
};

const removeGroceryItem = async (id) => {
    try {
        // Check if the grocery item exists
        const checkQuery = 'SELECT * FROM groceries WHERE id = ?';
        const checkParams = [id];
        const grocery = await mysqlLib.mysqlQueryPromise(pool, { api: 'removeGroceryItem' }, 'Check Grocery Existence', checkQuery, checkParams);

        if (grocery.length === 0) {
            return null; // Return null if not found
        }

        // Remove the grocery item
        const deleteQuery = 'DELETE FROM groceries WHERE id = ?';
        await mysqlLib.mysqlQueryPromise(pool, { api: 'removeGroceryItem' }, 'Delete Grocery Item', deleteQuery, [id]);

        return grocery[0]; // Return the removed grocery item
    } catch (err) {
        throw new Error('Error removing grocery item: ' + err.message);
    }
};

const updateInventory = async (id, stock) => {
    try {
        // Check if the grocery item exists
        const checkQuery = 'SELECT * FROM groceries WHERE id = ?';
        const checkParams = [id];
        const grocery = await mysqlLib.mysqlQueryPromise(pool, { api: 'updateInventory' }, 'Check Grocery Existence', checkQuery, checkParams);

        if (grocery.length === 0) {
            return null; // Return null if not found
        }

        // Update the inventory (stock)
        const updateQuery = 'UPDATE groceries SET stock = ? WHERE id = ?';
        await mysqlLib.mysqlQueryPromise(pool, { api: 'updateInventory' }, 'Update Inventory', updateQuery, [stock, id]);

        // Return the updated grocery item
        return {
            id,
            name: grocery[0].name,
            stock,
        };
    } catch (err) {
        throw new Error('Error updating inventory: ' + err.message);
    }
};

// Export all service methods
module.exports = {
    addGroceryItem,
    getAllGroceries,
    updateGroceryItem,
    removeGroceryItem,
    updateInventory,
};

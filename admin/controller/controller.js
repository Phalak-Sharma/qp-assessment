const adminService = require('../service/service'); // Import the admin service

// Controller to add a new grocery item
const addGroceryItem = async (req, res) => {
  const { name, description, price, stock } = req.body;

  try {
    // Call service method to add the grocery item
    const newGrocery = await adminService.addGroceryItem({ name, description, price, stock });

    res.status(201).json({
      message: 'Grocery item added successfully',
      grocery: newGrocery,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Controller to view all grocery items
const viewGroceries = async (req, res) => {
  try {
    // Call service method to get all groceries
    const groceries = await adminService.getAllGroceries();
    res.status(200).json(groceries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Controller to update a grocery item
const updateGroceryItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock } = req.body;

  try {
    // Call service method to update the grocery item
    const updatedGrocery = await adminService.updateGroceryItem(id, { name, description, price, stock });

    if (!updatedGrocery) {
      return res.status(404).json({ message: `Grocery item with ID ${id} not found` });
    }

    res.status(200).json({
      message: 'Grocery item updated successfully',
      grocery: updatedGrocery,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Controller to remove a grocery item
const removeGroceryItem = async (req, res) => {
  const { id } = req.params;

  try {
    // Call service method to remove the grocery item
    const deletedGrocery = await adminService.removeGroceryItem(id);

    if (!deletedGrocery) {
      return res.status(404).json({ message: `Grocery item with ID ${id} not found` });
    }

    res.status(200).json({
      message: `Grocery item with ID ${id} removed successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Controller to update inventory for a grocery item
const updateInventory = async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  try {
    // Call service method to update the inventory
    const updatedInventory = await adminService.updateInventory(id, stock);

    if (!updatedInventory) {
      return res.status(404).json({ message: `Grocery item with ID ${id} not found` });
    }

    res.status(200).json({
      message: 'Inventory updated successfully',
      grocery: updatedInventory,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  addGroceryItem,
  viewGroceries,
  updateGroceryItem,
  removeGroceryItem,
  updateInventory,
};

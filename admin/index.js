const adminValidator = require('./validator/validator');
const adminController = require('./controller/controller');
const validate = (schema) => async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (err) {
      const errors = err.details.map(e => e.message);
      return res.status(400).json({ errors });
    }
};

// Middleware to validate the 'id' parameter in the URL
const validateId = async (req, res, next) => {
    try {
      // Validate the path parameter 'id'
      await adminValidator.idValidatorSchema.validateAsync(req.params, { abortEarly: false });
      next();  // If validation is successful, move to the next middleware
    } catch (err) {
      // If validation fails, collect all the error messages
      const errors = err.details.map(e => e.message);
      
      // Return a 400 Bad Request response with all the error messages
      return res.status(400).json({ errors });
    }
};

app.get('/admin/groceries', validate(adminValidator.viewGroceries), adminController.viewGroceries);
app.put('/groceries/:id', validateId, validate(adminValidator.updateGroceryItemSchema), adminController.updateGroceryItem);
app.delete('/groceries/:id', validateId, validate(adminValidator.idValidatorSchema), adminController.removeGroceryItem);
app.patch('/groceries/:id/inventory', validateId, validate(adminValidator.updateInventorySchema), adminController.updateInventory);
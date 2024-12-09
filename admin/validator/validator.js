// validators/adminValidators.js
const Joi = require('joi');

// Schema for adding a new grocery item
const addGroceryItemSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Name should be a string',
    'string.empty': 'Name is required',
    'any.required': 'Name is required',
  }),
  description: Joi.string().optional(),
  price: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Price should be a number',
    'number.positive': 'Price should be a positive number',
    'number.precision': 'Price should have at most two decimal places',
    'any.required': 'Price is required',
  }),
  stock: Joi.number().integer().min(0).required().messages({
    'number.base': 'Stock should be a number',
    'number.integer': 'Stock should be an integer',
    'number.min': 'Stock cannot be negative',
    'any.required': 'Stock is required',
  }),
});

// Schema for updating a grocery item
const updateGroceryItemSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  price: Joi.number().positive().precision(2).optional(),
  stock: Joi.number().integer().min(0).optional(),
}).min(1);  // Ensure at least one field is being updated

// Schema for updating inventory
const updateInventorySchema = Joi.object({
  stock: Joi.number().integer().min(0).required().messages({
    'number.base': 'Stock should be a number',
    'number.integer': 'Stock should be an integer',
    'number.min': 'Stock cannot be negative',
    'any.required': 'Stock is required',
  }),
});

// Schema for validating grocery item ID
const idValidatorSchema = Joi.object({
  id: Joi.number().integer().required().messages({
    'number.base': 'ID should be a number',
    'number.integer': 'ID should be an integer',
    'any.required': 'ID is required',
  }),
});

module.exports = {
  addGroceryItemSchema,
  updateGroceryItemSchema,
  updateInventorySchema,
  idValidatorSchema,
};

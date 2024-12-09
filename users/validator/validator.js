const Joi = require('joi');

// Schema for placing an order
const placeOrderSchema = Joi.object({
  userId: Joi.number().integer().required().messages({
    'number.base': 'User ID should be a number',
    'any.required': 'User ID is required',
  }),
  items: Joi.array().items(
    Joi.object({
      groceryId: Joi.number().integer().required().messages({
        'number.base': 'Grocery ID should be a number',
        'any.required': 'Grocery ID is required',
      }),
      quantity: Joi.number().integer().min(1).required().messages({
        'number.base': 'Quantity should be a number',
        'number.min': 'Quantity must be at least 1',
        'any.required': 'Quantity is required',
      }),
    })
  ).required().messages({
    'array.base': 'Items should be an array of grocery items',
    'any.required': 'Items are required'
  })
});

module.exports = {
  placeOrderSchema,
};

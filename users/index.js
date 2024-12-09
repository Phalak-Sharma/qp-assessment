const userValidator = require('./validator/validator');
const userController = require('./controller/controller');

const validate = (schema) => async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (err) {
      const errors = err.details.map(e => e.message);
      return res.status(400).json({ errors });
    }
};

app.get('/user/groceries', userController.getGroceries);
app.post('/orders', validate(userValidator.placeOrderSchema), userController.placeOrder);

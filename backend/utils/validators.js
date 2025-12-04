const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const createBookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  description: Joi.string().allow(""),
  category: Joi.string().required(),
  isbn: Joi.string().allow(""),
  stock: Joi.number().min(0).required(),
  coverImageUrl: Joi.string().allow(""),
});

const updateBookSchema = Joi.object({
  title: Joi.string(),
  author: Joi.string(),
  description: Joi.string().allow(""),
  category: Joi.string(),
  isbn: Joi.string().allow(""),
  stock: Joi.number().min(0),
  coverImageUrl: Joi.string().allow(""),
});

const validateRequest = (schema, data, options = {}) => {
  // default options: don't abort early; allow caller to pass stripUnknown or allowUnknown
  const validateOptions = Object.assign({ abortEarly: false }, options);
  const { error, value } = schema.validate(data, validateOptions);
  if (error) {
    const details = error.details.map((d) => ({
      field: d.path.join("."),
      message: d.message,
    }));
    return { valid: false, errors: details };
  }
  return { valid: true, data: value };
};

module.exports = {
  registerSchema,
  loginSchema,
  createBookSchema,
  updateBookSchema,
  validateRequest,
};

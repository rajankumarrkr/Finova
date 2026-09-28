import { ApiResponse } from '../utils/apiResponse.js';

export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    if (parsed.body) req.body = parsed.body;
    next();
  } catch (error) {
    const formattedErrors = error.errors ? error.errors.map(err => ({
      field: err.path.join('.').replace(/^(body|query|params)\./, ''),
      message: err.message
    })) : error.message;

    return ApiResponse.error(res, 'Validation failed', 'VALIDATION_ERROR', 400, formattedErrors);
  }
};

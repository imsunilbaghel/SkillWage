export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const parsedBody = schema.parse(req.body);
      req.body = parsedBody;
      next();
    } catch (error) {
      if (error && error.errors && Array.isArray(error.errors)) {
        const errors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(422).json({
          success: false,
          message: errors[0]?.message || "Validation failed",
          errors: errors,
        });
      }
      next(error);
    }
  };
};

const validate = (rules) => {
  return (req, res, next) => {
    const errors = {};

    rules.forEach((rule) => {
      const { field, label, type, min, max, matches, custom } = rule;
      const value = req.body[field];

      // Required check
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors[field] = `${label || field} is required`;
        return;
      }

      if (value !== undefined && value !== null && value !== '') {
        // Email check
        if (type === 'email') {
          const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          if (!emailRegex.test(value)) {
            errors[field] = 'Please provide a valid email address';
          }
        }

        // Min length check
        if (min && String(value).length < min) {
          errors[field] = `${label || field} must be at least ${min} characters`;
        }

        // Max length check
        if (max && String(value).length > max) {
          errors[field] = `${label || field} cannot exceed ${max} characters`;
        }

        // Phone check
        if (type === 'phone') {
          const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
          if (!phoneRegex.test(value)) {
            errors[field] = 'Please provide a valid phone number';
          }
        }

        // Regex check
        if (matches && !matches.test(value)) {
          errors[field] = `${label || field} format is invalid`;
        }

        // Custom check function
        if (custom && typeof custom === 'function') {
          const customError = custom(value, req.body);
          if (customError) {
            errors[field] = customError;
          }
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  };
};

module.exports = validate;

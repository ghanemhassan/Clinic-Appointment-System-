/**
 * Middleware factory to restrict access based on user roles.
 * @param  {...string} roles - Allowed roles (e.g., 'patient', 'doctor', 'manager')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This action is restricted to: ${roles.join(', ')}.`,
      });
    }

    next();
  };
};

module.exports = authorize;

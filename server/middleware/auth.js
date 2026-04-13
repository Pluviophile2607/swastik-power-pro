const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify Token
exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

// Grant access to specific roles and optional granular permissions for Managers
exports.authorize = (roles, permission = null) => {
  return (req, res, next) => {
    // If the user's role is not in the allowed roles, reject
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `User role ${req.user.role} is not authorized to access this route` 
      });
    }

    // Special check for Manager role if a specific permission is required
    if (req.user.role === 'Manager' && permission) {
      if (!req.user.managerPermissions || !req.user.managerPermissions[permission]) {
        return res.status(403).json({ 
          success: false, 
          message: `Manager does not have '${permission}' permission for this operation` 
        });
      }
    }

    next();
  };
};

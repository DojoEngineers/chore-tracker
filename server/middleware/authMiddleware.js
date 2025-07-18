import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer <token>)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Optionally: fall back to cookie-based token (for browser-based clients)
  else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // If no token found, deny access
  if (!token) {
    return res.status(401).json('Not Authorized, no token provided');
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user associated with the token
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json('User not found');
    }

    // Attach the user to the request for use in route handlers
    req.user = user;

    next(); // Move to the next middleware or route
  } catch (error) {
    console.error(error);
    return res.status(401).json('Not Authorized, token failed');
  }
};


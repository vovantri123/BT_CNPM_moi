require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const white_lists = [
    '/',
    '/login',
    '/register',
    '/products',
    '/categories',
    '/products/sync',
    '/products/search',
  ];

  // Lấy pathname từ URL, bỏ qua query parameters
  const pathname = req.path || req.url.split('?')[0];

  console.log(`>>> Auth check: ${pathname}`);

  // So sánh trực tiếp với pathname (đã bao gồm /v1/api)
  if (white_lists.includes(pathname)) {
    console.log(`>>> Allowed path: ${pathname}`);
    next();
  } else {
    console.log(`>>> Auth required for: ${pathname}`);
    if (req?.headers?.authorization?.split(' ')?.[1]) {
      // Bearer token
      const token = req.headers.authorization.split(' ')[1];
      //verify token
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
          email: decoded.email,
          name: decoded.name,
          createdBy: 'Van Tri',
        };
        console.log('>>> check token: ', decoded);
        next();
      } catch (error) {
        return res.status(401).json({
          message: 'Token is invalid or has expired',
        });
      }
    } else {
      return res.status(401).json({
        message: 'You are not authenticated',
      });
    }
  }
};

module.exports = auth;

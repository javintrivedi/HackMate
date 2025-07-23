import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
  console.log(' Checking token...');
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized, token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(' Token valid:', decoded);
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token invalid or expired' });
  }
};

export default isAuthenticated;

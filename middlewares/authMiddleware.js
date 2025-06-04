import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {

  const superUser = req.headers['spuser-key'];
  if (superUser && superUser === process.env.SUPERUSER_SECRET) {
    req.user = { role: 'superuser'};
    return next();
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid Token' });
  }
};

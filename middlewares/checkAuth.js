import jwt from 'jsonwebtoken';
import User from '../model/User.js';

const checkAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];

    const decoded = jwt.decode(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select(
      '-password -confirmed -token -updatedAt -createdAt -__v'
    );

    return next();
  } else {
    const error = new Error('Token not valid');
    return res.status(401).json({ msg: error.message });
  }

  next();
};

export default checkAuth;

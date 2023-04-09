import generateID from '../helpers/generateID.js';
import generateJWT from '../helpers/generateJWT.js';
import User from '../model/User.js';

const registerUser = async (req, res) => {
  try {
    const { email } = req.body;

    const registerUser = await User.findOne({ email });

    if (registerUser) {
      const error = new Error('User already registered');
      return res.status(400).json({ msg: error.message });
    }

    const user = new User(req.body);
    user.token = generateID();
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    //test user exist
    if (!user) {
      const error = new Error('User not found');
      return res.status(404).json({ msg: error.message });
    }

    //test isConfirmed
    if (!user.confirmed) {
      const error = new Error('User is not confirmed');
      return res.status(403).json({ msg: error.message });
    }
    if (await user.verifyPassword(password)) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateJWT(user._id),
      });
    } else {
      const error = new Error('Incorrect credentials');
      return res.status(403).json({ msg: error.message });
    }
  } catch (error) {
    console.log(error);
  }
};

const confirmToken = async (req, res) => {
  const { token } = req.params;
  console.log(token);

  try {
    const userToConfirm = await User.findOne({ token });

    if (!userToConfirm) {
      const error = new Error('Token not valid');
      return res.status(403).json({ msg: error.message });
    }

    userToConfirm.confirmed = true;
    userToConfirm.token = '';
    await userToConfirm.save();
    return res.status(200).json({
      msg: 'User confirmed successfully',
    });
  } catch (error) {
    console.log(error);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    //test user exist
    if (!user) {
      const error = new Error('User not found');
      return res.status(404).json({ msg: error.message });
    }

    user.token = generateID();
    await user.save();
    return res.status(200).json({
      msg: 'We sent an email with the instructions to reset your password',
    });
  } catch (error) {
    console.log(error);
  }
};

const verifyToken = async (req, res) => {
  const { token } = req.params;

  try {
    const tokenToConfirm = await User.findOne({ token });

    if (!tokenToConfirm) {
      const error = new Error('Token not valid');
      return res.status(404).json({ msg: error.message });
    } else {
      return res.status(200).json({
        msg: 'User and token valid',
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const saveNewPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      const error = new Error('Token not valid');
      return res.status(404).json({ msg: error.message });
    } else {
      user.password = password;
      user.token = '';
      await user.save();
      return res.status(200).json({
        msg: 'Password restored successfully',
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getProfile = async (req, res) => {
  console.log(req.user)
};

export {
  registerUser,
  loginUser,
  confirmToken,
  resetPassword,
  verifyToken,
  saveNewPassword,
  getProfile,
};

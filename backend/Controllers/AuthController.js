import UserModel from "../Modules/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: 'User already exists. Please login.',
        success: false
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ name, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({
      message: "Signup successful",
      success: true
    });

  } catch (error) {
    res.status(500).json({
      message: "Error in signup",
      success: false,
      error: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: 'User not found. Please register.',
        success: false
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials',
        success: false
      });
    }

    const jwtToken = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Login successful',
      success: true,
      token: jwtToken,
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error in login',
      success: false,
      error: error.message
    });
  }
};

export { signup, login };
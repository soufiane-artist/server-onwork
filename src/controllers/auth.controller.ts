import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

// Generate JWT Token
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  role : string;
}

interface LoginBody {
  email: string;
  password: string;
}

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register: AsyncHandler = async (req, res) => {
  
  try {
    const { name, email, password, role } = req.body as RegisterBody;

    // Check if user exists
    const userExists: IUser | null = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user: IUser = await User.create({
      name,
      email,
      password,
      role: role || 'user',
    });

    if (user) {
      return res.status(201).json({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString()),
        role: user.role
      });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login: AsyncHandler = async (req, res) => {
  try {
    const { email, password } = req.body as LoginBody;

    // Check for user email
    const user: IUser | null = await User.findOne({ email }).select('+password');
    
    if (user && (await user.comparePassword(password))) {
      return res.json({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString()),
        role: user.role
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

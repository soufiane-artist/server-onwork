// user controller
import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/user.model';

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

interface UserBody {
  name: string;
  email: string;
  password: string;
  role: string;
}

// @desc    Get all users
// @route   GET /api/users
// @access  Private
export const getUsers: AsyncHandler = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById: AsyncHandler = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
export const updateUser: AsyncHandler = async (req, res) => {
  

  try {
    const { name,  role } = req.body as UserBody;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.role = role || user.role;

    const updatedUser = await user.save();
    return res.json({
      _id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
export const deleteUser: AsyncHandler = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    return res.json({ message: 'User removed' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

import User, { IUser } from '../models/user.model';

export class UserService {
  // Get user by ID
  static async getUserById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  // Update user
  static async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }

  // Delete user
  static async deleteUser(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id);
    return result !== null;
  }

  // Get all users (with pagination)
  static async getUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const users = await User.find().skip(skip).limit(limit);
    const total = await User.countDocuments();
    
    return {
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total
    };
  }
}

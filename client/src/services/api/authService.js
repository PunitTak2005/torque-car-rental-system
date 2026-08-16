import { loginUser, registerUser, forgotPassword, resetPassword, getMe, updateProfile } from '../api';

export const authService = {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile
};

export default authService;

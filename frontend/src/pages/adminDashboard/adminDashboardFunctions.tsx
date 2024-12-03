import axiosInstance from '../../config/axiosConfig';

export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    bio?: string;
    profilePicture?: string;
    createdAt: Date;
    updatedAt: Date;
    isBlocked?: boolean;
    isAdmin: boolean;
    isActive: boolean;
}


export const fetchUsers = async (): Promise<User[]> => {
    try {
      const response = await axiosInstance.get('/users');
      console.log(response.data);
      return response.data; // Ensure an array is returned
    } catch (error) {
      console.error('Error fetching users:', error);
      return []; // Return an empty array on failure
    }
  };

export const handleBlockUser = async (userId: string): Promise<string> => {
  try {
    await axiosInstance.put(`/user/${userId}/block`);
    return 'User blocked successfully';
  } catch (error) {
    return 'Error blocking user';
  }
};

export const handleUnblockUser = async (userId: string): Promise<string> => {
  try {
    await axiosInstance.put(`/user/${userId}/unblock`);
    return 'User unblocked successfully';
  } catch (error) {
    return 'Error unblocking user';
  }
};

export const changeUserRole = async (userId: string, isAdmin: boolean): Promise<string> => {
    try {
      // Send isAdmin (true/false) to the backend to update the user's role
      await axiosInstance.put(`/user/${userId}/role`, { isAdmin });
      return 'User role updated successfully';
    } catch (error) {
      return 'Error changing role';
    }
  };
export const handleChangePassword = async (userId: string, newPassword: string): Promise<string> => {
  try {
    await axiosInstance.put(`/user/${userId}/password`, { password: newPassword });
    return 'Password changed successfully';
  } catch (error) {
    return 'Error changing password';
  }
};
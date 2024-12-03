import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  fetchUsers,
  handleBlockUser,
  handleUnblockUser,
  handleChangePassword,
  changeUserRole,
} from './adminDashboardFunctions';

const AdminDashboard: React.FC = () => {
  const [message, setMessage] = useState('');
  const [passwordInput, setPasswordInput] = useState({ userId: '', newPassword: '' });

  const { data: users, error, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const blockUser = async (userId: string) => {
    const result = await handleBlockUser(userId);
    setMessage(result);
    refetch();
  };

  const unblockUser = async (userId: string) => {
    const result = await handleUnblockUser(userId);
    setMessage(result);
    refetch();
  };

  const changePassword = async () => {
    const { userId, newPassword } = passwordInput;
    if (!userId || !newPassword) {
      setMessage('Please provide both User ID and a new password.');
      return;
    }
    const result = await handleChangePassword(userId, newPassword);
    setMessage(result);
    setPasswordInput({ userId: '', newPassword: '' });
  };

  const changeRole = async (userId: string, isAdmin: boolean) => {
    const result = await changeUserRole(userId, !isAdmin); // Toggle role to make them Admin or User
    setMessage(result);
    refetch();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading users</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 text-black">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-4xl w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>

        {message && (
          <div className="mb-6 text-center text-sm text-gray-700">
            {message}
          </div>
        )}

        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Username</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Role</th> {/* New column for Role */}
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {/* Display "Admin" if user is an admin, otherwise "User" */}
                  {user.isAdmin ? 'Admin' : 'User'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.isBlocked ? 'Blocked' : 'Active'}
                </td>
                <td className="border border-gray-300 px-4 py-2 flex flex-col items-center space-y-4">
                  <div className="flex flex-col items-center space-y-2">
                    {/* Block/Unblock buttons */}
                    {user.isBlocked ? (
                      <button
                        onClick={() => unblockUser(user.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600"
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        onClick={() => blockUser(user.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600"
                      >
                        Block
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col items-center space-y-2 mt-2">
                    {/* Password change */}
                    <input
                      type="password"
                      placeholder="New Password"
                      className="px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={user.id === passwordInput.userId ? passwordInput.newPassword : ''}
                      onChange={(e) =>
                        setPasswordInput({ userId: user.id, newPassword: e.target.value })
                      }
                    />
                    <button
                      onClick={changePassword}
                      className="ml-2 bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600"
                    >
                      Change Password
                    </button>
                  </div>

                  <div className="flex flex-col items-center space-y-2 mt-2">
                    {/* Make Admin / Remove Admin button */}
                    <button
                      onClick={() => changeRole(user.id, user.isAdmin)}
                      className={`${
                        user.isAdmin ? 'bg-red-500' : 'bg-yellow-500'
                      } text-white px-4 py-2 rounded shadow-md hover:${
                        user.isAdmin ? 'bg-red-600' : 'bg-yellow-600'
                      }`}
                    >
                      {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

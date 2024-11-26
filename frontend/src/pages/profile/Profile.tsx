import React, { useEffect, useState } from 'react';
import { fetchUserById, User } from '../../services/userService';

const Profile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetchUserById(userId)
                .then((data) => {
                    setUser(data);
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err.response?.data?.message || err.message);
                    setLoading(false);
                });
        } else {
            setError('User ID not found in localStorage');
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center text-black">Profile</h2>
            {user && (
                <>
                    <p className="text-gray-800"><strong>Username:</strong> {user.username}</p>
                    <p className="text-gray-800"><strong>Email:</strong> {user.email}</p>
                    {user.bio && <p className="text-gray-800"><strong>Bio:</strong> {user.bio}</p>}
                    {user.profilePicture && (
                        <div className="mt-4">
                            <img src={user.profilePicture} alt="Profile" className="rounded-full w-32 h-32 mx-auto" />
                        </div>
                    )}
                    <p className="text-gray-800"><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                    <p className="text-gray-800"><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
                </>
            )}
        </div>
    );
};

export default Profile;
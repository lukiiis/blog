import React, { useEffect, useState } from 'react';
import { fetchUserById, User } from '../../services/userService';
import { fetchPostsByAuthorId, Post } from '../../services/postService';
import { Link, useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const isAdmin = localStorage.getItem("isAdmin");

        if (!token || isAdmin !== "false") {
            navigate("/");
        }
    }, [navigate]);

    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            Promise.all([fetchUserById(userId), fetchPostsByAuthorId(userId)])
                .then(([userData, userPosts]) => {
                    setUser(userData);
                    setPosts(userPosts);
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
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mx-auto my-7">
            <h2 className="text-2xl font-bold mb-4 text-center text-black">Profile</h2>
            {user && (
                <>
                    <p className="text-gray-800"><strong>Username:</strong> {user.username}</p>
                    <p className="text-gray-800"><strong>Email:</strong> {user.email}</p>
                    {user.bio && <p className="text-gray-800"><strong>Bio:</strong> {user.bio}</p>}
                    {user.profilePicture !== null && (
                        <div className="mt-4">
                            <img src={user.profilePicture} alt="Profile" className="rounded-full w-32 h-32 mx-auto" />
                        </div>
                    )}
                    <p className="text-gray-800"><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
                    <p className="text-gray-800"><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
                </>
            )}
            <h3 className="text-xl font-bold mt-6 mb-4 text-black">Your Posts</h3>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <article key={post.id} className="p-4 bg-gray-50 rounded-lg shadow-sm mb-4">
                        <h3 className="text-xl font-semibold text-black">
                            <Link to={`/post/${post.id}`}>{post.title}</Link>
                        </h3>
                        <p className="text-gray-700 break-words">{post.content}</p>
                    </article>
                ))
            ) : (
                <p className="text-gray-800">No posts available</p>
            )}
        </div>
    );
};

export default Profile;
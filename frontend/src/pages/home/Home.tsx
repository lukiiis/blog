import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPosts, Post } from '../../services/postService';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    const { data: posts, error, isLoading } = useQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading posts</div>;
    }

    return (
        <section className="bg-white p-6 rounded-lg shadow-md w-full mx-auto max-w-2xl">
            <h2 className="text-black text-2xl font-bold mb-4 text-center">Latest Posts</h2>
            <div className="space-y-4">
                {posts?.map((post: Post) => (
                    <article key={post.id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold text-black">
                            <Link to={`/post/${post.id}`}>{post.title}</Link>
                        </h3>
                        <p className="text-gray-700">{post.content}</p>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default Home;
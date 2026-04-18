import React, { useEffect, useState } from "react";
import { Query } from "appwrite";
import { Container, PostCard } from "../component";
import appwriteService from "../appwrite/db";

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        appwriteService
            .getPosts([Query.equal("status", "active")])
            .then((response) => {
                if (response) {
                    const safePosts = Array.isArray(response.documents)
                        ? response.documents
                        : Array.isArray(response.rows)
                            ? response.rows
                            : [];
                    setPosts(safePosts);
                }
            })
            .catch((fetchError) => {
                if (fetchError?.code === 401 || fetchError?.status === 401) {
                    setError("Please log in to view posts.");
                    return;
                }

                setError(fetchError?.message || "Failed to load posts.");
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <h2 className="text-center text-lg font-semibold text-slate-700">Loading posts...</h2>;
    }

    if (error) {
        return (
            <Container>
                <div className="glass-card w-full rounded-2xl py-16 text-center text-red-600">{error}</div>
            </Container>
        );
    }

    if (posts.length === 0) {
        return (
            <Container>
                <div className="glass-card w-full rounded-2xl py-16 text-center text-slate-600">No posts yet. Create your first post.</div>
            </Container>
        );
    }

    return (
        <div className="w-full py-8">
            <Container>
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900">Latest Stories</h1>
                    <p className="mt-1 text-slate-600">Thoughtful writing from your workspace.</p>
                </div>
                <div className="flex flex-wrap gap-y-2">
                    {posts.map((post) => (
                        <div key={post.$id} className="p-2 w-full sm:w-1/2 lg:w-1/3">
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default Home;
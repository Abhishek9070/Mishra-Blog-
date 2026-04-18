import React, { useEffect, useState } from "react";
import { Container, PostCard } from "../component";
import appwriteService from "../appwrite/db";

function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        appwriteService.getPosts().then((response) => {
            if (response) {
                const safePosts = Array.isArray(response.documents)
                    ? response.documents
                    : Array.isArray(response.rows)
                        ? response.rows
                        : [];
                setPosts(safePosts);
            }
        }).catch((fetchError) => {
            if (fetchError?.code === 401 || fetchError?.status === 401) {
                setError("You are not authorized to view posts. Please log in again.");
                return;
            }

            setError(fetchError?.message || "Failed to load posts.");
        });
    }, []);

    if (error) {
        return (
            <div className="w-full py-8">
                <Container>
                    <div className="glass-card rounded-2xl p-8 text-center text-red-600">{error}</div>
                </Container>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="w-full py-8">
                <Container>
                    <div className="glass-card rounded-2xl p-10 text-center text-slate-600">No posts available right now.</div>
                </Container>
            </div>
        );
    }

  return (
    <div className="w-full py-8">
        <Container>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900">All Posts</h1>
                <p className="mt-1 text-slate-600">Browse and manage published content.</p>
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

export default AllPosts;
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, PostForm } from "../component";
import appwriteService from "../appwrite/db";

function EditPost() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { slug } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!slug) {
            navigate("/");
            return;
        }

        appwriteService
            .getPost(slug)
            .then((response) => {
                if (response) {
                    setPost(response);
                } else {
                    navigate("/");
                }
            })
            .finally(() => setLoading(false));
    }, [slug, navigate]);

    if (loading) {
        return <h2 className="text-center text-lg font-semibold text-slate-700">Loading post...</h2>;
    }

    if (!post) {
        return null;
    }

    return (
        <div className="py-8">
            <Container>
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900">Edit Post</h1>
                    <p className="mt-1 text-slate-600">Refine your article before publishing changes.</p>
                </div>
                <PostForm post={post} />
            </Container>
        </div>
    );
}

export default EditPost;

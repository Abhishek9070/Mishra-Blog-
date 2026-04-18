import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/db";
import { Button, Container } from "../component";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const [imageFailed, setImageFailed] = useState(false);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
    };

    const imageUrl = appwriteService.getFilePreview(post?.featuredImage);

    return post ? (
        <div className="py-8">
            <Container>
                <article className="glass-card overflow-hidden rounded-2xl p-3 sm:p-4">
                <div className="relative mb-5 w-full">
                    {!imageFailed && imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={post.title}
                            className="max-h-[520px] w-full rounded-xl object-cover"
                            onError={() => setImageFailed(true)}
                        />
                    ) : (
                        <div className="grid h-72 w-full place-items-center rounded-xl bg-slate-100 text-slate-500">
                            Featured image not available
                        </div>
                    )}

                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-gradient-to-r from-emerald-500 to-teal-700" className="mr-3">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-gradient-to-r from-rose-500 to-red-600" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="mb-6 w-full">
                    <h1 className="text-3xl font-bold text-slate-900">{post.title}</h1>
                </div>
                <div className="content-prose">
                    {parse(post.content)}
                    </div>
                </article>
            </Container>
        </div>
    ) : null;
}
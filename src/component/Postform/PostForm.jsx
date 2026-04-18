import React, { useCallback, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/db";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, setValue, control, getValues, formState: { isSubmitting } } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const titleValue = useWatch({ control, name: "title" });
    const [error, setError] = useState("");
    const [imageFailed, setImageFailed] = useState(false);

    const submit = async (data) => {
        setError("");
        try {
            if (post) {
                const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

                if (file) {
                    appwriteService.deleteFile(post.featuredImage);
                }

                const dbPost = await appwriteService.updatePost(post.$id, {
                    ...data,
                    featuredImage: file ? file.$id : undefined,
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            } else {
                if (!userData) {
                    navigate("/login");
                    return;
                }

                const file = await appwriteService.uploadFile(data.image[0]);

                if (file) {
                    const fileId = file.$id;
                    data.featuredImage = fileId;
                    const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id });

                    if (dbPost) {
                        navigate(`/post/${dbPost.$id}`);
                    }
                }
            }
        } catch (submissionError) {
            setError(submissionError?.message || "Failed to save post. Please check your Appwrite table attributes.");
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        setValue("slug", slugTransform(titleValue), { shouldValidate: true });
    }, [titleValue, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="glass-card flex flex-wrap rounded-2xl p-4 sm:p-6">
            {error && <p className="mb-4 w-full rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
            <div className="w-full px-2 lg:w-2/3">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="mt-6 w-full px-2 lg:mt-0 lg:w-1/3">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        {!imageFailed && appwriteService.getFilePreview(post.featuredImage) ? (
                            <img
                                src={appwriteService.getFilePreview(post.featuredImage)}
                                alt={post.title}
                                className="rounded-lg"
                                onError={() => setImageFailed(true)}
                            />
                        ) : (
                            <div className="rounded-lg w-full h-36 bg-gray-200 grid place-items-center text-gray-600">
                                Current image not available
                            </div>
                        )}
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-gradient-to-r from-emerald-500 to-teal-700" : undefined} className="w-full">
                    {isSubmitting ? "Saving..." : post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}
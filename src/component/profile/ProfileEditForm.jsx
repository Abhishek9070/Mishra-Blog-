import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import Button from "../Button";
import Input from "../Input";
import Select from "../Select";
import ProfileAvatar from "./ProfileAvatar";

const genderOptions = ["Prefer not to say", "Male", "Female", "Non-binary", "Other"];

function normalizeWebsite(value) {
    if (!value) return "";

    const trimmed = value.trim();
    if (!trimmed) return "";

    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
}

function ProfileEditForm({ profile, onSubmit, errorMessage = "", successMessage = "" }) {
    const defaultValues = useMemo(
        () => ({
            displayName: profile?.displayName || "",
            headline: profile?.headline || "",
            gender: profile?.gender || "Prefer not to say",
            bio: profile?.bio || "",
            location: profile?.location || "",
            website: profile?.website || "",
            profileImage: undefined,
        }),
        [profile]
    );

    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm({ defaultValues });

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    const submit = async (data) => {
        await onSubmit({
            ...data,
            website: normalizeWebsite(data.website),
        });
    };

    return (
        <section className="glass-card rounded-2xl p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Edit Profile</h2>
                <ProfileAvatar
                    imageId={profile?.profileImageId}
                    name={profile?.displayName}
                    sizeClass="h-14 w-14"
                    alt={profile?.displayName || "Profile"}
                />
            </div>

            {errorMessage && (
                <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {errorMessage}
                </p>
            )}
            {successMessage && (
                <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    {successMessage}
                </p>
            )}

            <form onSubmit={handleSubmit(submit)} className="grid gap-4 sm:grid-cols-2">
                <Input
                    label="Display Name"
                    placeholder="How people should see your name"
                    {...register("displayName", { required: true })}
                />
                <Input
                    label="Headline"
                    placeholder="Writer, engineer, designer..."
                    {...register("headline")}
                />
                <Select
                    label="Gender"
                    options={genderOptions}
                    {...register("gender")}
                />
                <Input
                    label="Location"
                    placeholder="City, Country"
                    {...register("location")}
                />
                <Input
                    label="Website"
                    placeholder="yourwebsite.com"
                    {...register("website")}
                />
                <Input
                    label="Profile Picture"
                    type="file"
                    accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                    {...register("profileImage")}
                />
                <div className="sm:col-span-2">
                    <label className="mb-1.5 inline-block pl-1 text-sm font-semibold text-slate-700" htmlFor="profile-bio">
                        Bio
                    </label>
                    <textarea
                        id="profile-bio"
                        rows={5}
                        className="w-full rounded-xl border border-slate-200 bg-white/90 px-3.5 py-2.5 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                        placeholder="Tell readers a bit about yourself"
                        {...register("bio")}
                    />
                </div>
                <Button type="submit" className="sm:col-span-2" disabled={isSubmitting}>
                    {isSubmitting ? "Saving Profile..." : "Save Profile"}
                </Button>
            </form>
        </section>
    );
}

export default ProfileEditForm;

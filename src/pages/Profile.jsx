import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../appwrite/auth";
import appwriteService from "../appwrite/db";
import { Container, ProfileEditForm, ProfilePostsSection, ProfileSummaryCard } from "../component";
import { login } from "../store/authSlice";

function Profile() {
    const userData = useSelector((state) => state.auth.userData);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [saveError, setSaveError] = useState("");
    const [saveSuccess, setSaveSuccess] = useState("");

    useEffect(() => {
        if (!userData?.$id) {
            navigate("/login");
            return;
        }

        const hydrateProfile = async () => {
            setLoading(true);
            setLoadError("");

            try {
                const [publicProfile, postResponse] = await Promise.all([
                    appwriteService.getPublicProfile(userData.$id),
                    appwriteService.getPostsByUser(userData.$id, true),
                ]);

                const prefs = userData?.prefs || {};
                const mergedProfile = {
                    userId: userData.$id,
                    displayName: publicProfile?.displayName || userData?.name || "",
                    headline: publicProfile?.headline || prefs?.headline || "",
                    bio: publicProfile?.bio || prefs?.bio || "",
                    gender: publicProfile?.gender || prefs?.gender || "Prefer not to say",
                    location: publicProfile?.location || prefs?.location || "",
                    website: publicProfile?.website || prefs?.website || "",
                    profileImageId: publicProfile?.profileImageId || prefs?.profileImageId || "",
                };

                const safePosts = Array.isArray(postResponse?.documents)
                    ? postResponse.documents
                    : Array.isArray(postResponse?.rows)
                        ? postResponse.rows
                        : [];

                setProfile(mergedProfile);
                setPosts(safePosts);
            } catch (error) {
                setLoadError(error?.message || "Failed to load your profile.");
            } finally {
                setLoading(false);
            }
        };

        hydrateProfile();
    }, [userData, navigate]);

    const postStats = useMemo(() => {
        const active = posts.filter((post) => post.status === "active").length;
        const inactive = posts.filter((post) => post.status === "inactive").length;

        return {
            total: posts.length,
            active,
            inactive,
        };
    }, [posts]);

    const handleProfileSave = async (formData) => {
        if (!userData?.$id || !profile) {
            return;
        }

        setSaveError("");
        setSaveSuccess("");

        try {
            let profileImageId = profile.profileImageId || "";
            const selectedImage = formData?.profileImage?.[0];

            if (selectedImage) {
                const uploadedImage = await appwriteService.uploadFile(selectedImage, userData.$id);
                profileImageId = uploadedImage?.$id || "";

                if (profile.profileImageId && profile.profileImageId !== profileImageId) {
                    appwriteService.deleteFile(profile.profileImageId).catch(() => null);
                }
            }

            const nextProfile = {
                userId: userData.$id,
                displayName: formData.displayName,
                headline: formData.headline || "",
                bio: formData.bio || "",
                gender: formData.gender || "Prefer not to say",
                location: formData.location || "",
                website: formData.website || "",
                profileImageId,
                updatedAt: new Date().toISOString(),
            };

            const nextPrefs = {
                ...(userData?.prefs || {}),
                headline: nextProfile.headline,
                bio: nextProfile.bio,
                gender: nextProfile.gender,
                location: nextProfile.location,
                website: nextProfile.website,
                profileImageId: nextProfile.profileImageId,
            };

            const updatedUser = await authService.updateProfile({
                name: nextProfile.displayName,
                preferences: nextPrefs,
            });

            await appwriteService.upsertPublicProfile(userData.$id, nextProfile);

            if (updatedUser) {
                dispatch(login(updatedUser));
            }

            setProfile(nextProfile);
            setSaveSuccess("Profile updated successfully.");
        } catch (error) {
            setSaveError(error?.message || "Failed to update profile.");
        }
    };

    if (loading) {
        return <h2 className="text-center text-lg font-semibold text-slate-700">Loading profile...</h2>;
    }

    if (loadError) {
        return (
            <Container>
                <div className="glass-card rounded-2xl p-8 text-center text-rose-700">{loadError}</div>
            </Container>
        );
    }

    if (!profile) {
        return null;
    }

    return (
        <div className="py-8">
            <Container>
                <div className="space-y-6">
                    <ProfileSummaryCard profile={profile} postStats={postStats} isCurrentUser />
                    <ProfileEditForm
                        profile={profile}
                        onSubmit={handleProfileSave}
                        errorMessage={saveError}
                        successMessage={saveSuccess}
                    />
                    <ProfilePostsSection
                        posts={posts}
                        title="Your Posts"
                        allowInactiveFilter
                    />
                </div>
            </Container>
        </div>
    );
}

export default Profile;

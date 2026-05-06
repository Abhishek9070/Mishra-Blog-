import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, ProfilePostsSection, ProfileSummaryCard } from "../component";
import appwriteService from "../appwrite/db";

function UserProfile() {
    const { userId } = useParams();

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!userId) {
            setError("User profile not found.");
            setLoading(false);
            return;
        }

        const loadUserProfile = async () => {
            setLoading(true);
            setError("");

            try {
                const [publicProfile, postResponse] = await Promise.all([
                    appwriteService.getPublicProfile(userId, true),
                    appwriteService.getPostsByUser(userId, false),
                ]);

                const safePosts = Array.isArray(postResponse?.documents)
                    ? postResponse.documents
                    : Array.isArray(postResponse?.rows)
                        ? postResponse.rows
                        : [];

                setPosts(safePosts);
                setProfile({
                    userId,
                    displayName: publicProfile?.displayName || `User ${userId.slice(0, 8)}`,
                    headline: publicProfile?.headline || "",
                    bio: publicProfile?.bio || "",
                    gender: publicProfile?.gender || "Prefer not to say",
                    location: publicProfile?.location || "",
                    website: publicProfile?.website || "",
                    profileImageId: publicProfile?.profileImageId || "",
                });
            } catch (fetchError) {
                setError(fetchError?.message || "Failed to load this profile.");
            } finally {
                setLoading(false);
            }
        };

        loadUserProfile();
    }, [userId]);

    const postStats = useMemo(() => ({
        total: posts.length,
        active: posts.length,
        inactive: 0,
    }), [posts]);

    if (loading) {
        return <h2 className="text-center text-lg font-semibold text-slate-700">Loading user profile...</h2>;
    }

    if (error) {
        return (
            <Container>
                <div className="glass-card rounded-2xl p-8 text-center text-rose-700">{error}</div>
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
                    <ProfileSummaryCard profile={profile} postStats={postStats} />
                    <ProfilePostsSection
                        posts={posts}
                        title="Active Posts"
                    />
                </div>
            </Container>
        </div>
    );
}

export default UserProfile;

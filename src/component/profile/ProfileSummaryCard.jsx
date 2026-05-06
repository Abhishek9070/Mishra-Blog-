import React from "react";
import ProfileAvatar from "./ProfileAvatar";

function ProfileSummaryCard({ profile, postStats, isCurrentUser = false }) {
    return (
        <section className="glass-card rounded-2xl p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                    <ProfileAvatar
                        imageId={profile?.profileImageId}
                        name={profile?.displayName}
                        sizeClass="h-20 w-20 sm:h-24 sm:w-24"
                        alt={profile?.displayName || "Profile"}
                    />
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{profile?.displayName || "User"}</h1>
                        {profile?.headline && (
                            <p className="mt-1 text-sm font-medium text-slate-700">{profile.headline}</p>
                        )}
                        <p className="mt-2 text-sm text-slate-600">
                            {profile?.bio || "No bio added yet."}
                        </p>
                    </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Profile Type</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{isCurrentUser ? "Personal" : "Public"}</p>
                </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-5">
                <div className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Gender</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{profile?.gender || "Prefer not to say"}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Location</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{profile?.location || "Not set"}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Posts</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{postStats?.total ?? 0}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Active Posts</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{postStats?.active ?? 0}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white/70 px-3 py-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Inactive Posts</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{postStats?.inactive ?? 0}</p>
                </div>
            </div>

            {profile?.website && (
                <p className="mt-4 text-sm text-slate-600">
                    Website:{" "}
                    <a
                        href={profile.website}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-sky-700 hover:underline"
                    >
                        {profile.website}
                    </a>
                </p>
            )}
        </section>
    );
}

export default ProfileSummaryCard;

import React, { useMemo, useState } from "react";
import PostCard from "../PostCard";

const tabs = ["all", "active", "inactive"];

function ProfilePostsSection({ posts = [], title = "Posts", allowInactiveFilter = false }) {
    const [tab, setTab] = useState("all");

    const filteredPosts = useMemo(() => {
        if (!allowInactiveFilter || tab === "all") return posts;
        return posts.filter((post) => post.status === tab);
    }, [allowInactiveFilter, posts, tab]);

    return (
        <section className="glass-card rounded-2xl p-5 sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-slate-900">{title}</h2>
                {allowInactiveFilter && (
                    <div className="inline-flex rounded-xl border border-slate-200 bg-white/80 p-1">
                        {tabs.map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => setTab(item)}
                                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${tab === item
                                    ? "bg-sky-600 text-white"
                                    : "text-slate-600 hover:bg-slate-100"
                                    }`}
                            >
                                {item[0].toUpperCase() + item.slice(1)}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {filteredPosts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 px-4 py-10 text-center text-slate-600">
                    No posts found for this filter.
                </div>
            ) : (
                <div className="flex flex-wrap gap-y-2">
                    {filteredPosts.map((post) => (
                        <div key={post.$id} className="w-full p-2 sm:w-1/2 lg:w-1/3">
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default ProfilePostsSection;

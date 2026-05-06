import React, { useMemo, useState } from "react";
import appwriteService from "../../appwrite/db";

function ProfileAvatar({ imageId, name = "", className = "", sizeClass = "h-20 w-20", alt = "Profile" }) {
    const [imageFailed, setImageFailed] = useState(false);
    const imageUrl = appwriteService.getFilePreview(imageId);

    const initials = useMemo(() => {
        if (!name) return "U";

        const words = name
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2);

        if (!words.length) return "U";
        return words.map((word) => word[0]?.toUpperCase() || "").join("");
    }, [name]);

    return (
        <div className={`grid place-items-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 text-slate-700 ${sizeClass} ${className}`}>
            {!imageFailed && imageUrl ? (
                <img
                    src={imageUrl}
                    alt={alt}
                    className="h-full w-full object-cover"
                    onError={() => setImageFailed(true)}
                />
            ) : (
                <span className="text-sm font-semibold sm:text-base">{initials}</span>
            )}
        </div>
    );
}

export default ProfileAvatar;

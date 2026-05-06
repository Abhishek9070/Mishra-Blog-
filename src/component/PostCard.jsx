import React, { useEffect, useMemo, useState } from 'react'
import appwriteServices from '../appwrite/db'
import {Link} from 'react-router-dom'
function PostCard({$id , featuredImage ,title, userId, status}) {
  const [imageFailed, setImageFailed] = useState(false)
  const [authorProfile, setAuthorProfile] = useState(null)
  const imageUrl = appwriteServices.getFilePreview(featuredImage)

  useEffect(() => {
    let isMounted = true

    if (!userId) {
      setAuthorProfile(null)
      return undefined
    }

    appwriteServices.getPublicProfile(userId).then((profile) => {
      if (isMounted) {
        setAuthorProfile(profile)
      }
    })

    return () => {
      isMounted = false
    }
  }, [userId])

  const authorName = useMemo(() => {
    if (authorProfile?.displayName) {
      return authorProfile.displayName
    }

    if (userId) {
      return `User ${userId.slice(0, 8)}`
    }

    return 'Unknown author'
  }, [authorProfile, userId])

  return (
    <article className='glass-card h-full overflow-hidden rounded-2xl p-3 transition duration-300 hover:-translate-y-1 hover:shadow-xl'>
      <Link to={`/post/${$id}`} className='block'>
        <div className='mb-4 overflow-hidden rounded-xl'>
          {!imageFailed && imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className='h-52 w-full object-cover transition duration-500 hover:scale-105'
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className='grid h-52 w-full place-items-center rounded-xl bg-slate-100 text-slate-500'>
              Featured image not available
            </div>
          )}
        </div>
        <h2 className='line-clamp-2 text-lg font-semibold text-slate-900'>{title}</h2>
        <p className='mt-1 text-sm text-slate-500'>Read article</p>
      </Link>
      <div className='mt-3 flex flex-wrap items-center justify-between gap-2'>
        {userId ? (
          <Link to={`/profile/${userId}`} className='text-sm font-semibold text-sky-700 transition hover:underline'>
            By {authorName}
          </Link>
        ) : (
          <span className='text-sm font-semibold text-slate-500'>By {authorName}</span>
        )}
        {status && (
          <span className={`rounded-lg px-2 py-1 text-xs font-semibold ${status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            {status}
          </span>
        )}
      </div>
    </article>
  )
}

export default PostCard

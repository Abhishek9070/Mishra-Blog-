import React, { useState } from 'react'
import appwriteServices from '../appwrite/db'
import {Link} from 'react-router-dom'
function PostCard({$id , featuredImage ,title}) {
  const [imageFailed, setImageFailed] = useState(false)
  const imageUrl = appwriteServices.getFilePreview(featuredImage)

  return (
    <Link to={`/post/${$id}`} className='block h-full'>
        <article className='glass-card h-full overflow-hidden rounded-2xl p-3 transition duration-300 hover:-translate-y-1 hover:shadow-xl'>
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
        </article>
    </Link>
  )
}

export default PostCard

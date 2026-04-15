import React from 'react'
import appwriteServices from '../appwrite/db'
import {Link} from 'react-router-dom'
function PostCard({$id , featuredImage ,title}) {
  return (
    <Link to={`/post/${$id}`}>
        <div className='w-full bg-gray-300 rounded-xl p-4'>
        <div className='w-full justify-center rounded-b-4xl mb-4'>
            <img src={appwriteServices.getFilePreview(featuredImage)} alt={title}
            className='rounded-xl'/> 
        </div>
        <h2 className='text-xl font-bold'>{title}</h2>
        </div>
    </Link>
  )
}

export default PostCard

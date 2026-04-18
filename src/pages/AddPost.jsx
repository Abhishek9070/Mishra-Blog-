
import React from 'react'
import { Container, PostForm } from '../component'

function AddPost() {
  return (
    <div className='py-8'>
        <Container>
            <div className='mb-6'>
              <h1 className='text-3xl font-bold text-slate-900'>Create New Post</h1>
              <p className='mt-1 text-slate-600'>Write and publish a polished article.</p>
            </div>
            <PostForm />
        </Container>
    </div>
  )
}

export default AddPost
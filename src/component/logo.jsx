import React from 'react'

function Logo({ width = '140px' }) {
  return (
    <div
      className='inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-3 py-2 font-semibold tracking-tight text-slate-900 shadow-sm'
      style={{ width }}
    >
      <span className='text-teal-700'>Mishra</span>
      <span className='mx-1 text-slate-400'>•</span>
      <span>Blog</span>
    </div>
  )
}

export default Logo

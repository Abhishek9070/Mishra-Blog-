import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../logo'

function Footer() {
  return (
    <footer className="px-3 pb-6 pt-2 md:px-4 md:pb-8">
      <div className="mx-auto max-w-6xl">
        <div className="glass-card rounded-2xl px-5 py-6 sm:px-6 sm:py-7">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
            <Logo width="150px" />
            <p className="text-sm text-slate-600">Write better stories. Share faster. Grow your audience.</p>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Link className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900" to="/">
                Home
              </Link>
              <Link className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900" to="/all-posts">
                Explore Posts
              </Link>
              <Link className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900" to="/add-post">
                Create
              </Link>
            </div>

            <p className="text-sm text-slate-500">Copyright {new Date().getFullYear()} MishraBlog</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
import React from 'react'
import { Container, LogOutBtn, Logo } from '../index'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Header() {
  const authStatus = useSelector((state)=>state.auth.status)
  const navigate = useNavigate()

  const navItems = [
    {
      name: 'Home',
      url: "/",
      active: true
    }, 
    {
      name: "Login",
      url: "/login",
      active: !authStatus,
  },
  {
      name: "Signup",
      url: "/signup",
      active: !authStatus,
  },
  {
      name: "All Posts",
      url: "/all-posts",
      active: authStatus,
  },
  {
      name: "Add Post",
      url: "/add-post",
      active: authStatus,
  },
  ]

  return (
    <header className='sticky top-0 z-30 w-full px-3 py-4 md:px-4'>
      <Container>
        <nav className='glass-card flex flex-wrap items-center gap-3 rounded-2xl px-4 py-3 sm:px-5'>
          <div>
            <Link to='/'>
              <Logo width='132px'/>
            </Link>
          </div>

          <ul className='ml-auto flex flex-wrap items-center gap-2'>
            {navItems.map((item)=>
              item.active ? (
                <li key={item.name}>
                    <button
                      onClick={() => navigate(item.url)}
                      className='inline-flex items-center rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700'
                    >
                      {item.name}
                    </button>
                </li>   
                
              ) : null
            )}
            {authStatus && (
              <li>
                <LogOutBtn/>
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header

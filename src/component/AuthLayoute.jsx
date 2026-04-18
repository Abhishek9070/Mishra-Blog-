import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function AuthLayout({ children, authentication = true }) {
    const navigate = useNavigate()
    const authStatus = useSelector(state => state.auth.status)

    useEffect(() => {
        if (authentication && !authStatus) {
            navigate("/login")
        } else if (!authentication && authStatus) {
            navigate("/")
        }
    }, [navigate, authentication, authStatus])

    const shouldHideChildren = (authentication && !authStatus) || (!authentication && authStatus)

  return (
    shouldHideChildren
      ? <div className='mx-auto max-w-xl px-4'><div className='glass-card rounded-2xl p-6 text-center text-slate-700'>Loading...</div></div>
      : <>{children}</>
  )
}



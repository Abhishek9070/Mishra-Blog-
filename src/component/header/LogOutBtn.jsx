import React from 'react'
import { useDispatch } from 'react-redux'
import authService from '../../appwrite/auth'
import { logOut } from '../../store/authSlice'
function LogOutBtn() {
  const dispatch = useDispatch()
  const logoutHandler = ()=>{
    authService.logout()
    .then(() => dispatch(logOut()))
  }
  return (
    <button
      onClick={logoutHandler}
      className='inline-flex items-center rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100'
    >
      Log Out
    </button>
  )
}

export default LogOutBtn

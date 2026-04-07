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
    <button onClick={logoutHandler} className='in-line-block px-6 py-2 duration-200
    hover:bg-blue-700 rounded-full'>LogOut</button>
  )
}

export default LogOutBtn

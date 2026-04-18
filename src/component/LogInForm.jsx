import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice.js'
import { Button, Input, Logo } from "./index"
import { useDispatch } from "react-redux"
import authService from "../appwrite/auth"
import { useForm } from "react-hook-form"

function LoginForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { register, handleSubmit } = useForm()
  const [error, setError] = useState("")

  const login = async (data) => {
    setError("")
    try {
      const session = await authService.login(data)
      if (session) {
        const userData = await authService.getCurrentUser()
        if (userData) dispatch(authLogin(userData));
        navigate("/")
      }
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div
      className='mx-auto w-full max-w-xl px-4'
    >
      <div className='glass-card rounded-3xl p-8 sm:p-10'>
        <div className="mb-4 flex justify-center">
          <span className="inline-block">
            <Logo width="170px" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight text-slate-900">Welcome back</h2>
        <p className="mt-2 text-center text-base text-slate-600">
          Sign in to continue writing and managing posts.
        </p>
        <p className="mt-2 text-center text-sm text-slate-500">
          Don&apos;t have any account?&nbsp;
          <Link
            to="/signup"
            className="font-semibold text-sky-700 transition-all duration-200 hover:underline"
          >
            Sign Up
          </Link>
        </p>
        {error && <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-center text-sm text-rose-700">{error}</p>}
        <form onSubmit={handleSubmit(login)} className='mt-7'>
          <div className='space-y-5'>
            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                }
              })}
            />
            <Input
              label="Password: "
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: true,
              })}
            />
            <Button
              type="submit"
              className="w-full"
            >Sign in</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
import React, { useState } from 'react'
import authService from '../appwrite/auth'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input, Logo } from './index'
import { login as authLogin } from '../store/authSlice.js'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

function SignUpForm() {

    const navigate = useNavigate()
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()

    const signUp = async (data) => {
        setError("")
        try {
            const userSession = await authService.createAccount(data)
            if (userSession) {
                const userData = await authService.getCurrentUser()
                if (userData) {
                    dispatch(authLogin(userData))
                    navigate("/")
                }
            }
        } catch (error) {
            setError(error.message)
        }
    }
    return (
        <div className="mx-auto w-full max-w-xl px-4">
            <div className='glass-card rounded-3xl p-8 sm:p-10'>
                <div className="mb-4 flex justify-center">
                    <span className="inline-block">
                        <Logo width="170px" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight text-slate-900">Create your account</h2>
                <p className="mt-2 text-center text-base text-slate-600">Start publishing your ideas with a polished writing workflow.</p>
                <p className="mt-2 text-center text-sm text-slate-500">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-semibold text-sky-700 transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-center text-sm text-rose-700">{error}</p>}

                <form onSubmit={handleSubmit(signUp)} className='mt-7'>
                    <div className='space-y-5'>
                        <Input
                            label="Full Name: "
                            placeholder="Enter your full name"
                            {...register("name", {
                                required: true,
                            })}
                        />
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
                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </div>
                </form>
            </div>

        </div>
    )
}


export default SignUpForm

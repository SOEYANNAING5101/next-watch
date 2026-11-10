'use client'
import { signUp } from '../../lib/auth-client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

export default function LogInPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        try {
            const { error } = await signUp.email({
                name,
                email,
                password
            });
            if (error) {
                console.log(error)
                setError(
                    error.status === 429 ? "Too many attempts. Wait a moment and try again." :
                        error.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" ? "An account with that email already exists." :
                            error.code === "PASSWORD_TOO_SHORT" ? "Password must be at least 8 characters." :
                                error.status === 422 ? "Please check your details and try again" :
                                    "Something went wrong. Please try again."
                )
            } else {
                router.push("/")
                router.refresh();
            }
        } finally {
            setIsLoading(false)
        }

    }

    return (
        <div className='flex items-center justify-center flex-col'>
            <div className='flex items-center justify-center gap-2 p-4'>
                <div className='border border-2 border-accent rounded-sm w-5 h-5' ></div>
                <h2 className='text-white font-bold tracking-wide'>NEXTWATCH</h2>
            </div>
            <div className='md:bg-ink-raised md:border border-line md:p-6 rounded-lg text-left md:min-w-md w-full'>
                <h3 className='text-white text-xl font-bold tracking-wide'>Create your account</h3>
                <span className='text-faint text-xs max-w-md'>Save films, rate what you watch, and spin for something new.</span>
                {error && (
                    <p role='alert' className='mt-4 border border-red-900 text-red-300 text-xs rounded-md p-3'>{error}</p>
                )}
                <form className='flex flex-col gap-4 mt-6' onSubmit={handleSignUp}>
                    {/* Username */}
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='username' className='text-muted text-sm'>Username</label>
                        <input id='username' className='text-paper border border-line w-full bg-ink p-3 rounded-md text-sm outline-none foucs:border-line focus:ring-2 focus:ring-line transition transition-all duration-200'
                            value={name}
                            autoComplete='name'
                            onChange={(e) => setName(e.target.value)}
                            type='text'
                            required
                            disabled={isLoading}
                            placeholder='yan1234'></input>
                    </div>
                    {/* Email */}
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='email' className='text-muted text-sm'>Email</label>
                        <input id='email' className='text-paper border border-line w-full bg-ink p-3 rounded-md text-sm outline-none foucs:border-line focus:ring-2 focus:ring-line transition transition-all duration-200'
                            value={email}
                            autoComplete='email'
                            onChange={(e) => setEmail(e.target.value)}
                            type='email'
                            required
                            disabled={isLoading}
                            placeholder='example@example.com'></input>
                    </div>
                    {/* Password */}
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='password' className='text-muted text-xs'>Password</label>
                        <div className='relative'>
                            <input
                                id='password'
                                className='text-paper border border-line w-full bg-ink p-3 rounded-md text-sm outline-none focus:border-line focus:ring-2 focus:ring-line transition transition-all duration-200'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type={showPassword ? "text" : "password"}
                                required
                                disabled={isLoading}
                            >
                            </input>
                            <button
                                type='button'
                                disabled ={isLoading}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className='absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-paper cursor-pointer transition transition-all duration-200'
                                onClick={() => setShowPassword(!showPassword)}
                            >{showPassword ? <EyeOff size={15} /> : <Eye size={15} />}</button>

                        </div>
                        <span
                            className='text-muted text-xs '>Use 8 characters or more
                        </span>
                    </div>
                    <button
                        disabled={isLoading}
                        type='submit'
                        className='w-full mt-2 mb-5 flex bg-gray-200 items-center font-semibold justify-center p-2 rounded-sm border-2 border-gray-900  hover:scale-105  active:scale-95 cursor-pointer transition-all duration-200'
                    >
                        <span className='text-black text-sm'>
                            {isLoading ? "Creating new account" : "Create account"}
                        </span>
                    </button>
                </form>
                <div className='w-full flex items-center justify-center gap-2 mb-4'>
                    <div className='border border-1 border-line flex-1'></div>
                    <span className='text-faint text-xs'>OR</span>
                    <div className='border border-1 border-line flex-1'></div>
                </div>
                <div className='flex items-center gap-2'>
                    <button
                        disabled={isLoading}
                        className='border border-line bg-transparent p-2 w-full rounded-md text-white text-sm'>
                        Google
                    </button>
                    <button
                        disabled={isLoading}
                        className='border border-line bg-transparent p-2 w-full rounded-md text-white text-sm'>
                        Apple
                    </button>
                </div>
            </div>
            <div className='flex gap-2 p-4'>
                <span className='text-muted text-sm'>Already have an account?</span>
                <Link href="/signup" className='text-accent hover:text-accent/80 text-sm'>Log in</Link>
            </div>


        </div>
    )
}


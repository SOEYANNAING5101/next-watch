'use client'
import { signIn } from '../../lib/auth-client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'


export default function LogInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        try {
            const { error } = await signIn.email({
                email,
                password
            });
            if (error) {
                setError(
                    error.status === 429
                        ? "Too many attempts. Wait a moment and try again."
                        : "Email or password is incorrect."
                )
            } else {
                const raw = new URLSearchParams(window.location.search).get("redirect")
                const safe = raw && raw.startsWith("/") && !raw.startsWith('//') ? raw : "/";
                router.push(safe)
                router.refresh();
            }
        } finally {
            setIsLoading(false)
        }

    }

    return (
        <div className='flex items-center justify-center flex flex-col'>
            <div className='flex items-center justify-center gap-2 p-4'>
                <div className='border border-2 border-accent rounded-sm w-5 h-5' ></div>
                <h2 className='text-white font-bold tracking-wide'>NEXTWATCH</h2>
            </div>
            <div className='md:bg-ink-raised md:border border-line md:p-6 rounded-lg text-left md:min-w-md w-full'>
                <h3 className='text-white text-xl font-bold tracking-wide'>Welcome back</h3>
                <span className='text-faint text-xs'>Log in to pick up your lists and ratings.</span>
                {error && (
                    <p role='alert' className='mt-4 border border-red-900 text-red-300 text-xs rounded-md p-3'>{error}</p>
                )}
                <form className='flex flex-col gap-4 mt-6' onSubmit={handleSignIn}>
                    {/* Email */}
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='email' className='text-muted text-sm'>Email</label>
                        <input id='email' className='text-paper border border-line w-full bg-ink p-3 rounded-md text-sm outline-none foucs:border-line focus:ring-2 focus:ring-line transition transition-all duration-200'
                            value={email}
                            autoComplete='email'
                            onChange={(e) => setEmail(e.target.value)}
                            type='email'
                            disabled={isLoading}
                            placeholder='example@example.com'></input>
                    </div>
                    {/* Password */}
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='password' className='text-muted text-xs'>Password</label>
                        <input id='password' className='text-paper border border-line w-full bg-ink p-3 rounded-md text-sm outline-none focus:border-line focus:ring-2 focus:ring-line transition transition-all duration-200'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type='password'
                            disabled={isLoading}
                        ></input>
                        {/* Need to implment in the future */}
                        {/* <Link
                            href="/forgot-password"
                            className='text-accent hover:text-accent/80 text-xs font-semibold self-end'>Forgot password?
                        </Link> */}
                    </div>
                    <button
                    disabled={isLoading}
                    type='submit'
                        className='w-full mt-2 mb-5 flex bg-gray-200 items-center font-semibold justify-center p-2 rounded-sm border-2 border-gray-900  hover:scale-105  active:scale-95 cursor-pointer transition-all duration-200'
                    >
                        <span className='text-black text-sm'>
                            {isLoading ? "LOGGING IN" : "LOG IN"}
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
                <span className='text-muted text-sm'>New to NextWatch?</span>
                <Link href="/signup" className='text-accent hover:text-accent/80 text-sm'>Create an account</Link>
            </div>


        </div>
    )
}


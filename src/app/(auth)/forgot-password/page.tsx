'use client'
import { signUp, signIn, signOut, useSession } from '../../lib/auth-client';
import { useState } from 'react';
import Link from 'next/link'

export default function ForgotPassworPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const { data: session, isPending } = useSession();
    const handleSignUp = async () => {
        const { data, error } = await signUp.email({
            name,
            email,
            password
        });
        if (error) {
            alert(error.message || JSON.stringify(error));
        } else {
            alert(`Account created successfully. ${data}`)
        }
    }
    const handleSignIn = async () => {
        const { data, error } = await signIn.email({
            email,
            password
        });
        if (error) {
            alert(error.message)
        } else {
            alert(`Account logged successfully. ${data}`)
        }
    }
    const handleSignOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    alert("User sign out!") // redirect to login page
                },
            },
        });
    }
    if (isPending) {
        return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
    }
    if (session) {
        return (
            <div className='mt-20 bg-white'>
                Welcome,{session.user.name}
                Logged in as {session.user.email}
                <button onClick={handleSignOut}>Sign Out</button>
            </div>
        )
    }

    return (
        // <div className='mt-20 bg-white'>
        //     <div >
        //         {/* Username */}
        //         <div className='p-3'>
        //             <label>
        //                 Username
        //             </label>
        //             <input
        //                 value={name}
        //                 type='text'
        //                 placeholder='e.g. yan5101'
        //                 onChange={(e) => setName(e.target.value)}
        //                 className='border w-full'
        //             />
        //         </div>
        //         {/* Email */}
        //         <div className='p-3'>
        //             <label>
        //                 Email
        //             </label>
        //             <input
        //                 value={email}
        //                 type='email'
        //                 placeholder='e.g. yan5101@gmail.com'
        //                 onChange={(e) => setEmail(e.target.value)}
        //             />
        //         </div>
        //         {/* Password */}
        //         <div className='p-3'>
        //             <label>
        //                 Password
        //             </label>
        //             <input
        //                 value={password}
        //                 type='password'
        //                 placeholder='......'
        //                 onChange={(e) => setPassword(e.target.value)}
        //             />
        //         </div>

        //         <button onClick={handleSignUp}>
        //             Create Account
        //         </button>

        //         <button onClick={handleSignIn}>
        //             LogIn
        //         </button>
        //     </div>


        // </div>
        <div className='border border-gray-200 flex items-center justify-center flex flex-col'>
            <div className='flex items-center justify-center gap-2 p-4'>
                <div className='border border-2 border-accent rounded-sm w-5 h-5' ></div>
                <h2 className='text-white font-bold tracking-wide'>forgot password</h2>
            </div>
            <div className='bg-ink-raised border border-line md:p-6 rounded-lg text-left max-w-md w-full'>
                <h3 className='text-white text-xl font-bold tracking-wide'>Welcome back</h3>
                <span className='text-muted text-sm'>Log in to pick up you lists and ratings.</span>
                <form className='flex flex-col gap-4'>
                    {/* Email */}
                    <div className='flex flex-col gap-1'>
                        <label className='text-muted text-sm'>Email</label>
                        <input className='text-faint border border-line w-full bg-ink p-2 rounded-md text-sm'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type='email'
                            placeholder='example@example.com'></input>
                    </div>
                    {/* Password */}
                    <div className='flex flex-col gap-1'>
                        <div 
                        className='flex items-center justify-between'><label className='text-muted text-xs'>Password</label>
                        <Link
                        href="/forgot-password"
                        className='text-accent text-xs font-semibold'>Forgot password?</Link>
                        </div>
                        <input className='text-faint border border-line w-full bg-ink p-2 rounded-md text-sm'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type='password'
                            ></input>
                    </div>
                </form>
                <button
                    className='w-full mt-5 mb-5 flex bg-gray-200 items-center font-semibold justify-center p-2 rounded-sm border-2 border-gray-900  hover:scale-105  active:scale-95 cursor-pointer transition-all duration-200'
                >
                    <span className='text-black'>LOG IN</span>
                </button>
                <div className='w-full flex items-center justify-center gap-2 mb-4'>
                    <div className='border border-1 border-line w-full'></div>
                    <span className='text-faint text-xs'>OR</span>
                    <div className='border border-1 border-line w-full'></div>
                </div>
                <div className='flex items-center gap-2'>
                    <button className='border border-line bg-transparent p-2 w-full rounded-md text-white text-sm'>
                        Google
                    </button>
                    <button className='border border-line bg-transparent p-2 w-full rounded-md text-white text-sm'>
                        Apple
                    </button>
                </div>
            </div>
            <div className='flex gap-2 p-4'>
                <span className='text-muted text-sm'>New to NextWatch?</span>
                <Link href="/signup" className='text-accent text-sm'>Create an account</Link>
            </div>


        </div>
    )
}


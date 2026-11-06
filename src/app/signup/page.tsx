'use client'
import { signUp, signIn, signOut, useSession } from '../lib/auth-client';
import { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react'
import GoogleIcon from '../components/GoogleIcon';
import AppleIcon from '../components/AppleIcon';

export default function SignUpPage() {
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
        console.log("email: ", email)
        console.log("password: ", password)
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
        <div className='flex items-center justify-center min-h-[100dvh]'>
            <div className='md:bg-slate-800 w-full md:max-w-1/4 p-8 rounded-xl flex flex-col justify-center'>
                <h2
                    className="text-gray-400 text-sm text-left mb-4">
                    <span className="font-bold text-gray-200 text-xl ">NEXT<span className='text-gray-400'>WATCH</span></span>
                </h2>
                <h2 className='text-gray-200 font-bold text-lg'>
                    Welcome back to cinema
                </h2>
                <span className='mb-8 text-gray-400 text-xs font-semibold max-w-md '>Your portal to cinematic screening rooms & communal vibes.</span>
                <form className='flex flex-col gap-1'>
                    {/* Email or username */}
                    <label className='text-gray-400 text-sm font-semibold'>Email or Username</label>
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-gray-400 bg-slate-950 border border-gray-800 px-4 py-2 rounded-sm focus:ring-0 focus:ring-offset-0">
                    </input>

                    {/* Password */}
                    <label className='text-gray-400 text-sm font-semibold'>Password</label>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="text-gray-400 bg-slate-950 border border-gray-800 px-4 py-2 rounded-sm focus:ring-0 focus:ring-offset-0">
                    </input>

                    <div className='flex items-center justify-between mt-2 mb-2'>
                        {/* Need to modify */}
                        <button className='flex gap-1 items-center justify-center'>
                            <div
                                className="w-5 h-5 flex items-center justify-center bg-transparent rounded focus:ring-0 focus:ring-offset-0 border border-gray-800 cursor-pointer">
                                <Check size={15} />

                            </div>
                            <span className='text-gray-400 text-xs'>Remember me</span>
                        </button>
                        <button
                            className='text-gray-200 hover:text-gray-400 transition-all duration-200 text-xs font-semibold cursor-pointer'>
                            Forgot Password?
                        </button>
                    </div>
                    <button
                        onClick={() => handleSignIn()}
                        className='w-full flex gap-2 items-center justify-center text-black bg-gray-200 items-center font-semibold justify-center p-2 rounded-sm border-2 border-gray-900  hover:scale-105  active:scale-95 cursor-pointer transition-all duration-200'
                    >
                        <span>Sign In to Screening</span><ArrowRight size={15} />
                    </button>

                    <div className='flex gap-3 justify-between items-center mt-5 mb-5'>
                        <div className='border border-gray-400 w-full'></div>
                        <span className='text-gray-400 text-xs font-semibold shrink-0'>OR CONTINUE WITH</span>
                        <div className='border border-gray-400 w-full'></div>
                    </div>
                    <div className='flex gap-3 items-center'>
                        <button
                            className="w-full gap-2 flex items-center justify-center text-xs md:text-sm text-gray-200 hover:text-[#68c9da] font-semibold rounded-sm px-4 py-1.5 border border-gray-800 bg-gray-900 cursor-pointer transition-colors duration-200">
                            <GoogleIcon size={15}/>
                            <span className=''>Google</span>
                        </button>
                        <button
                            className="w-full gap-2 flex items-center justify-center text-xs md:text-sm text-gray-200 hover:text-[#68c9da] font-semibold rounded-sm px-4 py-1.5 border border-gray-800 bg-gray-900 cursor-pointer transition-colors duration-200">
                                <AppleIcon size={15}/>
                            <span>Apple</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}


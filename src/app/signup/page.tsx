'use client'
import { signUp, signIn, signOut, useSession } from '../lib/auth-client';
import { useState } from 'react';

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
    if(session){
        return(
            <div className='mt-20 bg-white'>
                Welcome,{session.user.name}
                Logged in as {session.user.email}
                <button onClick={handleSignOut}>Sign Out</button>
            </div>
        )
    }

    return (
        <div className='mt-20 bg-white'>
            <div >
                {/* Username */}
                <div className='p-3'>
                    <label>
                        Username
                    </label>
                    <input
                        value={name}
                        type='text'
                        placeholder='e.g. yan5101'
                        onChange={(e) => setName(e.target.value)}
                        className='border w-full'
                    />
                </div>
                {/* Email */}
                <div className='p-3'>
                    <label>
                        Email
                    </label>
                    <input
                        value={email}
                        type='email'
                        placeholder='e.g. yan5101@gmail.com'
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                {/* Password */}
                <div className='p-3'>
                    <label>
                        Password
                    </label>
                    <input
                        value={password}
                        type='password'
                        placeholder='......'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button onClick={handleSignUp}>
                    Create Account
                </button>

                <button onClick={handleSignIn}>
                    LogIn
                </button>
            </div>


        </div>
    )
}


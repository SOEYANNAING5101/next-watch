import { createAuthClient } from "better-auth/react" // make sure to import from better-auth/react
export const authClient =  createAuthClient({
    baseURL:"https://next-watch-roan-two.vercel.app/"
})
export const {signIn, signUp, signOut, useSession} = authClient;
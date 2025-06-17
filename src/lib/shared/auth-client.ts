import { createAuthClient } from "better-auth/react"

const APP_URL=process.env.NEXT_PUBLIC_APP_URL
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: APP_URL
})

export const { signIn, signUp, useSession } = authClient
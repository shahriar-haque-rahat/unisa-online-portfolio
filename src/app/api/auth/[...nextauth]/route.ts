import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Admin Login",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
                const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

                if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
                    throw new Error("Missing admin credentials in environment variables.");
                }

                // ✅ Compare plain text username and password
                if (
                    credentials?.username === ADMIN_USERNAME &&
                    credentials?.password === ADMIN_PASSWORD
                ) {
                    return { id: "1", name: "Admin" };
                }

                throw new Error("Invalid username or password.");
            },
        }),
    ],
    pages: { signIn: "/auth/login" },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

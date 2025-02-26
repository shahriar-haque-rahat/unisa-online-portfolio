"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";

const Login = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [attempts, setAttempts] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!credentials.username || !credentials.password) {
            setError("Please fill in both fields.");
            setLoading(false);
            return;
        }

        const res = await signIn("credentials", {
            ...credentials,
            redirect: false,
        });

        setLoading(false);

        if (res?.ok) {
            window.location.href = "/admin";
            setError(null);
        } else {
            setError("Invalid username or password.");
            setAttempts(attempts + 1);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label htmlFor="username" className="text-sm font-medium">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        placeholder="Enter your username"
                        value={credentials.username}
                        onChange={handleChange}
                        disabled={loading}
                        className="p-2 border rounded-md"
                    />

                    <label htmlFor="password" className="text-sm font-medium">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={credentials.password}
                        onChange={handleChange}
                        disabled={loading}
                        className="p-2 border rounded-md"
                    />

                    <button
                        type="submit"
                        disabled={loading || attempts >= 3}
                        className={`p-2 text-white rounded-md ${loading ? "bg-gray-400" : "bg-primary hover:bg-secondary"} ${attempts >= 3 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    {attempts >= 3 && <p className="text-yellow-500 text-sm text-center">Too many failed attempts. Try again later.</p>}
                </form>
            </div>
        </div>
    );
}

export default Login;

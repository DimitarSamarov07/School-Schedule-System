"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, GraduationCap, Shield, UserPlus, Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/api/client';
import {login} from "@/lib/api/user";

export default function AuthPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Login State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Register State (Setup for your future implementation)
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirmPassword, setRegConfirmPassword] = useState('');
    const [showRegPassword, setShowRegPassword] = useState(false);

    /**
     * Handles the Login process using our custom apiRequest wrapper.
     * This will automatically wait for the CSRF lock if it's not ready.
     */
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg(null);

        try {
            await login(email, password)
            router.push('/dashboard');
        } catch (error: any) {
            console.error("Login Error:", error);
            setErrorMsg(error.message || "An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder for your registration logic
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 flex items-center justify-center p-4">
            <div className="w-full max-w-md text-slate-900">

                {/* Logo Section */}
                <Link href="/" className="flex items-center justify-center gap-2 text-white mb-8 group">
                    <GraduationCap className="w-10 h-10 transition-transform group-hover:scale-110" />
                    <span className="font-bold text-3xl tracking-tight">EduSchedule</span>
                </Link>

                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Tabs */}
                    <div className="flex bg-gray-100 p-1">
                        <button
                            onClick={() => setActiveTab('login')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                                activeTab === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <Shield className="w-4 h-4" /> Login
                        </button>
                        <button
                            onClick={() => setActiveTab('register')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                                activeTab === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <UserPlus className="w-4 h-4" /> Register
                        </button>
                    </div>

                    <div className="p-8">
                        {errorMsg && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg animate-pulse">
                                {errorMsg}
                            </div>
                        )}

                        {activeTab === 'login' ? (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
                                    <p className="text-sm text-gray-500 mt-1">Sign in to access the dashboard</p>
                                </div>

                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">Username / Email</label>
                                        <input
                                            type="text"
                                            required
                                            disabled={isLoading}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all disabled:bg-gray-50"
                                            placeholder="admin_user"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                disabled={isLoading}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all pr-10 disabled:bg-gray-50"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-purple-600"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-2 rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
                                    >
                                        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {isLoading ? "Authenticating..." : "Sign in"}
                                    </button>
                                </form>
                                <Link href="/forgot-password">
                                    <p className="text-center text-xs text-gray-400 hover:text-purple-500 transition-colors">Forgot password?</p>
                                </Link>
                            </div>
                        ) : (
                            /* Register Form Section */
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                                    <p className="text-sm text-gray-500 mt-1">Register a new admin account</p>
                                </div>
                                <form onSubmit={handleRegister} className="space-y-4">
                                    {/* ... existing registration inputs ... */}
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">Full Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                            placeholder="John Doe"
                                            value={regName}
                                            onChange={(e) => setRegName(e.target.value)}
                                        />
                                    </div>
                                    {/* (Registration fields truncated for brevity - implementation same as login) */}
                                    <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg">
                                        Create Account
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-center mt-6">
                    <Link href="/" className="text-white/80 hover:text-white text-sm transition-colors border-b border-transparent hover:border-white">
                        ← Back to Home
                    </Link>
                </p>
            </div>
        </div>
    );
}
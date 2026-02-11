"use client";

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {Eye, EyeOff, GraduationCap, Shield, UserPlus} from 'lucide-react';


export default function AuthPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

    // Login State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Register State
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirmPassword, setRegConfirmPassword] = useState('');

    const [showRegPassword, setShowRegPassword] = useState(false);
    const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const loginData = {
            username: email,
            password: password
        };

        try {
            const response = await fetch('http://localhost:1343/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                // Check if the response actually has content before parsing
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    console.log("Login Success:", data);
                } else {
                    console.log("Login Success (No JSON body)");
                }

                router.push('/dashboard');
            } else {
                const errorText = await response.text(); // Read as text to avoid JSON crash
                console.error("Login failed:", errorText);
                alert("Login failed: " + (errorText || "Unknown error"));
            }
        } catch (error) {
            console.error("Network or Parsing error:", error);
        }
    };
    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/dashboard');
    };

    return (
        <div
            className="min-h-screen bg-linear-to-br from-indigo-600 via-purple-500 to-pink-500 flex items-center justify-center p-4">
            <div className="w-full max-w-md text-slate-900  ">

                <Link href="/" className="flex items-center justify-center gap-2 text-white mb-8 group">
                    <GraduationCap className="w-10 h-10 transition-transform group-hover:scale-110"/>
                    <span className="font-bold text-3xl tracking-tight">EduSchedule</span>
                </Link>

                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="flex bg-gray-100 p-1">
                        <Link
                            onClick={() => setActiveTab('login')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all  duration-300 ${activeTab === 'login'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'}`} href={""}>
                            <Shield className="w-4 h-4"/>
                            Login
                        </Link>
                        <Link
                            onClick={() => setActiveTab('register')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${activeTab === 'register'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'}`} href={""}>
                            <UserPlus className="w-4 h-4"/>
                            Register
                        </Link>
                    </div>

                    <div className="p-8">
                        {activeTab === 'login' ? (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
                                    <p className="text-sm text-gray-500 mt-1">Sign in to access the dashboard</p>
                                </div>

                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">Email</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                            placeholder="admin@school.edu"
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
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all pr-10"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-purple-600 transition-colors"
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-5 h-5"/>
                                                ) : (
                                                    <Eye className="w-5 h-5"/>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <button type="submit"
                                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-colors shadow-md">
                                        Sign in
                                    </button>
                                </form>
                                <Link href="/forgot-password">
                                    <p className="text-center text-xs text-gray-400">Forgot password?</p>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                                    <p className="text-sm text-gray-500 mt-1">Register a new admin account</p>
                                </div>

                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">Full Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                            placeholder="John Doe"
                                            value={regName}
                                            onChange={(e) => setRegName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                            placeholder="admin@school.edu"
                                            value={regEmail}
                                            onChange={(e) => setRegEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700">Password</label>

                                            <div className="relative">
                                                <input
                                                    type={showRegPassword ? "text" : "password"}
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all pr-10"
                                                    placeholder="••••••••"
                                                    value={regPassword}
                                                    onChange={(e) => setRegPassword(e.target.value)}
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => setShowRegPassword(!showRegPassword)}
                                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-purple-600 transition-colors"
                                                    aria-label={showRegPassword ? "Hide password" : "Show password"}
                                                >
                                                    {showRegPassword ? (
                                                        <EyeOff className="w-5 h-5"/>
                                                    ) : (
                                                        <Eye className="w-5 h-5"/>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700">Password</label>

                                            <div className="relative">
                                                <input
                                                    type={showRegConfirmPassword ? "text" : "password"}
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all pr-10"
                                                    placeholder="••••••••"
                                                    value={regConfirmPassword}
                                                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-purple-600 transition-colors"
                                                    aria-label={showRegConfirmPassword ? "Hide password" : "Show password"}
                                                >
                                                    {showRegConfirmPassword ? (
                                                        <EyeOff className="w-5 h-5"/>
                                                    ) : (
                                                        <Eye className="w-5 h-5"/>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit"
                                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-colors shadow-md">
                                        Create Account
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-center mt-6">
                    <Link href="/"
                          className="text-white/80 hover:text-white text-sm transition-colors border-b border-transparent hover:border-white">
                        ← Back to Home
                    </Link>
                </p>
            </div>
        </div>
    );
}
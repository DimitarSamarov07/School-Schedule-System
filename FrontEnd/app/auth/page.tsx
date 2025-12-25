"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, Shield, UserPlus } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/timetable');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/timetable');
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-slate-900  ">

          <Link href="/" className="flex items-center justify-center gap-2 text-white mb-8 group">
            <GraduationCap className="w-10 h-10 transition-transform group-hover:scale-110" />
            <span className="font-bold text-3xl tracking-tight">EduSchedule</span>
          </Link>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex bg-gray-100 p-1">
              <button
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all ${
                      activeTab === 'login'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <Shield className="w-4 h-4" />
                Login
              </button>
              <button
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all ${
                      activeTab === 'register'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <UserPlus className="w-4 h-4" />
                Register
              </button>
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
                            type="email"
                            required
                            className="w-full px-4 py-2 border border-gray-300  rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            placeholder="admin@school.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-colors shadow-md">
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
                          <input
                              type="password"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                              placeholder="••••••••"
                              value={regPassword}
                              onChange={(e) => setRegPassword(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm font-semibold text-gray-700">Confirm</label>
                          <input
                              type="password"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                              placeholder="••••••••"
                              value={regConfirmPassword}
                              onChange={(e) => setRegConfirmPassword(e.target.value)}
                          />
                        </div>
                      </div>
                      <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-colors shadow-md">
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
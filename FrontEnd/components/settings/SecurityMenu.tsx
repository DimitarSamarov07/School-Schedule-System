"use client";

import React, { useState } from 'react';
import { Lock, Key, UserCheck, Eye, EyeOff, Copy } from 'lucide-react';

const SecurityMenu = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col w-3xl "> {/* Fixed height container */}
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                <div className="mb-8">
                    <label className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-purple-600" />
                        Текуща парола
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full px-4 py-4 bg-white/60 backdrop-blur-sm border border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 transition-all text-lg shadow-sm pr-12 text-black"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-4 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                            ) : (
                                <Eye className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                            )}
                        </button>
                    </div>
                </div>

                {/* New Password */}
                <div className="mb-8">
                    <label className="block text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <Key className="w-4 h-4 text-emerald-600" />
                        Нова парола
                    </label>
                    <div className="relative">
                        <input
                            type="password"
                            className="w-full px-4 py-4 bg-white/60 backdrop-blur-sm border border-emerald-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all text-lg shadow-sm pr-12 text-black"
                            placeholder="Въведете нова парола"
                        />
                        <button className="absolute inset-y-0 right-0 pr-4 flex items-center">
                            <Eye className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="mb-12">
                    <label className="block text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-blue-600" />
                        Потвърдете паролата
                    </label>
                    <div className="relative">
                        <input
                            type="password"
                            className="w-full px-4 py-4 bg-white/60 backdrop-blur-sm border-2 border-blue-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-lg shadow-sm pr-12 text-black"
                            placeholder="Потвърдете новата парола"
                        />
                        <button className="absolute inset-y-0 right-0 pr-4 flex items-center">
                            <Eye className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>
                </div>


                <div className="p-10 pt-16 gap-10 border-t shrink-0 ">
                    <div className="flex gap-3">
                        <button className="flex-1 bg-gradient-to-r from-slate-500 to-slate-600 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:from-slate-600 hover:to-slate-700 transition-all">
                            Откажи
                        </button>
                        <button className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-purple-700 transition-all">
                            Запази промени
                        </button>
                    </div>
                </div>

            </div>

            {/* Fixed footer - always visible */}

        </div>
    );
};

export default SecurityMenu;

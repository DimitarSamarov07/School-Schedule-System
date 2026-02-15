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

                {/* 2FA Toggle */}
                <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                                    <Key className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 text-lg">Двуфакторна автентикация (2FA)</h3>
                                    <p className="text-sm text-slate-500">Допълнителна сигурност за акаунта ви</p>
                                </div>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>

                {/* Recovery Code */}
                <div className="mb-8">
                    <label className="block text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        Код за възстановяване
                    </label>
                    <div className="relative group">
                        <input
                            type="text"
                            readOnly
                            value="ABCD-EFGH-IJKL-MNOP"
                            className="w-full px-4 py-4 bg-slate-50/80 backdrop-blur-sm border border-slate-200 rounded-2xl text-lg font-mono tracking-wider pr-12 cursor-pointer hover:bg-slate-100 transition-all text-black"
                            onClick={() => copyToClipboard("ABCD-EFGH-IJKL-MNOP")}
                        />
                        <button
                            className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-slate-200 rounded-xl p-1 transition-all"
                            onClick={() => copyToClipboard("ABCD-EFGH-IJKL-MNOP")}
                            title="Копирай"
                        >
                            <Copy className={`w-5 h-5 ${copied ? 'text-emerald-600' : 'text-slate-400'}`} />
                        </button>
                    </div>
                    {copied && (
                        <p className="mt-2 text-sm text-emerald-600 flex items-center gap-1">
                            ✅ Копирано в клипборда
                        </p>
                    )}
                    <p className="text-xs text-slate-500 mt-2">
                        Запазете този код на сигурно място. Използвайте го за възстановяване при загуба на достъп.
                    </p>
                </div>
                <div className="p-8 pt-4 border-t border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50 shrink-0 ">
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

"use client";

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {
    Eye, EyeOff, GraduationCap, Loader2,
    Shield, UserPlus, User, Mail, Lock, CheckCircle2, XCircle
} from 'lucide-react';
import {login, register} from "@/lib/api/user";

/* ─── Password strength helper ───────────────────────────── */
function getStrength(pw: string): { score: number; label: string; color: string } {
    let score = 0;
    if (pw.length >= 8)          score++;
    if (/[A-Z]/.test(pw))        score++;
    if (/[0-9]/.test(pw))        score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    const map = [
        { label: '',        color: 'bg-gray-200'  },
        { label: 'Слаба',   color: 'bg-red-400'   },
        { label: 'Средна',  color: 'bg-yellow-400' },
        { label: 'Добра',   color: 'bg-blue-400'  },
        { label: 'Силна',   color: 'bg-green-500' },
    ];
    return { score, ...map[score] };
}

/* ─── Tiny requirement row ────────────────────────────────── */
function Req({ met, text }: { met: boolean; text: string }) {
    return (
        <span className={`flex items-center gap-1 text-xs ${met ? 'text-green-600' : 'text-gray-400'}`}>
            {met
                ? <CheckCircle2 className="w-3 h-3 shrink-0"/>
                : <XCircle      className="w-3 h-3 shrink-0"/>}
            {text}
        </span>
    );
}

/* ═══════════════════════════════════════════════════════════ */
export default function AuthPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg]   = useState<string | null>(null);

    /* ── Login state ── */
    const [username,     setUsername]    = useState('');
    const [password,     setPassword]    = useState('');
    const [showPassword, setShowPassword] = useState(false);

    /* ── Register state ── */
    const [regEmail,           setRegEmail]           = useState('');
    const [regUsername,        setRegUsername]        = useState('');
    const [regPassword,        setRegPassword]        = useState('');
    const [regConfirmPassword, setRegConfirmPassword] = useState('');
    const [showRegPassword,    setShowRegPassword]    = useState(false);
    const [showRegConfirm,     setShowRegConfirm]     = useState(false);
    const [registerSuccess,    setRegisterSuccess]    = useState(false);

    const strength      = getStrength(regPassword);
    const passwordsMatch = regPassword !== '' && regConfirmPassword !== ''
        ? regPassword === regConfirmPassword
        : null;

    /* ── Handlers ── */
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg(null);
        try {
            await login(username, password);
            router.push('/dashboard');
        } catch (error: any) {
            console.error("Login Error:", error);
            setErrorMsg(error.message || "Неочаквана грешка. Опитайте отново.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (regPassword !== regConfirmPassword) {
            setErrorMsg("Паролите не съвпадат.");
            return;
        }
        if (strength.score < 2) {
            setErrorMsg("Моля, изберете по-силна парола.");
            return;
        }

        setIsLoading(true);
        try {
            await register({
                username:     regUsername,
                email:    regEmail,
                password: regPassword,
                isAdmin: false,
            });
            setRegisterSuccess(true);
        } catch (error: any) {
            console.error("Register Error:", error);
            setErrorMsg(error.message || "Неочаквана грешка. Опитайте отново.");
        } finally {
            setIsLoading(false);
        }
    };

    const switchTab = (tab: 'login' | 'register') => {
        setActiveTab(tab);
        setErrorMsg(null);
        setRegisterSuccess(false);
    };

    /* ════════════════════════════════════════════════════════ */
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 flex items-center justify-center p-4">
            <div className="w-full max-w-md text-slate-900">

                {/* ── Logo ── */}
                <Link href="/" className="flex items-center justify-center gap-2 text-white mb-8 group">
                    <GraduationCap className="w-10 h-10 transition-transform group-hover:scale-110"/>
                    <span className="font-bold text-3xl tracking-tight">EduSchedule</span>
                </Link>

                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

                    {/* ── Tabs ── */}
                    <div className="flex bg-gray-100 p-1">
                        <button
                            onClick={() => switchTab('login')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                                activeTab === 'login'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <Shield className="w-4 h-4"/> Вход
                        </button>
                        <button
                            onClick={() => switchTab('register')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                                activeTab === 'register'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <UserPlus className="w-4 h-4"/> Регистрация
                        </button>
                    </div>

                    <div className="p-8">

                        {/* ── Shared error banner ── */}
                        {errorMsg && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg animate-pulse">
                                {errorMsg}
                            </div>
                        )}

                        {/* ════════ LOGIN ════════ */}
                        {activeTab === 'login' && (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold text-gray-900">Вход</h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Влезте във вашия профил за да достъпите училища и графици.
                                    </p>
                                </div>

                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">
                                            Потребителско име
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                                            <input
                                                type="text"
                                                required
                                                disabled={isLoading}
                                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all disabled:bg-gray-50"
                                                placeholder="admin"
                                                value={username}
                                                onChange={e => setUsername(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">Парола</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                disabled={isLoading}
                                                className="w-full pl-9 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all disabled:bg-gray-50"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-purple-600"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-2 rounded-lg transition-all shadow-md flex items-center justify-center gap-2"
                                    >
                                        {isLoading && <Loader2 className="w-4 h-4 animate-spin"/>}
                                        {isLoading ? "Влизане..." : "Вход"}
                                    </button>
                                </form>

                                <Link href="/forgot-password">
                                    <p className="text-center text-xs text-gray-400 hover:text-purple-500 transition-colors">
                                        Забравена парола?
                                    </p>
                                </Link>
                            </div>
                        )}

                        {/* ════════ REGISTER ════════ */}
                        {activeTab === 'register' && (
                            <div className="space-y-6">
                                {registerSuccess ? (
                                    <div className="text-center space-y-4 py-4">
                                        <div className="flex justify-center">
                                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                                                <CheckCircle2 className="w-8 h-8 text-green-600"/>
                                            </div>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900">Регистрацията е успешна!</h2>
                                        <p className="text-sm text-gray-500">
                                            Акаунтът ви беше създаден. Моля, влезте.
                                        </p>
                                        <button
                                            onClick={() => switchTab('login')}
                                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-all shadow-md"
                                        >
                                            Към Вход
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-center">
                                            <h2 className="text-2xl font-bold text-gray-900">Регистрация</h2>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Създайте нов администраторски акаунт.
                                            </p>
                                        </div>

                                        <form onSubmit={handleRegister} className="space-y-4">
                                            {/* Username */}
                                            <div className="space-y-1">
                                                <label className="text-sm font-semibold text-gray-700">Потребителско име</label>
                                                <div className="relative">
                                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                                                    <input
                                                        type="text"
                                                        required
                                                        disabled={isLoading}
                                                        autoComplete="username"
                                                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all disabled:bg-gray-50"
                                                        placeholder="ivan123"
                                                        value={regUsername}
                                                        onChange={e => setRegUsername(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Email */}
                                            <div className="space-y-1">
                                                <label className="text-sm font-semibold text-gray-700">Имейл адрес</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                                                    <input
                                                        type="email"
                                                        required
                                                        disabled={isLoading}
                                                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all disabled:bg-gray-50"
                                                        placeholder="ivan@example.com"
                                                        value={regEmail}
                                                        onChange={e => setRegEmail(e.target.value)}
                                                    />
                                                </div>
                                            </div>


                                            {/* Password */}
                                            <div className="space-y-1">
                                                <label className="text-sm font-semibold text-gray-700">Парола</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                                                    <input
                                                        type={showRegPassword ? "text" : "password"}
                                                        required
                                                        disabled={isLoading}
                                                        autoComplete="new-password"
                                                        className="w-full pl-9 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all disabled:bg-gray-50"
                                                        placeholder="••••••••"
                                                        value={regPassword}
                                                        onChange={e => setRegPassword(e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowRegPassword(!showRegPassword)}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-purple-600"
                                                    >
                                                        {showRegPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                                    </button>
                                                </div>

                                                {/* Strength bar */}
                                                {regPassword && (
                                                    <div className="space-y-1.5 pt-1">
                                                        <div className="flex gap-1">
                                                            {[1,2,3,4].map(i => (
                                                                <div
                                                                    key={i}
                                                                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                                                        i <= strength.score ? strength.color : 'bg-gray-200'
                                                                    }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <p className={`text-xs font-medium ${
                                                            strength.score <= 1 ? 'text-red-500'
                                                                : strength.score === 2 ? 'text-yellow-500'
                                                                    : strength.score === 3 ? 'text-blue-500'
                                                                        : 'text-green-600'
                                                        }`}>
                                                            {strength.label && `Сила на паролата: ${strength.label}`}
                                                        </p>
                                                        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                                                            <Req met={regPassword.length >= 8}         text="Мин. 8 символа"/>
                                                            <Req met={/[A-Z]/.test(regPassword)}       text="Главна буква"/>
                                                            <Req met={/[0-9]/.test(regPassword)}       text="Цифра"/>
                                                            <Req met={/[^A-Za-z0-9]/.test(regPassword)} text="Специален символ"/>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Confirm Password */}
                                            <div className="space-y-1">
                                                <label className="text-sm font-semibold text-gray-700">Потвърди паролата</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                                                    <input
                                                        type={showRegConfirm ? "text" : "password"}
                                                        required
                                                        disabled={isLoading}
                                                        autoComplete="new-password"
                                                        className={`w-full pl-9 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all disabled:bg-gray-50 ${
                                                            passwordsMatch === false
                                                                ? 'border-red-400 bg-red-50'
                                                                : passwordsMatch === true
                                                                    ? 'border-green-400 bg-green-50'
                                                                    : 'border-gray-300'
                                                        }`}
                                                        placeholder="••••••••"
                                                        value={regConfirmPassword}
                                                        onChange={e => setRegConfirmPassword(e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowRegConfirm(!showRegConfirm)}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-purple-600"
                                                    >
                                                        {showRegConfirm ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                                    </button>
                                                </div>
                                                {passwordsMatch === false && (
                                                    <p className="text-xs text-red-500 flex items-center gap-1">
                                                        <XCircle className="w-3 h-3"/> Паролите не съвпадат
                                                    </p>
                                                )}
                                                {passwordsMatch === true && (
                                                    <p className="text-xs text-green-600 flex items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3"/> Паролите съвпадат
                                                    </p>
                                                )}
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isLoading || passwordsMatch === false}
                                                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-2 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 mt-2"
                                            >
                                                {isLoading && <Loader2 className="w-4 h-4 animate-spin"/>}
                                                {isLoading ? "Регистриране..." : "Създай акаунт"}
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-center mt-6">
                    <Link
                        href="/"
                        className="text-white/80 hover:text-white text-sm transition-colors border-b border-transparent hover:border-white"
                    >
                        ← Обратно към начало
                    </Link>
                </p>
            </div>
        </div>
    );
}
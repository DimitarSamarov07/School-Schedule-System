import {GraduationCap} from "lucide-react";
import Link from "next/link";


export default function Header() {
    return (<header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-8xl mx-auto px-10 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <GraduationCap className="w-8 h-8" />
                    <span className="font-bold text-2xl">EduSchedule</span>
                </div>
                <Link href="/auth">
                    <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-md font-semibold hover:bg-white/30 transition-all duration-200 cursor-pointer">
                        Вход
                    </button>
                </Link>
            </div>
        </div>
    </header>)
}
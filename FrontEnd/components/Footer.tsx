import {GraduationCap} from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white py-4 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <GraduationCap className="w-5 h-5" />
                    <span className="font-semibold text-gray-900">EduSchedule</span>
                </div>
                <p className="text-sm">© 2026 Система за управление на училища. Всички права запазени.</p>
            </div>
        </footer>
    )
}
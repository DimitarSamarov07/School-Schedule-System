"use client";
import React from "react";
import { X } from "lucide-react";

interface ModalShellProps {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
    footer?: React.ReactNode;
    maxWidth?: "sm" | "md" | "lg" | "4xl";
}

export function ModalShell({ title, onClose, children, footer, maxWidth = "md" }: ModalShellProps) {
    const widths = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", "4xl": "max-w-4xl" };

    return (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className={`bg-white rounded-2xl w-full ${widths[maxWidth]} shadow-2xl overflow-hidden border border-gray-200 animate-in fade-in zoom-in duration-200`}>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors cursor-pointer">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[80vh]">{children}</div>
                {footer && <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">{footer}</div>}
            </div>
        </div>
    );
}
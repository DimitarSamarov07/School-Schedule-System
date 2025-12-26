"use client"; // <--- Add this line at the very top

import { useEffect } from "react";

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Опа! Нещо се обърка.
            </h2>
            <p className="text-slate-500 mb-6">
                Не успяхме да заредим разписанието.
            </p>
            <button
                onClick={() => reset()} // Attempts to re-render the segment
                className="px-6 py-2 bg-[#8b5cf6] text-white rounded-lg font-medium hover:bg-[#7c3aed] transition-colors"
            >
                Опитай пак
            </button>
        </div>
    );
}
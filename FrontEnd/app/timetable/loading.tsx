export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-100 w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-slate-500 font-medium animate-pulse">
                Зареждане на разписанието...
            </p>
        </div>
    );
}
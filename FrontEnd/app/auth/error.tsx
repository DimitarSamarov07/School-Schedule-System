"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <X color="red" size={100}></X>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
        Ooops! Something went wrong.
      </h2>
      <p className="text-slate-500 mb-6">
        We could not load the login form.
      </p>
      <Link
          onClick={() => reset()}
          className="px-6 py-2 bg-[#8b5cf6] text-white rounded-lg font-medium hover:bg-[#7c3aed] transition-colors"
          href={""}      >
        Try again
      </Link>
    </div>
  );
}
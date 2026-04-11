"use client";
import { useCurrentSchool } from "@/providers/SchoolProvider";

export function SchoolSwitcher() {
    const { currentSchool, accessList, switchSchool, isSudo } = useCurrentSchool();

    if (!isSudo || accessList.length === 0) return null;

    return (
        <div className="flex items-center gap-2">
            <label htmlFor="school-switcher" className="text-sm text-gray-500 hidden sm:block">
                Училище:
            </label>
            <select
                id="school-switcher"
                value={currentSchool?.SchoolId || ""}
                onChange={(e) => switchSchool(Number(e.target.value))}
                className="bg-white border border-gray-300 text-sm rounded-md px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
                {accessList.map((school: any) => {
                    // It will try to use Name (from API), fallback to SchoolName (if token has it), fallback to ID
                    const displayName = school.Name || school.SchoolName || `School #${school.SchoolId}`;
                    return (
                        <option key={school.SchoolId} value={school.SchoolId}>
                            {displayName}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}
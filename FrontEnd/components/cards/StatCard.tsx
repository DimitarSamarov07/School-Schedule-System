import { ForwardRefExoticComponent, RefAttributes } from "react";
import { LucideProps } from "lucide-react";

type StatCardProps = {
    label: string;
    value: number | string;
    color: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
};

export default function StatCard({ label, value, color, icon: Icon }: StatCardProps) {
    return (
        <div
            className="rounded-2xl px-5 py-4 text-white flex items-center justify-between"
            style={{ backgroundColor: color }}
        >
            <div className="flex flex-col gap-1">
                <p className="text-sm font-medium opacity-80">{label}</p>
                <p className="text-3xl font-bold leading-none">{value}</p>
            </div>
            <Icon size={36} className="opacity-60" strokeWidth={1.5} />
        </div>
    );
}

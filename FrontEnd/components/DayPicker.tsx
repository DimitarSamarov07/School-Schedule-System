"use client";

const DAYS = [
    { label: "Пн", value: 1 },
    { label: "Вт", value: 2 },
    { label: "Ср", value: 3 },
    { label: "Чт", value: 4 },
    { label: "Пт", value: 5 },
    { label: "Сб", value: 6 },
    { label: "Нд", value: 7 },
];

type Props = {
    value: number[];
    onChange: (days: number[]) => void;
    disabled?: boolean;
};

export function DayPicker({ value = [], onChange, disabled }: Props) {
    const toggle = (day: number) => {
        if (disabled) return;
        const next = value.includes(day)
            ? value.filter((d) => d !== day)
            : [...value, day].sort((a, b) => a - b);
        onChange(next);
    };

    return (
        <div className="flex gap-2 flex-wrap">
            {DAYS.map(({ label, value: dayValue }) => {
                const selected = value.includes(dayValue);
                return (
                    <button
                        key={dayValue}
                        type="button"
                        onClick={() => toggle(dayValue)}
                        disabled={disabled}
                        className={`
                            w-10 h-10 rounded-xl text-sm font-bold transition-all
                            ${selected
                            ? "bg-[#7C5CFC] text-white shadow-md shadow-purple-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }
                            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        `}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
}
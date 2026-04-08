export const PALETTES = [
    { bg: '#dbeafe', color: '#1e40af' },
    { bg: '#d1fae5', color: '#065f46' },
    { bg: '#ede9fe', color: '#4c1d95' },
    { bg: '#fef3c7', color: '#92400e' },
    { bg: '#fce7f3', color: '#9d174d' },
    { bg: '#ffedd5', color: '#9a3412' },
    { bg: '#cffafe', color: '#164e63' },
    { bg: '#ffe4e6', color: '#881337' },
];

export const getPalette = (id: number) => PALETTES[id % PALETTES.length];

export const DAYS = ['Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък'];

export const DAY_OPTIONS: { value: number; label: string }[] = [
    { value: 1, label: 'Понеделник' },
    { value: 2, label: 'Вторник' },
    { value: 3, label: 'Сряда' },
    { value: 4, label: 'Четвъртък' },
    { value: 5, label: 'Петък' },
];
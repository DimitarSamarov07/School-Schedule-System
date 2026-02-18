import {Calendar, Clock, DoorOpen, GraduationCap, Palette, Sun, Users} from "lucide-react";

export const menuItems = [
    { icon: Calendar, label: 'Програма', href: '/dashboard/' },
    { icon: Users, label: 'Учители', href: '/dashboard/teachers' },
    { icon: Palette, label: 'Предмети', href: '/dashboard/subjects' },
    { icon: GraduationCap, label: 'Класове', href: '/dashboard/classes' },
    { icon: DoorOpen, label: 'Стаи', href: '/dashboard/rooms' },
    { icon: Clock, label: 'Часове', href: '/dashboard/periods' },
    { icon: Sun, label: 'Почивки', href: '/dashboard/holidays' },
];
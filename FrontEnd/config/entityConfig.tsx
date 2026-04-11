import { Class } from "@/types/class";
import { Room } from "@/types/room";
import { Period } from "@/types/period";
import {formatWorkweek} from "@/lib/utils";

export const CLASS_CONFIG = {
    title: "Класове и учебни зали",
    singular: "клас",
    listKey: "gradeList",
    itemNameKey: "Name",
    searchKeys: ["Name", "Description"],
    columns: [
        { key: "Name", label: "Клас" },
        {
            key: "Room.Name",
            label: "Стая",
            render: (grade: Grade) => (
                <span className="bg-purple-50 text-purple-500 px-4 py-2 rounded-xl font-bold text-sm border border-purple-100">
                    {grade.Room?.Name || "Без стая"}
                </span>
            )
        },
        { key: "Description", label: "Специалност / Забележки" }
    ],
    formFields: [
        { key: "Name", label: "Име на Клас", type: "text", placeholder: "напр. 10А" },
        {
            key: "Room",
            label: "Стая",
            type: "dropdown",
            optionsKey: "roomList",   // ← which list from the hook to use
            labelKey: "Name",         // ← which field to show in the dropdown
            valueKey: "id",           // ← which field is the value
            placeholder: "Избери стая"
        },
        { key: "Description", label: "Специалност/забележки", type: "textarea", placeholder: "напр. Приложно програмиране" }
    ]
};

export const ROOM_CONFIG = {
    title: "Стаи и учебни зали",
    singular: "стая",
    listKey: "roomsList",
    itemNameKey: "Name",
    searchKeys: ["Name", "Floor"],
    columns: [
        { key: "Name", label: "Стая" },
        {
            key: "Floor",
            label: "Етаж",
            render: (room: Room) => (
                <span className="bg-purple-50 text-purple-500 px-4 py-2 rounded-xl font-bold text-sm border border-purple-100">
                    {"Етаж " + (room.Floor || "Без етаж")}
                </span>
            )
        },
        {
            key: "Capacity",
            label: "Капацитет",
            align: "right",
            render: (room: Room) => `${room.Capacity || 0} места`
        }
    ],
    formFields: [
        { key: "Name", label: "Име на Стая", type: "text", placeholder: "напр. Стая 204" },
        { key: "Floor", label: "Етаж", type: "text", placeholder: "напр. 3" },
        { key: "Capacity", label: "Капацитет", type: "text", placeholder: "напр. 30" }
    ]
};

export const TEACHER_CONFIG = {
    title: "Учители",
    singular: "учител",
    listKey: "teacherList",
    itemNameKey: "Name",
    searchKeys: ["Name", "Email"],
    columns: [
        { key: "Name", label: "Учител" },
        { key: "Email", label: "Имейл" }
    ],
    formFields: [
        { key: "Name", label: "Име на Учител", type: "text", placeholder: "напр. Иван Иванов" },
        { key: "Email", label: "Имейл", type: "text", placeholder: "напр. ivan@example.com" }
    ]
};

export const SUBJECT_CONFIG = {
    title: "Предмети",
    singular: "предмет",
    listKey: "subjectList",
    itemNameKey: "Name",
    searchKeys: ["Name", "Description"],
    columns: [
        { key: "Name", label: "Предмет" },
        { key: "Description", label: "Забележки" }
    ],
    formFields: [
        { key: "Name", label: "Име на Предмет", type: "text", placeholder: "напр. Математика" },
        { key: "Description", label: "Забележки", type: "text", placeholder: "напр. Основен предмет" }
    ]
};

export const SCHOOL_CONFIG = {
    title: "Училища",
    singular: "училище",
    listKey: "schoolsList",
    itemNameKey: "Name",
    searchKeys: ["Name", "Address"],
    columns: [
        { key: "Name", label: "Име" },
        { key: "Address", label: "Адрес" },
        {
            key: "WorkweekConfig",
            label: "Седмица",
            render: (item: unknown) => {
                const config = (item as Record<string, unknown>).WorkweekConfig;
                return formatWorkweek((config as number[]) ?? []);
            }
        }
    ],
    formFields: [
        { key: "Name", label: "Име на Училище", type: "text", placeholder: "напр. СУ Паисий Хилендарски" },
        { key: "Address", label: "Адрес", type: "text", placeholder: "напр. ул. Иван Вазов 1" },
        { key: "WorkweekConfig", label: "Работна седмица", type: "daypicker" }
    ]
};

export const PERIOD_CONFIG = {
    title: "Часове",
    singular: "час",
    listKey: "timeList",
    itemNameKey: "Name",
    searchKeys: ["Name", "Start", "End"],
    columns: [
        { key: "Name", label: "Час" },
        {
            key: "Start",
            label: "Начало",
            render: (period: Period) => (
                <span className="bg-purple-50 text-purple-500 px-4 py-2 rounded-xl font-bold text-sm border border-purple-100">
                    {period.Start}
                </span>
            )
        },
        {
            key: "End",
            label: "Край",
            render: (period: Period) => (
                <span className="bg-purple-50 text-purple-500 px-4 py-2 rounded-xl font-bold text-sm border border-purple-100">
                    {period.End}
                </span>
            )
        }
    ],
    formFields: [
        { key: "Name",  label: "Име на час", type: "text",       placeholder: "напр. 1ви час" },
        { key: "Start", label: "Начало",     type: "timepicker" }, // ← changed
        { key: "End",   label: "Край",       type: "timepicker" }, // ← changed
    ]
};

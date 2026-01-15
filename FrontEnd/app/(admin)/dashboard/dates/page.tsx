"use client";

import React, { useState, useMemo } from "react";
import { useDatesManager } from "@/hooks/use-dates-manager";
import { Plus, Calendar , X, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function IntegratedDatesPage() {
    const locale = "bg-BG";
    const manager = useDatesManager();

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedRange, setSelectedRange] = useState<{ from: Date | null; to: Date | null }>({
        from: null,
        to: null
    });

    const getCalendarDays = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDayOfMonth = new Date(year, month, 0).getDay();
        const days = [];

        for (let i = 0; i < firstDayOfMonth; i++) days.push(null);

        const d = new Date(year, month, 1);
        while (d.getMonth() === month) {
            days.push(new Date(d));
            d.setDate(d.getDate() + 1);
        }
        return days;
    };

    const monthsData = useMemo(() => {
        const firstMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const secondMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

        return [
            { date: firstMonth, days: getCalendarDays(firstMonth) },
            { date: secondMonth, days: getCalendarDays(secondMonth) }
        ];
    }, [currentMonth]);

    const changeMonth = (offset: number) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
    };

    const toggleDateSelection = (date: Date) => {
        if (!selectedRange.from || (selectedRange.from && selectedRange.to)) {
            setSelectedRange({ from: date, to: null });
        } else {
            date < selectedRange.from
                ? setSelectedRange({ from: date, to: selectedRange.from })
                : setSelectedRange({ from: selectedRange.from, to: date });
        }
    };

    const handleConfirmAdd = async () => {
        if (!selectedRange.from) return;
        setIsProcessing(true);

        const start = new Date(selectedRange.from);
        const end = selectedRange.to ? new Date(selectedRange.to) : start;
        const curr = new Date(start);
        try {
            while (curr <= end) {
                const formatedDate = Intl.DateTimeFormat('en-CA').format(curr);
                await manager.handleCreate(formatedDate, true);
                curr.setDate(curr.getDate() + 1);
            }
        } catch (error) {
            console.error("Batch creation failed", error);
        } finally {
            setIsProcessing(false);
            setSelectedRange({ from: null, to: null });
            manager.closeModal();
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50/50 gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Учебни и неучебни дни</h2>
                        <p className="text-sm text-gray-500">Управлявайте ваканции и почивки</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex bg-white border border-gray-200 rounded-lg p-1">
                            <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"><ChevronLeft size={18}/></button>
                            <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"><ChevronRight size={18}/></button>
                        </div>
                        <button
                            onClick={() => manager.setActiveModal('add')}
                            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            Добавете почивка
                        </button>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {monthsData.map((monthObj, monthIdx) => (
                        <div key={monthIdx} className="space-y-6">
                            <h3 className="text-lg font-bold text-gray-800 text-center lg:text-left px-2">
                                {monthObj.date.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
                            </h3>
                            <div className="grid grid-cols-7 gap-1">
                                {[ 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб','Не'].map(day => (
                                    <div key={day} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-3">
                                        {day}
                                    </div>
                                ))}
                                {monthObj.days.map((date, i) => {
                                    if (!date) return <div key={`empty-${monthIdx}-${i}`} />;
                                    const dStr = Intl.DateTimeFormat('en-CA').format(date);
                                    const holiday  = manager.dateList.find(d => d.Date.split('T')[0] === dStr && d.IsHoliday);

                                    return (
                                        <button
                                            key={dStr}
                                            onClick={() => holiday && manager.openDeleteModal(holiday)}
                                            className={`relative h-12 w-full flex flex-col items-center justify-center rounded-xl transition-all border text-sm
                                                ${holiday
                                                ? 'bg-red-50 border-red-200 text-red-600 font-bold hover:bg-red-100 cursor-pointer'
                                                : 'bg-white border-transparent hover:border-indigo-100 hover:bg-indigo-50/50 text-gray-600'}`}
                                        >
                                            {date.getDate()}
                                            {holiday && <div className="absolute bottom-1.5 w-1 h-1 bg-red-400 rounded-full" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-400">
                        Натиснете върху дата маркирана с червено за да я изтриете.
                    </p>
                </div>
            </div>

            {manager.activeModal === 'add' && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden border border-gray-200 animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Добавете ваканции или почивки</h2>
                                <p className="text-sm text-gray-500">Изберете началната и крайната дата на почивката.</p>
                            </div>
                            <button onClick={manager.closeModal} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"><X size={20}/></button>
                        </div>

                        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-purple-50 border border-purple-100 rounded-xl p-4 sticky top-0 z-10 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-600 rounded-lg text-white"><Calendar size={18}/></div>
                                    <div>
                                        <p className="text-sm font-semibold text-purple-900">
                                            {selectedRange.from ? (
                                                selectedRange.to
                                                    ? `${selectedRange.from.toLocaleDateString(locale)} — ${selectedRange.to.toLocaleDateString(locale)}`
                                                    : `Започваща ${selectedRange.from.toLocaleDateString(locale)}...`
                                            ) : "Моля изберете дати"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => changeMonth(-1)} className="p-1.5 border border-purple-200 rounded-md hover:bg-white transition-colors cursor-pointer"><ChevronLeft size={16}/></button>
                                    <button onClick={() => changeMonth(1)} className="p-1.5 border border-purple-200 rounded-md hover:bg-white transition-colors cursor-pointer"><ChevronRight size={16}/></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {monthsData.map((monthObj, mIdx) => (
                                    <div key={mIdx} className="space-y-4">
                                        <h4 className="text-sm font-bold text-gray-700 text-center uppercase tracking-widest bg-gray-50 py-2 rounded-lg">
                                            {monthObj.date.toLocaleDateString(locale, { month: 'long' })}
                                        </h4>
                                        <div className="grid grid-cols-7 gap-1">
                                            {monthObj.days.map((date, i) => {
                                                if (!date) return <div key={`modal-empty-${mIdx}-${i}`} />;
                                                const time = date.getTime();
                                                const isSelected = (selectedRange.from?.getTime() === time) || (selectedRange.to?.getTime() === time);
                                                const inRange = selectedRange.from && selectedRange.to && time > selectedRange.from.getTime() && time < selectedRange.to.getTime();

                                                return (
                                                    <button
                                                        key={date.toISOString()}
                                                        onClick={() => toggleDateSelection(date)}
                                                        className={`h-10 w-full flex items-center justify-center rounded-lg text-xs transition-all
                                                            ${isSelected ? 'bg-purple-600 text-white font-bold shadow-md' :
                                                            inRange ? 'bg-purple-100 text-purple-700 font-medium' :
                                                                'hover:bg-gray-100 text-gray-600'}`}
                                                    >
                                                        {date.getDate()}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
                            <button onClick={manager.closeModal} className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">Отказ</button>
                            <button
                                onClick={handleConfirmAdd}
                                disabled={!selectedRange.from || isProcessing}
                                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Потвърди и запази ваканциите"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {manager.activeModal === 'delete' && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl border border-gray-200 text-center animate-in fade-in zoom-in duration-200">
                        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={50}/>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Сигурни ли сте че искате да изтриете тази почивка?</h2>
                        <p className="text-gray-500 text-sm mb-8">
                            Това действие ще изтрие почивката на дата <br/>
                            <span className="font-bold text-gray-800">{manager.selectedDate ? new Date(manager.selectedDate.Date).toLocaleDateString(locale) : ''}</span>.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={manager.closeModal} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 cursor-pointer">Отказ</button>
                            <button onClick={manager.handleDelete} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 shadow-lg shadow-red-100 transition-all cursor-pointer">Да, изтрий</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
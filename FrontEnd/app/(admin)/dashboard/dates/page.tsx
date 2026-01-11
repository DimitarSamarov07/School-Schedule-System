"use client";

import React, { useState, useMemo } from "react";
import { useDatesManager } from "@/hooks/use-dates-manager";



export default function DatesPage() {
    const manager = useDatesManager();

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedRange, setSelectedRange] = useState<{ from: Date | null; to: Date | null }>({
        from: null,
        to: null
    });

    const calendarData = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
        const date = new Date(year, month, 1);
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    }, [currentMonth]);

    const upcomingHolidays = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return manager.dateList
            .filter(d => {
                const holidayDate = new Date(d.Date);
                return d.IsHoliday && holidayDate >= today;
            })
            .sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());
    }, [manager.dateList]);

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
        <div className="max-w-7xl mx-auto p-6 font-sans">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Manage Dates</h2>
                    <p className="text-sm text-gray-500 mt-1">Navigate months and configure academic breaks.</p>
                </div>

                <button
                    onClick={() => manager.setActiveModal('add')}
                    className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 transition-all shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Add Holiday
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white border rounded-2xl p-6 shadow-sm h-fit">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-800 text-lg">
                            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h3>
                        <div className="flex gap-1">
                            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-lg border border-gray-100 text-gray-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-lg border border-gray-100 text-gray-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-400 mb-2">
                        {[ 'П', 'В', 'С', 'Ч', 'П', 'С','Н',].map((day, index) => (
                            <div key={`${day}-${index}`} className="py-2">{day}</div>
                        ))}
                        {calendarData.map((date, i) => {
                            if (!date) return <div key={`empty-${i}`} />;
                            const dStr = Intl.DateTimeFormat('en-CA').format(date);
                            const isHoliday = manager.dateList.find(d => d.Date.split('T')[0] === dStr)?.IsHoliday;

                            return (
                                <div
                                    key={dStr}
                                    className={`py-2.5 text-sm rounded-xl transition-all ${isHoliday ? 'bg-red-500 text-white font-bold shadow-md scale-105' : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'}`}
                                >
                                    {date.getDate()}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50/30">
                            <h3 className="font-bold text-gray-800">Upcoming Holidays</h3>
                            <button onClick={() => setCurrentMonth(new Date())} className="text-xs text-purple-600 font-semibold hover:underline">Go to Today</button>
                        </div>

                        <div className="divide-y divide-gray-100 min-h-100">
                            {manager.isLoading ? (
                                <div className="p-12 text-center text-gray-400 animate-pulse">Syncing with database...</div>
                            ) : upcomingHolidays.length === 0 ? (
                                <div className="p-12 text-center text-gray-400 italic">No future holidays scheduled.</div>
                            ) : (
                                upcomingHolidays.map((holiday) => (
                                    <div key={holiday.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 group">
                                        <div className="flex items-center gap-5">
                                            <div className="bg-purple-50 text-purple-700 w-14 h-14 rounded-2xl flex flex-col items-center justify-center border border-purple-100">
                                                <span className="text-[10px] uppercase font-bold tracking-tighter">{new Date(holiday.Date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                                <span className="text-xl font-black leading-tight">{new Date(holiday.Date).getDate()}</span>
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{new Date(holiday.Date).toLocaleDateString('en-US', { weekday: 'long' })}</div>
                                                <div className="text-xs text-gray-500">Academic Break • {new Date(holiday.Date).getFullYear()}</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => manager.openDeleteModal(holiday)}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {manager.activeModal === 'add' && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-gray-900">Mark Holidays</h2>
                            <div className="flex gap-2">
                                <button onClick={() => changeMonth(-1)} className="p-1.5 border rounded-lg hover:bg-gray-50"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
                                <button onClick={() => changeMonth(1)} className="p-1.5 border rounded-lg hover:bg-gray-50"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="text-center text-purple-600 font-bold bg-purple-50 py-2 rounded-xl">
                                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </div>

                            <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
                                <div className="grid grid-cols-7 gap-1 text-center">
                                    {calendarData.map((date, i) => {
                                        if (!date) return <div key={`m-empty-${i}`} />;
                                        const isSelected = (selectedRange.from && date.getTime() === selectedRange.from.getTime()) ||
                                            (selectedRange.to && date.getTime() === selectedRange.to.getTime());
                                        const inRange = selectedRange.from && selectedRange.to && date > selectedRange.from && date < selectedRange.to;

                                        return (
                                            <button
                                                key={date.toISOString()}
                                                onClick={() => toggleDateSelection(date)}
                                                className={`h-10 w-10 flex items-center justify-center rounded-xl text-sm transition-all ${isSelected ? 'bg-purple-600 text-white shadow-lg' : inRange ? 'bg-purple-100 text-purple-700' : 'hover:bg-white text-gray-600'}`}
                                            >
                                                {date.getDate()}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={manager.closeModal}
                                    disabled={isProcessing}
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmAdd}
                                    disabled={!selectedRange.from || isProcessing}
                                    className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-purple-200 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : "Confirm Range"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {manager.activeModal === 'delete' && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl text-center">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h2 className="text-xl font-black text-gray-900 mb-2">Delete Holiday?</h2>
                        <p className="text-gray-500 mb-8">This will remove the break for {manager.selectedDate ? new Date(manager.selectedDate.Date).toLocaleDateString() : 'this date'}.</p>
                        <div className="flex gap-3">
                            <button onClick={manager.closeModal} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-bold">Cancel</button>
                            <button onClick={manager.handleDelete} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-100 transition-all">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
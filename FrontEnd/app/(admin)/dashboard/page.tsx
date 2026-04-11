'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useCurrentSchool } from '@/providers/SchoolProvider';
import { useRoomsManager } from '@/hooks/use-rooms-manager';
import { useGradesManager } from '@/hooks/use-grades-manager';
import { useTeacherManager } from '@/hooks/use-teachers-manager';
import { useSubjectsManager } from '@/hooks/use-subjects-manager';
import { usePeriodsManager } from '@/hooks/use-periods-manager';
import {Building, Clock, GraduationCap, Palette, Users, AlertCircle, Plus} from 'lucide-react'; // Added AlertCircle
import StatCard from '@/components/cards/StatCard';
import moment from 'moment';
import { apiRequest } from '@/lib/api/client';
import { ApiEntry, ModalConfig, PeriodSection } from '@/types/schedule';
import { transformSchedule } from '@/utils/scheduleParse';
import { PeriodTable } from '@/components/schedule/PeriodTable';
import { AddScheduleModal } from '@/components/schedule/AddScheduleModal';

export default function TimetablePage() {
    const { currentSchool } = useCurrentSchool();
    const { roomsList }     = useRoomsManager();
    const { gradeList }     = useGradesManager();
    const { teacherList }   = useTeacherManager();
    const { subjectList }   = useSubjectsManager();
    const { timeList }      = usePeriodsManager();

    const [startDate] = useState(() => moment().startOf('isoWeek').format('YYYY-MM-DD'));
    const [endDate]   = useState(() => moment().endOf('isoWeek').format('YYYY-MM-DD'));

    const [sections,    setSections]    = useState<PeriodSection[]>([]);
    const [loading,     setLoading]     = useState(true);
    const [modalOpen,   setModalOpen]   = useState(false);
    const [modalConfig, setModalConfig] = useState<ModalConfig>({});

    const timeListRef    = useRef(timeList);
    const gradeListRef   = useRef(gradeList);
    const didInitialLoad = useRef(false);

    useEffect(() => { timeListRef.current  = timeList;  }, [timeList]);
    useEffect(() => { gradeListRef.current = gradeList; }, [gradeList]);

    const loadSchedule = useCallback((silent = false) => {
        // Safe access here, though we already guard against null currentSchool below
        const schoolId = currentSchool?.SchoolId;
        const tl = timeListRef.current;
        const gl = gradeListRef.current;

        if (!schoolId || !tl.length || !gl.length) return;

        if (!silent) setLoading(true);
        apiRequest<ApiEntry[]>(
            `/schedule/betweenDates?schoolId=${schoolId}&startDate=${startDate}&endDate=${endDate}`
        )
            .then(data => setSections(transformSchedule(data, tl, gl)))
            .catch(err => console.error('Failed to load schedule:', err))
            .finally(() => { if (!silent) setLoading(false); });
    }, [currentSchool?.SchoolId, startDate, endDate]);

    useEffect(() => {
        if (timeList.length && gradeList.length && !didInitialLoad.current) {
            didInitialLoad.current = true;
            loadSchedule();
        }
    }, [timeList.length, gradeList.length, loadSchedule]);

    function openModal(config: ModalConfig = {}) {
        setModalConfig(config);
        setModalOpen(true);
    }

    // ─── NULL SCHOOL GUARD ──────────────────────────────────────────────
    if (!currentSchool) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Няма избрано училище</h2>
                <p className="text-slate-500 max-w-md">
                    За да видите и редактирате програмата, трябва да сте добавени към училище.
                    Моля, свържете се с администратор или изберете училище от менюто.
                </p>
            </div>
        );
    }

    if (loading) return <p className="p-6 text-gray-400">Зареждане...</p>;

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Програма</h2>
                <button
                    onClick={() => openModal()}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 1.125rem', borderRadius: '0.625rem', background: '#6c3de6', color: '#fff', border: 'none', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
                >
                    <Plus size={16}></Plus>
                    Добави часове
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <StatCard label="Учители"  value={teacherList.length} color="#3B5BDB" icon={GraduationCap} />
                <StatCard label="Класове"  value={gradeList.length}   color="#0F9B8E" icon={Users}         />
                <StatCard label="Стаи"     value={roomsList.length}   color="#7C5CFC" icon={Building}      />
                <StatCard label="Предмети" value={subjectList.length} color="#E05C8A" icon={Palette}       />
                <StatCard label="Часове"   value={timeList.length}    color="#E8703A" icon={Clock}         />
            </div>

            <div className="pt-10 space-y-6">
                {sections.length === 0
                    ? <p className="text-gray-400 text-sm">Няма записи за тази седмица.</p>
                    : sections.map((s, idx) => (
                        <PeriodTable
                            key={s.id}
                            section={s}
                            defaultOpen={idx < 2}
                            onAddCell={(periodId, classId, dayIndex) =>
                                openModal({ periodId, classId, dayIndex })
                            }
                        />
                    ))
                }
            </div>

            {modalOpen && (
                <AddScheduleModal
                    {...modalConfig}
                    onSave={() => { setModalOpen(false); loadSchedule(true); }}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </>
    );
}
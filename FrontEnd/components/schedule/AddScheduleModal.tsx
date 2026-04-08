'use client';

import { FormEvent, useEffect, useState } from 'react';
import moment from 'moment';
import { useCurrentSchool } from '@/providers/SchoolProvider';
import { useRoomsManager } from '@/hooks/use-rooms-manager';
import { useGradesManager } from '@/hooks/use-grades-manager';
import { useTeacherManager } from '@/hooks/use-teachers-manager';
import { useSubjectsManager } from '@/hooks/use-subjects-manager';
import { usePeriodsManager } from '@/hooks/use-periods-manager';
import { apiRequest } from '@/lib/api/client';
import { DAYS, DAY_OPTIONS } from '@/constants/schedule';
import { ModalField, inputStyle } from './ModalField';

// ── Types ─────────────────────────────────────────────────────────────────────
interface ScheduleEntry {
    _key:      number;   // local React key only, never sent to API
    periodId:  number;
    classId:   number;
    subjectId: number;
    teacherId: number;
    roomId:    number;
}

interface AddScheduleModalProps {
    periodId?: number;
    classId?:  number;
    dayIndex?: number;
    onSave:    () => void;
    onClose:   () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
let _nextKey = 1;
const nextKey = () => _nextKey++;

function makeEntry(overrides: Partial<ScheduleEntry> = {}): ScheduleEntry {
    return { _key: nextKey(), periodId: 0, classId: 0, subjectId: 0, teacherId: 0, roomId: 0, ...overrides };
}

// ── Component ─────────────────────────────────────────────────────────────────
export function AddScheduleModal({ periodId, classId, dayIndex, onSave, onClose }: AddScheduleModalProps) {
    const { currentSchool } = useCurrentSchool();
    const { roomsList }     = useRoomsManager();
    const { gradeList }     = useGradesManager();
    const { teacherList }   = useTeacherManager();
    const { subjectList }   = useSubjectsManager();
    const { timeList }      = usePeriodsManager();

    const clickedDate = dayIndex !== undefined
        ? moment().startOf('isoWeek').add(dayIndex, 'days').format('YYYY-MM-DD')
        : moment().startOf('isoWeek').format('YYYY-MM-DD');

    // ── Global fields (shared across all entries) ──────────────────────────
    const [startDate, setStartDate] = useState(clickedDate);
    const [endDate,   setEndDate]   = useState(clickedDate);
    const [dayOfWeek, setDayOfWeek] = useState<number>(
        dayIndex !== undefined ? dayIndex + 1 : moment(clickedDate).isoWeekday()
    );

    // ── Per-entry list ─────────────────────────────────────────────────────
    const [entries, setEntries] = useState<ScheduleEntry[]>(() => [
        makeEntry({ periodId: periodId ?? 0, classId: classId ?? 0 }),
    ]);

    const [saving, setSaving] = useState(false);
    const [error,  setError]  = useState<string | null>(null);

    // Pre-fill first entry once lists load
    useEffect(() => {
        if (timeList.length)    setEntries(prev => prev.map((e, i) => i === 0 && !e.periodId  ? { ...e, periodId:  periodId  ?? timeList[0].id    } : e));
    }, [timeList]);
    useEffect(() => {
        if (gradeList.length)   setEntries(prev => prev.map((e, i) => i === 0 && !e.classId   ? { ...e, classId:   classId   ?? gradeList[0].id   } : e));
    }, [gradeList]);
    useEffect(() => {
        if (subjectList.length) setEntries(prev => prev.map((e, i) => i === 0 && !e.subjectId ? { ...e, subjectId: subjectList[0].id              } : e));
    }, [subjectList]);
    useEffect(() => {
        if (teacherList.length) setEntries(prev => prev.map((e, i) => i === 0 && !e.teacherId ? { ...e, teacherId: teacherList[0].id              } : e));
    }, [teacherList]);
    useEffect(() => {
        if (roomsList.length)   setEntries(prev => prev.map((e, i) => i === 0 && !e.roomId    ? { ...e, roomId:    roomsList[0].id                } : e));
    }, [roomsList]);

    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', h);
        return () => document.removeEventListener('keydown', h);
    }, [onClose]);

    // ── Entry helpers ──────────────────────────────────────────────────────
    function updateEntry(key: number, patch: Partial<ScheduleEntry>) {
        setEntries(prev => prev.map(e => e._key === key ? { ...e, ...patch } : e));
    }

    function addEntry() {
        setEntries(prev => {
            const last = prev[prev.length - 1];
            // Clone last row so the user only needs to change what differs
            return [...prev, makeEntry({
                periodId:  last.periodId,
                classId:   last.classId,
                subjectId: last.subjectId,
                teacherId: last.teacherId,
                roomId:    last.roomId,
            })];
        });
    }

    function removeEntry(key: number) {
        setEntries(prev => prev.length > 1 ? prev.filter(e => e._key !== key) : prev);
    }

    // ── Day count ──────────────────────────────────────────────────────────
    const dayCount = (() => {
        if (!startDate || !endDate) return 0;
        let count = 0;
        const cur = moment(startDate);
        const end = moment(endDate);
        while (cur.isSameOrBefore(end)) {
            if (cur.isoWeekday() === dayOfWeek) count++;
            cur.add(1, 'day');
        }
        return count;
    })();

    // ── Submit ─────────────────────────────────────────────────────────────
    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!startDate || !endDate)
        { setError('Изберете начална и крайна дата.'); return; }
        if (moment(endDate).isBefore(startDate))
        { setError('Крайната дата трябва да е след началната.'); return; }

        const invalid = entries.find(e => !e.periodId || !e.classId || !e.subjectId || !e.teacherId || !e.roomId);
        if (invalid)
        { setError('Всички редове трябва да са попълнени.'); return; }

        setSaving(true);
        setError(null);
        try {
            await apiRequest(`/schedule/bulk?schoolId=${currentSchool!.SchoolId}`, {
                method: 'POST',
                body: JSON.stringify({
                    startDate,
                    endDate,
                    dayOfWeek,
                    schedules: entries.map(({ periodId, classId, subjectId, teacherId, roomId }) => ({
                        periodId, classId, subjectId, teacherId, roomId,
                    })),
                }),
            });
            onSave();
        } catch (err) {
            setError(String(err));
            setSaving(false);
        }
    }

    const dayLabel = dayIndex !== undefined ? DAYS[dayIndex] : null;
    const totalRecords = dayCount * entries.length;

    return (
        <div
            onClick={e => e.target === e.currentTarget && onClose()}
            style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        >
            <div style={{ background: '#fff', border: '1px solid #dde0e5', borderRadius: '1rem', width: '100%', maxWidth: 680, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem 1rem', borderBottom: '1px solid #e4e6ea', flexShrink: 0 }}>
                    <div>
                        <h2 style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>
                            {dayLabel ? `Добави за ${dayLabel}` : 'Добави програма'}
                        </h2>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 2 }}>
                            Добавете няколко реда наведнъж — всички ще бъдат записани за избрания период
                        </p>
                    </div>
                    <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', cursor: 'pointer', color: '#6b7280' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                </div>

                {/* Scrollable body */}
                <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* ── Global date/day section ── */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <ModalField label="От дата">
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inputStyle} />
                        </ModalField>
                        <ModalField label="До дата">
                            <input type="date" value={endDate} min={startDate} onChange={e => setEndDate(e.target.value)} style={inputStyle} />
                        </ModalField>
                    </div>

                    <ModalField label="Ден от седмицата">
                        <select value={dayOfWeek} onChange={e => setDayOfWeek(+e.target.value)} style={inputStyle}>
                            {DAY_OPTIONS.map(({ value, label }) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </ModalField>

                    {totalRecords > 0 && (
                        <div style={{ background: '#ede9fb', color: '#6c3de6', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.8125rem', fontWeight: 500 }}>
                            Ще бъдат създадени <strong>{totalRecords}</strong> {totalRecords === 1 ? 'запис' : 'записа'}{' '}
                            ({entries.length} {entries.length === 1 ? 'ред' : 'реда'} × {dayCount} {dayCount === 1 ? 'ден' : 'дни'})
                        </div>
                    )}

                    <div style={{ height: 1, background: '#e4e6ea' }} />

                    {/* ── Per-entry rows ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {entries.map((entry, idx) => (
                            <EntryRow
                                key={entry._key}
                                index={idx}
                                entry={entry}
                                timeList={timeList}
                                gradeList={gradeList}
                                subjectList={subjectList}
                                teacherList={teacherList}
                                roomsList={roomsList}
                                canRemove={entries.length > 1}
                                onChange={patch => updateEntry(entry._key, patch)}
                                onRemove={() => removeEntry(entry._key)}
                            />
                        ))}
                    </div>

                    {/* Add row button */}
                    <button
                        type="button"
                        onClick={addEntry}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '0.5rem', borderRadius: '0.5rem', border: '1.5px dashed #c4b5fd', background: 'transparent', color: '#6c3de6', fontWeight: 500, fontSize: '0.8125rem', cursor: 'pointer', transition: 'background 160ms ease' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f5f3ff')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                        Добави ред
                    </button>

                    {error && (
                        <p style={{ fontSize: '0.75rem', color: '#b91c1c', background: '#fee2e2', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', margin: 0 }}>
                            {error}
                        </p>
                    )}
                </form>

                {/* Footer — outside the scrollable form so it's always visible */}
                <div style={{ borderTop: '1px solid #e4e6ea', padding: '1rem 1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexShrink: 0 }}>
                    <button type="button" onClick={onClose} style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: '1px solid #dde0e5', background: 'transparent', color: '#6b7280', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer' }}>
                        Отказ
                    </button>
                    <button
                        type="submit"
                        form="schedule-form"
                        disabled={saving || totalRecords === 0}
                        onClick={handleSubmit as any}
                        style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: 'none', background: saving || totalRecords === 0 ? '#a78bfa' : '#6c3de6', color: '#fff', fontWeight: 500, fontSize: '0.875rem', cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 160ms ease' }}
                    >
                        {saving ? 'Запазване…' : `Създай ${totalRecords > 0 ? totalRecords : ''} ${totalRecords === 1 ? 'запис' : 'записа'}`}
                    </button>
                </div>

            </div>
        </div>
    );
}

// ── EntryRow ──────────────────────────────────────────────────────────────────
interface EntryRowProps {
    index:       number;
    entry:       ScheduleEntry;
    timeList:    Array<{ id: number; Name: string; Start?: string; End?: string }>;
    gradeList:   Array<{ id: number; Name: string }>;
    subjectList: Array<{ id: number; Name: string }>;
    teacherList: Array<{ id: number; Name: string }>;
    roomsList:   Array<{ id: number; Name: string }>;
    canRemove:   boolean;
    onChange:    (patch: Partial<ScheduleEntry>) => void;
    onRemove:    () => void;
}

function EntryRow({ index, entry, timeList, gradeList, subjectList, teacherList, roomsList, canRemove, onChange, onRemove }: EntryRowProps) {
    const rowStyle: React.CSSProperties = {
        background: '#f9fafb',
        border: '1px solid #e4e6ea',
        borderRadius: '0.75rem',
        padding: '0.875rem',
    };

    const compactInput: React.CSSProperties = {
        ...inputStyle,
        background: '#fff',
        padding: '0.375rem 0.625rem',
        fontSize: '0.8125rem',
    };

    return (
        <div style={rowStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                    Ред {index + 1}
                </span>
                {canRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        title="Премахни ред"
                        style={{ width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', color: '#9ca3af', cursor: 'pointer', transition: 'color 160ms ease, background 160ms ease' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#b91c1c'; e.currentTarget.style.background = '#fee2e2'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: 500, color: '#9ca3af' }}>Час</label>
                    <select value={entry.periodId} onChange={e => onChange({ periodId: +e.target.value })} style={compactInput}>
                        <option value={0}>—</option>
                        {timeList.map(p => (
                            <option key={p.id} value={p.id}>{p.Name}</option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: 500, color: '#9ca3af' }}>Клас</label>
                    <select value={entry.classId} onChange={e => onChange({ classId: +e.target.value })} style={compactInput}>
                        <option value={0}>—</option>
                        {gradeList.map(g => <option key={g.id} value={g.id}>{g.Name}</option>)}
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: 500, color: '#9ca3af' }}>Предмет</label>
                    <select value={entry.subjectId} onChange={e => onChange({ subjectId: +e.target.value })} style={compactInput}>
                        <option value={0}>—</option>
                        {subjectList.map(s => <option key={s.id} value={s.id}>{s.Name}</option>)}
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: 500, color: '#9ca3af' }}>Учител</label>
                    <select value={entry.teacherId} onChange={e => onChange({ teacherId: +e.target.value })} style={compactInput}>
                        <option value={0}>—</option>
                        {teacherList.map(t => <option key={t.id} value={t.id}>{t.Name}</option>)}
                    </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <label style={{ fontSize: '0.7rem', fontWeight: 500, color: '#9ca3af' }}>Стая</label>
                    <select value={entry.roomId} onChange={e => onChange({ roomId: +e.target.value })} style={compactInput}>
                        <option value={0}>—</option>
                        {roomsList.map(r => <option key={r.id} value={r.id}>{r.Name}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
}
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRoomsManager }    from '@/hooks/use-rooms-manager';
import { useGradesManager }   from '@/hooks/use-grades-manager';
import { useTeacherManager }  from '@/hooks/use-teachers-manager';
import { useSubjectsManager } from '@/hooks/use-subjects-manager';
import { usePeriodsManager }  from '@/hooks/use-periods-manager';
import { useCurrentSchool }   from '@/providers/SchoolProvider';
import { bulkCreateSchedules } from '@/lib/api/schedule';
import moment from 'moment';
import {CsrfProvider} from "@/providers/CSRFProvider";

interface Props {
    onSave:  () => void;
    onClose: () => void;
}

export default function AddScheduleModal({ onSave, onClose }: Props) {
    const { currentSchool } = useCurrentSchool();
    const { roomsList }     = useRoomsManager();
    const { gradeList }     = useGradesManager();
    const { teacherList }   = useTeacherManager();
    const { subjectList }   = useSubjectsManager();
    const { timeList }      = usePeriodsManager();

    // Default to current Mon–Fri
    const [startDate,    setStartDate]    = useState(moment().startOf('isoWeek').format('YYYY-MM-DD'));
    const [endDate,      setEndDate]      = useState(moment().endOf('isoWeek').subtract(2, 'days').format('YYYY-MM-DD'));
    const [selPeriodId,  setSelPeriodId]  = useState(0);
    const [selClassId,   setSelClassId]   = useState(0);
    const [selSubjectId, setSelSubjectId] = useState(0);
    const [selTeacherId, setSelTeacherId] = useState(0);
    const [selRoomId,    setSelRoomId]    = useState(0);
    const [saving,       setSaving]       = useState(false);
    const [error,        setError]        = useState<string | null>(null);

    // Set first option as default once lists load
    useEffect(() => { if (timeList.length   && !selPeriodId)  setSelPeriodId(timeList[0].Id);    }, [timeList]);
    useEffect(() => { if (gradeList.length  && !selClassId)   setSelClassId(gradeList[0].Id);    }, [gradeList]);
    useEffect(() => { if (subjectList.length && !selSubjectId) setSelSubjectId(subjectList[0].Id); }, [subjectList]);
    useEffect(() => { if (teacherList.length && !selTeacherId) setSelTeacherId(teacherList[0].Id); }, [teacherList]);
    useEffect(() => { if (roomsList.length  && !selRoomId)    setSelRoomId(roomsList[0].Id);     }, [roomsList]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    // How many school days are in the range (preview for user)
    const dayCount = (() => {
        if (!startDate || !endDate) return 0;
        let count = 0;
        const cur = moment(startDate);
        const end = moment(endDate);
        while (cur.isSameOrBefore(end)) {
            if (cur.isoWeekday() <= 5) count++;
            cur.add(1, 'day');
        }
        return count;
    })();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!startDate || !endDate) { setError('Select a start and end date.'); return; }
        if (moment(endDate).isBefore(startDate)) { setError('End date must be after start date.'); return; }
        if (!selSubjectId || !selTeacherId || !selRoomId || !selPeriodId || !selClassId) {
            setError('All fields are required.');
            return;
        }

        setSaving(true);
        setError(null);
        try {
            await bulkCreateSchedules(
                currentSchool!.SchoolId,
                startDate,
                endDate,
                [{ periodId: selPeriodId, classId: selClassId, subjectId: selSubjectId, teacherId: selTeacherId, roomId: selRoomId }]
            );
            onSave();
        } catch (err) {
            setError(String(err));
            setSaving(false);
        }
    }

    return (
        <CsrfProvider>
        <div
            onClick={e => e.target === e.currentTarget && onClose()}
            style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
        >
            <div style={{ background: '#fff', border: '1px solid #dde0e5', borderRadius: '1rem', width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem 1rem', borderBottom: '1px solid #e4e6ea' }}>
                    <div>
                        <h2 style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>Bulk Add Schedule</h2>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 2 }}>Creates one entry per school day in the range</p>
                    </div>
                    <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'transparent', cursor: 'pointer', color: '#6b7280' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6 6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '1.25rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Date range row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <Field label="Start Date">
                            <input
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                style={inputStyle}
                            />
                        </Field>
                        <Field label="End Date">
                            <input
                                type="date"
                                value={endDate}
                                min={startDate}
                                onChange={e => setEndDate(e.target.value)}
                                style={inputStyle}
                            />
                        </Field>
                    </div>

                    {/* Day count preview */}
                    {dayCount > 0 && (
                        <div style={{ background: '#ede9fb', color: '#6c3de6', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', fontSize: '0.8125rem', fontWeight: 500 }}>
                            📅 This will create <strong>{dayCount}</strong> schedule {dayCount === 1 ? 'entry' : 'entries'} (school days only, weekends skipped)
                        </div>
                    )}

                    <div style={{ height: 1, background: '#e4e6ea' }} />

                    <Field label="Period">
                        <select value={selPeriodId} onChange={e => setSelPeriodId(+e.target.value)} style={inputStyle}>
                            <option value={0}>— Select period —</option>
                            {timeList.map(p => (
                                <option key={p.Id} value={p.Id}>
                                    {p.Name} ({p.Start?.slice(0,5)} – {p.End?.slice(0,5)})
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Class">
                        <select value={selClassId} onChange={e => setSelClassId(+e.target.value)} style={inputStyle}>
                            <option value={0}>— Select class —</option>
                            {gradeList.map(g => (
                                <option key={g.Id} value={g.Id}>{g.Name}</option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Subject">
                        <select value={selSubjectId} onChange={e => setSelSubjectId(+e.target.value)} style={inputStyle}>
                            <option value={0}>— Select subject —</option>
                            {subjectList.map(s => (
                                <option key={s.Id} value={s.Id}>{s.Name}</option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Teacher">
                        <select value={selTeacherId} onChange={e => setSelTeacherId(+e.target.value)} style={inputStyle}>
                            <option value={0}>— Select teacher —</option>
                            {teacherList.map(t => (
                                <option key={t.Id} value={t.Id}>{t.Name}</option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Room">
                        <select value={selRoomId} onChange={e => setSelRoomId(+e.target.value)} style={inputStyle}>
                            <option value={0}>— Select room —</option>
                            {roomsList.map(r => (
                                <option key={r.Id} value={r.Id}>{r.Name}</option>
                            ))}
                        </select>
                    </Field>

                    {error && (
                        <p style={{ fontSize: '0.75rem', color: '#b91c1c', background: '#fee2e2', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', margin: 0 }}>
                            {error}
                        </p>
                    )}

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                        <button type="button" onClick={onClose} style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: '1px solid #dde0e5', background: 'transparent', color: '#6b7280', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer' }}>
                            Cancel
                        </button>
                        <button type="submit" disabled={saving || dayCount === 0} style={{ padding: '0.5rem 1.25rem', borderRadius: '0.5rem', border: 'none', background: saving || dayCount === 0 ? '#a78bfa' : '#6c3de6', color: '#fff', fontWeight: 500, fontSize: '0.875rem', cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 160ms ease' }}>
                            {saving ? 'Creating…' : `Create ${dayCount > 0 ? dayCount : ''} ${dayCount === 1 ? 'Entry' : 'Entries'}`}
                        </button>
                    </div>

                </form>
            </div>
        </div>
        </CsrfProvider>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#6b7280' }}>{label}</label>
            {children}
        </div>
    );
}

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.5rem 0.75rem',
    borderRadius: '0.5rem', border: '1px solid #dde0e5',
    background: '#f9fafb', fontSize: '0.875rem',
    outline: 'none', fontFamily: 'inherit',
};
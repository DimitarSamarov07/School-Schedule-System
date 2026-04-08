'use client';

import { useState, useId } from 'react';
import type { ScheduleEntry } from '@/types/schedule';

// ── Types (must match what transformSchedule returns) ─────────────────────────
export interface GradeRow {
    gradeId: number;
    gradeName: string;
    cells: (ScheduleEntry | null)[]; // index 0=Mon … 4=Fri
}

export interface PeriodTableProps {
    name: string;
    time: string;
    rows: GradeRow[];
    isAdmin?: boolean;
    onAddCell?: (periodId: number, classId: number, dayIndex: number) => void;
    onEditCell?: (entry: ScheduleEntry) => void;
    onDeleteCell?: (entry: ScheduleEntry) => void;
}

// ── Subject category → colour ─────────────────────────────────────────────────
const CATEGORY_COLOR: Record<string, { bg: string; color: string }> = {
    Mathematics: { bg: '#dbeafe', color: '#1e40af' },
    Art:         { bg: '#fce7f3', color: '#9d174d' },
    Science:     { bg: '#d1fae5', color: '#065f46' },
    English:     { bg: '#ede9fe', color: '#4c1d95' },
    History:     { bg: '#fef3c7', color: '#92400e' },
    Geography:   { bg: '#ffedd5', color: '#9a3412' },
    Physics:     { bg: '#cffafe', color: '#164e63' },
    Literature:  { bg: '#ffe4e6', color: '#881337' },
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// ── Root export ───────────────────────────────────────────────────────────────
export default function PeriodTable({
                                        name, time, rows,
                                        isAdmin = false,
                                        onAddCell, onEditCell, onDeleteCell,
                                    }: PeriodTableProps) {
    const [open, setOpen] = useState(true);
    const panelId = useId();
    const today = new Date().getDay() - 1; // 0=Mon … 4=Fri

    const filled = rows.reduce((acc, r) => acc + r.cells.filter(Boolean).length, 0);
    const total  = rows.length * 5;

    return (
        <div style={cardStyle}>
            {/* ── Header ── */}
            <button
                onClick={() => setOpen(v => !v)}
                aria-expanded={open}
                aria-controls={panelId}
                style={headerStyle}
                onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
                {/* Chevron */}
                <svg
                    width="20" height="20" viewBox="0 0 24 24"
                    fill="none" stroke="#9ca3af" strokeWidth="2.5"
                    style={{ flexShrink: 0, transition: 'transform 220ms cubic-bezier(.16,1,.3,1)', transform: open ? 'rotate(90deg)' : 'rotate(0)' }}
                >
                    <path d="m9 18 6-6-6-6"/>
                </svg>

                {/* Purple badge */}
                <span style={{ width: 36, height: 36, borderRadius: 8, background: '#ede9fb', color: '#6c3de6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                    {name.split(' ')[0]}
                </span>

                {/* Name + time */}
                <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontWeight: 700, fontSize: '0.9375rem', color: 'inherit' }}>{name}</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginTop: 1 }}>{time}</span>
                </span>

                {/* Slot count */}
                <span style={{ padding: '2px 8px', background: '#f0f1f3', borderRadius: 9999, fontSize: '0.75rem', color: '#6b7280', fontWeight: 500, flexShrink: 0 }}>
                    {filled}/{total} slots
                </span>
            </button>

            {/* ── Body — grid-template-rows accordion ── */}
            <div
                id={panelId}
                role="region"
                style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows 240ms cubic-bezier(.16,1,.3,1)' }}
            >
                <div style={{ overflow: 'hidden' }}>
                    <div style={{ height: 1, background: '#e4e6ea' }} />
                    <div style={{ overflowX: 'auto', padding: '1rem 1.25rem 1.25rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'fixed' }}>
                            <thead>
                            <tr>
                                <th style={thGradeStyle}>Grade</th>
                                {DAYS.map((day, i) => (
                                    <th key={day} style={{ ...thDayStyle, color: i === today ? '#6c3de6' : '#6b7280' }}>
                                        {day}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {rows.map(row => (
                                <tr key={row.gradeId}>
                                    <td style={tdGradeStyle}>
                                        <span style={gradePillStyle}>{row.gradeName}</span>
                                    </td>
                                    {DAYS.map((_, dayIdx) => (
                                        <td key={dayIdx} style={{ paddingRight: '0.75rem', paddingBottom: '0.75rem', verticalAlign: 'top' }}>
                                            <Cell
                                                entry={row.cells[dayIdx] ?? null}
                                                isAdmin={isAdmin}
                                                onAdd={() => onAddCell?.(row.cells[dayIdx]?.periodId ?? 0, row.gradeId, dayIdx)}
                                                onEdit={() => row.cells[dayIdx] && onEditCell?.(row.cells[dayIdx]!)}
                                                onDelete={() => row.cells[dayIdx] && onDeleteCell?.(row.cells[dayIdx]!)}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Cell ──────────────────────────────────────────────────────────────────────
function Cell({ entry, isAdmin, onAdd, onEdit, onDelete }: {
    entry: ScheduleEntry | null;
    isAdmin: boolean;
    onAdd: () => void;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const [hovered, setHovered] = useState(false);

    if (!entry) {
        if (!isAdmin) {
            return <div style={{ ...emptyCellBase, cursor: 'default', borderStyle: 'solid' }} />;
        }
        return (
            <button
                onClick={onAdd}
                style={{ ...emptyCellBase, background: hovered ? '#f9fafb' : '#f0f1f3', borderColor: hovered ? '#6c3de6' : '#dde0e5', color: hovered ? '#6c3de6' : '#9ca3af' }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                aria-label="Add schedule entry"
            >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14"/>
                </svg>
                Add
            </button>
        );
    }

    const palette = CATEGORY_COLOR[entry.subject.category] ?? { bg: '#e0e7ff', color: '#3730a3' };
    const teacher = `${entry.teacher.firstName} ${entry.teacher.lastName}`;

    return (
        <div
            style={{ position: 'relative', borderRadius: '0.75rem', padding: '0.75rem', minHeight: 80, display: 'flex', flexDirection: 'column', gap: 2, background: palette.bg, color: palette.color, transform: hovered ? 'translateY(-1px)' : 'none', boxShadow: hovered ? '0 4px 12px rgba(0,0,0,.1)' : 'none', transition: 'transform 160ms ease, box-shadow 160ms ease' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <span style={{ fontWeight: 700, fontSize: '0.875rem', lineHeight: 1.2 }}>{entry.subject.name}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.8 }}>{entry.subject.category}</span>
            <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                <UserIcon /> {teacher}
            </span>
            <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 3, opacity: 0.75 }}>
                <RoomIcon /> {entry.room.name}
            </span>

            {/* Edit/Delete — only admins, only on hover */}
            {isAdmin && hovered && (
                <div style={{ position: 'absolute', top: 6, right: 6, display: 'flex', gap: 3 }}>
                    <Btn onClick={onEdit}  title="Edit">  <EditIcon />  </Btn>
                    <Btn onClick={onDelete} title="Delete"><TrashIcon /></Btn>
                </div>
            )}
        </div>
    );
}

function Btn({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
    const [h, setH] = useState(false);
    return (
        <button
            onClick={e => { e.stopPropagation(); onClick(); }}
            title={title}
            style={{ width: 22, height: 22, borderRadius: 6, background: h ? 'rgba(0,0,0,.22)' : 'rgba(0,0,0,.12)', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', padding: 0 }}
            onMouseEnter={() => setH(true)}
            onMouseLeave={() => setH(false)}
        >
            {children}
        </button>
    );
}

// ── Icons ──────────────────────────────────────────────────────────────────────
const UserIcon  = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
const RoomIcon  = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 22v-4h6v4M3 9h18"/></svg>;
const EditIcon  = () => <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon = () => <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>;

// ── Shared styles ──────────────────────────────────────────────────────────────
const cardStyle:       React.CSSProperties = { background: '#fff', border: '1px solid #dde0e5', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.06)' };
const headerStyle:     React.CSSProperties = { width: '100%', display: 'flex', alignItems: 'center', padding: '1rem 1.25rem', gap: '0.75rem', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'background 160ms ease' };
const thGradeStyle:    React.CSSProperties = { width: 72, fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 500, paddingBottom: '0.75rem', paddingRight: '0.75rem' };
const thDayStyle:      React.CSSProperties = { width: 'calc((100% - 72px) / 5)', minWidth: 160, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', paddingBottom: '0.75rem', paddingRight: '0.75rem' };
const tdGradeStyle:    React.CSSProperties = { paddingRight: '0.75rem', paddingBottom: '0.75rem', verticalAlign: 'middle', width: 72 };
const gradePillStyle:  React.CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.875rem', background: '#f0f1f3', color: '#111827' };
const emptyCellBase:   React.CSSProperties = { borderRadius: '0.75rem', minHeight: 80, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, border: '1.5px dashed #dde0e5', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer', transition: 'all 160ms ease' };
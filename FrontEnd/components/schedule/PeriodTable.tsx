'use client';

import { useState } from 'react';
import { PeriodSection } from '@/types/schedule';
import { DAYS } from '@/constants/schedule';
import { Cell } from './Cell';

interface PeriodTableProps {
    section:     PeriodSection;
    defaultOpen: boolean;
    onAddCell:   (periodId: number, classId: number, dayIndex: number) => void;
}

export function PeriodTable({ section, defaultOpen, onAddCell }: PeriodTableProps) {
    const [open, setOpen] = useState(defaultOpen);
    const today = new Date().getDay() - 1;

    const filled = section.rows.reduce((n, r) => n + r.cells.filter(Boolean).length, 0);
    const total  = section.rows.length * 5;

    return (
        <div style={{ background: '#fff', border: '1px solid #e4e6ea', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
            <button
                onClick={() => setOpen(v => !v)}
                aria-expanded={open}
                style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '1rem 1.25rem', gap: '0.75rem', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'background 160ms ease' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5"
                     style={{ flexShrink: 0, transition: 'transform 220ms cubic-bezier(.16,1,.3,1)', transform: open ? 'rotate(90deg)' : 'rotate(0)' }}>
                    <path d="m9 18 6-6-6-6"/>
                </svg>
                <span style={{ width: 36, height: 36, borderRadius: 8, background: '#ede9fb', color: '#6c3de6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                    {section.name.match(/\d+/)?.[0] ?? '·'}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontWeight: 700, fontSize: '0.9375rem' }}>{section.name}</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginTop: 1 }}>{section.time}</span>
                </span>
                <span style={{ padding: '2px 8px', background: '#f0f1f3', borderRadius: 9999, fontSize: '0.75rem', color: '#6b7280', fontWeight: 500, flexShrink: 0 }}>
                    {filled}/{total} слота
                </span>
            </button>

            <div style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows 240ms cubic-bezier(.16,1,.3,1)' }}>
                <div style={{ overflow: 'hidden' }}>
                    <div style={{ height: 1, background: '#e4e6ea' }} />
                    <div style={{ overflowX: 'auto', padding: '1rem 1.25rem 1.25rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'fixed' }}>
                            <thead>
                            <tr>
                                <th style={{ width: 72, fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 500, paddingBottom: '0.75rem', paddingRight: '0.75rem' }}>Клас</th>
                                {DAYS.map((day, i) => (
                                    <th key={day} style={{ width: 'calc((100% - 72px) / 5)', minWidth: 160, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', paddingBottom: '0.75rem', paddingRight: '0.75rem', color: i === today ? '#6c3de6' : '#6b7280' }}>
                                        {day}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {section.rows.map(row => (
                                <tr key={row.gradeId}>
                                    <td style={{ paddingRight: '0.75rem', paddingBottom: '0.75rem', verticalAlign: 'middle', width: 72 }}>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '0.75rem', fontWeight: 700, fontSize: '0.75rem', background: '#f0f1f3', color: '#111827', textAlign: 'center', overflow: 'hidden', padding: '0 4px' }}>
                                            {row.gradeName.length > 6 ? row.gradeName.slice(0, 3) + '…' : row.gradeName}
                                        </span>
                                    </td>
                                    {row.cells.map((entry, dayIdx) => (
                                        <td key={dayIdx} style={{ paddingRight: '0.75rem', paddingBottom: '0.75rem', verticalAlign: 'top' }}>
                                            <Cell
                                                entry={entry}
                                                onAdd={() => onAddCell(section.id, row.gradeId, dayIdx)}
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
'use client';

import { useState } from 'react';
import { ApiEntry } from '@/types/schedule';
import { getPalette } from '@/constants/schedule';
import {Plus} from "lucide-react";

interface CellProps {
    entry: ApiEntry | null;
    onAdd: () => void;
}

export function Cell({ entry, onAdd }: CellProps) {
    const [hovered, setHovered] = useState(false);

    if (!entry) {
        return (
            <div
                onClick={onAdd}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{ borderRadius: '0.75rem', minHeight: 80, background: hovered ? '#f5f3ff' : '#f0f1f3', border: `1.5px dashed ${hovered ? '#6c3de6' : '#dde0e5'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer', transition: 'all 160ms ease', color: hovered ? '#6c3de6' : '#9ca3af', fontSize: '0.75rem', fontWeight: 500 }}
            >
                <Plus></Plus>
                Добави
            </div>
        );
    }

    const p = getPalette(entry.Subject.Id);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ borderRadius: '0.75rem', padding: '0.75rem', minHeight: 80, display: 'flex', flexDirection: 'column', gap: 2, background: p.bg, color: p.color, transform: hovered ? 'translateY(-1px)' : 'none', boxShadow: hovered ? '0 4px 12px rgba(0,0,0,.1)' : 'none', transition: 'transform 160ms ease, box-shadow 160ms ease' }}
        >
            <span style={{ fontWeight: 700, fontSize: '0.875rem', lineHeight: 1.2 }}>{entry.Subject.Name}</span>
            <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 3, marginTop: 4 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                {entry.Teacher.Name}
            </span>
            <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 3, opacity: 0.75 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 22v-4h6v4M3 9h18"/></svg>
                {entry.Room.Name}
            </span>
        </div>
    );
}
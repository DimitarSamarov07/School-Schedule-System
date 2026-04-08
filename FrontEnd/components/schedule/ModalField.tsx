import React from 'react';

export const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.5rem 0.75rem',
    borderRadius: '0.5rem', border: '1px solid #dde0e5',
    background: '#f9fafb', fontSize: '0.875rem',
    outline: 'none', fontFamily: 'inherit',
};

export function ModalField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#6b7280' }}>{label}</label>
            {children}
        </div>
    );
}
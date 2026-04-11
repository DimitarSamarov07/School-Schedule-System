"use client";

import { FormEvent, useState } from 'react';
import { useCurrentSchool } from '@/providers/SchoolProvider';
import { inviteUserToSchool } from '@/lib/api/schoolUser';
import { UserPlus } from 'lucide-react';

type Status = { type: 'success' | 'error'; message: string } | null;

export default function InvitePage() {
    const { currentSchool, isSudo } = useCurrentSchool();
    const isAdmin = !!currentSchool?.IsAdmin || isSudo;

    const [username, setUsername] = useState('');
    const [loading,  setLoading]  = useState(false);
    const [status,   setStatus]   = useState<Status>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!isAdmin || !currentSchool?.SchoolId) return;

        const trimmed = username.trim();
        if (!trimmed) {
            setStatus({ type: 'error', message: 'Моля, въведете потребителско име.' });
            return;
        }

        setLoading(true);
        setStatus(null);

        try {
            await   inviteUserToSchool(currentSchool.SchoolId, trimmed);
            setStatus({ type: 'success', message: `Покана е изпратена до „${trimmed}".` });
            setUsername('');
        } catch (err) {
            let msg = err instanceof Error ? err.message : String(err);

            // If apiRequest embeds a JSON body in the error message, parse it out
            try {
                const parsed = JSON.parse(msg);
                msg = parsed.message ?? parsed.error ?? msg;
                console.log(msg)
            } catch {
                // Not JSON — use msg as-is
            }

            if (msg.includes('User not found.')) { console.log("jr") }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: 500, margin: '0 auto', padding: '2.5rem 1rem' }}>

            {/* Page header */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Покани потребител</h2>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: 4 }}>
                    Въведете потребителско име, за да поканите член към{' '}
                    <strong>{currentSchool?.SchoolName ?? 'училището'}</strong>.
                </p>
            </div>

            {/* Card */}
            <div style={{ background: '#fff', border: '1px solid #e4e6ea', borderRadius: '1rem', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>

                {/* Icon badge */}
                <div style={{ width: 48, height: 48, borderRadius: '0.75rem', background: '#ede9fb', color: '#6c3de6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <UserPlus size={22} />
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Username field */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <label
                            htmlFor="invite-username"
                            style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#374151' }}
                        >
                            Потребителско име
                        </label>
                        <input
                            id="invite-username"
                            type="text"
                            placeholder="напр. ivan.petrov"
                            value={username}
                            onChange={e => { setUsername(e.target.value); setStatus(null); }}
                            disabled={!isAdmin || loading}
                            autoComplete="off"
                            style={{
                                padding: '0.625rem 0.875rem',
                                borderRadius: '0.5rem',
                                border: '1px solid #dde0e5',
                                background: !isAdmin ? '#f3f4f6' : '#f9fafb',
                                fontSize: '0.875rem',
                                outline: 'none',
                                fontFamily: 'inherit',
                                color: '#111827',
                                transition: 'border-color 160ms ease, box-shadow 160ms ease',
                            }}
                            onFocus={e => {
                                e.currentTarget.style.borderColor = '#6c3de6';
                                e.currentTarget.style.boxShadow  = '0 0 0 3px rgba(108,61,230,.12)';
                            }}
                            onBlur={e => {
                                e.currentTarget.style.borderColor = '#dde0e5';
                                e.currentTarget.style.boxShadow  = 'none';
                            }}
                        />
                    </div>

                    {/* Status banner */}
                    {status && (
                        <div style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.5rem',
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            background: status.type === 'success' ? '#d1fae5' : '#fee2e2',
                            color:      status.type === 'success' ? '#065f46' : '#b91c1c',
                        }}>
                            {status.message}
                        </div>
                    )}

                    {/* Non-admin warning */}
                    {!isAdmin && (
                        <div style={{ padding: '0.5rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.8125rem', background: '#fef3c7', color: '#92400e' }}>
                            Нямате права за поканване на потребители.
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!isAdmin || loading || !username.trim()}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            padding: '0.625rem 1.25rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            cursor: (!isAdmin || loading || !username.trim()) ? 'not-allowed' : 'pointer',
                            background: (!isAdmin || loading || !username.trim()) ? '#a78bfa' : '#6c3de6',
                            color: '#fff',
                            transition: 'background 160ms ease',
                            marginTop: '0.25rem',
                        }}
                        onMouseEnter={e => {
                            if (!(!isAdmin || loading || !username.trim()))
                                e.currentTarget.style.background = '#5b30c8';
                        }}
                        onMouseLeave={e => {
                            if (!(!isAdmin || loading || !username.trim()))
                                e.currentTarget.style.background = '#6c3de6';
                        }}
                    >
                        {loading ? (
                            <>
                                <Spinner />
                                Изпращане…
                            </>
                        ) : (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z"/>
                                </svg>
                                Изпрати покана
                            </>
                        )}
                    </button>

                </form>
            </div>
        </div>
    );
}

// ── Inline spinner (no extra dep) ─────────────────────────────────────────────
function Spinner() {
    return (
        <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            style={{ animation: 'spin 0.7s linear infinite' }}
        >
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
        </svg>
    );
}
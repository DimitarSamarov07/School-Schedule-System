// src/components/ClockTimePicker.tsx
import { useRef, useEffect, useCallback, useState } from "react";

interface Props {
    value: string;                 // "HH:MM" or "HH:MM:SS"
    onChange: (v: string) => void; // emits "HH:MM:00"
}

// ─── Canvas constants ───────────────────────────────────────
const S = 240, CX = 120, CY = 120, R = 108;
const C = {
    purple: "#7c5cf6", bg: "#f4f0ff", track: "#e6e0fa",
    text: "#1a1a2e", muted: "#9391a8", tick: "#ccc8e4",
};

// ─── Pure canvas helpers (outside component = stable) ───────
const pad = (n: number) => String(n).padStart(2, "0");

const hr12Angle = (h: number) => ((h % 12) / 12) * 2 * Math.PI - Math.PI / 2;
const minAngle  = (m: number) => (m / 60) * 2 * Math.PI - Math.PI / 2;
const isInner   = (h: number) => h === 0 || h >= 13;
const handLen   = (h: number) => isInner(h) ? R * 0.54 : R * 0.78;

function drawHand(ctx: CanvasRenderingContext2D, angle: number, len: number) {
    const tx = CX + Math.cos(angle) * len, ty = CY + Math.sin(angle) * len;
    ctx.beginPath(); ctx.moveTo(CX, CY); ctx.lineTo(tx, ty);
    ctx.strokeStyle = C.purple; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.arc(tx, ty, 16, 0, 2 * Math.PI);
    ctx.fillStyle = C.purple; ctx.fill();
}

function drawNum(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, sel: boolean, inner: boolean) {
    if (sel) {
        ctx.beginPath(); ctx.arc(x, y, inner ? 12 : 15, 0, 2 * Math.PI);
        ctx.fillStyle = "#fff"; ctx.fill();
    }
    ctx.font = `${inner ? 500 : 600} ${inner ? "12px" : "13px"} Inter,sans-serif`;
    ctx.fillStyle = sel ? C.purple : (inner ? C.muted : C.text);
    ctx.fillText(text, x, y);
}

function renderHours(ctx: CanvasRenderingContext2D, sel: number) {
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (let p = 0; p < 12; p++) {
        const a = (p / 12) * 2 * Math.PI - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(CX + Math.cos(a) * (R - 2), CY + Math.sin(a) * (R - 2));
        ctx.lineTo(CX + Math.cos(a) * (R - 8), CY + Math.sin(a) * (R - 8));
        ctx.strokeStyle = C.tick; ctx.lineWidth = 1.5; ctx.stroke();
    }
    drawHand(ctx, hr12Angle(sel), handLen(sel));
    // outer 1–12
    for (let p = 0; p < 12; p++) {
        const v = p === 0 ? 12 : p, a = hr12Angle(v);
        drawNum(ctx, String(v), CX + Math.cos(a) * R * 0.78, CY + Math.sin(a) * R * 0.78, sel === v, false);
    }
    // inner 0, 13–23
    for (let p = 0; p < 12; p++) {
        const v = p === 0 ? 0 : p + 12, a = hr12Angle(v === 0 ? 0 : v - 12);
        drawNum(ctx, pad(v), CX + Math.cos(a) * R * 0.54, CY + Math.sin(a) * R * 0.54, sel === v, true);
    }
}

function renderMinutes(ctx: CanvasRenderingContext2D, sel: number) {
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (let i = 0; i < 60; i++) {
        const a = (i / 60) * 2 * Math.PI - Math.PI / 2, big = i % 5 === 0;
        ctx.beginPath();
        ctx.moveTo(CX + Math.cos(a) * (R - 2), CY + Math.sin(a) * (R - 2));
        ctx.lineTo(CX + Math.cos(a) * (R - (big ? 10 : 5)), CY + Math.sin(a) * (R - (big ? 10 : 5)));
        ctx.strokeStyle = big ? C.tick : "#dbd8ee"; ctx.lineWidth = big ? 1.5 : 1; ctx.stroke();
    }
    drawHand(ctx, minAngle(sel), R * 0.78);
    for (let p = 0; p < 12; p++) {
        const v = p * 5, a = (p / 12) * 2 * Math.PI - Math.PI / 2;
        drawNum(ctx, pad(v), CX + Math.cos(a) * R * 0.78, CY + Math.sin(a) * R * 0.78, sel === v, false);
    }
}

function parseTime(s: string) {
    const [h = "0", m = "0"] = (s || "00:00").split(":");
    return { h: Math.min(23, Math.max(0, +h)), m: Math.min(59, Math.max(0, +m)) };
}

// ─── Component ───────────────────────────────────────────────
export function ClockTimePicker({ value, onChange }: Props) {
    const canvasRef  = useRef<HTMLCanvasElement>(null);
    const modeRef    = useRef<"h" | "m">("h");
    const timeRef    = useRef(parseTime(value));
    const dragging   = useRef(false);

    const [uiMode, setUiMode] = useState<"h" | "m">("h");
    const [uiTime, setUiTime] = useState(() => parseTime(value));

    // Sync when parent updates value
    useEffect(() => {
        const t = parseTime(value);
        timeRef.current = t;
        setUiTime(t);
    }, [value]);

    // Stable draw — reads from refs, never stale
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;
        const { h, m } = timeRef.current;
        const mode = modeRef.current;
        ctx.clearRect(0, 0, S, S);
        ctx.beginPath(); ctx.arc(CX, CY, R, 0, 2 * Math.PI); ctx.fillStyle = C.bg; ctx.fill();
        ctx.beginPath(); ctx.arc(CX, CY, R, 0, 2 * Math.PI); ctx.strokeStyle = C.track; ctx.lineWidth = 1.5; ctx.stroke();
        mode === "h" ? renderHours(ctx, h) : renderMinutes(ctx, m);
        ctx.beginPath(); ctx.arc(CX, CY, 4, 0, 2 * Math.PI); ctx.fillStyle = C.purple; ctx.fill();
    }, []);

    useEffect(() => { draw(); }, [uiMode, uiTime, draw]);

    // ─── Interaction ──────────────────────────────────────────
    function canvasXY(e: React.MouseEvent | React.TouchEvent) {
        const rect = canvasRef.current!.getBoundingClientRect();
        const src  = "touches" in e ? e.touches[0] : e;
        return { x: (src.clientX - rect.left) * (S / rect.width), y: (src.clientY - rect.top) * (S / rect.height) };
    }

    function hitHour(e: React.MouseEvent | React.TouchEvent) {
        const { x, y } = canvasXY(e);
        const dx = x - CX, dy = y - CY, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 10) return null;
        let a = Math.atan2(dy, dx) + Math.PI / 2; if (a < 0) a += 2 * Math.PI;
        const p = Math.round(a / (2 * Math.PI / 12)) % 12;
        return dist < R * 0.65 ? (p === 0 ? 0 : p + 12) : (p === 0 ? 12 : p);
    }

    function hitMin(e: React.MouseEvent | React.TouchEvent) {
        const { x, y } = canvasXY(e);
        const dx = x - CX, dy = y - CY;
        if (Math.sqrt(dx * dx + dy * dy) < 10) return null;
        let a = Math.atan2(dy, dx) + Math.PI / 2; if (a < 0) a += 2 * Math.PI;
        return Math.round(a / (2 * Math.PI / 60)) % 60;
    }

    function applyHit(e: React.MouseEvent | React.TouchEvent) {
        const cur = timeRef.current;
        if (modeRef.current === "h") {
            const v = hitHour(e); if (v === null) return;
            const next = { ...cur, h: v };
            timeRef.current = next; setUiTime(next);
            onChange(`${pad(next.h)}:${pad(next.m)}:00`);
        } else {
            const v = hitMin(e); if (v === null) return;
            const next = { ...cur, m: v };
            timeRef.current = next; setUiTime(next);
            onChange(`${pad(next.h)}:${pad(next.m)}:00`);
        }
        draw();
    }

    function switchMode(m: "h" | "m") { modeRef.current = m; setUiMode(m); }

    function onDown(e: React.MouseEvent | React.TouchEvent) {
        if ("touches" in e) e.preventDefault();
        dragging.current = true; applyHit(e);
    }
    function onMove(e: React.MouseEvent | React.TouchEvent) {
        if ("touches" in e) e.preventDefault();
        if (dragging.current) applyHit(e);
    }
    function onUp() {
        if (!dragging.current) return;
        dragging.current = false;
        if (modeRef.current === "h") setTimeout(() => switchMode("m"), 400);
    }

    return (
        <div className="flex flex-col items-center gap-3">
            {/* Digital readout */}
            <div className="text-3xl font-bold tabular-nums select-none leading-none">
                <span className={uiMode === "h" ? "text-purple-600" : "text-gray-300"}>{pad(uiTime.h)}</span>
                <span className="text-gray-300 mx-0.5">:</span>
                <span className={uiMode === "m" ? "text-purple-600" : "text-gray-300"}>{pad(uiTime.m)}</span>
            </div>

            {/* Mode pills */}
            <div className="flex gap-2">
                {(["h", "m"] as const).map(m => (
                    <button key={m} type="button" onClick={() => switchMode(m)}
                            className={`text-xs font-bold px-3 py-1 rounded-full border-2 transition-all ${
                                uiMode === m
                                    ? "bg-purple-500 border-purple-500 text-white"
                                    : "border-purple-200 text-purple-400 hover:border-purple-400"
                            }`}>
                        {m === "h" ? "ЧАС" : "МИН"}
                    </button>
                ))}
            </div>

            <canvas ref={canvasRef} width={S} height={S} className="cursor-pointer touch-none"
                    onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp}
                    onMouseLeave={() => { dragging.current = false; }}
                    onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
            />
        </div>
    );
}
"use client";

import { useState, useEffect } from "react";
import { calculateTimeDiff, getDramaticMessage, padZero } from "@/lib/time-utils";
import type { TimeDiff } from "@/lib/time-utils";

interface CounterProps {
    startDate: Date;
}

export default function Counter({ startDate }: CounterProps) {
    const [time, setTime] = useState<TimeDiff>({
        days: 0, hours: 0, minutes: 0, seconds: 0, totalDays: 0,
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const update = () => setTime(calculateTimeDiff(startDate));
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [startDate]);

    if (!mounted) {
        return (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div className="animate-pulse" style={{ color: "var(--text-muted)" }}>
                    Đang tính toán...
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={{ textAlign: "center" }}>
            {/* Main number */}
            <div style={{ marginBottom: 8 }}>
                <span className="counter-number">{time.days.toLocaleString()}</span>
            </div>

            {/* Label */}
            <div
                style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--text-dim)",
                    marginBottom: 28,
                }}
            >
                ngày solo
            </div>

            {/* H : M : S */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "clamp(20px, 6vw, 36px)",
                    marginBottom: 28,
                }}
            >
                {[
                    { value: padZero(time.hours), label: "giờ" },
                    { value: padZero(time.minutes), label: "phút" },
                    { value: padZero(time.seconds), label: "giây" },
                ].map((unit) => (
                    <div key={unit.label} style={{ textAlign: "center" }}>
                        <div className="counter-unit">{unit.value}</div>
                        <div className="counter-label">{unit.label}</div>
                    </div>
                ))}
            </div>

            {/* Message */}
            <p
                className="animate-fade-in delay-300"
                style={{
                    fontSize: "clamp(13px, 3.5vw, 15px)",
                    color: "var(--text-muted)",
                    lineHeight: 1.7,
                    maxWidth: 320,
                    margin: "0 auto",
                }}
            >
                {getDramaticMessage(time.totalDays)}
            </p>
        </div>
    );
}

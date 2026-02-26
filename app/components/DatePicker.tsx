"use client";

import { useState, useMemo } from "react";
import Dropdown from "./Dropdown";

interface DatePickerProps {
    onSelect: (date: Date) => void;
}

const MONTHS = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
    "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
    "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

function getDaysInMonth(month: number, year: number): number {
    return new Date(year, month + 1, 0).getDate();
}

export default function DatePicker({ onSelect }: DatePickerProps) {
    const [now] = useState(() => new Date());
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const [mode, setMode] = useState<"breakup" | "always">("breakup");
    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(currentMonth);
    const [day, setDay] = useState(1);

    // Year options (100 years back)
    const yearOptions = useMemo(() => {
        return Array.from({ length: 101 }, (_, i) => ({
            label: String(currentYear - i),
            value: currentYear - i,
        }));
    }, [currentYear]);

    // Month options
    const monthOptions = MONTHS.map((label, i) => ({ label, value: i }));

    // Day options based on month/year
    const maxDays = getDaysInMonth(month, year);
    const dayOptions = Array.from({ length: maxDays }, (_, i) => ({
        label: String(i + 1),
        value: i + 1,
    }));

    // Validate date is not in the future
    const isValid = useMemo(() => {
        const d = new Date(year, month, day);
        return d <= now && day <= maxDays;
    }, [year, month, day, maxDays, now]);

    function handleYearChange(y: number) {
        setYear(y);
        const newMax = getDaysInMonth(month, y);
        if (day > newMax) setDay(newMax);
    }

    function handleMonthChange(m: number) {
        setMonth(m);
        const newMax = getDaysInMonth(m, year);
        if (day > newMax) setDay(newMax);
    }

    function handleSubmit() {
        if (!isValid) return;
        onSelect(new Date(year, month, day));
    }

    return (
        <div
            className="card"
            style={{
                maxWidth: 380,
                margin: "0 auto",
                textAlign: "center",
            }}
        >
            {/* Toggle */}
            <div
                style={{
                    display: "flex",
                    gap: 4,
                    marginBottom: 20,
                    background: "var(--bg-subtle)",
                    borderRadius: "var(--radius-sm)",
                    padding: 3,
                }}
            >
                {(["breakup", "always"] as const).map((m) => (
                    <button
                        key={m}
                        onClick={() => setMode(m)}
                        style={{
                            flex: 1,
                            padding: "10px 10px",
                            borderRadius: 8,
                            border: "none",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            background: mode === m ? "var(--bg-card)" : "transparent",
                            color: mode === m ? "var(--text)" : "var(--text-muted)",
                            boxShadow: mode === m ? "var(--shadow-sm)" : "none",
                        }}
                    >
                        {m === "breakup" ? "Solo từ ngày..." : "Solo từ đầu 😎"}
                    </button>
                ))}
            </div>

            {/* Label */}
            <p
                style={{
                    fontSize: 14,
                    color: "var(--text-muted)",
                    marginBottom: 16,
                    lineHeight: 1.5,
                }}
            >
                {mode === "breakup"
                    ? "Bạn bắt đầu solo từ khi nào?"
                    : "Nhập ngày sinh — bạn solo ngay từ đầu! 🎈"}
            </p>

            {/* Custom Dropdowns */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <Dropdown
                    value={day}
                    options={dayOptions}
                    onChange={setDay}
                    placeholder="Ngày"
                />
                <Dropdown
                    value={month}
                    options={monthOptions}
                    onChange={handleMonthChange}
                    placeholder="Tháng"
                />
                <Dropdown
                    value={year}
                    options={yearOptions}
                    onChange={handleYearChange}
                    placeholder="Năm"
                />
            </div>

            {/* Date preview */}
            <div
                style={{
                    padding: "10px 16px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--bg-subtle)",
                    marginBottom: 16,
                    fontSize: 13,
                    color: "var(--text-muted)",
                    fontWeight: 500,
                }}
            >
                📅 {day} {MONTHS[month]} {year}
            </div>

            {/* Submit */}
            <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={!isValid}
                style={{
                    width: "100%",
                    opacity: isValid ? 1 : 0.35,
                    cursor: isValid ? "pointer" : "not-allowed",
                }}
            >
                {mode === "always" ? "Let's go! 🚀" : "Bắt đầu đếm →"}
            </button>
        </div>
    );
}

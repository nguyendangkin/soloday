"use client";

import { useState, useRef, useEffect } from "react";

interface DropdownProps {
    value: number;
    options: { label: string; value: number }[];
    onChange: (value: number) => void;
    placeholder?: string;
    width?: string;
}

export default function Dropdown({
    value,
    options,
    onChange,
    placeholder = "Chọn",
    width = "100%",
}: DropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Find selected label
    const selected = options.find((o) => o.value === value);

    // Close on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener("mousedown", handleClick);
            return () => document.removeEventListener("mousedown", handleClick);
        }
    }, [open]);

    // Scroll to selected item when opened
    useEffect(() => {
        if (open && listRef.current) {
            const activeEl = listRef.current.querySelector("[data-active='true']");
            if (activeEl) {
                activeEl.scrollIntoView({ block: "center", behavior: "instant" });
            }
        }
    }, [open]);

    return (
        <div ref={ref} style={{ position: "relative", width, flex: 1 }}>
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                style={{
                    width: "100%",
                    padding: "11px 32px 11px 14px",
                    borderRadius: "var(--radius-sm)",
                    border: `1px solid ${open ? "#a1a1aa" : "var(--border)"}`,
                    background: "var(--bg)",
                    color: selected ? "var(--text)" : "var(--text-dim)",
                    fontSize: 14,
                    fontFamily: "inherit",
                    fontWeight: 500,
                    textAlign: "left",
                    cursor: "pointer",
                    outline: "none",
                    transition: "all 0.15s ease",
                    boxShadow: open ? "0 0 0 3px rgba(0,0,0,0.04)" : "none",
                    position: "relative",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {selected ? selected.label : placeholder}

                {/* Chevron */}
                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: `translateY(-50%) rotate(${open ? "180deg" : "0"})`,
                        transition: "transform 0.2s ease",
                        pointerEvents: "none",
                    }}
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>

            {/* Dropdown list */}
            {open && (
                <div
                    ref={listRef}
                    className="animate-fade-in"
                    style={{
                        position: "absolute",
                        top: "calc(100% + 6px)",
                        left: 0,
                        right: 0,
                        zIndex: 9999,
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-sm)",
                        boxShadow: "var(--shadow-lg)",
                        maxHeight: 220,
                        overflowY: "auto",
                        overflowX: "hidden",
                        padding: 4,
                        animationDuration: "0.15s",
                    }}
                >
                    {options.map((opt) => {
                        const isActive = opt.value === value;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                data-active={isActive}
                                onClick={() => {
                                    onChange(opt.value);
                                    setOpen(false);
                                }}
                                style={{
                                    width: "100%",
                                    padding: "9px 12px",
                                    border: "none",
                                    borderRadius: 7,
                                    background: isActive ? "var(--bg-subtle)" : "transparent",
                                    color: isActive ? "var(--text)" : "var(--text-muted)",
                                    fontSize: 13,
                                    fontFamily: "inherit",
                                    fontWeight: isActive ? 600 : 400,
                                    textAlign: "left",
                                    cursor: "pointer",
                                    outline: "none",
                                    transition: "background 0.1s ease",
                                    display: "block",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = "var(--bg-hover)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = isActive
                                        ? "var(--bg-subtle)"
                                        : "transparent";
                                }}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

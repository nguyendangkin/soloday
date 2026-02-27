"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { getStartDate, clearData, addLoveHistory } from "@/lib/storage";
import { calculateTimeDiff } from "@/lib/time-utils";
import Counter from "../components/Counter";
import Achievements from "../components/Achievements";
import ShareCard from "../components/ShareCard";
import Footer from "../components/Footer";

const CongratulationModal = dynamic(
    () => import("../components/CongratulationModal"),
    { ssr: false }
);

export default function CounterPage() {
    const router = useRouter();
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [totalDays, setTotalDays] = useState(0);
    const [showReset, setShowReset] = useState(false);
    const [showCongratModal, setShowCongratModal] = useState(false);
    const [partnerName, setPartnerName] = useState("");
    const [confetti, setConfetti] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard
        setMounted(true);
        const saved = getStartDate();
        if (!saved) {
            router.replace("/");
            return;
        }

        setStartDate(saved);

        const update = () => {
            const diff = calculateTimeDiff(saved);
            setTotalDays(diff.totalDays);
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [router]);

    const handleReset = useCallback(() => {
        setConfetti(true);
        setTimeout(() => {
            clearData();
            router.replace("/");
        }, 2500);
    }, [router]);

    if (!mounted || !startDate) {
        return (
            <main
                style={{
                    minHeight: "100dvh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div className="animate-pulse" style={{ color: "var(--text-muted)" }}>
                    Đang tải...
                </div>
            </main>
        );
    }

    return (
        <main style={{ minHeight: "100dvh", padding: "32px 0 100px" }}>
            <div className="container">
                {/* Header */}
                <div
                    className="animate-fade-in"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 40,
                    }}
                >
                    <span
                        style={{
                            fontSize: 13,
                            fontWeight: 700,
                            letterSpacing: "-0.01em",
                            color: "var(--text)",
                        }}
                    >
                        Solo Day ✌️
                    </span>
                    <button
                        onClick={() => router.replace("/")}
                        className="btn-fun"
                        disabled={confetti}
                        style={{
                            background: "none",
                            border: "none",
                            color: "var(--text-muted)",
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: confetti ? "not-allowed" : "pointer",
                            padding: "6px 0",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            opacity: confetti ? 0.4 : 1,
                            transition: "opacity 0.2s ease",
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        Trang chủ
                    </button>
                </div>

                {/* Counter */}
                <div style={{ marginBottom: 40 }}>
                    <Counter startDate={startDate} />
                </div>

                <div className="divider" style={{ marginBottom: 28 }} />

                {/* Achievements */}
                <div style={{ marginBottom: 40 }}>
                    <Achievements totalDays={totalDays} />
                </div>

                <div className="divider" style={{ marginBottom: 28 }} />

                {/* Share */}
                <div style={{ marginBottom: 40 }}>
                    <h2 className="section-title" style={{ marginBottom: 14 }}>
                        Chia sẻ
                    </h2>
                    <ShareCard totalDays={totalDays} disabled={confetti} />
                </div>

                <div className="divider" style={{ marginBottom: 28 }} />

                {/* Reset */}
                <div className="animate-fade-in-up delay-600" style={{ textAlign: "center" }}>
                    {!showReset ? (
                        <button
                            className="btn btn-ghost"
                            onClick={() => setShowReset(true)}
                            disabled={confetti}
                            style={{
                                fontSize: 13,
                                opacity: confetti ? 0.4 : 1,
                                cursor: confetti ? "not-allowed" : "pointer",
                                transition: "opacity 0.2s ease",
                            }}
                        >
                            Đã có người yêu rồi! 🎉
                        </button>
                    ) : (
                        <div className="animate-fade-in-scale">
                            <p
                                style={{
                                    fontSize: 14,
                                    color: "var(--text-muted)",
                                    marginBottom: 14,
                                }}
                            >
                                Chúc mừng bạn nhé! 🥰
                            </p>

                            {/* Partner name input */}
                            <input
                                type="text"
                                placeholder="Tên người ấy (không bắt buộc)"
                                value={partnerName}
                                onChange={(e) => setPartnerName(e.target.value)}
                                style={{
                                    width: "100%",
                                    maxWidth: 260,
                                    padding: "10px 16px",
                                    borderRadius: 12,
                                    border: "1px solid var(--border)",
                                    background: "var(--bg-card)",
                                    fontSize: 13,
                                    fontFamily: "inherit",
                                    color: "var(--text)",
                                    outline: "none",
                                    textAlign: "center",
                                    marginBottom: 14,
                                    transition: "border-color 0.2s ease",
                                }}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "#a1a1aa"; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
                            />

                            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setShowCongratModal(true)}
                                    disabled={confetti}
                                    style={{
                                        fontSize: 13,
                                        opacity: confetti ? 0.4 : 1,
                                        cursor: confetti ? "not-allowed" : "pointer",
                                        transition: "opacity 0.2s ease",
                                    }}
                                >
                                    Xác nhận 🎊
                                </button>
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => { setShowReset(false); setPartnerName(""); }}
                                    disabled={confetti}
                                    style={{
                                        fontSize: 13,
                                        opacity: confetti ? 0.4 : 1,
                                        cursor: confetti ? "not-allowed" : "pointer",
                                        transition: "opacity 0.2s ease",
                                    }}
                                >
                                    Chưa đâu 😄
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Confetti */}
            {/* Congratulation Modal */}
            {showCongratModal && (
                <CongratulationModal
                    totalDays={totalDays}
                    partnerName={partnerName.trim() || undefined}
                    onClose={() => {
                        setShowCongratModal(false);
                        if (startDate) {
                            addLoveHistory(startDate, totalDays, partnerName);
                        }
                        setPartnerName("");
                        handleReset();
                    }}
                />
            )}

            {confetti && <ConfettiEffect />}
            <Footer />
        </main>
    );
}

function ConfettiEffect() {
    const colors = ["#fbbf24", "#34d399", "#60a5fa", "#f472b6", "#a78bfa", "#fb923c"];
    const [particles] = useState(() =>
        Array.from({ length: 30 }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            delay: `${Math.random() * 1.5}s`,
            size: 5 + Math.random() * 8,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
        }))
    );

    return (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100 }}>
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="confetti-particle"
                    style={{
                        left: p.left,
                        animationDelay: p.delay,
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        borderRadius: p.borderRadius,
                        transform: `rotate(${p.rotation}deg)`,
                    }}
                />
            ))}
        </div>
    );
}

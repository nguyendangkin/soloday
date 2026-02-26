"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getLoveHistory, removeLoveHistory } from "@/lib/storage";
import type { LoveHistory } from "@/lib/storage";
import { getLatestAchievement } from "@/lib/achievements";
import Footer from "../components/Footer";

export default function HistoryPage() {
    const router = useRouter();
    const [history, setHistory] = useState<LoveHistory[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setHistory(getLoveHistory());
    }, []);

    function handleDelete(id: string) {
        removeLoveHistory(id);
        setHistory(getLoveHistory());
    }

    if (!mounted) {
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
                        marginBottom: 32,
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
                        Lịch Sử Tình Yêu 💕
                    </span>
                    <button
                        onClick={() => router.replace("/")}
                        className="btn-fun"
                        style={{
                            background: "none",
                            border: "none",
                            color: "var(--text-muted)",
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: "pointer",
                            padding: "6px 0",
                        }}
                    >
                        ← Trang chủ
                    </button>
                </div>

                {/* Empty state */}
                {history.length === 0 && (
                    <div
                        className="animate-fade-in-up delay-200"
                        style={{
                            textAlign: "center",
                            padding: "60px 20px",
                        }}
                    >
                        <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
                        <p
                            style={{
                                fontSize: 15,
                                fontWeight: 600,
                                color: "var(--text)",
                                marginBottom: 8,
                            }}
                        >
                            Chưa có cuộc tình nào
                        </p>
                        <p
                            style={{
                                fontSize: 13,
                                color: "var(--text-muted)",
                                lineHeight: 1.6,
                                maxWidth: 280,
                                margin: "0 auto",
                            }}
                        >
                            Khi bạn xác nhận có người yêu, cuộc tình sẽ được lưu lại ở đây! 🌹
                        </p>
                    </div>
                )}

                {/* History list */}
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {history.map((record, index) => (
                        <div key={record.id}>
                            {/* Divider with label */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    margin: index === 0 ? "0 0 14px" : "24px 0 14px",
                                }}
                            >
                                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                                <span
                                    style={{
                                        fontSize: 11,
                                        fontWeight: 600,
                                        letterSpacing: "0.06em",
                                        textTransform: "uppercase",
                                        color: "var(--text-dim)",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    Cuộc tình #{history.length - index}
                                </span>
                                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                            </div>

                            <HistoryCard
                                record={record}
                                index={index}
                                onDelete={handleDelete}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </main>
    );
}

// ==========================================
// History Card Component
// ==========================================

interface HistoryCardProps {
    record: LoveHistory;
    index: number;
    onDelete: (id: string) => void;
}

function HistoryCard({ record, index, onDelete }: HistoryCardProps) {
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const achievement = getLatestAchievement(record.totalDays);
    const cardRef = useCallback(() => document.getElementById(`history-card-${record.id}`), [record.id]);

    const startDate = new Date(record.startDate);
    const endDate = new Date(record.endDate);

    const formatDate = (d: Date) =>
        d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

    const handleDownload = useCallback(async () => {
        const el = document.getElementById(`history-card-${record.id}`);
        if (!el) return;
        try {
            const { toPng } = await import("html-to-image");
            const dataUrl = await toPng(el, {
                pixelRatio: 2,
                quality: 1,
                cacheBust: true,
                style: { transform: "none", animation: "none" },
            });
            const link = document.createElement("a");
            link.download = `love-history-${record.totalDays}days.png`;
            link.href = dataUrl;
            link.click();
        } catch {
            alert("Không thể tải ảnh. Vui lòng thử lại!");
        }
    }, [record.id, record.totalDays]);

    const delayClass = index < 6 ? `delay-${(index + 1) * 100}` : "";

    return (
        <div className={`animate-fade-in-up ${delayClass}`}>
            {/* Card */}
            <div
                id={`history-card-${record.id}`}
                style={{
                    background: "linear-gradient(145deg, #fff5f5 0%, #ffffff 40%, #fef3f8 100%)",
                    border: "1px solid #fce7f3",
                    borderRadius: 20,
                    padding: "32px 24px 24px",
                    textAlign: "center",
                    boxShadow: "0 4px 16px rgba(244, 114, 182, 0.08)",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Decorative */}
                <div style={{ position: "absolute", top: 10, left: 14, fontSize: 14, opacity: 0.2 }}>💕</div>
                <div style={{ position: "absolute", top: 12, right: 14, fontSize: 12, opacity: 0.15 }}>💗</div>

                {/* Heart */}
                <div style={{ fontSize: 32, marginBottom: 8 }}>💖</div>

                {/* Days number */}
                <div
                    style={{
                        fontSize: "clamp(28px, 8vw, 40px)",
                        fontWeight: 800,
                        letterSpacing: "-0.04em",
                        lineHeight: 1,
                        color: "#111111",
                        marginBottom: 4,
                        fontFamily: "'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif",
                    }}
                >
                    {record.totalDays.toLocaleString()}
                </div>
                <div
                    style={{
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#9ca3af",
                        marginBottom: 16,
                        fontFamily: "'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif",
                    }}
                >
                    ngày solo đã kết thúc
                </div>

                {/* Partner name — dedication line */}
                {record.partnerName && (
                    <div
                        style={{
                            fontSize: 12,
                            fontWeight: 500,
                            fontStyle: "italic",
                            color: "#f472b6",
                            marginBottom: 14,
                            fontFamily: "'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif",
                        }}
                    >
                        ❤️ {record.partnerName}
                    </div>
                )}

                {/* Achievement badge */}
                {achievement && (
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "6px 14px",
                            borderRadius: 9999,
                            border: "1px solid #fce7f3",
                            background: "#fdf2f8",
                            marginBottom: 14,
                        }}
                    >
                        <span style={{ fontSize: 14 }}>{achievement.icon}</span>
                        <span
                            style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#1a1a1a",
                                fontFamily: "'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif",
                            }}
                        >
                            {achievement.name}
                        </span>
                    </div>
                )}

                {/* Date range */}
                <div
                    style={{
                        fontSize: 12,
                        color: "#9ca3af",
                        fontFamily: "'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif",
                    }}
                >
                    {formatDate(startDate)} → {formatDate(endDate)}
                </div>

                {/* Watermark */}
                <div
                    style={{
                        marginTop: 14,
                        fontSize: 9,
                        fontWeight: 500,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#d1d5db",
                        fontFamily: "'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif",
                    }}
                >
                    solo-days.app
                </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button
                    className="btn btn-primary"
                    onClick={handleDownload}
                    style={{
                        flex: 1,
                        fontSize: 13,
                        padding: "10px 16px",
                        background: "#ec4899",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#db2777"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#ec4899"; }}
                >
                    Chia sẻ ✌️
                </button>

                {!showConfirmDelete ? (
                    <button
                        className="btn btn-ghost"
                        onClick={() => setShowConfirmDelete(true)}
                        style={{ fontSize: 13, padding: "10px 16px" }}
                    >
                        Xóa 🗑️
                    </button>
                ) : (
                    <div style={{ display: "flex", gap: 6 }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => onDelete(record.id)}
                            style={{
                                fontSize: 12,
                                padding: "10px 14px",
                                background: "#ef4444",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "#dc2626"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "#ef4444"; }}
                        >
                            Xác nhận
                        </button>
                        <button
                            className="btn btn-ghost"
                            onClick={() => setShowConfirmDelete(false)}
                            style={{ fontSize: 12, padding: "10px 14px" }}
                        >
                            Hủy
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

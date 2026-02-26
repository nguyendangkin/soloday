"use client";

import { useCallback, useRef } from "react";
import { toPng } from "html-to-image";
import { getLatestAchievement } from "@/lib/achievements";

interface CongratulationModalProps {
    totalDays: number;
    partnerName?: string;
    onClose: () => void;
}

/**
 * Get a congratulatory quote about ending solo days
 */
function getCongratQuote(totalDays: number, name?: string): string {
    const who = name || "người ấy";
    const quotes = [
        `${totalDays} ngày solo đã kết thúc — chương mới với ${who} bắt đầu! 💕`,
        `Hành trình ${totalDays} ngày solo khép lại, tình yêu với ${who} mở ra! 🥰`,
        `${totalDays} ngày tận hưởng cuộc sống — giờ có ${who} cùng tận hưởng! 💑`,
        `Sau ${totalDays} ngày, cuối cùng cũng tìm được ${who}! 🌹`,
        `${totalDays} ngày solo — xứng đáng với tình yêu từ ${who}! ✨`,
        `Kết thúc ${totalDays} ngày solo bằng câu chuyện tình yêu với ${who}! 💘`,
    ];
    return quotes[totalDays % quotes.length];
}

export default function CongratulationModal({ totalDays, partnerName, onClose }: CongratulationModalProps) {
    const achievement = getLatestAchievement(totalDays);
    const quote = getCongratQuote(totalDays, partnerName);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleDownload = useCallback(async () => {
        if (!cardRef.current) return;

        try {
            const dataUrl = await toPng(cardRef.current, {
                pixelRatio: 2,
                quality: 1,
                cacheBust: true,
                style: {
                    transform: "none",
                    animation: "none",
                },
            });

            const link = document.createElement("a");
            link.download = `solo-days-goodbye-${totalDays}.png`;
            link.href = dataUrl;
            link.click();
        } catch {
            alert("Không thể tải ảnh. Vui lòng thử lại!");
        }
    }, [totalDays]);

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 50,
                padding: 20,
            }}
        >
            <div
                className="animate-fade-in-scale"
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 380,
                    maxHeight: "90vh",
                    overflowY: "auto",
                }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        background: "#f3f4f6",
                        border: "none",
                        fontSize: 14,
                        cursor: "pointer",
                        color: "#6b7280",
                        zIndex: 10,
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        transition: "all 0.2s ease",
                        lineHeight: 1,
                        fontWeight: 600,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#e5e7eb";
                        e.currentTarget.style.color = "#374151";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#f3f4f6";
                        e.currentTarget.style.color = "#6b7280";
                    }}
                >
                    ✕
                </button>

                {/* Card for screenshot */}
                <div
                    ref={cardRef}
                    style={{
                        background: "linear-gradient(145deg, #fff5f5 0%, #ffffff 40%, #fef3f8 100%)",
                        border: "1px solid #fce7f3",
                        borderRadius: 20,
                        padding: "40px 28px 32px",
                        textAlign: "center",
                        boxShadow: "0 8px 32px rgba(244, 114, 182, 0.12)",
                        position: "relative",
                        overflow: "hidden",
                        marginBottom: 14,
                    }}
                >
                    {/* Decorative hearts */}
                    <div
                        style={{
                            position: "absolute",
                            top: 12,
                            left: 16,
                            fontSize: 18,
                            opacity: 0.3,
                        }}
                    >
                        💕
                    </div>
                    <div
                        style={{
                            position: "absolute",
                            top: 16,
                            right: 18,
                            fontSize: 14,
                            opacity: 0.25,
                        }}
                    >
                        💗
                    </div>
                    <div
                        style={{
                            position: "absolute",
                            bottom: 40,
                            left: 20,
                            fontSize: 12,
                            opacity: 0.2,
                        }}
                    >
                        ✨
                    </div>
                    <div
                        style={{
                            position: "absolute",
                            bottom: 50,
                            right: 16,
                            fontSize: 14,
                            opacity: 0.2,
                        }}
                    >
                        🌹
                    </div>

                    {/* Big heart emoji */}
                    <div
                        style={{
                            fontSize: 40,
                            marginBottom: 12,
                        }}
                    >
                        💖
                    </div>

                    {/* Achievement badge */}
                    {achievement && (
                        <div
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "8px 16px",
                                borderRadius: 9999,
                                border: "1px solid #fce7f3",
                                background: "#fdf2f8",
                                marginBottom: 14,
                            }}
                        >
                            <span style={{ fontSize: 16 }}>{achievement.icon}</span>
                            <span
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "#1a1a1a",
                                    fontFamily: "'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif",
                                }}
                            >
                                {achievement.name}
                            </span>
                        </div>
                    )}

                    {/* Title */}
                    <div
                        style={{
                            fontSize: 14,
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            color: "#ec4899",
                            marginBottom: 16,
                            fontFamily: "'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif",
                        }}
                    >
                        Chúc mừng!
                    </div>

                    {/* Days */}
                    <div
                        style={{
                            fontSize: "clamp(36px, 10vw, 52px)",
                            fontWeight: 800,
                            letterSpacing: "-0.04em",
                            lineHeight: 1,
                            color: "#111111",
                            marginBottom: 6,
                            fontFamily: "'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif",
                        }}
                    >
                        {totalDays.toLocaleString()}
                    </div>
                    <div
                        style={{
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "#9ca3af",
                            marginBottom: 20,
                            fontFamily: "'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif",
                        }}
                    >
                        ngày solo đã kết thúc 🎉
                    </div>

                    {/* Partner name — dedication line */}
                    {partnerName && (
                        <div
                            style={{
                                fontSize: 13,
                                fontWeight: 500,
                                fontStyle: "italic",
                                color: "#f472b6",
                                marginBottom: 18,
                                fontFamily: "'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif",
                            }}
                        >
                            ❤️ {partnerName}
                        </div>
                    )}

                    {/* Quote */}
                    <p
                        style={{
                            fontSize: 13,
                            color: "#6b7280",
                            lineHeight: 1.6,
                            maxWidth: 280,
                            margin: "0 auto",
                            fontFamily: "'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif",
                        }}
                    >
                        &quot;{quote}&quot;
                    </p>

                    {/* Watermark */}
                    <div
                        style={{
                            marginTop: 20,
                            fontSize: 10,
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
                <div style={{ display: "flex", gap: 8 }}>
                    <button
                        className="btn btn-primary"
                        onClick={handleDownload}
                        style={{
                            flex: 1,
                            fontSize: 14,
                            background: "#ec4899",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#db2777";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#ec4899";
                        }}
                    >
                        Chia sẻ ✌️
                    </button>
                </div>
            </div>
        </div>
    );
}

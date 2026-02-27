"use client";

import { useCallback, useRef, useState } from "react";
import { getLatestAchievement } from "@/lib/achievements";
import { getShareQuote } from "@/lib/time-utils";

interface ShareCardProps {
    totalDays: number;
    disabled?: boolean;
}

const MOODS = [
    { emoji: "🚀", label: "Đang vào guồng" },
    { emoji: "😌", label: "Bình yên thật sự" },
    { emoji: "✨", label: "Sáng tạo bùng nổ" },
    { emoji: "🎯", label: "Khóa mục tiêu rồi" },
    { emoji: "🫶", label: "Ấm lòng lắm nha" },
    { emoji: "🌙", label: "Chill thôi anh em" },
    { emoji: "🤯", label: "Ủa hay vậy ta?!" },
    { emoji: "🔥", label: "Đang cháy đây nè" },
    { emoji: "😎", label: "Tự tin vào rồi đó" },
    { emoji: "🌅", label: "Ngóng ngày mai ghê" },
];

export default function ShareCard({ totalDays, disabled = false }: ShareCardProps) {
    const achievement = getLatestAchievement(totalDays);
    const quote = getShareQuote(totalDays);
    const cardRef = useRef<HTMLDivElement>(null);

    const [mood, setMood] = useState<{ emoji: string; label: string } | null>(null);
    const [note, setNote] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadCard = useCallback(async () => {
        if (!cardRef.current || isDownloading) return;

        setIsDownloading(true);
        try {
            const { toPng } = await import("html-to-image");
            // Wait a tick for UI to stabilize
            await new Promise((resolve) => setTimeout(resolve, 50));

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
            link.download = `soloday-${totalDays}.png`;
            link.href = dataUrl;
            link.click();
        } catch {
            alert("Không thể tải ảnh. Vui lòng thử lại!");
        } finally {
            setIsDownloading(false);
        }
    }, [totalDays, isDownloading]);

    const cardContent = (
        <div
            style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 20,
                padding: "36px 28px",
                textAlign: "center",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
                position: "relative",
                overflow: "hidden",
            }}
        >
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
                ngày solo
            </div>

            {/* Badge */}
            {achievement && (
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 16px",
                        borderRadius: 9999,
                        border: "1px solid #e5e7eb",
                        background: "#f0f0f0",
                        marginBottom: 18,
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

            {/* Custom Mood & Note Area */}
            {(mood || note) && (
                <div
                    style={{
                        marginTop: 24,
                        padding: "16px",
                        background: "#fafafa",
                        borderRadius: 16,
                        border: "1px dashed #e5e7eb",
                        textAlign: "left",
                        fontFamily: "'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif",
                    }}
                >
                    {mood && (
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#111", marginBottom: note ? 6 : 0 }}>
                            Đang cảm thấy {mood.emoji} {mood.label}
                        </div>
                    )}
                    {note && (
                        <div style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.6, wordBreak: "break-word", fontStyle: "italic" }}>
                            &quot;{note}&quot;
                        </div>
                    )}
                </div>
            )}

            {/* Watermark */}
            <div
                style={{
                    marginTop: 24,
                    fontSize: 10,
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#9ca3af",
                    opacity: 0.5,
                    fontFamily: "'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif",
                }}
            >
                soloday.onrender.com
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in-up delay-400">
            {/* Customization Inputs */}
            <div style={{ marginBottom: 24, textAlign: "left" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 12 }}>
                    Cảm xúc hôm nay:
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                    {MOODS.map((m) => {
                        const isSelected = mood?.label === m.label;
                        return (
                            <button
                                key={m.label}
                                onClick={() => setMood(isSelected ? null : m)}
                                style={{
                                    padding: "8px 14px",
                                    borderRadius: 20,
                                    fontSize: 13,
                                    background: isSelected ? "var(--highlight)" : "#f3f4f6",
                                    color: isSelected ? "#fff" : "#4b5563",
                                    border: "none",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                    fontWeight: isSelected ? 600 : 500,
                                }}
                            >
                                {m.emoji} {m.label}
                            </button>
                        );
                    })}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", margin: 0 }}>
                        Ghi chú ngắn trên ảnh:
                    </p>
                    <span style={{ fontSize: 11, color: note.length === 60 ? "#ef4444" : "#9ca3af", fontWeight: 500 }}>
                        {note.length}/60
                    </span>
                </div>
                <input
                    type="text"
                    maxLength={60}
                    placeholder="VD: Một ngày tuyệt vời..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                        fontSize: 14,
                        fontFamily: "inherit",
                        outline: "none",
                        background: "#fff",
                        color: "var(--text)",
                        transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--highlight)")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
            </div>

            {/* Visible Card (No margin, normal display) */}
            <div style={{ marginBottom: 24 }}>
                {cardContent}
            </div>

            {/* Hidden Export Wrapper (with margin/gradient, strictly for the downloaded image snapshot) */}
            <div style={{ position: "absolute", left: "-9999px", top: 0, opacity: 0, pointerEvents: "none" }}>
                <div
                    ref={cardRef}
                    style={{
                        padding: "40px",
                        background: "linear-gradient(135deg, #f6f8fb 0%, #e5e7eb 100%)",
                        borderRadius: 24,
                        // Fix the width to 400px so it perfectly resembles a social media post ratio
                        width: "400px",
                        boxSizing: "border-box",
                    }}
                >
                    {cardContent}
                </div>
            </div>

            {/* Download button */}
            <div style={{ display: "flex" }}>
                <button
                    className="btn btn-primary"
                    onClick={handleDownloadCard}
                    disabled={isDownloading || disabled}
                    style={{
                        flex: 1,
                        fontSize: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        opacity: (isDownloading || disabled) ? 0.4 : 1,
                        cursor: (isDownloading || disabled) ? "not-allowed" : "pointer",
                        transition: "opacity 0.2s ease",
                    }}
                >
                    {isDownloading ? (
                        <>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ animation: "spin 0.8s linear infinite" }}
                            >
                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                            </svg>
                            Đang tạo ảnh...
                        </>
                    ) : (
                        <>Chia sẻ với bạn bè ✌️</>
                    )}
                </button>
            </div>
        </div>
    );
}

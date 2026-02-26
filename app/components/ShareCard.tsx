"use client";

import { useCallback, useRef } from "react";
import { getLatestAchievement } from "@/lib/achievements";
import { getShareQuote } from "@/lib/time-utils";

interface ShareCardProps {
    totalDays: number;
}

export default function ShareCard({ totalDays }: ShareCardProps) {
    const achievement = getLatestAchievement(totalDays);
    const quote = getShareQuote(totalDays);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleDownloadCard = useCallback(async () => {
        if (!cardRef.current) return;

        try {
            const { toPng } = await import("html-to-image");
            const dataUrl = await toPng(cardRef.current, {
                pixelRatio: 2,
                quality: 1,
                cacheBust: true,
                // Resolve CSS variables to actual values before rendering
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
        }
    }, [totalDays]);

    return (
        <div className="animate-fade-in-up delay-400">
            {/* Card for screenshot - uses inline styles to ensure correct rendering in image */}
            <div
                ref={cardRef}
                style={{
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 20,
                    padding: "36px 28px",
                    textAlign: "center",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                    position: "relative",
                    overflow: "hidden",
                    marginBottom: 14,
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

                {/* Watermark */}
                <div
                    style={{
                        marginTop: 20,
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

            {/* Download button */}
            <div style={{ display: "flex" }}>
                <button
                    className="btn btn-primary"
                    onClick={handleDownloadCard}
                    style={{ flex: 1, fontSize: 14 }}
                >
                    Chia sẻ với bạn bè ✌️
                </button>
            </div>
        </div>
    );
}

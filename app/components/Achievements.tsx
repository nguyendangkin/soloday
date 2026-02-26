"use client";

import {
    ACHIEVEMENTS,
    getUnlockedAchievements,
    getNextAchievement,
    getProgressToNext,
} from "@/lib/achievements";
import type { Achievement } from "@/lib/achievements";

interface AchievementsProps {
    totalDays: number;
}

export default function Achievements({ totalDays }: AchievementsProps) {
    const unlocked = getUnlockedAchievements(totalDays);
    const next = getNextAchievement(totalDays);
    const progress = getProgressToNext(totalDays);
    const unlockedIds = new Set(unlocked.map((a) => a.id));

    function getStatus(a: Achievement): "unlocked" | "next" | "locked" {
        if (unlockedIds.has(a.id)) return "unlocked";
        if (next && a.id === next.id) return "next";
        return "locked";
    }

    return (
        <div className="animate-fade-in-up delay-200">
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 14,
                }}
            >
                <h2 className="section-title">Thành tựu</h2>
                <span
                    style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text-muted)",
                    }}
                >
                    {unlocked.length}/{ACHIEVEMENTS.length}
                </span>
            </div>

            {/* List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {ACHIEVEMENTS.map((achievement, index) => {
                    const status = getStatus(achievement);

                    return (
                        <div
                            key={achievement.id}
                            className={`achievement-item ${status}`}
                            style={{ animationDelay: `${index * 0.04}s` }}
                        >
                            {/* Icon */}
                            <div className="achievement-icon">{achievement.icon}</div>

                            {/* Content */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        marginBottom: 2,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 700,
                                            color: status === "unlocked" ? "var(--text)" : "var(--text-muted)",
                                        }}
                                    >
                                        {achievement.name}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 11,
                                            fontWeight: 500,
                                            color: "var(--text-dim)",
                                        }}
                                    >
                                        {achievement.days} ngày
                                    </span>
                                </div>
                                <p
                                    style={{
                                        fontSize: 12,
                                        color: "var(--text-dim)",
                                        lineHeight: 1.5,
                                    }}
                                >
                                    {achievement.description}
                                </p>

                                {/* Progress for next */}
                                {status === "next" && (
                                    <div
                                        style={{
                                            marginTop: 8,
                                            height: 4,
                                            background: "var(--bg-subtle)",
                                            borderRadius: "var(--radius-full)",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <div
                                            style={{
                                                height: "100%",
                                                width: `${progress * 100}%`,
                                                background: "var(--text-muted)",
                                                borderRadius: "var(--radius-full)",
                                                transition: "width 1s ease",
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Check */}
                            {status === "unlocked" && (
                                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>✓</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

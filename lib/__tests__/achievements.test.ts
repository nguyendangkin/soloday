import { describe, it, expect } from "vitest";
import {
    ACHIEVEMENTS,
    getUnlockedAchievements,
    getNextAchievement,
    getLatestAchievement,
    getProgressToNext,
} from "../achievements";

describe("getUnlockedAchievements", () => {
    it("should return empty array for 0 days", () => {
        expect(getUnlockedAchievements(0)).toEqual([]);
    });

    it("should return first achievement at exactly 7 days", () => {
        const result = getUnlockedAchievements(7);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("starter");
    });

    it("should return multiple achievements at 100 days", () => {
        const result = getUnlockedAchievements(100);
        // 7, 30, 100 days => 3 achievements
        expect(result).toHaveLength(3);
        expect(result.map((a) => a.id)).toEqual([
            "starter",
            "explorer",
            "centurion",
        ]);
    });

    it("should return all achievements for very large number", () => {
        const result = getUnlockedAchievements(999999);
        expect(result).toHaveLength(ACHIEVEMENTS.length);
    });
});

describe("getNextAchievement", () => {
    it("should return first achievement for 0 days", () => {
        const result = getNextAchievement(0);
        expect(result).not.toBeNull();
        expect(result!.id).toBe("starter");
        expect(result!.days).toBe(7);
    });

    it("should return correct next after partial progress", () => {
        const result = getNextAchievement(50);
        expect(result).not.toBeNull();
        expect(result!.id).toBe("centurion");
        expect(result!.days).toBe(100);
    });

    it("should return null when all achievements unlocked", () => {
        const maxDays = ACHIEVEMENTS[ACHIEVEMENTS.length - 1].days;
        const result = getNextAchievement(maxDays);
        expect(result).toBeNull();
    });
});

describe("getLatestAchievement", () => {
    it("should return null for 0 days", () => {
        expect(getLatestAchievement(0)).toBeNull();
    });

    it("should return latest unlocked achievement", () => {
        const result = getLatestAchievement(365);
        expect(result).not.toBeNull();
        expect(result!.id).toBe("champion");
    });

    it("should return last achievement for max days", () => {
        const result = getLatestAchievement(999999);
        expect(result).not.toBeNull();
        expect(result!.id).toBe("universe");
    });
});

describe("getProgressToNext", () => {
    it("should return 0 for 0 days (before any achievement)", () => {
        const result = getProgressToNext(0);
        expect(result).toBe(0);
    });

    it("should calculate correct progress between achievements", () => {
        // Between 7 (starter) and 30 (explorer), at day 7
        const result = getProgressToNext(7);
        // progress = 7 - 7 = 0, range = 30 - 7 = 23
        expect(result).toBeCloseTo(0);
    });

    it("should return partial progress correctly", () => {
        // Between 7 and 30, at day 18
        // progress = 18 - 7 = 11, range = 30 - 7 = 23
        const result = getProgressToNext(18);
        expect(result).toBeCloseTo(11 / 23, 5);
    });

    it("should return 1 when all achievements unlocked", () => {
        const maxDays = ACHIEVEMENTS[ACHIEVEMENTS.length - 1].days;
        const result = getProgressToNext(maxDays);
        expect(result).toBe(1);
    });
});

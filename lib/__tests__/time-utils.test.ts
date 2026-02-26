import { describe, it, expect, vi, afterEach } from "vitest";
import {
    calculateTimeDiff,
    getDramaticMessage,
    getShareQuote,
    padZero,
} from "../time-utils";

describe("calculateTimeDiff", () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it("should return all zeros when startDate is in the future", () => {
        const futureDate = new Date(Date.now() + 86400000); // +1 day
        const result = calculateTimeDiff(futureDate);
        expect(result).toEqual({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            totalDays: 0,
        });
    });

    it("should calculate correct time difference", () => {
        // Fix "now" to a known time
        vi.useFakeTimers();
        const now = new Date("2025-03-01T12:00:00Z");
        vi.setSystemTime(now);

        // startDate = 2 days, 3 hours, 15 minutes, 30 seconds ago
        const start = new Date("2025-02-27T08:44:30Z");
        const result = calculateTimeDiff(start);

        expect(result.days).toBe(2);
        expect(result.hours).toBe(3);
        expect(result.minutes).toBe(15);
        expect(result.seconds).toBe(30);
        expect(result.totalDays).toBe(2);
    });

    it("should return 0 days for same-day difference", () => {
        vi.useFakeTimers();
        const now = new Date("2025-03-01T12:00:00Z");
        vi.setSystemTime(now);

        const start = new Date("2025-03-01T10:30:00Z");
        const result = calculateTimeDiff(start);

        expect(result.days).toBe(0);
        expect(result.hours).toBe(1);
        expect(result.minutes).toBe(30);
        expect(result.totalDays).toBe(0);
    });
});

describe("getDramaticMessage", () => {
    it("should return correct message for < 7 days", () => {
        expect(getDramaticMessage(0)).toContain("Hành trình");
        expect(getDramaticMessage(6)).toContain("Hành trình");
    });

    it("should return correct message for < 30 days", () => {
        expect(getDramaticMessage(7)).toContain("thời gian tuyệt vời");
    });

    it("should return correct message for < 100 days", () => {
        expect(getDramaticMessage(30)).toContain("Tự do");
    });

    it("should return correct message for 365+ days", () => {
        expect(getDramaticMessage(365)).toContain("1 năm");
    });

    it("should return correct message for 60+ years (21900+ days)", () => {
        expect(getDramaticMessage(22000)).toContain("vũ trụ");
    });
});

describe("getShareQuote", () => {
    it("should return a string containing the total days", () => {
        const quote = getShareQuote(42);
        expect(quote).toContain("42");
    });

    it("should cycle through quotes deterministically", () => {
        // quotes array has 6 items, index = totalDays % 6
        // Same index should produce same quote pattern (same suffix)
        const q0 = getShareQuote(0);
        const q6 = getShareQuote(6);
        // Both use index 0 — same template but different number prefix
        expect(q0).toContain("ngày tận hưởng cuộc sống");
        expect(q6).toContain("ngày tận hưởng cuộc sống");
    });
});

describe("padZero", () => {
    it("should pad single digit with leading zero", () => {
        expect(padZero(0)).toBe("00");
        expect(padZero(5)).toBe("05");
        expect(padZero(9)).toBe("09");
    });

    it("should keep double digits unchanged", () => {
        expect(padZero(10)).toBe("10");
        expect(padZero(23)).toBe("23");
        expect(padZero(59)).toBe("59");
    });

    it("should handle numbers larger than 99", () => {
        expect(padZero(100)).toBe("100");
    });
});

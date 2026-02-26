import { describe, it, expect, beforeEach } from "vitest";
import {
    saveStartDate,
    getStartDate,
    clearData,
    hasStartDate,
    getLoveHistory,
    addLoveHistory,
    removeLoveHistory,
    importBackup,
} from "../storage";

describe("Storage — Start Date", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("should return null when no start date is saved", () => {
        expect(getStartDate()).toBeNull();
    });

    it("should save and retrieve start date correctly", () => {
        const date = new Date("2025-01-15T10:00:00Z");
        saveStartDate(date);

        const result = getStartDate();
        expect(result).not.toBeNull();
        expect(result!.toISOString()).toBe(date.toISOString());
    });

    it("should return null for invalid stored date", () => {
        localStorage.setItem("fa-counter-start-date", "not-a-date");
        expect(getStartDate()).toBeNull();
    });

    it("hasStartDate should return false when empty", () => {
        expect(hasStartDate()).toBe(false);
    });

    it("hasStartDate should return true after saving", () => {
        saveStartDate(new Date());
        expect(hasStartDate()).toBe(true);
    });

    it("clearData should remove the start date", () => {
        saveStartDate(new Date());
        expect(hasStartDate()).toBe(true);

        clearData();
        expect(hasStartDate()).toBe(false);
    });
});

describe("Storage — Love History", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("should return empty array when no history exists", () => {
        expect(getLoveHistory()).toEqual([]);
    });

    it("should return empty array for corrupted JSON", () => {
        localStorage.setItem("fa-counter-love-history", "{invalid}");
        expect(getLoveHistory()).toEqual([]);
    });

    it("should add a love history record", () => {
        const startDate = new Date("2024-06-01");
        addLoveHistory(startDate, 100, "Test Partner");

        const history = getLoveHistory();
        expect(history).toHaveLength(1);
        expect(history[0].totalDays).toBe(100);
        expect(history[0].partnerName).toBe("Test Partner");
        expect(history[0].id).toBeDefined();
    });

    it("should add records in newest-first order", () => {
        addLoveHistory(new Date("2024-01-01"), 50, "First");
        addLoveHistory(new Date("2024-06-01"), 100, "Second");

        const history = getLoveHistory();
        expect(history).toHaveLength(2);
        expect(history[0].partnerName).toBe("Second");
        expect(history[1].partnerName).toBe("First");
    });

    it("should handle empty/whitespace partner name as undefined", () => {
        addLoveHistory(new Date(), 10, "   ");
        const history = getLoveHistory();
        expect(history[0].partnerName).toBeUndefined();
    });

    it("should remove a love history record by id", () => {
        addLoveHistory(new Date(), 50, "Alice");
        addLoveHistory(new Date(), 100, "Bob");

        const history = getLoveHistory();
        const idToRemove = history[0].id;

        removeLoveHistory(idToRemove);

        const updated = getLoveHistory();
        expect(updated).toHaveLength(1);
        expect(updated[0].partnerName).toBe("Alice");
    });
});

describe("Storage — Import Backup", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("should reject non-JSON file", async () => {
        const file = new File(["not json"], "bad.json", {
            type: "application/json",
        });
        const result = await importBackup(file);
        expect(result.success).toBe(false);
        expect(result.message).toContain("Không thể đọc file");
    });

    it("should reject file with wrong appId", async () => {
        const data = JSON.stringify({
            appId: "wrong-app",
            version: 1,
            data: {},
        });
        const file = new File([data], "backup.json", {
            type: "application/json",
        });
        const result = await importBackup(file);
        expect(result.success).toBe(false);
        expect(result.message).toContain("không đúng định dạng");
    });

    it("should reject file with missing data field", async () => {
        const data = JSON.stringify({
            appId: "solo-days",
            version: 1,
        });
        const file = new File([data], "backup.json", {
            type: "application/json",
        });
        const result = await importBackup(file);
        expect(result.success).toBe(false);
        expect(result.message).toContain("bị hỏng");
    });

    it("should reject file with invalid startDate", async () => {
        const data = JSON.stringify({
            appId: "solo-days",
            version: 1,
            data: {
                startDate: "not-a-date",
                loveHistory: [],
            },
        });
        const file = new File([data], "backup.json", {
            type: "application/json",
        });
        const result = await importBackup(file);
        expect(result.success).toBe(false);
        expect(result.message).toContain("không hợp lệ");
    });

    it("should successfully import valid backup", async () => {
        const data = JSON.stringify({
            appId: "solo-days",
            version: 1,
            exportedAt: new Date().toISOString(),
            data: {
                startDate: "2025-01-01T00:00:00Z",
                loveHistory: [
                    {
                        id: "abc123",
                        startDate: "2024-01-01T00:00:00Z",
                        endDate: "2024-06-01T00:00:00Z",
                        totalDays: 152,
                        partnerName: "Test",
                    },
                ],
            },
        });
        const file = new File([data], "backup.json", {
            type: "application/json",
        });

        const result = await importBackup(file);
        expect(result.success).toBe(true);
        expect(result.message).toContain("thành công");

        // Verify data was written
        const startDate = getStartDate();
        expect(startDate).not.toBeNull();
        expect(startDate!.toISOString()).toBe("2025-01-01T00:00:00.000Z");

        const history = getLoveHistory();
        expect(history).toHaveLength(1);
        expect(history[0].partnerName).toBe("Test");
    });

    it("should clear startDate when backup has null startDate", async () => {
        // First save something
        saveStartDate(new Date());
        expect(hasStartDate()).toBe(true);

        const data = JSON.stringify({
            appId: "solo-days",
            version: 1,
            exportedAt: new Date().toISOString(),
            data: {
                startDate: null,
                loveHistory: [],
            },
        });
        const file = new File([data], "backup.json", {
            type: "application/json",
        });

        const result = await importBackup(file);
        expect(result.success).toBe(true);
        expect(hasStartDate()).toBe(false);
    });
});

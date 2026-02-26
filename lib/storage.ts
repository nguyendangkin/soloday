// LocalStorage helper — SSR-safe wrapper

const STORAGE_KEY = "fa-counter-start-date";
const HISTORY_KEY = "fa-counter-love-history";

export interface LoveHistory {
    id: string;
    startDate: string; // ISO string
    endDate: string;   // ISO string
    totalDays: number;
    partnerName?: string;
}

/**
 * Check if we're running in the browser
 */
function isBrowser(): boolean {
    return typeof window !== "undefined";
}

/**
 * Save the FA start date to localStorage
 */
export function saveStartDate(date: Date): void {
    if (!isBrowser()) return;
    localStorage.setItem(STORAGE_KEY, date.toISOString());
}

/**
 * Get the FA start date from localStorage
 * Returns null if not set or invalid
 */
export function getStartDate(): Date | null {
    if (!isBrowser()) return null;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const date = new Date(stored);
    if (isNaN(date.getTime())) return null;

    return date;
}

/**
 * Clear all FA counter data
 */
export function clearData(): void {
    if (!isBrowser()) return;
    localStorage.removeItem(STORAGE_KEY);
}

/**
 * Check if the user has a saved start date
 */
export function hasStartDate(): boolean {
    return getStartDate() !== null;
}

// ==========================================
// Love History — track past relationships
// ==========================================

/**
 * Get all love history records
 */
export function getLoveHistory(): LoveHistory[] {
    if (!isBrowser()) return [];
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    try {
        return JSON.parse(stored) as LoveHistory[];
    } catch {
        return [];
    }
}

/**
 * Add a new love history record (called when user confirms having a partner)
 */
export function addLoveHistory(startDate: Date, totalDays: number, partnerName?: string): void {
    if (!isBrowser()) return;
    const history = getLoveHistory();
    const record: LoveHistory = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
        totalDays,
        partnerName: partnerName?.trim() || undefined,
    };
    history.unshift(record); // newest first
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

/**
 * Remove a love history record by id
 */
export function removeLoveHistory(id: string): void {
    if (!isBrowser()) return;
    const history = getLoveHistory().filter((h) => h.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

// ==========================================
// Backup & Restore — export/import JSON file
// ==========================================

interface BackupData {
    appId: string;
    version: number;
    exportedAt: string;
    data: {
        startDate: string | null;
        loveHistory: LoveHistory[];
    };
}

/**
 * Export all app data as a JSON file download
 */
export function exportBackup(): void {
    if (!isBrowser()) return;

    const backup: BackupData = {
        appId: "soloday",
        version: 1,
        exportedAt: new Date().toISOString(),
        data: {
            startDate: localStorage.getItem(STORAGE_KEY),
            loveHistory: getLoveHistory(),
        },
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "");
    link.download = `soloday-backup-${dateStr}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
}

/**
 * Import backup from a JSON file — validates structure before writing
 */
export async function importBackup(
    file: File
): Promise<{ success: boolean; message: string }> {
    if (!isBrowser()) {
        return { success: false, message: "Không hỗ trợ trên server." };
    }

    // Security: limit file size to 1MB to prevent DoS
    const MAX_FILE_SIZE = 1024 * 1024; // 1MB
    if (file.size > MAX_FILE_SIZE) {
        return {
            success: false,
            message: "File backup quá lớn (tối đa 1MB).",
        };
    }

    try {
        const text = await file.text();
        const parsed = JSON.parse(text) as BackupData;

        // Validate top-level structure
        if ((parsed.appId !== "soloday" && parsed.appId !== "solo-days") || typeof parsed.version !== "number") {
            return {
                success: false,
                message: "File không đúng định dạng Solo Days.",
            };
        }
        if (!parsed.data || typeof parsed.data !== "object") {
            return { success: false, message: "Dữ liệu backup bị hỏng." };
        }

        // Write startDate
        if (parsed.data.startDate) {
            const d = new Date(parsed.data.startDate);
            if (isNaN(d.getTime())) {
                return { success: false, message: "Ngày bắt đầu không hợp lệ." };
            }
            localStorage.setItem(STORAGE_KEY, parsed.data.startDate);
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }

        // Write loveHistory with per-record validation
        if (Array.isArray(parsed.data.loveHistory)) {
            const MAX_RECORDS = 500;
            const MAX_NAME_LENGTH = 100;
            const validated = parsed.data.loveHistory
                .slice(0, MAX_RECORDS)
                .filter((record): record is LoveHistory => {
                    // Validate each record has required fields with correct types
                    if (typeof record !== "object" || record === null) return false;
                    if (typeof record.id !== "string") return false;
                    if (typeof record.startDate !== "string") return false;
                    if (typeof record.endDate !== "string") return false;
                    if (typeof record.totalDays !== "number") return false;
                    // Validate dates are parseable
                    if (isNaN(new Date(record.startDate).getTime())) return false;
                    if (isNaN(new Date(record.endDate).getTime())) return false;
                    return true;
                })
                .map((record) => ({
                    id: String(record.id).slice(0, 20),
                    startDate: record.startDate,
                    endDate: record.endDate,
                    totalDays: Math.max(0, Math.floor(record.totalDays)),
                    // Sanitize partnerName: trim, limit length, strip control chars
                    ...(record.partnerName
                        ? {
                            partnerName: String(record.partnerName)
                                .trim()
                                .slice(0, MAX_NAME_LENGTH)
                                .replace(/[\x00-\x1f\x7f]/g, ""),
                        }
                        : {}),
                }));

            localStorage.setItem(HISTORY_KEY, JSON.stringify(validated));
        }

        return { success: true, message: "Khôi phục dữ liệu thành công! 🎉" };
    } catch {
        return {
            success: false,
            message: "Không thể đọc file. Vui lòng chọn file backup (.json).",
        };
    }
}

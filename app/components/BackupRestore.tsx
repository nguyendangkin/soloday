"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { exportBackup, importBackup } from "@/lib/storage";

export default function BackupRestore() {
    const fileRef = useRef<HTMLInputElement>(null);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);

    // Auto-dismiss toast after 3s
    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(timer);
    }, [toast]);

    const handleExport = useCallback(() => {
        exportBackup();
        setToast({ message: "Đã tải file sao lưu! 💾", type: "success" });
    }, []);

    const handleImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const result = await importBackup(file);
        setToast({
            message: result.message,
            type: result.success ? "success" : "error",
        });

        // Reset input so same file can be selected again
        if (fileRef.current) fileRef.current.value = "";

        // Reload page to reflect restored data
        if (result.success) {
            setTimeout(() => window.location.reload(), 1500);
        }
    }, []);

    return (
        <>
            {/* Buttons */}
            <div
                style={{
                    display: "flex",
                    gap: 8,
                    justifyContent: "center",
                    width: "100%",
                    maxWidth: 300,
                }}
            >
                <button
                    className="btn btn-ghost"
                    onClick={handleExport}
                    style={{ flex: 1, fontSize: 13 }}
                >
                    Sao lưu 💾
                </button>
                <button
                    className="btn btn-ghost"
                    onClick={() => fileRef.current?.click()}
                    style={{ flex: 1, fontSize: 13 }}
                >
                    Khôi phục 📂
                </button>

                {/* Hidden file input */}
                <input
                    ref={fileRef}
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    style={{ display: "none" }}
                />
            </div>

            {/* Toast notification — Portal to body to escape transform stacking context */}
            {toast && createPortal(
                <div
                    className={`toast ${toast.type === "success" ? "toast-success" : "toast-error"
                        }`}
                >
                    {toast.message}
                </div>,
                document.body
            )}
        </>
    );
}


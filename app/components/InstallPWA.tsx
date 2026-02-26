"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPWA() {
    const [isInstalled, setIsInstalled] = useState(false);
    const [deferredPrompt, setDeferredPrompt] =
        useState<BeforeInstallPromptEvent | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [installing, setInstalling] = useState(false);

    useEffect(() => {
        // Check if already running as installed PWA
        const isStandalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as unknown as { standalone?: boolean }).standalone ===
            true;

        if (isStandalone) {
            setIsInstalled(true);
            return;
        }

        // Check if prompt was already captured by early inline script
        const win = window as unknown as {
            __deferredInstallPrompt?: BeforeInstallPromptEvent | null;
        };
        if (win.__deferredInstallPrompt) {
            setDeferredPrompt(win.__deferredInstallPrompt);
        }

        // Listen for beforeinstallprompt
        const handleBeforeInstall = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
            setShowModal(false);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstall);
        window.addEventListener("appinstalled", handleAppInstalled);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
            window.removeEventListener("appinstalled", handleAppInstalled);
        };
    }, []);

    const handleInstall = useCallback(async () => {
        // Re-check window global at click time
        const win = window as unknown as {
            __deferredInstallPrompt?: BeforeInstallPromptEvent | null;
        };
        const prompt = deferredPrompt || win.__deferredInstallPrompt || null;

        if (!prompt) return;

        setInstalling(true);
        try {
            await prompt.prompt();
            const { outcome } = await prompt.userChoice;
            if (outcome === "accepted") {
                setIsInstalled(true);
                setShowModal(false);
            }
        } catch {
            // User dismissed
        } finally {
            setInstalling(false);
            setDeferredPrompt(null);
            win.__deferredInstallPrompt = null;
        }
    }, [deferredPrompt]);

    // Can we install?
    const canInstall = !!(
        deferredPrompt ||
        (typeof window !== "undefined" &&
            (window as unknown as { __deferredInstallPrompt?: unknown })
                .__deferredInstallPrompt)
    );

    return (
        <>
            {/* Install Button */}
            <button
                className="btn btn-fun install-btn"
                onClick={() => {
                    setShowModal(true);
                }}
                style={{ width: "100%", maxWidth: 300 }}
            >
                <span className="install-btn-icon">📲</span>
                Tải App về máy
            </button>

            {/* Modal */}
            {showModal && createPortal(
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="install-modal animate-fade-in-scale">
                            {/* Close button */}
                            <button
                                className="install-modal-close"
                                onClick={() => setShowModal(false)}
                                aria-label="Đóng"
                            >
                                ✕
                            </button>

                            {/* App icon */}
                            <div className="install-modal-icon">
                                <img
                                    src="/icons/icon-192x192.png"
                                    alt="Solo Days"
                                    width={72}
                                    height={72}
                                    style={{ borderRadius: 16 }}
                                />
                            </div>

                            {/* App info */}
                            <h3 className="install-modal-title">Solo Days</h3>
                            <p className="install-modal-desc">
                                Đếm ngày solo · Thành tựu · Chia sẻ
                            </p>

                            <div className="divider" style={{ margin: "16px 0" }} />

                            {isInstalled ? (
                                <div className="install-modal-status">
                                    <div className="install-modal-check">✅</div>
                                    <p className="install-modal-status-text">
                                        App đã được cài đặt!
                                    </p>
                                    <p className="install-modal-status-hint">
                                        Mở app từ màn hình chính để sử dụng
                                    </p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setShowModal(false)}
                                        style={{ width: "100%", marginTop: 12 }}
                                    >
                                        Đã hiểu 👍
                                    </button>
                                </div>
                            ) : (
                                <div className="install-modal-status">
                                    {canInstall ? (
                                        <button
                                            className="btn btn-primary"
                                            onClick={handleInstall}
                                            disabled={installing}
                                            style={{ width: "100%", marginTop: 4 }}
                                        >
                                            {installing ? "Đang cài đặt..." : "Xác nhận cài đặt 🚀"}
                                        </button>
                                    ) : (
                                        <div style={{ marginTop: 4, textAlign: "left" }}>
                                            <p
                                                style={{
                                                    fontSize: 12,
                                                    color: "var(--text-muted)",
                                                    marginBottom: 8,
                                                }}
                                            >
                                                Cài đặt thủ công:
                                            </p>
                                            <div className="install-modal-features">
                                                {[
                                                    '📱 iOS: Nhấn "Chia sẻ" → "Thêm vào MH chính"',
                                                    '🌐 Chrome/Edge: Menu ⋮ → "Cài đặt ứng dụng"',
                                                ].map((step) => (
                                                    <div
                                                        key={step}
                                                        className="install-modal-feature"
                                                        style={{ fontSize: 12, padding: "6px 10px" }}
                                                    >
                                                        {step}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                , document.body)}
        </>
    );
}

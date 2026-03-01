import packageJson from "../../package.json";

export default function Footer() {
    return (
        <footer
            style={{
                padding: "14px 20px",
                textAlign: "center",
            }}
        >
            <p
                style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    letterSpacing: "0.01em",
                    marginBottom: 8,
                }}
            >
                🥰 Yêu bản thân là điều tuyệt vời nhất!
            </p>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
                <a
                    href="https://unikorn.vn/u/nguyen-dang-kin-nguyen-dang-kin"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Nguyễn Đăng Kín - Unikorn"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 11,
                        color: "var(--text-dim)",
                        textDecoration: "none",
                        opacity: 0.5,
                        transition: "opacity 0.2s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.5"; }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                    </svg>
                </a>
                <span style={{ fontSize: 11, color: "var(--text-dim)", opacity: 0.5 }}>
                    •
                </span>
                <a
                    href="https://unikorn.vn/p/solo-day"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Solo Day - Unikorn"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 11,
                        color: "var(--text-dim)",
                        textDecoration: "none",
                        opacity: 0.5,
                        transition: "opacity 0.2s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.5"; }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                    </svg>
                </a>
                <span style={{ fontSize: 11, color: "var(--text-dim)", opacity: 0.5 }}>
                    •
                </span>
                <span style={{ fontSize: 11, color: "var(--text-dim)", opacity: 0.5, fontFamily: "monospace" }}>
                    v{packageJson.version}
                </span>
            </div>
        </footer>
    );
}

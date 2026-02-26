"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveStartDate, getStartDate } from "@/lib/storage";
import DatePicker from "./components/DatePicker";
import BackupRestore from "./components/BackupRestore";
import InstallPWA from "./components/InstallPWA";
import Footer from "./components/Footer";

export default function Home() {
  const router = useRouter();
  const [showPicker, setShowPicker] = useState(false);
  const [existing, setExisting] = useState<Date | null>(null);

  useEffect(() => {
    setExisting(getStartDate());
  }, []);

  function handleDateSelect(date: Date) {
    saveStartDate(date);
    router.push("/counter");
  }

  function handleContinue() {
    if (existing) {
      router.push("/counter");
    }
  }

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px 40px",
        position: "relative",
      }}
    >
      {/* Hero */}
      <div
        className="animate-fade-in"
        style={{
          textAlign: "center",
          maxWidth: 440,
          width: "100%",
          position: "relative",
          zIndex: 20,
        }}
      >
        {/* Emoji */}
        <div
          className="animate-float"
          style={{
            fontSize: "clamp(52px, 14vw, 80px)",
            marginBottom: 20,
            lineHeight: 1,
          }}
        >
          ✌️
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-in-up delay-100"
          style={{
            fontSize: "clamp(28px, 7vw, 42px)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.15,
            color: "var(--highlight)",
            marginBottom: 12,
          }}
        >
          Bạn đã solo
          <br />
          <span style={{ color: "var(--text-muted)" }}>được bao lâu rồi?</span>
        </h1>

        {/* Subtitle */}
        <p
          className="animate-fade-in-up delay-200"
          style={{
            fontSize: "clamp(14px, 3.5vw, 16px)",
            color: "var(--text-muted)",
            lineHeight: 1.7,
            maxWidth: 340,
            margin: "0 auto 36px",
          }}
        >
          Đếm ngày solo. Mở khóa thành tựu vui nhộn.
          <br />
          Chia sẻ niềm vui với bạn bè!
        </p>

        {/* CTA */}
        {!showPicker ? (
          <div
            className="animate-fade-in-up delay-300"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              alignItems: "center",
            }}
          >
            <button
              className="btn btn-primary"
              onClick={() => setShowPicker(true)}
              style={{ width: "100%", maxWidth: 300, fontSize: 15 }}
            >
              Bắt đầu đếm ngày →
            </button>

            {existing && (
              <button
                className="btn btn-ghost"
                onClick={handleContinue}
                style={{ width: "100%", maxWidth: 300 }}
              >
                Xem bộ đếm của tôi 📊
              </button>
            )}

            <button
              className="btn btn-ghost"
              onClick={() => router.push("/history")}
              style={{ width: "100%", maxWidth: 300 }}
            >
              Lịch sử tình yêu 💕
            </button>

            {/* Backup & Restore */}
            <BackupRestore />

            {/* Install PWA */}
            <InstallPWA />
          </div>
        ) : (
          <div className="animate-fade-in-scale">
            <DatePicker onSelect={handleDateSelect} />
          </div>
        )}
      </div>

      {/* Stats */}
      <div
        className="animate-fade-in delay-500"
        style={{
          display: "flex",
          gap: 28,
          justifyContent: "center",
          marginTop: 48,
        }}
      >
        {[
          { label: "Thành tựu", value: "20" },
          { label: "Cột mốc", value: "7→21900" },
          { label: "Offline", value: "100%" },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "var(--highlight)",
                letterSpacing: "-0.02em",
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--text-dim)",
                marginTop: 2,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </main>
  );
}

# 🛡️ SECURITY AUDIT REPORT — Soloday

**Ngày audit**: 2026-02-26  
**Phiên bản**: 0.1.0  
**Stack**: Next.js 16.1.6, React 19.2.3, Tailwind CSS 4  
**Loại ứng dụng**: Client-side PWA (không có backend/API)

---

## 📊 Tổng Quan Kết Quả

| Tier | Phạm vi | Kết quả |
|------|---------|---------|
| **Tier 1** | Automated Scanners | ✅ 0 dependency vulnerabilities |
| **Tier 2** | Manual Code Review | ⚠️ 3 vấn đề phát hiện → **ĐÃ FIX** |
| **Tier 3** | Attack Simulation | ✅ Không có critical vectors |
| **Tier 4** | Fix & Report | ✅ Đã vá tất cả |

**Đánh giá tổng thể: 🟢 AN TOÀN** (sau khi vá)

---

## Tier 1: Automated Scanners

### npm audit
```
found 0 vulnerabilities
```

### Static Analysis — XSS Patterns
- `dangerouslySetInnerHTML`: **1 lần** tại `layout.tsx:51` — hardcoded PWA inline script, **KHÔNG** chứa user input → ✅ An toàn
- `eval`, `innerHTML`, `document.write`: **0 lần** → ✅ An toàn
- Secrets/tokens hardcoded: **0 lần** → ✅ An toàn
- `process.env` references: **0 lần** → ✅ Không có server secrets

---

## Tier 2: Manual Code Review

### SEC-001: importBackup — Không giới hạn file size 🔴 ĐÃ FIX
- **Mức độ**: Medium
- **Mô tả**: Hàm `importBackup()` không kiểm tra kích thước file trước khi đọc. File JSON rất lớn có thể gây DoS (treo tab browser) hoặc vượt quota localStorage (~5MB).
- **Fix**: Thêm `MAX_FILE_SIZE = 1MB` check trước khi `file.text()`.

### SEC-002: importBackup — Không validate từng record 🔴 ĐÃ FIX
- **Mức độ**: Medium  
- **Mô tả**: `loveHistory` array được ghi trực tiếp vào localStorage mà không validate structure từng record. Attacker có thể craft file backup chứa prototype pollution payloads hoặc data injection.
- **Fix**: 
  - Validate type của từng field (`id`, `startDate`, `endDate`, `totalDays`)
  - Validate dates parseable (`isNaN(new Date(...).getTime())`)
  - Giới hạn 500 records, id cắt 20 chars
  - Sanitize `partnerName`: cắt 100 chars, strip control characters

### SEC-003: Không có security headers 🔴 ĐÃ FIX
- **Mức độ**: Low (client-only app)
- **Mô tả**: `next.config.ts` không cấu hình HTTP security headers.
- **Fix**: Thêm headers:
  - `X-Frame-Options: DENY` (chống clickjacking)
  - `X-Content-Type-Options: nosniff` (chống MIME sniffing)
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## Tier 3: Attack Simulation

### XSS via Partner Name Input
- **Vector**: Nhập `<script>alert(1)</script>` vào ô "Tên người ấy"
- **Kết quả**: ✅ **KHÔNG BỊ XSS** — React auto-escapes JSX output. Text render bằng `{partnerName}`, không dùng `dangerouslySetInnerHTML`.

### Malicious JSON Backup Import
- **Vector**: Upload file JSON với `loveHistory` chứa prototype pollution (`"__proto__"`, `"constructor"`)
- **Kết quả**: ✅ **KHÔNG BỊ** — Sau fix SEC-002, mỗi record được validate type riêng biệt. Records không đúng format bị loại bỏ.

### localStorage Tampering
- **Vector**: Sửa trực tiếp localStorage trong DevTools
- **Kết quả**: ℹ️ **ACCEPTED RISK** — Client-only app, dữ liệu localStorage thuộc về user. `getStartDate()` và `getLoveHistory()` đều có try/catch và validation.

### Service Worker Hijacking
- **Vector**: Thay đổi `sw.js` để cache response giả
- **Kết quả**: ✅ **KHÔNG BỊ** — SW registered từ cùng origin. Network-first strategy cho HTML/JS/CSS nghĩa là mọi update từ server đều override cache.

### Clickjacking
- **Vector**: Nhúng app trong iframe của trang khác
- **Kết quả**: ✅ **ĐÃ CHẶN** — `X-Frame-Options: DENY` header.

---

## Tier 4: Files Đã Thay Đổi

| File | Thay đổi |
|------|----------|
| `lib/storage.ts` | File size limit, per-record validation, partnerName sanitization |
| `next.config.ts` | Security headers (X-Frame-Options, X-Content-Type-Options, etc.) |

### Regression Test
```
✓ lib/__tests__/achievements.test.ts (14 tests)
✓ lib/__tests__/storage.test.ts (18 tests)  
✓ lib/__tests__/time-utils.test.ts (13 tests)

Test Files  3 passed (3)
Tests       45 passed (45)
```

---

## 💡 Khuyến Nghị Bổ Sung (Không Bắt Buộc)

1. **CSP Header**: Cân nhắc thêm `Content-Security-Policy` khi deploy production để chặn inline scripts bên thứ 3.
2. **Subresource Integrity (SRI)**: Nếu dùng CDN cho fonts/scripts, thêm SRI hash.
3. **Rate Limiting partner name**: Hiện chưa giới hạn tần suất tạo love history records (nhưng chỉ ảnh hưởng localStorage của user).

# 🔍 AUDIT REPORT — Soloday

**Ngày**: 2026-02-26  
**Phiên bản**: 0.1.0  
**Tech Stack**: Next.js 16.1.6 + React 19.2.3 + TypeScript 5 + Tailwind 4  

---

## 📊 Tổng quan

| Hạng mục | Trạng thái | Ghi chú |
|---|---|---|
| Security Scan | ✅ PASS | 0 vulnerabilities |
| TypeScript Check | ✅ PASS | Không có lỗi |
| ESLint | ❌ FAIL | 10 errors, 3 warnings |
| SEO Audit | ⚠️ WARNING | Thiếu OG Image, robots.txt |
| PWA Config | ✅ PASS | manifest.json + sw.js đầy đủ |

**Điểm tổng: 3/5 PASS**

---

## 1. 🔒 Security Scan

```
npm audit → found 0 vulnerabilities
```

✅ **Không có lỗ hổng bảo mật nào** trong dependency tree.

**Điểm cộng**:
- `poweredByHeader: false` trong `next.config.ts` (ẩn header X-Powered-By)
- `reactStrictMode: true` bật chế độ nghiêm ngặt
- Không hardcode secret/API key nào

---

## 2. 📝 ESLint — 10 Errors, 3 Warnings

### ❌ Errors

#### `app/counter/page.tsx` — 7 lỗi `react-hooks/purity`
- **Vấn đề**: Gọi `Math.random()` trực tiếp trong render body của `ConfettiEffect` (dòng 228-234, 249)
- **Nguyên nhân**: `Math.random()` là impure function, gây ra kết quả không ổn định khi re-render
- **Fix**: Wrap logic tạo particles vào `useMemo` hoặc `useState` + `useEffect`

```diff
- const particles = Array.from({ length: 30 }, (_, i) => ({
-     ...
-     left: `${Math.random() * 100}%`,
-     ...
- }));
+ const [particles] = useState(() =>
+     Array.from({ length: 30 }, (_, i) => ({
+         ...
+         left: `${Math.random() * 100}%`,
+         ...
+     }))
+ );
```

#### `app/history/page.tsx:16` — 1 lỗi `react-hooks/set-state-in-effect`
- **Vấn đề**: `setMounted(true)` gọi trực tiếp trong `useEffect`
- **Fix**: Dùng pattern khác hoặc chấp nhận đây là pattern chuẩn cho hydration check

#### `app/page.tsx:17` — 1 lỗi `react-hooks/set-state-in-effect`
- **Vấn đề**: `setExisting(getStartDate())` gọi trực tiếp trong `useEffect`
- **Fix**: Tương tự, đây là pattern phổ biến để đọc localStorage

#### `app/counter/page.tsx:29` — 1 lỗi `react-hooks/set-state-in-effect`
- **Vấn đề**: `setMounted(true)` trong `useEffect`

### ⚠️ Warnings

| File | Dòng | Lỗi |
|---|---|---|
| `app/history/page.tsx` | 172 | `cardRef` được gán nhưng không sử dụng |

---

## 3. ✅ TypeScript Check

```
npx tsc --noEmit → 0 errors
```

✅ **Không có lỗi TypeScript** — Type safety đầy đủ.

---

## 4. 🔎 SEO Audit

### ✅ Đã có
- `<html lang="vi">` — Đúng ngôn ngữ
- `<title>` — "Solo Days — Đếm Ngày Solo"
- `<meta name="description">` — Đầy đủ mô tả
- `<meta name="keywords">` — 5 keywords
- **OpenGraph** — title, description, type, locale
- **Twitter Cards** — card, title, description
- **Viewport** — Responsive config
- **PWA Manifest** — name, short_name, icons, display, theme_color

### ⚠️ Thiếu / Cần cải thiện

| Vấn đề | Mức độ | Gợi ý |
|---|---|---|
| Thiếu `og:image` | **Cao** | Thêm ảnh preview khi share trên MXH |
| Thiếu `og:url` | Trung bình | Thêm canonical URL |
| Thiếu `robots.txt` | Trung bình | Cho phép crawler index |
| Thiếu `sitemap.xml` | Thấp | Tạo sitemap cho SEO |
| Sub-pages thiếu metadata | Trung bình | `/counter`, `/history` nên có riêng |

---

## 5. 📱 PWA Audit

### ✅ Đã có
- `manifest.json` — Đầy đủ name, short_name, icons, display, theme_color
- `sw.js` — Service Worker đã đăng ký
- Icons 192x192 và 512x512 (cả `any` và `maskable`)
- Apple Touch Icon configured
- Apple Mobile Web App meta tags

### ⚠️ Lưu ý
- `beforeinstallprompt` handler sử dụng inline script (`dangerouslySetInnerHTML`)

---

## 🛠️ Đề xuất sửa (theo ưu tiên)

### 🔴 Ưu tiên cao
1. **Fix ESLint `react-hooks/purity`** → Wrap `Math.random()` vào `useState` initializer trong `ConfettiEffect`
2. **Thêm `og:image`** → Tạo ảnh social preview 1200x630

### 🟡 Ưu tiên trung bình  
3. **Thêm `robots.txt`** → `public/robots.txt`
4. **Thêm metadata cho sub-pages** → `/counter` và `/history`
5. **Xoá biến không dùng** `cardRef` trong `history/page.tsx`

### 🟢 Ưu tiên thấp
6. **Thêm `sitemap.xml`** → Cho SEO
7. **Thêm `og:url`** và canonical link
8. **Pattern `setMounted`** → Cân nhắc dùng `useSyncExternalStore` hoặc suppress lint rule nếu intentional

---

*Báo cáo được tạo bởi Antigravity — 2026-02-26T12:48+07:00*

# Solo Days — Đếm Ngày Solo 🥰

> Bạn đã solo bao lâu rồi? Đếm ngày, mở khóa thành tựu vui nhộn, và chia sẻ với bạn bè!

🔗 **Live Demo:** [soloday.onrender.com](https://soloday.onrender.com)

---

## ✨ Tính năng

- **🔢 Bộ đếm ngày solo** — Xem bạn đã solo bao nhiêu ngày, giờ, phút, giây (realtime)
- **🏆 20 thành tựu** — Mở khóa badge từ 7 ngày đến 60 năm (✨ Khởi Đầu Vui → 🌌 Vũ Trụ)
- **📸 Chia sẻ ảnh** — Tải card chia sẻ đẹp để khoe với bạn bè
- **💕 Lịch sử tình yêu** — Khi hết solo, cuộc tình được lưu lại cùng thành tựu
- **💾 Backup & Restore** — Sao lưu và khôi phục dữ liệu bằng file JSON
- **📱 PWA** — Cài đặt trực tiếp lên điện thoại như app native
- **⚡ Offline** — Hoạt động kể cả khi không có mạng (Service Worker)
- **📅 Chọn ngày bắt đầu** — Date picker tinh tế, chọn đúng ngày bạn bắt đầu solo

## 🛠️ Tech Stack

| Công nghệ | Phiên bản |
|---|---|
| **Next.js** | 16 |
| **React** | 19 |
| **TypeScript** | 5 |
| **CSS** | Vanilla (không framework) |
| **Testing** | Vitest + Testing Library |
| **Export** | Static HTML (output: export) |

## 🚀 Chạy local

```bash
# Clone repo
git clone https://github.com/nguyendangkin/soloday.git
cd soloday

# Cài dependencies
npm install

# Chạy dev server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem app.

## 📦 Build & Deploy

```bash
# Build static site
npm run build

# Output nằm trong thư mục /out
```

App được build thành static HTML, có thể deploy lên bất kỳ hosting nào (Render, Vercel, Netlify, GitHub Pages...).

## 🧪 Testing

```bash
# Chạy test
npm test

# Chạy test (watch mode)
npm run test:watch
```

## 📂 Cấu trúc dự án

```
soloday/
├── app/
│   ├── components/       # UI components
│   │   ├── Achievements.tsx     # Hệ thống thành tựu
│   │   ├── BackupRestore.tsx    # Sao lưu & khôi phục
│   │   ├── CongratulationModal.tsx  # Modal chúc mừng hết solo
│   │   ├── Counter.tsx          # Bộ đếm realtime
│   │   ├── DatePicker.tsx       # Chọn ngày bắt đầu
│   │   ├── InstallPWA.tsx       # Nút cài PWA
│   │   ├── ShareCard.tsx        # Card chia sẻ ảnh
│   │   └── Footer.tsx           # Footer
│   ├── counter/          # Trang đếm ngày
│   ├── history/          # Trang lịch sử tình yêu
│   ├── globals.css       # Styles
│   ├── layout.tsx        # Root layout + SEO
│   └── page.tsx          # Trang chủ
├── lib/
│   ├── achievements.ts   # Logic thành tựu (20 mốc)
│   ├── storage.ts        # LocalStorage + Backup/Restore
│   └── time-utils.ts     # Tính toán thời gian
├── public/
│   ├── manifest.json     # PWA manifest
│   ├── sw.js            # Service Worker
│   └── icons/           # App icons
└── package.json
```

## 🎯 Hệ thống thành tựu

| Mốc | Badge | Tên |
|-----|-------|-----|
| 7 ngày | ✨ | Khởi Đầu Vui |
| 30 ngày | 🎒 | Nhà Thám Hiểm |
| 100 ngày | 🎯 | Bách Nhật |
| 365 ngày | 🎉 | 1 Năm Rực Rỡ |
| 1,000 ngày | 🚀 | Vượt Ngàn |
| 1,825 ngày | ⭐ | Huyền Thoại |
| 3,650 ngày | 🌟 | Vĩnh Cửu |
| ... | ... | ... |
| 21,900 ngày | 🌌 | Vũ Trụ |

## 📄 License

MIT

---

*🥰 Yêu bản thân là điều tuyệt vời nhất!*

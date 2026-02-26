// Achievement data — positive and fun tone

export interface Achievement {
    id: string;
    days: number;
    icon: string;
    name: string;
    description: string;
}

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: "starter",
        days: 7,
        icon: "✨",
        name: "Khởi Đầu Vui",
        description: "Tuần đầu tiên tận hưởng cuộc sống!",
    },
    {
        id: "explorer",
        days: 30,
        icon: "🎒",
        name: "Nhà Thám Hiểm",
        description: "1 tháng khám phá thế giới của riêng mình",
    },
    {
        id: "centurion",
        days: 100,
        icon: "🎯",
        name: "Bách Nhật",
        description: "100 ngày sống thật với chính mình!",
    },
    {
        id: "adventurer",
        days: 200,
        icon: "🌿",
        name: "An Nhiên",
        description: "200 ngày bình yên và tự tại",
    },
    {
        id: "champion",
        days: 365,
        icon: "🎉",
        name: "1 Năm Rực Rỡ",
        description: "Một năm trọn vẹn yêu thương bản thân!",
    },
    {
        id: "zen",
        days: 500,
        icon: "☕",
        name: "Zen Master",
        description: "Thong thả tận hưởng từng khoảnh khắc",
    },
    {
        id: "sage",
        days: 730,
        icon: "📖",
        name: "Hiền Triết",
        description: "2 năm hiểu mình hơn mỗi ngày",
    },
    {
        id: "cosmic",
        days: 1000,
        icon: "🚀",
        name: "Vượt Ngàn",
        description: "1000 ngày tự do tự tại!",
    },
    {
        id: "legend",
        days: 1825,
        icon: "⭐",
        name: "Huyền Thoại",
        description: "5 năm sống vui, sống đẹp!",
    },
    {
        id: "eternal",
        days: 3650,
        icon: "🌟",
        name: "Vĩnh Cửu",
        description: "10 năm yêu thương chính mình 🥰",
    },
    {
        id: "diamond",
        days: 5475,
        icon: "💎",
        name: "Kim Cương",
        description: "15 năm toả sáng rực rỡ!",
    },
    {
        id: "platinum",
        days: 7300,
        icon: "👑",
        name: "Bạch Kim",
        description: "20 năm — hai thập kỷ hạnh phúc!",
    },
    {
        id: "quarter-century",
        days: 9125,
        icon: "🏛️",
        name: "Tứ Phần Thế Kỷ",
        description: "25 năm — cuộc đời thật đáng sống!",
    },
    {
        id: "pearl",
        days: 10950,
        icon: "🦪",
        name: "Ngọc Trai",
        description: "30 năm — mỗi ngày đều là quà tặng!",
    },
    {
        id: "coral",
        days: 12775,
        icon: "🪸",
        name: "San Hô",
        description: "35 năm — đẹp tự nhiên, đẹp từ bên trong!",
    },
    {
        id: "ruby",
        days: 14600,
        icon: "❤️‍🔥",
        name: "Hồng Ngọc",
        description: "40 năm — trái tim luôn ấm áp!",
    },
    {
        id: "sapphire",
        days: 16425,
        icon: "💙",
        name: "Lam Ngọc",
        description: "45 năm — thanh thản và viên mãn",
    },
    {
        id: "golden",
        days: 18250,
        icon: "🥇",
        name: "Vàng Ròng",
        description: "50 năm — nửa thế kỷ rạng ngời!",
    },
    {
        id: "emerald",
        days: 20075,
        icon: "💚",
        name: "Ngọc Lục Bảo",
        description: "55 năm — tươi xanh mãi không phai!",
    },
    {
        id: "universe",
        days: 21900,
        icon: "🌌",
        name: "Vũ Trụ",
        description: "60 năm — bạn là cả một vũ trụ yêu thương!",
    },
];

export function getUnlockedAchievements(totalDays: number): Achievement[] {
    return ACHIEVEMENTS.filter((a) => totalDays >= a.days);
}

export function getNextAchievement(totalDays: number): Achievement | null {
    return ACHIEVEMENTS.find((a) => totalDays < a.days) ?? null;
}

export function getLatestAchievement(totalDays: number): Achievement | null {
    const unlocked = getUnlockedAchievements(totalDays);
    return unlocked.length > 0 ? unlocked[unlocked.length - 1] : null;
}

export function getProgressToNext(totalDays: number): number {
    const next = getNextAchievement(totalDays);
    if (!next) return 1;
    const unlocked = getUnlockedAchievements(totalDays);
    const prevDays = unlocked.length > 0 ? unlocked[unlocked.length - 1].days : 0;
    const range = next.days - prevDays;
    const progress = totalDays - prevDays;
    return Math.min(progress / range, 1);
}

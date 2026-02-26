// Time calculation utilities and positive messages

export interface TimeDiff {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalDays: number;
}

export function calculateTimeDiff(startDate: Date): TimeDiff {
    const now = new Date();
    const diffMs = now.getTime() - startDate.getTime();

    if (diffMs < 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, totalDays: 0 };
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    return {
        days: totalDays,
        hours: totalHours % 24,
        minutes: totalMinutes % 60,
        seconds: totalSeconds % 60,
        totalDays,
    };
}

/**
 * Positive, fun messages based on total days
 */
export function getDramaticMessage(totalDays: number): string {
    if (totalDays < 7) {
        return "Hành trình yêu bản thân bắt đầu rồi! 🌱";
    }
    if (totalDays < 30) {
        return "Bạn đang có thời gian tuyệt vời cho chính mình!";
    }
    if (totalDays < 100) {
        return "Tự do là khi bạn muốn làm gì thì làm ✨";
    }
    if (totalDays < 200) {
        return "100+ ngày tận hưởng cuộc sống — tuyệt lắm!";
    }
    if (totalDays < 365) {
        return "Bạn đang sống trọn vẹn mỗi khoảnh khắc!";
    }
    if (totalDays < 500) {
        return "1 năm tuyệt vời! Bạn hiểu mình hơn rất nhiều 🎉";
    }
    if (totalDays < 730) {
        return "Mỗi ngày là một cuộc phiêu lưu mới ☕";
    }
    if (totalDays < 1000) {
        return "2+ năm — bạn thật sự biết cách yêu thương mình!";
    }
    if (totalDays < 1825) {
        return "1000+ ngày! Hạnh phúc toả ra từ bên trong 🚀";
    }
    if (totalDays < 3650) {
        return "Bạn chứng minh hạnh phúc nằm ngay trong chính mình ⭐";
    }
    if (totalDays < 5475) {
        return "10+ năm yêu thương chính mình — thật tuyệt vời! 🌟";
    }
    if (totalDays < 7300) {
        return "15 năm toả sáng — bạn đẹp lắm! 💎";
    }
    if (totalDays < 9125) {
        return "20 năm — hai thập kỷ hạnh phúc viên mãn! 👑";
    }
    if (totalDays < 10950) {
        return "Một phần tư thế kỷ — cuộc đời thật đáng sống! 🏛️";
    }
    if (totalDays < 12775) {
        return "30 năm — mỗi ngày đều là quà tặng! 🦪";
    }
    if (totalDays < 14600) {
        return "35 năm — đẹp tự nhiên từ bên trong! 🪸";
    }
    if (totalDays < 16425) {
        return "40 năm — trái tim luôn ấm áp! ❤️‍🔥";
    }
    if (totalDays < 18250) {
        return "45 năm — thanh thản và viên mãn! 💙";
    }
    if (totalDays < 20075) {
        return "Nửa thế kỷ rạng ngời — bạn tuyệt vời lắm! 🥇";
    }
    if (totalDays < 21900) {
        return "55 năm — tươi xanh mãi không phai! 💚";
    }
    return "60+ năm — bạn là cả một vũ trụ yêu thương! 🌌";
}

/**
 * Fun share quotes — self-love focused
 */
export function getShareQuote(totalDays: number): string {
    const quotes: string[] = [
        `${totalDays} ngày tận hưởng cuộc sống — mỗi ngày đều đáng yêu!`,
        `Đã ${totalDays} ngày tôi sống trọn vẹn cho chính mình ✨`,
        `${totalDays} ngày yêu bản thân — hạnh phúc mỗi ngày!`,
        `Yêu bản thân ${totalDays} ngày rồi — và vẫn đang rất vui! 🎉`,
        `${totalDays} ngày yêu thương chính mình. Bạn thử chưa? 🥰`,
        `${totalDays} ngày sống tự do, tự tại, tự vui 😎`,
    ];
    return quotes[totalDays % quotes.length];
}

export function padZero(num: number): string {
    return num.toString().padStart(2, "0");
}

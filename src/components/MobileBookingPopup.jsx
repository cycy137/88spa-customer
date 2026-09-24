// src/components/MobileBookingPopup.jsx
import React, { useState, useEffect } from 'react';

/* ============================================================
 * 预留：促销广告位（现在不上，先留好）
 * ------------------------------------------------------------
 * PROMO 设为 null 时，弹窗只显示预约入口，不显示促销。
 * 以后想上哪个促销，把下面这行改成注释里的格式即可，
 * 弹窗会自动在预约按钮上方渲染促销卡片，不用改其他代码。
 * ============================================================
 */
// const PROMO = {
//   badge: 'Limited Time',                 // 角标文案（可不填）
//   title: 'Aromatherapy Add-on',          // 促销标题
//   subtitle: 'FREE with any 60-min+ service', // 促销副文案（可不填）
//   highlight: 'FREE',                     // 高亮价格/文案（可不填）
// };
const PROMO = null;

// 每天只弹一次：用 localStorage 记住上次弹出的日期
const STORAGE_KEY = 'spa88_mobile_popup_last_shown';
const todayStr = () => new Date().toISOString().slice(0, 10);

/**
 * 手机端进站预约弹窗
 * - 只在手机端（md 断点以下）弹出，电脑端不打扰
 * - 每天最多弹一次，关掉后当天不再出现
 * - 点 "Book Now" 直接打开预约窗口；也支持一键拨打电话
 */
export default function MobileBookingPopup({ onBookNowClick }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 非手机端直接跳过
    if (!window.matchMedia('(max-width: 767px)').matches) return;
    // 当天已经弹过就跳过
    try {
      if (localStorage.getItem(STORAGE_KEY) === todayStr()) return;
    } catch {
      /* 隐私模式下 localStorage 可能不可用，照常弹出 */
    }
    // 稍延迟弹出，避免和首屏渲染抢视觉
    const timer = setTimeout(() => setVisible(true), 900);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, todayStr());
    } catch {
      /* 忽略写入失败 */
    }
    setVisible(false);
  };

  const handleBook = () => {
    dismiss();
    onBookNowClick();
  };

  if (!visible) return null;

  return (
    <div
      className="md:hidden fixed inset-0 z-[90] flex items-center justify-center px-6"
      role="dialog"
      aria-modal="true"
      aria-label="Book your appointment"
    >
      {/* 背景遮罩：点空白处关闭 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={dismiss} />

      {/* 卡片本体 */}
      <div className="relative w-full max-w-sm bg-spa-cardBg rounded-3xl shadow-2xl px-6 pt-8 pb-6 text-center overflow-hidden">
        {/* 顶部金色装饰线 */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-spa-gold" />

        {/* 右上角关闭按钮 */}
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/5 text-spa-textMuted flex items-center justify-center text-lg leading-none hover:bg-black/10 transition-colors"
        >
          ×
        </button>

        <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-spa-gold mb-2">
          88 Head Spa &amp; Massage
        </p>
        <h2 className="font-serif text-2xl text-spa-textDark mb-2">
          Book Your Appointment
        </h2>
        <p className="text-sm text-spa-textMuted leading-relaxed mb-5">
          Head spa &amp; massage therapy in Redmond.
          Reserve your time slot in under a minute.
        </p>

        {/* 预留促销位：PROMO 为 null 时不渲染 */}
        {PROMO && (
          <div className="mb-5 rounded-2xl border-2 border-spa-gold/60 bg-spa-gold/10 p-4 text-left">
            {PROMO.badge && (
              <span className="inline-block bg-spa-gold text-white text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full mb-1.5">
                {PROMO.badge}
              </span>
            )}
            <p className="font-serif text-lg text-spa-textDark leading-snug">{PROMO.title}</p>
            {PROMO.subtitle && (
              <p className="text-sm text-spa-textMuted mt-1">{PROMO.subtitle}</p>
            )}
            {PROMO.highlight && (
              <p className="text-spa-gold font-bold mt-1">{PROMO.highlight}</p>
            )}
          </div>
        )}

        {/* 主按钮：直接打开预约窗口 */}
        <button
          onClick={handleBook}
          className="w-full bg-spa-gold text-spa-textDark font-semibold tracking-wider py-3.5 rounded-full text-base hover:bg-spa-gold/90 active:scale-[0.98] transition-all mb-3"
        >
          Book Now
        </button>

        {/* 备选：一键拨打电话 */}
        <a
          href="tel:+14258671867"
          className="block w-full border border-spa-textMuted/30 text-spa-textDark font-medium py-3 rounded-full text-sm hover:border-spa-gold transition-colors"
        >
          Call 425-867-1867
        </a>
      </div>
    </div>
  );
}

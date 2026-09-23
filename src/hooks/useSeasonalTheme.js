// src/hooks/useSeasonalTheme.js
import { useEffect, useState } from 'react';

// 本地默认的四个季度明亮、温和的水疗主题配置
const DEFAULT_SEASONAL_THEMES = {
  spring: {
    bg: '#f4f7f4',
    accent: '#e6ede6',
    // 👈 核心：直接指向本地 public/images/ 里的图片（或者在线图床 URL）
    bgImage: 'url("public/image/main.webp")'
  },
  summer: {
    bg: '#fbf9f6',
    accent: '#f3ece3',
    bgImage: 'url("public/image/main.webp")'
  },
  autumn: {
    bg: '#fcf8f2',
    accent: '#f5ebe0',
    bgImage: 'url("public/image/main.webp")'
  },
  winter: {
    bg: '#f5f7fa',
    accent: '#eaf0f6',
    bgImage: 'url("https://unsplash.com")'
  }
};

/**
 * 季节性动态主题控制器
 * @param {Object} dbThemeConfig 从 Cloudflare Worker 初始化接口共享来的最新主题配置
 */
export function useSeasonalTheme(dbThemeConfig) {
  useEffect(() => {
    // 1. 获取当前系统月份，计算当前的默认季度
    const month = new Date().getMonth() + 1;
    let activeSeason = 'summer';

    if (month >= 3 && month <= 5) activeSeason = 'spring';
    else if (month >= 6 && month <= 8) activeSeason = 'summer';
    else if (month >= 9 && month <= 11) activeSeason = 'autumn';
    else activeSeason = 'winter';

    const defaultTheme = DEFAULT_SEASONAL_THEMES[activeSeason];

    // 2. 优先级判定：优先使用 D1 数据库里配置的自定义颜色/图片，其次使用本地计算出的季度兜底
    const finalBgColor = dbThemeConfig?.customBgColor || defaultTheme.bg;
    const finalAccentColor = dbThemeConfig?.customAccentColor || defaultTheme.accent;
    const finalBgImage = dbThemeConfig?.customBgImage ? `url(${dbThemeConfig.customBgImage})` : defaultTheme.bgImage;

    // 3. 将变量动态注入到 DOM 根节点，一键洗牌全站 Tailwind 的类名渲染
    const root = document.documentElement;
    root.style.setProperty('--spa-dynamic-bg', finalBgColor);
    root.style.setProperty('--spa-dynamic-accent', finalAccentColor);
    root.style.setProperty('--spa-dynamic-image', finalBgImage);

  }, [dbThemeConfig]); // 当数据库捞回来的主题配置发生改变时，重新触发全站皮肤洗牌
}

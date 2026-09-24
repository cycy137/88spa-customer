// src/components/SpecialPromo.jsx
import React from 'react';
// 🌟 核心：引入全局统一的英文文本转换 utility
import { transformServiceData } from '../utils/serviceMapper';
 
// 加购项配图映射：按 D1 服务名称匹配，图片存放在 public/image/ 下
const ADDON_IMAGES = {
  'Aromatherapy': '/image/addon-aromatherapy.webp',
  'Magnetic Therapy Lamp': '/image/addon-magnetic-lamp.webp',
};
 
/**
 * 季节轮换/限时特价专属独立高凸显性组件
 */
export default function SpecialPromo({ onBookNowClick, activeServices = [] }) {
  
  // 1. 自动从共享的数据流中捞取所有在 D1 数据库中标有特价、或者打上特价标签的项目
  const promoItems = activeServices.filter(item => item.salePrice || item.isSpecial);
 
  // 如果当前季节数据库里没有任何特价活动，组件自动保持优雅隐藏，不破坏页面整体留白感
  if (promoItems.length === 0) return null;
 
  return (
    <section className="py-20 bg-gradient-to-b from-spa-lightBg via-spa-accent/20 to-spa-lightBg border-y border-spa-accent text-spa-textDark relative overflow-hidden">
      
      {/* 视觉修饰：极淡的香槟金动态微光环 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-spa-gold/5 rounded-full blur-3xl pointer-events-none" />
 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 顶部高凸显区标题 */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-xl">
            <div className="inline-flex items-center space-x-2 bg-spa-gold/10 text-spa-gold px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-3">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-spa-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-spa-gold"></span>
              </span>
              <span>Limited Time Offers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-light tracking-tight">
              Seasonal Specials & New Arrivals
            </h2>
          </div>
          <p className="text-spa-textMuted font-light text-sm max-w-xs md:text-right leading-relaxed">
            Exclusive therapeutic sequences rotating for the current season. Secure your time slot before capacity fills.
          </p>
        </div>
 
        {/* 凸显性网格卡片排版 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {promoItems.map((item) => {
            
            // 🌟【核心变换接头点】：在这里直接拦截并调用 Mapping，把 "special脚90" 转换成高奢名称
            const { displayName, displaySubtitle } = transformServiceData(item);
            
            // 自动计算本次促销为您省下了多少美元
            const saving = item.price - (item.salePrice || item.price);
            const addonImage = ADDON_IMAGES[item.name];
            
            return (
              <div 
                key={item.id}
                className="relative bg-white border-2 border-spa-gold rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col group"
              >
                {/* 装饰条：卡片顶部/左侧的香槟金高光线 */}
                <div className="absolute top-0 left-0 w-full sm:w-1.5 h-1.5 sm:h-full bg-spa-gold" />
 
                {/* 加购项配图：有配图的卡片顶部通栏展示，手机和桌面都不会再挤压文字区 */}
                {addonImage && (
                  <div className="w-full overflow-hidden flex-shrink-0">
                    <img
                      src={addonImage}
                      alt={displayName}
                      loading="lazy"
                      className="w-full h-48 sm:h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
 
                {/* 内容区：包住原来的文字区和价格区，恢复两列排版 */}
                <div className="p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 flex-1 w-full">
                {/* 左侧：文字描述区 */}
                <div className="flex-1 space-y-3 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="bg-red-500 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">
                      SAVE ${saving}
                    </span>
                    <span className="text-xs text-spa-gold tracking-wider font-medium uppercase">
                      {item.duration} Mins Treatment
                    </span>
                  </div>
                  
                  {/* 🌟 渲染转换映射后的精美英文名称 */}
                  <h3 className="text-xl sm:text-2xl font-serif font-medium tracking-wide group-hover:text-spa-brand transition-colors duration-300">
                    {displayName}
                  </h3>
                  
                  {/* 🌟 渲染对应的精美描述文案 */}
                  <p className="text-sm text-spa-textMuted font-light leading-relaxed max-w-md">
                    {displaySubtitle}
                  </p>
                </div>
 
                {/* 右侧：高对比度原价、特价对比与一键秒杀按钮区 */}
                <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-spa-accent/40 pt-4 sm:pt-0 gap-4 flex-shrink-0">
                  <div className="text-left sm:text-right">
                    <div className="text-xs text-spa-textMuted/60 line-through font-light leading-none mb-1">
                      Reg. ${item.price}
                    </div>
                    <div className="text-3xl font-bold tracking-tight text-red-600 leading-none">
                      ${item.salePrice || item.price}
                    </div>
                  </div>
 
                  <button
                    onClick={() => onBookNowClick(item)}
                    className="bg-spa-brand hover:bg-spa-brand/90 text-white font-medium px-6 py-3 rounded-xl text-sm tracking-wider transition-all duration-300 shadow-md group-hover:scale-[1.02] transform"
                  >
                    Claim Offer
                  </button>
                </div>
                </div>
 
              </div>
            );
          })}
        </div>
 
      </div>
    </section>
  );
}

// src/components/Hero.jsx
import React from 'react';

export default function Hero({ onBookNowClick }) {
  return (
    <section 
      style={{ backgroundImage: 'var(--spa-dynamic-image)' }}
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center transition-all duration-700 pt-20"
    >
      
      {/* 🌟 核心修改 1：移除 backdrop-blur 模糊，并将蒙层改为淡淡的黑灰半透明渐变（仅 30% 不透明度） */}
      {/* 这样可以保证你实景图里的水床、瀑布细节 100% 清晰可见，同时微微压暗确保纯白字依然醒目 */}
      <div className="absolute inset-0 bg-black/30 z-0" />
      
      {/* 渐变氛围修饰（改为极淡的微光，防止破坏图片清晰度） */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-spa-gold/5 rounded-full blur-3xl" />
      </div>

      {/* 🌟 核心修改 2：因为图片变清晰亮堂了，我们将主文字颜色改为高对比度的纯白 text-white */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        
        <p className="text-xs sm:text-sm font-medium tracking-[0.3em] text-spa-gold uppercase mb-6 drop-shadow-sm">
          Premium Head Spa & Therapeutic Massage
        </p>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light tracking-tight leading-tight mb-8 drop-shadow-md">
          Recharge Your Mind. <br />
          <span className="font-serif italic text-spa-gold">Revitalize</span> Your Body.
        </h1>

        <p className="max-w-xl mx-auto text-base sm:text-lg text-white/90 font-light tracking-wide leading-relaxed mb-12 drop-shadow-sm">
          Experience Redmond's premier holistic wellness sanctuary. Immerse yourself in our signature Japanese head spa treatments and deep tissue body therapies designed for ultimate restoration.
        </p>

        {/* 核心交互动作区 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={onBookNowClick}
            className="w-full sm:w-auto bg-spa-brand hover:bg-spa-brand/90 text-white font-medium px-8 py-4 rounded-full text-base tracking-wider transition-all duration-300 shadow-lg hover:shadow-spa-brand/20 transform hover:-translate-y-0.5"
          >
            Book An Appointment
          </button>
          <a
            href="tel:4258671867"
            // 次要按钮样式微调：使用半透明白边框，在大图上极具高级轻奢感
            className="w-full sm:w-auto border border-white/40 hover:border-spa-gold text-white hover:text-spa-gold font-medium px-8 py-4 rounded-full text-base tracking-wider transition-all duration-300 backdrop-blur-sm transform hover:-translate-y-0.5"
          >
            Call (425) 867-1867
          </a>
        </div>

      </div>

    </section>
  );
}

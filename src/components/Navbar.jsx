// src/components/Navbar.jsx
import React from 'react';

export default function Navbar({ onBookNowClick }) {
  return (
    // 改为奶白色半透明高斯模糊背景，文字变为深色 spa-textDark
    <nav className="fixed top-0 left-0 w-full z-50 bg-spa-lightBg/80 backdrop-blur-md border-b border-spa-accent text-spa-textDark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* 左侧：店名 */}
          <div className="flex-shrink-0 flex flex-col">
            <span className="text-xl font-bold tracking-widest text-spa-brand">88 SPA</span>
            <span className="text-[10px] tracking-wider text-spa-textMuted uppercase">Head Spa & Massage</span>
          </div>

          {/* 中间：菜单导航 */}
          <div className="hidden md:flex space-x-8 text-sm font-medium tracking-wide">
            <a href="#services" className="hover:text-spa-gold transition-colors duration-300">Services</a>
            <a href="#reviews" className="hover:text-spa-gold transition-colors duration-300">Reviews</a>
            <a href="#contact" className="hover:text-spa-gold transition-colors duration-300">Hours & Location</a>
          </div>

          {/* 右侧：高显预约按钮 */}
          <div className="flex items-center space-x-4">
            <a href="tel:4258671867" className="hidden lg:block text-sm text-spa-textMuted hover:text-spa-brand transition-colors">
              Call: (425) 867-1867
            </a>
            <button
              onClick={onBookNowClick}
              className="bg-spa-brand hover:bg-spa-brand/90 text-white font-medium px-5 py-2.5 rounded-full text-sm tracking-wide transition-all duration-300 shadow-sm"
            >
              Book Now
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}

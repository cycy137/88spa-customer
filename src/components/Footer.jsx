// src/components/Footer.jsx
import React from 'react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-spa-accent/40 text-spa-textDark pt-20 pb-8 border-t border-spa-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 上方核心信息网格 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* 左侧 5 列：店铺基础定位、营业时间与联系电话 */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex flex-col mb-6">
                <span className="text-2xl font-serif font-bold tracking-widest text-spa-gold">88 SPA</span>
                <span className="text-xs tracking-widest text-spa-textMuted/50 uppercase mt-1">Redmond Sanctuary</span>
              </div>
              <p className="text-sm font-light text-spa-textMuted/70 leading-relaxed mb-8 max-w-sm">
                Your premier destination for deep rejuvenation. Providing professional head spa scalp therapies and full body massage sequences.
              </p>
            </div>

            {/* 营业时间与直联电话 */}
            <div className="grid grid-cols-2 gap-6 text-sm border-t border-spa-emerald/20 pt-6">
              <div>
                <h4 className="font-semibold text-spa-gold tracking-wider uppercase text-xs mb-3">Hours</h4>
                <p className="font-light text-spa-textMuted/80">Mon - Sun</p>
                <p className="font-light text-spa-textMuted/80 mt-0.5">10:00 AM - 10:00 PM</p>
              </div>
              <div>
                <h4 className="font-semibold text-spa-gold tracking-wider uppercase text-xs mb-3">Contact</h4>
                <a href="tel:4258671867" className="font-light text-spa-textMuted/80 hover:text-spa-gold block transition-colors">
                  (425) 867-1867
                </a>
                <p className="text-xs text-spa-textMuted/40 mt-1">Appointments Required</p>
              </div>
            </div>
          </div>

          {/* 右侧 7 列：嵌入的 Redmond 物理地址与精致 Google Maps */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="mb-4 text-sm flex items-start gap-2">
              <svg className="w-5 h-5 text-spa-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <h4 className="font-semibold text-spa-gold tracking-wider uppercase text-xs mb-1">Location</h4>
                <p className="font-light text-spa-textMuted/90">
                  88 Head Spa & Massage, Redmond, WA 98052
                </p>
              </div>
            </div>

            {/* 地图嵌入框：采用标准的高级静音无边框响应式 iframe 大图，未来可在此处替换为您精准的 Google Map 嵌入链接 */}
            <div className="w-full h-64 bg-spa-emerald/5 rounded-2xl overflow-hidden border border-spa-emerald/20 shadow-inner">
              <iframe 
                title="88spa Redmond Location"
                src="https://google.com" 
                className="w-full h-full border-0 filter grayscale opacity-80 contrast-125 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>

        {/* 最底部版权声明线 */}
        <div className="border-t border-spa-emerald/20 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-spa-textMuted/40 tracking-wider">
          <p>© {new Date().getFullYear()} 88 Head Spa & Massage. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-light">Designed for Ultimate Rejuvenation</p>
        </div>

      </div>
    </footer>
  );
}

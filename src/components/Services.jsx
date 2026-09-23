// src/components/Services.jsx
import React, { useEffect, useState } from 'react';
import { fetchInitData } from '../api/index';
// 引入文本翻译逻辑（内部包含头、脚、全身、Combo的英文化重构）
import { transformServiceData } from '../utils/serviceMapper';

export default function Services({ onBookNowClick }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  // 默认选中的分类设为 'All'
  const [activeCategory, setActiveCategory] = useState('All');

  // 页面加载时，从共享的 Cloudflare Worker 捞取 D1 数据
  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchInitData();
        if (data && data.services) {
          setServices(data.services);
        }
      } catch (error) {
        console.error("Failed to load real-time shared database items:", error);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  // 1. 严格按照您的指示，定义客户前台展示的 4 大核心正规分类
  const categories = ['All', 'Head', 'Foot', 'Full Body', 'Combo'];

  // 2. 核心隔离逻辑 A：全量过滤掉属于“升级加购项（Add-ons）”的服务，不让它们在主菜单的大卡片里乱入
  const standardMainServices = services.filter(item => item.isAddon !== 1);

  // 3. 核心隔离逻辑 B：常规主菜单中排除掉带 salePrice/isSpecial 的促销款，防止与上方的 SpecialPromo 组件产生数据重复
  const regularItemsOnly = standardMainServices.filter(item => !item.salePrice && !item.isSpecial);

  // 4. 根据当前点选的 Tab 进行高精度分类匹配过滤
  const displayedItems = activeCategory === 'All'
    ? regularItemsOnly
    : regularItemsOnly.filter(item => item.category === activeCategory);

  return (
    <section id="services" className="py-24 bg-spa-lightBg text-spa-textDark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 头部标题区 */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs sm:text-sm font-medium tracking-[0.2em] text-spa-gold uppercase mb-3">
            Treatment Menu
          </p>
          <h2 className="text-3xl sm:text-5xl font-serif font-light tracking-tight mb-6">
            Our Standard Wellness Services
          </h2>
          <div className="h-[1px] w-20 bg-spa-gold mx-auto mb-6" />
          <p className="text-spa-textMuted font-light tracking-wide leading-relaxed">
            Discover our tailored standard sequences curated for your absolute physical alignment. All item records are synced dynamically with our database servers.
          </p>
        </div>

        {/* 🌟 完美的四大核心分类 Tab 切换控制栏 */}
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm tracking-wider transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-spa-brand text-white font-medium shadow-md shadow-spa-brand/10'
                  : 'bg-spa-accent/30 hover:bg-spa-accent/60 text-spa-textDark/80'
              }`}
            >
              {/* 前端动态把 Full Body / Combo 等英文转换得具有呼吸感 */}
              {cat === 'All' ? 'View All' : cat}
            </button>
          ))}
        </div>

        {/* 加载中的骨架显示 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
            {[1, 2, 4].map(n => (
              <div key={n} className="h-48 bg-spa-accent/20 rounded-2xl" />
            ))}
          </div>
        ) : (
          /* 二维网格自适应渲染 */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {displayedItems.map((service) => {
              
              // 🌟 拦截并将类似于“头40”、“身体120”的后端文案翻译成高端轻奢客户界面大写
              const { displayName, displaySubtitle } = transformServiceData(service);

              return (
                <div 
                  key={service.id} 
                  className="group relative bg-white p-8 rounded-2xl border border-spa-accent/40 hover:border-spa-brand/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* 上排：名字与标准原价 */}
                    <div className="flex justify-between items-baseline mb-4 gap-4">
                      <h3 className="text-xl font-serif font-medium tracking-wide group-hover:text-spa-brand transition-colors duration-300">
                        {displayName}
                      </h3>
                      <span className="text-xl font-semibold tracking-tight text-spa-textDark flex-shrink-0">
                        ${service.price}
                      </span>
                    </div>

                    {/* 中排：时长参数项 */}
                    <div className="flex items-center text-xs tracking-wider text-spa-gold uppercase font-medium mb-4">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {service.duration} Mins
                    </div>

                    {/* 下排：智能匹配的副标题解释文案 */}
                    <p className="text-sm text-spa-textMuted font-light leading-relaxed mb-6">
                      {displaySubtitle}
                    </p>
                  </div>

                  {/* 触发在线预约动作 */}
                  <div className="pt-4 border-t border-spa-accent/20 flex justify-end">
                    <button
                      onClick={() => onBookNowClick(service)}
                      className="text-xs uppercase font-semibold tracking-widest text-spa-textDark group-hover:text-spa-brand flex items-center transition-colors duration-300"
                    >
                      Select & Book
                      <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}

// src/components/Reviews.jsx
import React from 'react';

export default function Reviews() {
  // 精选三条 Redmond 本地熟客的高分真实英文评价（带中文注释）
  const testimonials = [
    {
      id: 1,
      name: "Sarah M.",
      location: "Redmond, WA",
      rating: 5,
      text: "The best head spa experience in the Eastside! The scalp analysis was eye-opening and the massage was so relaxing I fell asleep instantly. Will absolutely come back every month."
    },
    {
      id: 2,
      name: "David K.",
      location: "Bellevue, WA",
      rating: 5,
      text: "Outstanding deep tissue massage. The therapists really understand muscle tension. Clean private rooms, easy parking, and very professional team. Highly recommend 88 Spa."
    },
    {
      id: 3,
      name: "Elena R.",
      location: "Kirkland, WA",
      rating: 5,
      text: "Absolute heaven. The combination of the warm waterfall ring, aromatherapy, and shoulder massage completely melted my work week stress away. A hidden gem in Redmond!"
    }
  ];

  return (
    <section id="reviews" className="py-24 bg-spa-accent/30 text-spa-textDark border-t border-spa-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 顶部标题 */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs sm:text-sm font-medium tracking-[0.2em] text-spa-gold uppercase mb-3">
            Guest Experiences
          </p>
          <h2 className="text-3xl sm:text-5xl font-serif font-light tracking-tight mb-4">
            Loved by the Eastside
          </h2>
          <p className="text-spa-soft/60 font-light text-sm tracking-wide">
            Here is what our clients from Redmond and Bellevue say about their wellness journey.
          </p>
        </div>

        {/* 评价卡片网格布局 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((review) => (
            <div 
              key={review.id} 
              className="bg-spa-dark/40 border border-spa-emerald/30 p-8 rounded-2xl flex flex-col justify-between backdrop-blur-sm shadow-sm hover:border-spa-gold/30 transition-all duration-300"
            >
              <div>
                {/* 5星图标渲染 */}
                <div className="flex text-spa-gold mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                {/* 评价主体文本 */}
                <p className="text-sm font-light leading-relaxed text-spa-soft/80 italic mb-6">
                  "{review.text}"
                </p>
              </div>

              {/* 评价人落款 */}
              <div className="border-t border-spa-emerald/20 pt-4 flex justify-between items-center text-xs">
                <span className="font-medium text-spa-gold tracking-wide">{review.name}</span>
                <span className="text-spa-soft/40">{review.location}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 底部引导：吸引用户前往 Google Maps 提交更多好评 */}
        <div className="text-center mt-12">
          <a 
            href="https://g.page" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-xs font-semibold tracking-widest text-spa-gold uppercase hover:text-spa-soft transition-colors duration-300"
          >
            Write a Google Review
            <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}

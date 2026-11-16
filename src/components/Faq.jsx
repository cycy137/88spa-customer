// src/components/Faq.jsx
import React, { useState } from 'react';

import { FAQS } from '../data/faqs.js';

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQS.map((f) => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": f.a
    }
  }))
};

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-24 bg-white text-spa-textDark">
      {/* FAQPage structured data: helps Google & AI search cite these answers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 头部标题区 */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs sm:text-sm font-medium tracking-[0.2em] text-spa-gold uppercase mb-3">
            Good To Know
          </p>
          <h2 className="text-3xl sm:text-5xl font-serif font-light tracking-tight mb-6">
            Frequently Asked Questions
          </h2>
          <div className="h-[1px] w-20 bg-spa-gold mx-auto mb-6" />
          <p className="text-spa-textMuted font-light tracking-wide leading-relaxed">
            Everything you'd want to know before your first visit.
          </p>
        </div>

        {/* 手风琴问答列表 */}
        <div className="divide-y divide-spa-accent/40 border-y border-spa-accent/40">
          {FAQS.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                  aria-expanded={open}
                >
                  <span className={`text-base sm:text-lg font-medium tracking-wide transition-colors duration-300 ${open ? 'text-spa-brand' : 'text-spa-textDark group-hover:text-spa-brand'}`}>
                    {item.q}
                  </span>
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center text-lg leading-none transition-all duration-300 ${open ? 'bg-spa-brand text-white border-spa-brand rotate-45' : 'border-spa-gold text-spa-gold group-hover:bg-spa-gold group-hover:text-white'}`}>
                    +
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="pb-6 pr-4 sm:pr-12 text-spa-textMuted font-light leading-relaxed tracking-wide">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

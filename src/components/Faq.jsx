// src/components/Faq.jsx
import React, { useState } from 'react';

const FAQS = [
  {
    q: "What is a head spa, exactly?",
    a: "A head spa is a traditional scalp-care ritual focused on scalp health and deep relaxation. It combines a thorough cleanse and exfoliation of the scalp, a warm-water therapy rinse, and slow, deliberate massage across the head, neck, and shoulders. Think of it as a facial \u2014 but for your scalp."
  },
  {
    q: "Which treatment should I try for my first visit?",
    a: "Start with our Signature Head Spa. It covers the full traditional sequence \u2014 cleanse, scalp massage, warm-water therapy, and a finishing blow-dry \u2014 so you experience everything in one session. If you also want bodywork, our Head + Foot combo is the most-booked way in."
  },
  {
    q: "Will my hair be wet when I leave?",
    a: "No. Every head spa session ends with a professional blow-dry, so you walk out with dry, soft, refreshed hair. Please note we don't do styling \u2014 no curling or elaborate blowouts \u2014 so allow extra time if you're headed somewhere formal right after."
  },
  {
    q: "Do I need to wash my hair before my appointment?",
    a: "No \u2014 please come as you are. The deep cleanse is the whole point of the treatment, and arriving with unwashed hair actually lets your therapist better assess your scalp condition."
  },
  {
    q: "How is a head spa different from a regular salon hair wash?",
    a: "A salon wash is cosmetic and takes a few minutes. A head spa is therapeutic: extended scalp exfoliation, acupressure-style massage that targets tension in the head, neck, and shoulders, and warm-water therapy designed to calm the nervous system. Most guests describe it as closer to a massage than to anything at a hair salon."
  },
  {
    q: "Can I ask for softer pressure or warmer water?",
    a: "Please do \u2014 before your session and during it. Water temperature and massage pressure are set to your comfort, and adjusting mid-session is completely normal. If anything genuinely doesn't feel right, tell your therapist right away."
  },
  {
    q: "How often should I get a head spa?",
    a: "For ongoing scalp health, most guests come every 3 to 4 weeks \u2014 similar to a facial schedule. If you're dealing with buildup, dryness, or an itchy scalp, your therapist may suggest a shorter interval for the first few visits."
  },
  {
    q: "Do you take walk-ins, or should I book ahead?",
    a: "Appointments are recommended \u2014 head spa sessions need a dedicated therapy bed, so same-day availability isn't guaranteed. Call us at (425) 867-1867 or book online to reserve your spot."
  },
  {
    q: "Is head spa only for women?",
    a: "Not at all. Scalp health and stress relief are for everyone, and a good share of our guests are men. The treatment is fully customized to your hair length and scalp condition."
  },
  {
    q: "What other services do you offer besides head spa?",
    a: "We're a full massage spa: deep tissue and Swedish body massage, foot reflexology, cupping therapy as an add-on, and combo packages that pair head spa with massage or foot treatments in a single visit. Check our Treatment Menu above for the full list."
  }
];

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
            Everything you'd want to know before your first head spa visit.
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

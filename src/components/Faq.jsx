// src/components/Faq.jsx
import React, { useState } from 'react';

const FAQS = [
  {
    q: "What is a head spa, exactly?",
    a: "A head spa is a traditional scalp-care ritual focused on scalp health and deep relaxation. It combines a thorough cleanse and exfoliation of the scalp, a warm-water therapy rinse, and slow, deliberate massage across the head, neck, and shoulders. Think of it as a facial \u2014 but for your scalp."
  },
  {
    q: "Which treatment should I try for my first visit?",
    a: "Start with a body massage \u2014 it's our most popular service and the best introduction to what we do. Your therapist works through back, neck, shoulder, and leg tension with deep, therapeutic pressure tailored to you. Want the full experience in one visit? Our Body + Head combo pairs a complete massage with the traditional head spa ritual."
  },
  {
    q: "How much does a head spa cost?",
    a: "Head spa sessions run $68 for 40 minutes, $88 for 60 minutes, and $128 for 90 minutes. Our most-booked option is the 60-minute Signature at $88 \u2014 the full traditional ritual including deep cleanse, scalp massage, warm-water therapy, and a finishing blow-dry."
  },
  {
    q: "How much does a body massage cost?",
    a: "Body massage starts at $50 for 30 minutes, $80 for 60 minutes, $110 for 90 minutes, and $140 for a full two hours. It's our most popular service. The best value is in our combos \u2014 for example, a 60-minute body massage paired with a 60-minute head spa is $158 for two full hours."
  },
  {
    q: "What does a body massage session include?",
    a: "A full-body therapeutic massage focused on the areas where tension builds up: back, neck, shoulders, arms, and legs. We use deep tissue techniques to release knots, ease chronic tightness, and improve circulation \u2014 all at a pressure level you choose. Sessions run 60 or 90 minutes, and most guests tell us the 90-minute session is worth it."
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
    a: "Please do \u2014 before your session and during it. Massage pressure and water temperature are set to your comfort, and adjusting mid-session is completely normal. If anything genuinely doesn't feel right, tell your therapist right away."
  },
  {
    q: "How often should I come in?",
    a: "For ongoing benefits, most guests book every 3 to 4 weeks \u2014 whether that's body massage for tension maintenance or head spa for scalp health. If you're working through chronic tightness or heavy scalp buildup, your therapist may suggest a shorter interval for the first few visits."
  },
  {
    q: "Do you take walk-ins, or should I book ahead?",
    a: "Appointments are recommended \u2014 massage and head spa sessions need a dedicated therapy room, so same-day availability isn't guaranteed. Call us at (425) 867-1867 or book online to reserve your spot."
  },
  {
    q: "Do you offer foot massage or add-ons like cupping?",
    a: "Yes. Foot reflexology is available on its own or paired with body massage and head spa in our combo packages. Cupping therapy can be added to any body massage session for deeper release of stubborn tension \u2014 just ask when you book. Check our Treatment Menu above for the full list."
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

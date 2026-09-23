// src/utils/serviceMapper.js

/**
 * Key vocabulary dictionary matching raw text fragments to premium customer-facing English
 */
const VOCABULARY = {
  '头': 'Signature Head Spa',
  '身体': 'Therapeutic Full Body Massage', // 👈 按照您的要求，调整为全身
  '脚': 'Revitalizing Foot Reflexology',
  'special脚': 'Limited Premium Foot Ritual'
};

/**
 * Parses and transforms raw API strings like "头40" or "身体90+脚30" into client-ready displays
 * @param {Object} rawService The raw database row item
 * @returns {Object} Transformed display strings for the front-end layout cards
 */
export function transformServiceData(rawService) {
  const { name, duration, category } = rawService;

  // 1. Exact Override Protection: Check if there's a custom promo or specific override name first
  if (name.toLowerCase().includes('special')) {
    // e.g., "special脚90" turns into "Limited Premium Foot Ritual (Special)"
    const numericPart = name.replace(/[^0-9]/g, '');
    return {
      displayName: `Premium Foot Reflexology Special`,
      displaySubtitle: `Exclusive seasonal deep tissue & pressure point massage sequence.`
    };
  }

  // 2. Combo Package Parsing: If it contains a '+' sign, split and map each item
  if (name.includes('+')) {
    const parts = name.split('+'); // e.g., ["身体90", "脚30"]
    const descriptiveNames = parts.map(part => {
      const cleanKeyword = part.replace(/[0-9]/g, '').trim(); // "身体"
      return VOCABULARY[cleanKeyword] || cleanKeyword;
    });

    return {
      displayName: descriptiveNames.join(' & '), // "Therapeutic Body Massage & Revitalizing Foot Reflexology"
      displaySubtitle: `Our ultimate combined luxury sequence targeting continuous physical tension.`
    };
  }

  // 3. Single Service Parsing
  const coreKeyword = name.replace(/[0-9]/g, '').trim(); // "头"
  const formattedName = VOCABULARY[coreKeyword] || name;

  // Tailor beautiful subtitles based on category to boost SEO and conversions
    let subtitle = 'Indulge in our tailored wellness treatment to restore your natural balance.';
    if (category === 'Head') {
        subtitle = 'Deep scalp scaling, therapeutic hair wash, premium herbal mist, and neck relaxation.';
    } else if (category === 'Foot') {
        subtitle = 'Targeted pressure point reflexology and warm soothing compression to release local tension.';
    } else if (category === 'Full Body') {
        subtitle = 'Full body muscle relief incorporating custom organic massage oils and heated stones.';
    } else if (category === 'Combo') {
        subtitle = 'Our ultimate combined luxury sequence targeting complete physiological restoration.';
    }

  return {
    displayName: formattedName || name,
    displaySubtitle: subtitle
  };
}

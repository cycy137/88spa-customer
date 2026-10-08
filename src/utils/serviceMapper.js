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

  // 是否真的是特价项目（以数据库标记为准，而不只是名字里带 special）
  const isActuallySpecial = !!(rawService.isSpecial || rawService.salePrice);

  // 1. 特价专属名称：只有数据库里标了特价的才走这里
  if (name.toLowerCase().includes('special') && isActuallySpecial) {
    // e.g., "special脚90" turns into "Premium Foot Reflexology Special"
    return {
      displayName: `Premium Foot Reflexology Special`,
      displaySubtitle: `Exclusive seasonal deep tissue & pressure point massage sequence.`
    };
  }

  // 曾经是特价、现在已移回常规菜单的项目：去掉名字里的 special 前缀后按常规解析
  const cleanName = name.replace(/special/i, '');

  // 2. Combo Package Parsing: If it contains a '+' sign, split and map each item
  if (cleanName.includes('+')) {
    const parts = cleanName.split('+'); // e.g., ["身体90", "脚30"]
    const descriptiveNames = parts.map(part => {
      const cleanKeyword = part.replace(/[0-9]/g, '').trim(); // "身体"
      return VOCABULARY[cleanKeyword] || cleanKeyword;
    });

    return {
      displayName: descriptiveNames.join(' & '), // "Therapeutic Body Massage & Revitalizing Foot Reflexology"
      displaySubtitle: `Our ultimate combined luxury sequence targeting continuous physical tension.`
    };
  }

  // 3. Single Service Parsing (用去掉 special 前缀后的名字解析)
  const coreKeyword = cleanName.replace(/[0-9]/g, '').trim(); // "头"
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

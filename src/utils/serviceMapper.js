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
 * Short plain-English labels for the minute-by-minute breakdown shown in combo subtitles,
 * e.g. "60 min full body massage + 30 min foot reflexology"
 */
const SHORT_LABELS = {
  '头': 'head spa',
  '身体': 'full body massage',
  '脚': 'foot reflexology'
};

/**
 * Parses and transforms raw API strings like "头40" or "身体90+脚30" into client-ready displays
 * @param {Object} rawService The raw database row item
 * @returns {Object} Transformed display strings for the front-end layout cards
 */
export function transformServiceData(rawService) {
  const { name, duration, category } = rawService;
  const mins = Number(duration) || 0;

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

  // 曾经是特价、现在已移回常规菜单的项目：去掉名字里的 special 前缀后按常规解析，
  // 但先记住名字里带不带 special——脚部 Basic/Special 的区分就靠这个
  const isSpecialNamed = /special/i.test(name);
  const cleanName = name.replace(/special/i, '');

  // 2. Combo Package Parsing: If it contains a '+' sign, split and map each item
  if (cleanName.includes('+')) {
    const parts = cleanName.split('+'); // e.g., ["身体90", "脚30"]
    const descriptiveNames = parts.map(part => {
      const cleanKeyword = part.replace(/[0-9]/g, '').trim(); // "身体"
      return VOCABULARY[cleanKeyword] || cleanKeyword;
    });

    // 每个组合的副标题写出各自的分钟拆分（如 60/30），不再全类共用一句话
    const splitText = parts.map(part => {
      const minutes = (part.match(/[0-9]+/) || [])[0] || '';
      const cleanKeyword = part.replace(/[0-9]/g, '').trim();
      const label = SHORT_LABELS[cleanKeyword] || cleanKeyword;
      return minutes ? `${minutes} min ${label}` : label;
    }).join(' + ');

    return {
      displayName: descriptiveNames.join(' & '), // "Therapeutic Body Massage & Revitalizing Foot Reflexology"
      displaySubtitle: `A combined sequence in one visit: ${splitText}.`
    };
  }

  // 3. Single Service Parsing (用去掉 special 前缀后的名字解析)
  const coreKeyword = cleanName.replace(/[0-9]/g, '').trim(); // "头"
  const formattedName = VOCABULARY[coreKeyword] || name;

  // 脚部：Basic 与 Special 必须在名字和描述上分开（后端名字带 special 的为 Special）
  if (coreKeyword === '脚') {
    if (isSpecialNamed) {
      return {
        displayName: 'Special Foot Reflexology',
        displaySubtitle: 'Special foot reflexology: our premium foot ritual with targeted pressure-point massage and warm soothing compression.'
      };
    }
    return {
      displayName: formattedName || name,
      displaySubtitle: 'Basic foot reflexology: targeted pressure-point massage and warm compression to release tension in tired feet.'
    };
  }

  // 头部：按时长档写不同的副标题，措辞取自本站 FAQ 对头疗的已有定义，不新编项目内容
  if (coreKeyword === '头') {
    if (mins >= 90) {
      return {
        displayName: formattedName || name,
        displaySubtitle: 'An extended traditional head spa ritual with unhurried time for scalp care, warm-water therapy, and deep relaxation.'
      };
    }
    if (mins === 60) {
      return {
        displayName: formattedName || name,
        displaySubtitle: 'The full traditional head spa ritual: deep cleanse, scalp massage, warm-water therapy, and a finishing blow-dry.'
      };
    }
    return {
      displayName: formattedName || name,
      displaySubtitle: 'A focused traditional head spa ritual: scalp cleanse, therapeutic wash, and head, neck, and shoulder massage.'
    };
  }

  // 全身：按时长档写不同的副标题，措辞取自本站 FAQ 对身体按摩的已有定义
  if (coreKeyword === '身体') {
    if (mins >= 90) {
      return {
        displayName: formattedName || name,
        displaySubtitle: 'An extended full body therapeutic massage with unhurried time on back, neck, shoulders, arms, and legs, at a pressure level you choose.'
      };
    }
    if (mins === 60) {
      return {
        displayName: formattedName || name,
        displaySubtitle: 'A full body therapeutic massage for the areas where tension builds up: back, neck, shoulders, arms, and legs, at a pressure level you choose.'
      };
    }
    return {
      displayName: formattedName || name,
      displaySubtitle: 'A focused full body massage for the areas where tension builds up: back, neck, shoulders, arms, and legs.'
    };
  }

  // 其他分类：保留原有通用副标题
  let subtitle = 'Indulge in our tailored wellness treatment to restore your natural balance.';
  if (category === 'Combo') {
    subtitle = 'Our ultimate combined luxury sequence targeting complete physiological restoration.';
  }

  return {
    displayName: formattedName || name,
    displaySubtitle: subtitle
  };
}

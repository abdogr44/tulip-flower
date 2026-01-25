import path from 'path';
import fs from 'fs/promises';

export const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

export const CATEGORY_DEFINITIONS = [
  {
    ar: 'أشجار كبيرة',
    slug: 'plants-big',
    keywords: ['tree', 'trees', 'ashjar', 'شجر', 'شجرة', 'أشجار'],
    title: 'أشجار ونباتات كبيرة',
    tags: ['أشجار', 'ديكور', 'نباتات كبيرة'],
    alt: 'أشجار صناعية كبيرة للديكور الداخلي',
  },
  {
    ar: 'نباتات صغيرة',
    slug: 'plants-small',
    keywords: ['flower', 'flowers', 'ward', 'зеور', 'ورود', 'نباتات صغيرة', 'أحواض', 'فازات'],
    title: 'نباتات صغيرة وزهور',
    tags: ['زهور', 'نباتات صغيرة', 'ديكور'],
    alt: 'نباتات صغيرة وزهور صناعية للديكور',
  },
  {
    ar: 'طاولات',
    slug: 'tables',
    keywords: ['table', 'tables', 'tawla', 'طاولة', 'طاولات'],
    title: 'طاولات خشبية وإيبوكسي',
    tags: ['طاولة', 'خشب', 'ديكور'],
    alt: 'طاولات خشبية وإيبوكسي بتصاميم مميزة',
  },
  {
    ar: 'خشبيات',
    slug: 'woods',
    keywords: ['wood', 'wooden', 'khashab', 'خشب', 'خشبيات', 'أخشاب'],
    title: 'ديكورات خشبية',
    tags: ['خشب', 'ديكور', 'أعمال خشبية'],
    alt: 'ديكورات وأعمال خشبية فنية',
  },
  {
    ar: 'ديكور',
    slug: 'decore',
    keywords: ['decor', 'decoration', 'decore', 'ديكور', 'زينة'],
    title: 'قطع ديكور مميزة',
    tags: ['ديكور', 'اكسسوارات'],
    alt: 'قطع ديكور وإكسسوارات منزلية',
  },
  {
    ar: 'زهور',
    slug: 'flowers',
    keywords: ['flower', 'flowers', 'ward', 'زهور', 'ورود', 'وردة', 'زهرة'],
    title: 'تنسيق زهور صناعية',
    tags: ['زهور', 'تنسيق', 'ديكور'],
    alt: 'تنسيق زهور صناعية بلمسة فاخرة',
  },
  {
    ar: 'أحواض',
    slug: 'planters',
    keywords: ['planter', 'planters', 'pot', 'vase', 'حوض', 'أحواض', 'فاز', 'فازة', 'فازات', 'مزهرية'],
    title: 'أحواض نباتات صناعية',
    tags: ['أحواض', 'ديكور', 'نباتات صناعية'],
    alt: 'أحواض نباتات صناعية بتفاصيل أنيقة',
  },
  {
    ar: 'جدار أخضر',
    slug: 'green-wall',
    keywords: ['wall', 'greenwall', 'green-wall', 'moss', 'جدار', 'حائط', 'جدار اخضر', 'جدارأخضر'],
    title: 'جدار أخضر صناعي',
    tags: ['جدار أخضر', 'ديكور', 'نباتات صناعية'],
    alt: 'جدار أخضر صناعي لتزيين المساحات',
  },
  {
    ar: 'خارجي',
    slug: 'outdoor',
    keywords: ['outdoor', 'outside', 'garden', 'حديقة', 'خارجي', 'شرفة'],
    title: 'تنسيق خارجي',
    tags: ['خارجي', 'ديكور', 'نباتات صناعية'],
    alt: 'تنسيق نباتات صناعية للمساحات الخارجية',
  },
  {
    ar: 'مكاتب/لوبي',
    slug: 'office-lobby',
    keywords: ['office', 'lobby', 'reception', 'مكتب', 'لوبي', 'استقبال'],
    title: 'ديكور مكتب أو لوبي',
    tags: ['مكاتب', 'لوبي', 'ديكور'],
    alt: 'ديكور نباتات صناعية لمكاتب ولوبيات',
  },
  {
    ar: 'مناسبات',
    slug: 'events',
    keywords: ['event', 'wedding', 'party', 'مناسبة', 'حفلة', 'زفاف', 'عرس'],
    title: 'تنسيق مناسبات',
    tags: ['مناسبات', 'تنسيق', 'ديكور'],
    alt: 'تنسيق زهور صناعية للمناسبات',
  },
  {
    ar: 'تفصيل',
    slug: 'custom',
    keywords: ['custom', 'special', 'تفصيل', 'مصنع', 'تصنيع', 'خاص'],
    title: 'تنفيذ تفصيل خاص',
    tags: ['تفصيل', 'تنفيذ', 'ديكور'],
    alt: 'تنفيذ ديكور نباتات صناعية حسب الطلب',
  },
  {
    ar: 'غير مصنف',
    slug: 'uncategorized',
    keywords: [],
    title: 'عمل من أعمال توليب',
    tags: ['ديكور', 'نباتات صناعية'],
    alt: 'ديكور نباتات صناعية من توليب',
  },
];

export const LOCATION_DEFINITIONS = [
  {
    ar: 'النوفليين',
    slug: 'nofleen',
    keywords: ['النوفليين', 'نوفليين', 'nofleen', 'nawfaliyyin'],
  },
  {
    ar: 'طرابلس',
    slug: 'tripoli',
    keywords: ['tripoli', 'طرابلس'],
  },
];

export const DEFAULT_LOCATION_AR =
  process.env.TULIP_DEFAULT_LOCATION || 'النوفليين';

export const DEFAULT_LOCATION_SLUG = 'unknown';

export function normalizeText(text) {
  return text.toLowerCase();
}

export function detectCategory(text) {
  const normalized = normalizeText(text);
  for (const category of CATEGORY_DEFINITIONS) {
    if (!category.keywords.length) continue;
    if (category.keywords.some((keyword) => normalized.includes(keyword))) {
      return category;
    }
  }
  return CATEGORY_DEFINITIONS.find((category) => category.ar === 'غير مصنف');
}

export function detectLocation(text) {
  const normalized = normalizeText(text);
  for (const location of LOCATION_DEFINITIONS) {
    if (location.keywords.some((keyword) => normalized.includes(keyword))) {
      return location;
    }
  }
  const defaultLocation = LOCATION_DEFINITIONS.find(
    (location) => location.ar === DEFAULT_LOCATION_AR
  );
  return (
    defaultLocation || {
      ar: DEFAULT_LOCATION_AR,
      slug: DEFAULT_LOCATION_SLUG,
      keywords: [],
    }
  );
}

export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

export async function collectImages(rootDir) {
  const results = [];
  const skipDirs = new Set([
    'node_modules',
    '.next',
    '.git',
    'public\\tulip-gallery',
    'public/tulip-gallery',
    'public\\brand',
    'public/brand',
  ]);

  async function walk(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relPath = path.relative(rootDir, fullPath);
      const relPathNormalized = relPath.replace(/\\/g, '/');

      if (entry.isDirectory()) {
        if ([...skipDirs].some((skip) => relPathNormalized.startsWith(skip))) {
          continue;
        }
        await walk(fullPath);
        continue;
      }

      const ext = path.extname(entry.name).toLowerCase();
      if (!IMAGE_EXTENSIONS.has(ext)) continue;
      if (relPathNormalized.toLowerCase().includes('logo')) continue;
      results.push({
        path: fullPath,
        relativePath: relPathNormalized,
      });
    }
  }

  await walk(rootDir);
  results.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
  return results;
}

export async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

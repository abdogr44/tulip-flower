import path from 'path';
import fs from 'fs/promises';
import { createRequire } from 'module';
import sharp from 'sharp';
import {
  CATEGORY_DEFINITIONS,
  DEFAULT_LOCATION_AR,
  DEFAULT_LOCATION_SLUG,
  collectImages,
  detectCategory,
  detectLocation,
  ensureDir,
  fileExists,
} from './gallery-utils.mjs';

const require = createRequire(import.meta.url);
const imagesGuid = require('../images-guid.json');

const metadataMap = new Map();
imagesGuid.forEach((item) => {
  metadataMap.set(item.filename, item);
});

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
const rawDir = path.join(publicDir, 'tulip-gallery', 'raw');
const optimizedDir = path.join(publicDir, 'tulip-gallery', 'optimized');
const manifestPath = path.join(publicDir, 'tulip-gallery', 'manifest.json');

const images = await collectImages(rootDir);
await ensureDir(rawDir);
await ensureDir(optimizedDir);

const counters = new Map();
const manifest = [];

const getCounterKey = (categorySlug, locationSlug) => `${categorySlug}__${locationSlug}`;

const toPublicPath = (absolutePath) => {
  const rel = path.relative(publicDir, absolutePath).replace(/\\/g, '/');
  return `/${rel}`;
};

const resolveCategory = (category, explicitCategory) => {
  if (explicitCategory) {
    const found = CATEGORY_DEFINITIONS.find((item) => item.ar === explicitCategory);
    if (found) return found;
  }
  return CATEGORY_DEFINITIONS.find((item) => item.ar === category.ar) ||
    CATEGORY_DEFINITIONS[CATEGORY_DEFINITIONS.length - 1];
};

for (const file of images) {
  const fileName = path.basename(file.relativePath);
  const metadata = metadataMap.get(fileName);

  const category = resolveCategory(detectCategory(file.relativePath), metadata?.category_ar);
  const location = detectLocation(file.relativePath);
  const locationAr = metadata?.location_ar || location?.ar || DEFAULT_LOCATION_AR;
  const locationSlug = location?.slug || DEFAULT_LOCATION_SLUG;

  const counterKey = getCounterKey(category.slug, locationSlug);
  const nextIndex = (counters.get(counterKey) || 0) + 1;
  counters.set(counterKey, nextIndex);

  const indexString = String(nextIndex).padStart(3, '0');
  const baseName = `tulip__${category.slug}__${locationSlug}__${indexString}`;

  const rawTarget = path.join(rawDir, fileName);
  if (!(await fileExists(rawTarget))) {
    await fs.copyFile(file.path, rawTarget);
  }

  const thumbPath = path.join(optimizedDir, `${baseName}__480.webp`);
  const mediumPath = path.join(optimizedDir, `${baseName}__960.webp`);
  const largePath = path.join(optimizedDir, `${baseName}__1600.webp`);

  const image = sharp(file.path).rotate();

  if (!(await fileExists(thumbPath))) {
    await image
      .clone()
      .resize({ width: 480, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(thumbPath);
  }

  if (!(await fileExists(mediumPath))) {
    await image
      .clone()
      .resize({ width: 960, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(mediumPath);
  }

  if (!(await fileExists(largePath))) {
    await image
      .clone()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(largePath);
  }

  const blurBuffer = await image
    .clone()
    .resize({ width: 12, withoutEnlargement: true })
    .webp({ quality: 20 })
    .toBuffer();

  const blurDataURL = `data:image/webp;base64,${blurBuffer.toString('base64')}`;

  manifest.push({
    id: baseName,
    title_ar: metadata?.title_ar || category.title || 'عمل من أعمال توليب',
    category_ar: category.ar,
    tags_ar: metadata?.tags_ar || category.tags || ['ديكور', 'نباتات صناعية'],
    location_ar: locationAr,
    src: {
      thumb: toPublicPath(thumbPath),
      medium: toPublicPath(mediumPath),
      large: toPublicPath(largePath),
    },
    blurDataURL,
    alt_ar: metadata?.alt_ar || category.alt || 'ديكور نباتات صناعية من توليب',
  });
}

await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

console.log(`Gallery build complete: ${manifest.length} items.`);
console.log(`Manifest saved to ${path.relative(rootDir, manifestPath)}`);


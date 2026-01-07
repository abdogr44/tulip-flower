import path from 'path';
import fs from 'fs/promises';
import {
  collectImages,
  detectCategory,
  detectLocation,
  ensureDir,
} from './gallery-utils.mjs';

const rootDir = process.cwd();
const reportDir = path.join(rootDir, 'public', 'tulip-gallery');

const images = await collectImages(rootDir);
const summary = {};

const results = images.map((file) => {
  const category = detectCategory(file.relativePath);
  const location = detectLocation(file.relativePath);
  summary[category.ar] = (summary[category.ar] || 0) + 1;

  return {
    source: file.relativePath,
    category_ar: category.ar,
    location_ar: location.ar,
  };
});

await ensureDir(reportDir);
await fs.writeFile(
  path.join(reportDir, 'scan-report.json'),
  JSON.stringify({
    total: results.length,
    summary,
    results,
  }, null, 2),
  'utf8'
);

console.log('Scan complete.');
console.log(`Total images: ${results.length}`);
console.table(summary);
console.log('Report saved to public/tulip-gallery/scan-report.json');

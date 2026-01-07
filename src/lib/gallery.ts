import { promises as fs } from 'fs';
import path from 'path';
import type { GalleryItem } from './types';

export async function readGalleryManifest(): Promise<GalleryItem[]> {
  const manifestPath = path.join(process.cwd(), 'public', 'tulip-gallery', 'manifest.json');
  try {
    const raw = await fs.readFile(manifestPath, 'utf8');
    const data = JSON.parse(raw) as GalleryItem[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

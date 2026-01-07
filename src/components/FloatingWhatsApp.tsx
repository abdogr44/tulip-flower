'use client';

import { buildWhatsAppUrl } from '@/lib/whatsapp';

export default function FloatingWhatsApp() {
  return (
    <a
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-tulip-red px-5 py-3 text-sm font-semibold text-white shadow-soft"
      aria-label="واتساب - طلب عرض سعر"
    >
      واتساب
      <span className="text-base">↗</span>
    </a>
  );
}

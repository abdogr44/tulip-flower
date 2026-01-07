'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import type { GalleryItem } from '@/lib/types';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

const CATEGORY_FILTERS = [
  { label: 'الكل', value: 'all' },
  { label: 'أشجار', value: 'أشجار' },
  { label: 'زهور', value: 'زهور' },
  { label: 'أحواض', value: 'أحواض' },
  { label: 'جدار أخضر', value: 'جدار أخضر' },
  { label: 'خارجي', value: 'خارجي' },
  { label: 'مكاتب/لوبي', value: 'مكاتب/لوبي' },
  { label: 'مناسبات', value: 'مناسبات' },
  { label: 'تفصيل', value: 'تفصيل' },
  { label: 'غير مصنف', value: 'غير مصنف' },
];

const CATEGORY_SYNONYMS: Record<string, string[]> = {
  'أحواض': ['أحواض', 'أحواض/فازات'],
  'تفصيل': ['تفصيل', 'تفصيل/تصنيع خاص'],
};

type Props = {
  items: GalleryItem[];
};

export default function Gallery({ items }: Props) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeLocation, setActiveLocation] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [displayLimit, setDisplayLimit] = useState(12);
  const [pageUrl, setPageUrl] = useState('');
  const [isZoomed, setIsZoomed] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPageUrl(window.location.href);
    }
  }, []);

  const locations = useMemo(() => {
    const unique = new Set<string>();
    items.forEach((item) => {
      if (item.location_ar) {
        unique.add(item.location_ar);
      }
    });
    return Array.from(unique);
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const categoryValue = item.category_ar || '';
      const matchesCategory =
        activeCategory === 'all' ||
        (CATEGORY_SYNONYMS[activeCategory]
          ? CATEGORY_SYNONYMS[activeCategory].includes(categoryValue)
          : categoryValue === activeCategory);
      const matchesLocation =
        activeLocation === 'all' || item.location_ar === activeLocation;
      return matchesCategory && matchesLocation;
    });
  }, [items, activeCategory, activeLocation]);

  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, displayLimit);
  }, [filteredItems, displayLimit]);

  const selectedIndex = useMemo(() => {
    if (!selectedId) return -1;
    return filteredItems.findIndex((item) => item.id === selectedId);
  }, [filteredItems, selectedId]);

  const activeItem = selectedIndex >= 0 ? filteredItems[selectedIndex] : null;

  useEffect(() => {
    if (selectedId && selectedIndex === -1) {
      setSelectedId(null);
    }
  }, [selectedId, selectedIndex]);

  const openItem = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const closeItem = useCallback(() => {
    setSelectedId(null);
    setIsZoomed(false);
  }, []);

  const goNext = useCallback(() => {
    if (!filteredItems.length) return;
    const nextIndex = selectedIndex >= 0 ? (selectedIndex + 1) % filteredItems.length : 0;
    setSelectedId(filteredItems[nextIndex].id);
    setIsZoomed(false);
  }, [filteredItems, selectedIndex]);

  const goPrev = useCallback(() => {
    if (!filteredItems.length) return;
    const prevIndex =
      selectedIndex >= 0
        ? (selectedIndex - 1 + filteredItems.length) % filteredItems.length
        : 0;
    setSelectedId(filteredItems[prevIndex].id);
    setIsZoomed(false);
  }, [filteredItems, selectedIndex]);

  useEffect(() => {
    if (!activeItem) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeItem();
      }
      if (event.key === 'ArrowRight') {
        goNext();
      }
      if (event.key === 'ArrowLeft') {
        goPrev();
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [activeItem, closeItem, goNext, goPrev]);

  useEffect(() => {
    if (activeItem && modalRef.current) {
      modalRef.current.focus();
    }
  }, [activeItem]);

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    const threshold = 50;
    if (deltaX > threshold) {
      goPrev();
    } else if (deltaX < -threshold) {
      goNext();
    }
    touchStartX.current = null;
  };

  const toggleZoom = () => {
    setIsZoomed((prev) => !prev);
    setZoomPosition({ x: 0, y: 0 });
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const touch = e.touches[0];
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((touch.clientX - left) / width) * 100;
    const y = ((touch.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <section id="gallery" className="relative pb-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORY_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveCategory(filter.value)}
                className={`rounded-full border px-4 py-2 text-sm transition ${activeCategory === filter.value
                  ? 'border-tulip-red bg-tulip-red text-white'
                  : 'border-black/10 bg-white text-black/70 hover:border-tulip-red'
                  }`}
                aria-pressed={activeCategory === filter.value}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <div className="min-w-[180px]">
            <label className="sr-only" htmlFor="location-select">
              فلترة حسب الموقع
            </label>
            <select
              id="location-select"
              value={activeLocation}
              onChange={(event) => setActiveLocation(event.target.value)}
              className="w-full rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/70 focus:border-tulip-green focus:outline-none"
            >
              <option value="all">كل المواقع</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((item, index) => (
            <article
              key={item.id}
              className="gallery-article group relative overflow-hidden rounded-2xl border border-black/5 bg-white shadow-soft transition hover:-translate-y-1"
            >
              <button
                type="button"
                onClick={() => openItem(item.id)}
                className="block w-full text-start"
                aria-label={`عرض ${item.title_ar}`}
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={item.src.medium}
                    alt={item.alt_ar}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                    placeholder="blur"
                    blurDataURL={item.blurDataURL}
                    priority={index < 4}
                  />
                </div>
                <div className="space-y-2 px-4 pb-5 pt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-tulip-ink">
                      {item.title_ar}
                    </h3>
                    <span className="text-xs text-tulip-orange">●</span>
                  </div>
                  <p className="text-sm text-black/50">{item.location_ar}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags_ar.slice(0, 3).map((tag) => (
                      <span
                        key={`${item.id}-${tag}`}
                        className="rounded-full bg-tulip-green/10 px-3 py-1 text-xs text-tulip-green"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            </article>
          ))}
        </div>

        {displayLimit < filteredItems.length && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => setDisplayLimit((prev) => prev + 12)}
              className="rounded-full border border-black/10 bg-white px-8 py-3 text-sm font-semibold text-black/70 hover:border-tulip-red hover:text-tulip-red transition"
            >
              عرض المزيد من الصور
            </button>
          </div>
        )}
      </div>

      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-10"
          role="dialog"
          aria-modal="true"
          onClick={closeItem}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            ref={modalRef}
            tabIndex={-1}
            className="relative max-h-full w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-soft outline-none"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeItem}
              className="absolute left-4 top-4 z-20 rounded-full border border-black/10 bg-white/90 px-3 py-1 text-sm text-black/70 hover:bg-white transition"
              aria-label="إغلاق"
            >
              إغلاق
            </button>

            {/* Image Counter */}
            <div className="absolute right-4 top-4 z-20 rounded-full bg-black/60 px-3 py-1 text-sm text-white backdrop-blur-sm">
              {selectedIndex + 1} / {filteredItems.length}
            </div>

            {/* Large Arrow Navigation Buttons - Desktop/Tablet Only */}
            <button
              type="button"
              onClick={goPrev}
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-white/90 text-tulip-ink shadow-lg backdrop-blur-sm transition hover:bg-white hover:scale-110"
              aria-label="الصورة السابقة"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-white/90 text-tulip-ink shadow-lg backdrop-blur-sm transition hover:bg-white hover:scale-110"
              aria-label="الصورة التالية"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div
              className={`relative h-[65vh] w-full overflow-hidden bg-black/5 transition-colors ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                }`}
              onClick={toggleZoom}
              onMouseMove={onMouseMove}
              onTouchMove={onTouchMove}
            >
              <Image
                src={activeItem.src.large}
                alt={activeItem.alt_ar}
                fill
                sizes="(max-width: 768px) 100vw, 90vw"
                className={`transition-transform duration-300 ease-out ${isZoomed ? 'scale-[2.5] object-contain' : 'object-contain'
                  }`}
                style={isZoomed ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : undefined}
                placeholder="blur"
                blurDataURL={activeItem.blurDataURL}
              />
            </div>
            <div className="space-y-4 px-4 py-4 sm:px-6 sm:py-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-tulip-ink sm:text-lg">
                    {activeItem.title_ar}
                  </h3>
                  <p className="text-sm text-black/50">{activeItem.location_ar}</p>
                </div>

                {/* Navigation Controls - Optimized for Mobile */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={toggleZoom}
                    className="flex-1 sm:flex-none rounded-full border border-tulip-red bg-white px-4 py-2 text-sm font-medium text-tulip-red hover:bg-tulip-red hover:text-white transition"
                    aria-label={isZoomed ? 'تصغير الصورة' : 'تكبير الصورة'}
                  >
                    {isZoomed ? 'تصغير' : 'تكبير'}
                  </button>

                  {/* Mobile Navigation Buttons */}
                  <button
                    type="button"
                    onClick={goPrev}
                    className="md:hidden flex-1 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/70 hover:border-tulip-red hover:text-tulip-red transition"
                    aria-label="الصورة السابقة"
                  >
                    السابق
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="md:hidden flex-1 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/70 hover:border-tulip-red hover:text-tulip-red transition"
                    aria-label="الصورة التالية"
                  >
                    التالي
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeItem.tags_ar.map((tag) => (
                  <span
                    key={`${activeItem.id}-${tag}`}
                    className="rounded-full bg-tulip-green/10 px-3 py-1 text-xs text-tulip-green"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href={buildWhatsAppUrl({
                  title: activeItem.title_ar,
                  location: activeItem.location_ar,
                  url: pageUrl,
                })}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-tulip-red px-6 py-3 text-sm font-semibold text-white"
              >
                اطلب مثل هذا
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

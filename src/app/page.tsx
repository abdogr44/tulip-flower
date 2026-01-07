import Image from 'next/image';
import Gallery from '@/components/Gallery';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { readGalleryManifest } from '@/lib/gallery';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export default async function Home() {
  const items = await readGalleryManifest();

  return (
    <main className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-40 top-10 h-72 w-72 rounded-full bg-tulip-red/10 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-32 h-80 w-80 rounded-full bg-tulip-green/10 blur-3xl" />
        <section className="mx-auto w-full max-w-6xl px-6 pb-16 pt-16">
          <div className="space-y-6 fade-up">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full border border-black/10 bg-white">
                <Image
                  src="/brand/logo.jpg"
                  alt="شعار توليب"
                  fill
                  className="object-cover"
                  sizes="64px"
                  priority
                />
              </div>
              <h1 className="text-3xl font-semibold text-tulip-ink">توليب</h1>
            </div>
            <p className="text-lg text-black/70">
              توليب لخدمات تنسيق الحدائق و الزهور و الديكور
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-tulip-red px-6 py-3 text-sm font-semibold text-white"
              >
                واتساب - طلب عرض سعر
              </a>
              <a
                href="#gallery"
                className="rounded-full border border-black/10 px-6 py-3 text-sm text-black/70"
              >
                تصفح المعرض
              </a>
            </div>
          </div>
        </section>
      </div>

      {
        items.length > 0 ? (
          <Gallery items={items} />
        ) : (
          <section className="mx-auto w-full max-w-4xl px-6 pb-20">
            <div className="rounded-2xl border border-black/10 bg-white p-8 text-center text-black/60">
              لم يتم العثور على صور بعد. شغّل `npm run gallery:build` بعد إضافة الصور.
            </div>
          </section>
        )
      }

      < footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 pb-10 text-sm text-black/50" >
        <span>© Tulip</span>
        <div className="flex gap-4">
          <a href={buildWhatsAppUrl()} target="_blank" rel="noreferrer">
            واتساب
          </a>
          <a href={`tel:+${WHATSAPP_NUMBER}`}>اتصال</a>
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
            انستغرام
          </a>
        </div>
      </footer >

      <FloatingWhatsApp />
    </main >
  );
}

import Image from 'next/image';
import Gallery from '@/components/Gallery';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { readGalleryManifest } from '@/lib/gallery';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export default async function Home() {
  let items = await readGalleryManifest();

  // Custom Sort Order
  const categoryOrder = [
    'أشجار كبيرة',
    'نباتات صغيرة',
    'طاولات',
    'خشبيات',
    'ديكور'
  ];

  items.sort((a, b) => {
    const indexA = categoryOrder.indexOf(a.category_ar);
    const indexB = categoryOrder.indexOf(b.category_ar);

    // If both are in the priority list, sort by index
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    // If only A is in list, it comes first
    if (indexA !== -1) return -1;
    // If only B is in list, it comes first
    if (indexB !== -1) return 1;

    // Default sort or keep original order
    return 0;
  });

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

      <section className="mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-soft md:p-12">
          <h2 className="mb-6 text-2xl font-semibold text-tulip-ink md:text-3xl">
            مشروع مصنع فايبر توليب
          </h2>

          <div className="space-y-6 text-lg leading-relaxed text-black/70">
            <p>
              مشروع انشاء مصنع فايبر لتصنيع الاحواض للاشجار وفازات الورد والطاولات وبعض الديكورات
            </p>

            <p>
              وفكرة المشروع تتمحور حول التصنيع المحلي مع استراد المواد الخامة من الخارج
            </p>

            <div className="mt-8">
              <h3 className="mb-4 text-xl font-semibold text-tulip-ink">
                تكلفة المشروع تنقسم إلى 3 أقسام:
              </h3>

              <div className="space-y-4">
                <div className="rounded-2xl border border-tulip-green/20 bg-tulip-green/5 p-6">
                  <h4 className="mb-2 font-semibold text-tulip-ink">
                    1) مواد تشغيلية خام
                  </h4>
                  <p className="text-black/70">
                    من دول الجوار ومواد خام من دولة الصين
                  </p>
                  <p className="mt-2 text-xl font-bold text-tulip-green">
                    التكلفة: تقريبا 150,000 دولار
                  </p>
                </div>

                <div className="rounded-2xl border border-tulip-orange/20 bg-tulip-orange/5 p-6">
                  <h4 className="mb-2 font-semibold text-tulip-ink">
                    2) مواد محلية طبيعية وأدوات مصنعية
                  </h4>
                  <p className="mt-2 text-xl font-bold text-tulip-orange">
                    التكلفة: تقريبا 20,000 دولار
                  </p>
                </div>

                <div className="rounded-2xl border border-tulip-red/20 bg-tulip-red/5 p-6">
                  <h4 className="mb-2 font-semibold text-tulip-ink">
                    3) صالة عرض في مكان تجاري
                  </h4>
                  <p className="text-black/70">
                    ويمكن فتح فروع في مناطق خارج طرابلس
                  </p>
                  <p className="mt-2 text-lg font-semibold text-tulip-red">
                    التكلفة تعتمد على المكان والديكور وهي على أسعار حسب السوق المحلي
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-gradient-to-br from-tulip-green/10 to-tulip-red/10 p-6 md:p-8">
              <h3 className="mb-4 text-xl font-semibold text-tulip-ink">
                ميزة التصنيع المحلي
              </h3>
              <p className="text-black/70">
                تقليل مصاريف الشحن العالية وزيادة في هامش الربح حيث يصل هامش الربح بعد التصنيع المحلي إلى
                <span className="mx-2 font-bold text-tulip-green">300%</span>
                وفي بعض الأصناف إلى
                <span className="mr-2 font-bold text-tulip-red">500%</span>
              </p>
            </div>
          </div>
        </div>
      </section>

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

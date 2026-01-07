# Tulip Gallery UI

واجهة معرض أعمال Tulip (صفحة واحدة RTL) جاهزة للنشر على Vercel.

## تشغيل محلي

```bash
npm install
npm run dev
```

## بايبلاين الصور

1) ضع الصور الأصلية داخل أي مجلد في الريبو (يفضّل `Gallery/`).
2) شغّل الفحص:

```bash
npm run gallery:scan
```

3) شغّل البناء:

```bash
npm run gallery:build
```

سينتج ذلك:
- `public/tulip-gallery/raw` للاحتفاظ بالنسخ الأصلية.
- `public/tulip-gallery/optimized` للنسخ المحسنة.
- `public/tulip-gallery/manifest.json` لتغذية الواجهة.

## إضافة صور جديدة

- انسخ الصور الجديدة إلى `Gallery/`.
- شغّل `npm run gallery:build` لإعادة التوليد.
- عدّل التصنيفات أو الموقع عبر أسماء الملفات أو بتعديل `scripts/gallery-utils.mjs` عند الحاجة.

## أرقام التواصل

- رقم الواتساب موجود في ثابت واحد داخل `src/lib/constants.ts`.

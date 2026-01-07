export type GalleryItem = {
  id: string;
  title_ar: string;
  category_ar: string;
  tags_ar: string[];
  location_ar: string;
  date?: string;
  src: {
    thumb: string;
    medium: string;
    large: string;
  };
  blurDataURL: string;
  alt_ar: string;
};

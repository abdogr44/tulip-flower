import { WHATSAPP_NUMBER, WHATSAPP_DEFAULT_MESSAGE } from './constants';

type WhatsAppPayload = {
  title?: string;
  location?: string;
  url?: string;
};

export function buildWhatsAppUrl(payload: WhatsAppPayload = {}) {
  const parts = [WHATSAPP_DEFAULT_MESSAGE];
  if (payload.title) {
    parts.push(`العنوان: ${payload.title}`);
  }
  if (payload.location) {
    parts.push(`الموقع: ${payload.location}`);
  }
  if (payload.url) {
    parts.push(`الرابط: ${payload.url}`);
  }
  const text = parts.join('\n');
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

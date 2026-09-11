export type LegalLocale = "uz" | "ru" | "en";

export const legalDocuments: Record<
  "privacy" | "terms",
  Record<LegalLocale, { title: string; paragraphs: string[] }>
> = {
  privacy: {
    uz: {
      title: "Maxfiylik siyosati",
      paragraphs: [
        "Seven Ways sayt orqali olingan shaxsiy maʼlumotlarni (ism, telefon, elektron pochta) faqat soʻrovingizni qayta ishlash va aloqa uchun ishlatadi.",
        "Maʼlumotlar uchinchi shaxslarga sotilmaydi. Xizmat koʻrsatish uchun zarur boʻlgan hollardagina (masalan, bron tizimlari) uzatilishi mumkin.",
        "Savollar uchun: info@sevenways.uz",
      ],
    },
    ru: {
      title: "Политика конфиденциальности",
      paragraphs: [
        "Seven Ways использует персональные данные (имя, телефон, email), полученные через сайт, только для обработки заявок и связи с вами.",
        "Данные не продаются третьим лицам. Передача возможна лишь при необходимости оказания услуги (например, системы бронирования).",
        "Вопросы: info@sevenways.uz",
      ],
    },
    en: {
      title: "Privacy policy",
      paragraphs: [
        "Seven Ways uses personal data (name, phone, email) collected via the site only to process requests and contact you.",
        "We do not sell data to third parties. Sharing may occur only when required to deliver the service (e.g. booking systems).",
        "Questions: info@sevenways.uz",
      ],
    },
  },
  terms: {
    uz: {
      title: "Foydalanish shartlari",
      paragraphs: [
        "Saytdagi narxlar orientir hisoblanadi. Yakuniy shartlar shartnomada belgilanadi.",
        "Onlayn toʻlov amalga oshirilmaydi. Toʻlov ofis kassasi orqali, chek bilan.",
        "Saytdan foydalanish Oʻzbekiston Respublikasi qonunlariga boʻysunadi.",
      ],
    },
    ru: {
      title: "Условия использования",
      paragraphs: [
        "Цены на сайте ориентировочные. Итоговые условия фиксируются в договоре.",
        "Онлайн-оплата не принимается. Оплата — через кассу офиса с чеком.",
        "Использование сайта регулируется законодательством Республики Узбекистан.",
      ],
    },
    en: {
      title: "Terms of use",
      paragraphs: [
        "Prices on the site are indicative. Final terms are stated in the contract.",
        "Online payment is not accepted. Payment is at the office cash desk with a receipt.",
        "Use of the site is governed by the laws of the Republic of Uzbekistan.",
      ],
    },
  },
};

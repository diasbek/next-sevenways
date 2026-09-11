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
        "Odatiy holatda toʻlov ofis kassasi orqali, chek bilan. Onlayn toʻlov faqat saytda checkout yoqilganda va Click/Payme/Uzum orqali amalga oshiriladi — hech qachon xodimning shaxsiy kartasiga emas.",
        "Saytdan foydalanish Oʻzbekiston Respublikasi qonunlariga boʻysunadi.",
      ],
    },
    ru: {
      title: "Условия использования",
      paragraphs: [
        "Цены на сайте ориентировочные. Итоговые условия фиксируются в договоре.",
        "По умолчанию оплата — через кассу офиса с чеком. Онлайн-оплата доступна только когда на сайте включён checkout и проходит через Click/Payme/Uzum — никогда на личную карту сотрудника.",
        "Использование сайта регулируется законодательством Республики Узбекистан.",
      ],
    },
    en: {
      title: "Terms of use",
      paragraphs: [
        "Prices on the site are indicative. Final terms are stated in the contract.",
        "By default, payment is at the office cash desk with a receipt. Online payment is available only when checkout is enabled on the site and goes through Click/Payme/Uzum — never to an employee’s personal card.",
        "Use of the site is governed by the laws of the Republic of Uzbekistan.",
      ],
    },
  },
};

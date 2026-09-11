export type LocalizedOffice = {
  id: string;
  cityKey: "tashkent" | "samarkand";
  city: { uz: string; ru: string; en: string };
  name: { uz: string; ru: string; en: string };
  address: { uz: string; ru: string; en: string };
  phones: string[];
  phoneDisplay: string;
  lat: number;
  lng: number;
  image?: string;
};

export const OFFICES: LocalizedOffice[] = [
  {
    id: "central",
    cityKey: "tashkent",
    city: { uz: "Toshkent", ru: "Ташкент", en: "Tashkent" },
    name: { uz: "Markaziy ofis", ru: "Центральный офис", en: "Central office" },
    address: {
      uz: "Amir Temur koʻchasi, 1",
      ru: "ул. Амира Темура, 1",
      en: "1 Amir Temur Street",
    },
    phones: ["+998977779811"],
    phoneDisplay: "+998 97 777 98 11",
    lat: 41.3111,
    lng: 69.2797,
    image: "/images/offices/central.jpg",
  },
  {
    id: "yunusabad",
    cityKey: "tashkent",
    city: { uz: "Toshkent", ru: "Ташкент", en: "Tashkent" },
    name: { uz: "Yunusobod", ru: "Юнусабад", en: "Yunusabad" },
    address: {
      uz: "Amir Temur shoh koʻchasi, 100",
      ru: "пр. Амира Темура, 100",
      en: "100 Amir Temur Avenue",
    },
    phones: ["+998901234568"],
    phoneDisplay: "+998 90 123 45 68",
    lat: 41.345,
    lng: 69.285,
  },
  {
    id: "chilonzor",
    cityKey: "tashkent",
    city: { uz: "Toshkent", ru: "Ташкент", en: "Tashkent" },
    name: { uz: "Chilonzor", ru: "Чиланзар", en: "Chilanzar" },
    address: {
      uz: "Bunyodkor shoh koʻchasi, 15",
      ru: "пр. Бунёдкор, 15",
      en: "15 Bunyodkor Avenue",
    },
    phones: ["+998901234569"],
    phoneDisplay: "+998 90 123 45 69",
    lat: 41.285,
    lng: 69.205,
  },
  {
    id: "samarkand",
    cityKey: "samarkand",
    city: { uz: "Samarqand", ru: "Самарканд", en: "Samarkand" },
    name: {
      uz: "Samarqand ofis",
      ru: "Офис Самарканд",
      en: "Samarkand office",
    },
    address: {
      uz: "Registon koʻchasi, 5",
      ru: "ул. Регистан, 5",
      en: "5 Registon Street",
    },
    phones: ["+998902345678"],
    phoneDisplay: "+998 90 234 56 78",
    lat: 39.6542,
    lng: 66.9597,
  },
];

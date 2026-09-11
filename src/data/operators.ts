export type Operator = {
  id: string;
  name: { uz: string; ru: string; en: string };
  role: { uz: string; ru: string; en: string };
  phone: string;
  phoneDisplay: string;
  telegram: string;
  image: string;
  online?: boolean;
};

export const OPERATORS: Operator[] = [
  {
    id: "dilnoza",
    name: {
      uz: "Dilnoza Karimova",
      ru: "Дилноза Каримова",
      en: "Dilnoza Karimova",
    },
    role: {
      uz: "Tur menejeri",
      ru: "Менеджер по турам",
      en: "Tour manager",
    },
    phone: "+998901234567",
    phoneDisplay: "+998 90 123 45 67",
    telegram: "dilnoza_sevenways",
    image: "/images/operators/dilnoza.jpg",
    online: true,
  },
  {
    id: "azizbek",
    name: {
      uz: "Azizbek Rasulov",
      ru: "Азизбек Расулов",
      en: "Azizbek Rasulov",
    },
    role: {
      uz: "Katta operator",
      ru: "Старший оператор",
      en: "Senior operator",
    },
    phone: "+998901234568",
    phoneDisplay: "+998 90 123 45 68",
    telegram: "azizbek_sevenways",
    image: "/images/operators/azizbek.jpg",
    online: true,
  },
  {
    id: "madina",
    name: {
      uz: "Madina Tursunova",
      ru: "Мадина Турсунова",
      en: "Madina Tursunova",
    },
    role: {
      uz: "Yoʻnalishlar mutaxassisi",
      ru: "Специалист по направлениям",
      en: "Destinations specialist",
    },
    phone: "+998901234569",
    phoneDisplay: "+998 90 123 45 69",
    telegram: "madina_sevenways",
    image: "/images/operators/madina.jpg",
    online: true,
  },
  {
    id: "sherzod",
    name: {
      uz: "Sherzod Abdukarimov",
      ru: "Шерзод Абдукаримов",
      en: "Sherzod Abdukarimov",
    },
    role: {
      uz: "Bron menejeri",
      ru: "Менеджер по бронированию",
      en: "Booking manager",
    },
    phone: "+998901234570",
    phoneDisplay: "+998 90 123 45 70",
    telegram: "sherzod_sevenways",
    image: "/images/operators/sherzod.jpg",
    online: true,
  },
];

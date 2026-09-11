export interface NavItem {
  label: string;
  href: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface GiftItem {
  id: string;
  title: string;
  note: string;
}

export interface SiteCopy {
  meta: {
    homeTitle: string;
    homeDescription: string;
    toursTitle: string;
    toursDescription: string;
    searchTitle: string;
    searchDescription: string;
    calendarTitle: string;
    calendarDescription: string;
    giftsTitle: string;
    giftsDescription: string;
    officesTitle: string;
    officesDescription: string;
    requestTitle: string;
    requestDescription: string;
    faqTitle: string;
    faqDescription: string;
    aboutTitle: string;
    aboutDescription: string;
    newsTitle: string;
    newsDescription: string;
    contactsTitle: string;
    contactsDescription: string;
    privacyTitle: string;
    privacyDescription: string;
    termsTitle: string;
    termsDescription: string;
    notFoundTitle: string;
  };
  ui: {
    leaveRequest: string;
    call: string;
    write: string;
    send: string;
    next: string;
    back: string;
    menu: string;
    close: string;
    cookieText: string;
    cookieAccept: string;
    cookieDecline: string;
    required: string;
    fromPrice: string;
    perPerson: string;
    forTwo: string;
    nights: string;
    allInclusive: string;
    onRequest: string;
    seatsAvailable: string;
    viewTours: string;
    searchTours: string;
    learnMore: string;
    readMore: string;
    allDestinations: string;
    filter: string;
    reset: string;
    noResults: string;
    priceDisclaimer: string;
  };
  nav: NavItem[];
  home: {
    heroTitle: string;
    heroLead: string;
    heroNote: string;
    trustOffices: string;
    trustTourists: string;
    trustYears: string;
    destinationsTitle: string;
    hotTitle: string;
    hotLead: string;
    giftsTitle: string;
    giftsLead: string;
    faqTitle: string;
    faqLead: string;
    trustTitle: string;
    trustLead: string;
    ctaTitle: string;
    ctaLead: string;
  };
  about: {
    title: string;
    lead: string;
    body: string[];
    principlesTitle: string;
    principles: string[];
    stepsTitle: string;
    steps: Array<{ title: string; text: string }>;
  };
  faq: {
    title: string;
    lead: string;
    items: FaqItem[];
  };
  contacts: {
    title: string;
    lead: string;
    callCentre: string;
    visitOffice: string;
    scamTitle: string;
    scamText: string;
  };
  offices: {
    title: string;
    lead: string;
    mapTitle: string;
    listTitle: string;
  };
  search: {
    title: string;
    lead: string;
    destination: string;
    dates: string;
    budget: string;
    travellers: string;
  };
  calendar: {
    title: string;
    lead: string;
  };
  gifts: {
    title: string;
    lead: string;
    items: GiftItem[];
  };
  request: {
    title: string;
    lead: string;
    name: string;
    phone: string;
    destination: string;
    dates: string;
    comment: string;
    success: string;
  };
  tours: {
    title: string;
    lead: string;
    includedTitle: string;
    included: string[];
  };
  news: {
    title: string;
    lead: string;
    empty: string;
  };
  footer: {
    blurb: string;
    support: string;
    legal: string;
    rights: string;
  };
  notFound: {
    title: string;
    lead: string;
    home: string;
  };
}

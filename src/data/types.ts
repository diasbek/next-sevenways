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
  brand: {
    descriptor: string;
  };
  home: {
    heroTitle: string;
    heroLead: string;
    heroNote: string;
    heroScript: string;
    heroTabTours: string;
    heroTabHotels: string;
    heroTabTransfers: string;
    heroWhere: string;
    heroDates: string;
    heroPeople: string;
    heroSearchCta: string;
    trustOffices: string;
    trustTourists: string;
    trustYears: string;
    trustSupport: string;
    destinationsTitle: string;
    destinationsLead: string;
    destinationsFilterAll: string;
    destinationsFilterBeach: string;
    destinationsFilterExcursion: string;
    hotTitle: string;
    hotLead: string;
    hotBenefitPrice: string;
    hotBenefitHotels: string;
    hotBenefitSupport: string;
    giftsTitle: string;
    giftsLead: string;
    faqEyebrow: string;
    faqTitle: string;
    faqLead: string;
    faqCardTitle: string;
    faqCardLead: string;
    faqAskCta: string;
    faqBenefitFast: string;
    faqBenefitSupport: string;
    trustTitle: string;
    trustLead: string;
    ctaTitle: string;
    ctaLead: string;
  };
  about: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    lead: string;
    cta: string;
    whoEyebrow: string;
    whoTitle: string;
    whoLead: string;
    stats: Array<{ value: string; label: string }>;
    principlesTitle: string;
    principlesLead: string;
    principles: Array<{ title: string; text: string }>;
    stepsEyebrow: string;
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
    cityTashkent: string;
    citySamarkand: string;
    buildRoute: string;
    call: string;
    officesCountLabel: string;
    helpInPerson: string;
    operatorsTitle: string;
    operatorsLead: string;
    online: string;
    contactOperator: string;
    consultTitle: string;
    consultLead: string;
    getConsult: string;
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
    navigation: string;
    support: string;
    legal: string;
    rights: string;
    nav: NavItem[];
  };
  notFound: {
    title: string;
    lead: string;
    home: string;
  };
}

export type Localized = { nl: string; ar: string; en: string; fr: string };

export const org = {
  name: {
    nl: "VZW De Toekomst",
    ar: "جمعية المستقبل",
    en: "VZW De Toekomst",
    fr: "VZW De Toekomst",
  } as Localized,
  tagline: {
    nl: "Islamitisch centrum & moskee in Gent",
    ar: "مركز إسلامي ومسجد في غنت",
    en: "Islamic centre & mosque in Ghent",
    fr: "Centre islamique et mosquée à Gand",
  } as Localized,
  address: {
    street: "Rerum-Novarumplein 1",
    postalCode: "9000",
    city: "Gent",
    country: "België",
  },
  phone: "0472 86 04 75",
  email: "info@toekomst.be", // TODO
  iban: "BE00 0000 0000 0000", // TODO
  facebook: "https://www.facebook.com/profile.php?id=100074718108818",
  mapUrl: "https://maps.google.com/?q=Rerum-Novarumplein+1,+9000+Gent",
};

export const mawaqit = {
  slug: "de-toekomst-ghant-9000-belgium",
  mosqueId: "2598",
  url: "https://mawaqit.net/en/de-toekomst-ghant-9000-belgium",
};

export type Hall = {
  id: string;
  label: Localized;
};

export const halls: Hall[] = [
  {
    id: "grote-zaal",
    label: { nl: "Grote zaal", ar: "القاعة الكبرى", en: "Main hall", fr: "Grande salle" },
  },
  {
    id: "kleine-zaal",
    label: { nl: "Kleine zaal", ar: "القاعة الصغيرة", en: "Small hall", fr: "Petite salle" },
  },
  {
    id: "leslokaal",
    label: { nl: "Leslokaal", ar: "قاعة الدروس", en: "Classroom", fr: "Salle de classe" },
  },
  {
    id: "buiten",
    label: { nl: "Buitenterrein", ar: "الساحة الخارجية", en: "Outdoor area", fr: "Espace extérieur" },
  },
];

export type BookingType = {
  id: string;
  label: Localized;
};

export const bookingTypes: BookingType[] = [
  {
    id: "bruiloft",
    label: {
      nl: "Bruiloft / feest",
      ar: "عرس / حفل",
      en: "Wedding / celebration",
      fr: "Mariage / fête",
    },
  },
  {
    id: "aza",
    label: { nl: "عزاء (rouwbeklag)", ar: "عزاء", en: "عزاء (condolences)", fr: "عزاء (condoléances)" },
  },
  {
    id: "aqiqa",
    label: { nl: "عقيقة (geboorte)", ar: "عقيقة", en: "عقيقة (newborn)", fr: "عقيقة (naissance)" },
  },
  {
    id: "overig",
    label: { nl: "Overige", ar: "أخرى", en: "Other", fr: "Autre" },
  },
];

export type LinkItem = {
  name: string;
  url: string;
  description: Localized;
};

export const quranLinks: LinkItem[] = [
  {
    name: "Quran.com",
    url: "https://quran.com",
    description: {
      nl: "Lees de Koran met vertalingen en recitaties.",
      ar: "اقرأ القرآن مع الترجمات والتلاوات.",
      en: "Read the Qur'an with translations and recitations.",
      fr: "Lisez le Coran avec traductions et récitations.",
    },
  },
  {
    name: "Tanzil.net",
    url: "https://tanzil.net",
    description: {
      nl: "Nauwkeurige Korantekst en vertalingen om te downloaden.",
      ar: "نص قرآني دقيق وترجمات للتحميل.",
      en: "Accurate Qur'an text and translations to download.",
      fr: "Texte coranique précis et traductions à télécharger.",
    },
  },
  {
    name: "Quran.ksu.edu.sa",
    url: "https://quran.ksu.edu.sa",
    description: {
      nl: "Koran met tafsir (uitleg) van King Saud University.",
      ar: "القرآن مع التفسير من جامعة الملك سعود.",
      en: "Qur'an with tafsir from King Saud University.",
      fr: "Coran avec tafsir (exégèse) de l'Université King Saud.",
    },
  },
  {
    name: "Everyayah.com",
    url: "https://everyayah.com",
    description: {
      nl: "Recitaties per vers (ayah) om te beluisteren.",
      ar: "تلاوات لكل آية للاستماع.",
      en: "Recitations per verse (ayah) to listen to.",
      fr: "Récitations verset par verset à écouter.",
    },
  },
  {
    name: "Tafseer.app",
    url: "https://tafseer.app",
    description: {
      nl: "Koran met meerdere tafsir-werken naast elkaar.",
      ar: "القرآن مع عدة تفاسير جنبًا إلى جنب.",
      en: "Qur'an with multiple tafsir works side by side.",
      fr: "Coran avec plusieurs tafsirs côte à côte.",
    },
  },
];

export const fatwaLinks: LinkItem[] = [
  {
    name: "IslamQA.info",
    url: "https://islamqa.info",
    description: {
      nl: "Vragen en antwoorden over islamitische rulings.",
      ar: "أسئلة وأجوبة حول الأحكام الشرعية.",
      en: "Questions and answers on Islamic rulings.",
      fr: "Questions et réponses sur les règles islamiques.",
    },
  },
  {
    name: "IslamWeb.net",
    url: "https://www.islamweb.net",
    description: {
      nl: "Uitgebreide fatwa-databank en advies.",
      ar: "قاعدة بيانات فتاوى شاملة.",
      en: "Extensive fatwa database and advice.",
      fr: "Base de données étendue de fatwas et conseils.",
    },
  },
  {
    name: "BinBaz.org.sa",
    url: "https://binbaz.org.sa",
    description: {
      nl: "Fatwa's van Shaykh Ibn Baaz (rahimahu Allah).",
      ar: "فتاوى الشيخ ابن باز رحمه الله.",
      en: "Fatwas of Shaykh Ibn Baaz (may Allah have mercy on him).",
      fr: "Fatwas du Cheikh Ibn Baaz (qu'Allah lui fasse miséricorde).",
    },
  },
  {
    name: "Alifta.gov.sa",
    url: "https://www.alifta.gov.sa",
    description: {
      nl: "Permanente commissie voor islamitisch onderzoek en fatwa.",
      ar: "اللجنة الدائمة للبحوث العلمية والإفتاء.",
      en: "Permanent Committee for Islamic Research and Fatwa.",
      fr: "Comité permanent pour la recherche islamique et la fatwa.",
    },
  },
  {
    name: "Al-Yaqeen",
    url: "https://al-yaqeen.com",
    description: {
      nl: "Nederlandstalige islamitische kennis en fatwa's.",
      ar: "معرفة إسلامية وفتاوى باللغة الهولندية.",
      en: "Dutch-language Islamic knowledge and fatwas.",
      fr: "Savoir islamique et fatwas en néerlandais.",
    },
  },
];

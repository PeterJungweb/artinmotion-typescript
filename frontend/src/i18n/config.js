import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import translationDE from "./locals/de.json";
import translationEN from "./locals/en.json";

const resources = {
  de: {
    translation: translationDE, // use the JSON object directly
  },
  en: {
    translation: translationEN,
  },
};

i18n
  // detect user language

  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    fallbackLng: "de",
    load: "languageOnly", // drop region (e.g. de-AT → de)
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;

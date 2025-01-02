import { translation } from "dictionaries/translation";

// const dictionaries = {
//   en: () => import("dictionaries/en.json").then((module) => module.default),
//   es: () => import("dictionaries/es.json").then((module) => module.default),
//   it: () => import("dictionaries/it.json").then((module) => module.default),
//   fr: () => import("dictionaries/fr.json").then((module) => module.default),
//   ru: () => import("dictionaries/ru.json").then((module) => module.default),
//   zh: () => import("dictionaries/zh.json").then((module) => module.default),
// };

// export const getDictionary = async (locale: Locale) => dictionaries[locale]();
export const getDictionary = (locale: any) => translation[locale];

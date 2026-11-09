import i18n from "@/i18n/i18n";
import type { Ititle } from "@/types/types";

const languageKeys: Record<string, keyof Ititle> = { hy: "am", ru: "ru", en: "en" };

export const areaTitle = (title?: Ititle) => {
  if (!title) return "";
  const key = languageKeys[i18n.resolvedLanguage ?? "en"] ?? "en";
  return title[key] || title.en;
};

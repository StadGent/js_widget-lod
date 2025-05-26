import { ui, defaultLang } from "./lod-processing-register-i18n";

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: string) {
    return ui[lang][key] || ui[defaultLang][key] || key;
  };
}

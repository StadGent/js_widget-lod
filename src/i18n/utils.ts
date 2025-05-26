import { ui, defaultLang } from "./lod-processing-register-i18n";

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: string) {
    return ui[lang][key] || ui[defaultLang][key] || key;
  };
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
) {
  let timeout: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

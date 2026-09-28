import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'km';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang: Language) => set({ language: lang }),
      toggleLanguage: () => set({ language: get().language === 'en' ? 'km' : 'en' }),
    }),
    {
      name: 'inventory_language',
    }
  )
);

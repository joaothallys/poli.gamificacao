import languages, { type Language } from "~/utils/languages";

export type LanguageSlice = {
  language: Language;
};

const spanishLanguageIndex = 6;

export const createLanguageSlice = (): LanguageSlice => ({
  language: languages[spanishLanguageIndex],
});
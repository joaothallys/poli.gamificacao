export type LingotSlice = {
  lingots: number;
};

export const createLingotSlice = (): LingotSlice => ({
  lingots: 0,
});
import type { DateString } from "~/utils/dateString"; // Use 'import type' para DateString

type XpByDate = Record<DateString, number>;

export type XpSlice = {
  xpByDate: XpByDate;
};

export const createXpSlice = (): XpSlice => ({
  xpByDate: {},
});
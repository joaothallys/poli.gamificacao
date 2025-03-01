import type { DateString } from "~/utils/dateString";
import type dayjs from "dayjs"; // Use 'import type' para dayjs

type ActiveDays = Set<DateString>;

export type StreakSlice = {
  activeDays: ActiveDays;
  streak: number;
  isActiveDay: (day: dayjs.Dayjs) => boolean;
  addToday: () => void;
};

export const createStreakSlice = (): StreakSlice => ({
  activeDays: new Set(),
  streak: 0,
  isActiveDay: () => false,
  addToday: () => {
    // Ação de adicionar dia removida, pois os valores são estáticos
  },
});
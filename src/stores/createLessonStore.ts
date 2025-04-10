export type LessonSlice = {
  lessonsCompleted: number;
  increaseLessonsCompleted: (by?: number) => void;
  jumpToUnit: (unitNumber: number) => void;
};

export const createLessonSlice: LessonSlice = {
  lessonsCompleted: 0,
  increaseLessonsCompleted: () => {},
  jumpToUnit: () => {},
};
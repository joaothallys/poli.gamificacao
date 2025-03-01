export type GoalXp = 1 | 10 | 20 | 30 | 50;

export type GoalXpSlice = {
  goalXp: GoalXp;
};

export const createGoalXpSlice = (): GoalXpSlice => ({
  goalXp: 10,
});
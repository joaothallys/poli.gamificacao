import dayjs from "dayjs";

export type UserSlice = {
  name: string;
  username: string;
  joinedAt: dayjs.Dayjs;
  loggedIn: boolean;
};

export const createUserSlice = (): UserSlice => ({
  name: "John Doe",
  username: "johndoe",
  joinedAt: dayjs("2022-01-01"),
  loggedIn: true,
});
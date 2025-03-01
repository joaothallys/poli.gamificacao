import { fakeUsers } from "~/utils/fakeUsers";

export const useLeaderboardUsers = () => {
  const userInfo = {
    name: "Current User",
    xp: 1500,
    isCurrentUser: true,
  } as const;
  return [...fakeUsers, userInfo].sort((a, b) => b.xp - a.xp);
};

export const useLeaderboardRank = () => {
  const leaderboardUsers = useLeaderboardUsers();
  const index = leaderboardUsers.findIndex((user) => user.isCurrentUser);
  return index === -1 ? null : index + 1;
};
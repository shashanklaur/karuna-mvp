import { getMe, updateMe, getUser } from "../../lib/mockServer";
import type { User } from "../../lib/types";

export const profileApi = {
  async me(): Promise<User | null> {
    return getMe();
  },
  async update(partial: Partial<User>): Promise<User> {
    return updateMe(partial);
  },
  async getUser(id: string): Promise<User | null> {
    return getUser(id);
  }
};

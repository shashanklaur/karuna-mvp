import { listMyGratitude, createGratitude } from "../../lib/mockServer";
import type { GratitudeNote } from "../../lib/mockServer";
import type { Id } from "../../lib/types";

export const gratitudeApi = {
  async mine(): Promise<GratitudeNote[]> {
    return listMyGratitude();
  },

  async create(connectionId: Id, toUserId: Id, text: string): Promise<GratitudeNote> {
    return createGratitude(connectionId, toUserId, text);
  }
};

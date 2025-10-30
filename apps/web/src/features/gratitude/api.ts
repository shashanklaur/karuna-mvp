import { listMyGratitude, createGratitude, getConnection, getMe } from "../../lib/mockServer";

export const gratitudeApi = {
  list: () => listMyGratitude(),
  create: async (connectionId: string, text: string) => {
    const conn = await getConnection(connectionId);
    const me = await getMe();
    if (!conn || !me) throw new Error("Connection/user not found");
    // send thanks to the OTHER person in the connection
    const toUserId = me._id === conn.starterId ? conn.partnerId : conn.starterId;
    return createGratitude(connectionId, toUserId, text);
  }
};

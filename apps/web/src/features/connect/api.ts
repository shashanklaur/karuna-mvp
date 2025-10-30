import {
  ensureConnection,
  listConnections,
  getConnection,
  updateConnectionStatus,
  listMessages,
  sendMessage
} from "../../lib/mockServer";

export const connectApi = {
  connectToPost: (postId: string, partnerId: string) => ensureConnection(postId, partnerId),
  list: () => listConnections(),
  get: (id: string) => getConnection(id),
  setStatus: (id: string, status: "active" | "completed" | "cancelled") => updateConnectionStatus(id, status),
  messages: {
    list: (cid: string) => listMessages(cid),
    send: (cid: string, body: string) => sendMessage(cid, body)
  }
};

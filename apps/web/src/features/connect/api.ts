import type { Id } from "../../lib/types";
import {
  ensureConnection,
  listConnections,
  getConnection,
  updateConnectionStatus,
  listMessages,
  sendMessage as sendMessageApi,
} from "../../lib/mockServer";
import type { Connection, Message } from "../../lib/mockServer";

export const connectApi = {
  async connectToPost(postId: Id, partnerId: Id): Promise<Connection> {
    return ensureConnection(postId, partnerId);
  },

  async list(): Promise<Connection[]> {
    return listConnections();
  },

  async get(id: Id): Promise<Connection | null> {
    return getConnection(id);
  },

  async setStatus(id: Id, status: Connection["status"]): Promise<Connection> {
    return updateConnectionStatus(id, status);
  },

  // === convenience methods used by Thread screen ===
  async getThread(id: Id): Promise<{ connection: Connection; messages: Message[] } | null> {
    const connection = await getConnection(id);
    if (!connection) return null;
    const messages = await listMessages(id);
    return { connection, messages };
  },

  async sendMessage(id: Id, body: string): Promise<Message> {
    return sendMessageApi(id, body);
  },

  async completeConnection(id: Id): Promise<Connection> {
    return updateConnectionStatus(id, "completed");
  },

  messages: {
    list(connectionId: Id): Promise<Message[]> {
      return listMessages(connectionId);
    },
  },
};

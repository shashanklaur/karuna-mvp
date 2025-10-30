import { listReports, closeReport, createReport } from "../../lib/mockServer";

export const adminApi = {
  list: () => listReports(),
  close: (id: string) => closeReport(id),
  create: (payload: { reporterId: string; targetUserId?: string; targetPostId?: string; reason: string }) =>
    createReport(payload)
};

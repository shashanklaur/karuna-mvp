import { listReports, closeReport } from "../../lib/mockServer";
import type { Report } from "../../lib/types";

export const adminApi = {
  async list(): Promise<Report[]> {
    return listReports();
  },
  async close(id: string): Promise<Report> {
    return closeReport(id);
  }
};

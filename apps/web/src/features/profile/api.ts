import { getMe, updateMe, getUser } from "../../lib/mockServer";
// For now our mockServer only exposes getMe/updateMe/getUser minimal stubs.
// If yours is missing getUser/updateMe, profile page will just show "Please log in".

export const profileApi = {
  me: () => getMe(),
  update: (partial: { name?: string; city?: string; tags?: string[]; avatarUrl?: string }) => updateMe(partial),
  get: (id: string) => getUser(id)
};

import { getMe, loginUser, logoutUser, registerUser } from "../../lib/mockServer";
import type { User } from "../../lib/types";

export const authApi = {
  me: () => getMe() as Promise<User | null>,
  login: (email: string, password: string) => loginUser(email, password) as Promise<User>,
  register: (input: { name: string; email: string; password: string; city?: string }) =>
    registerUser(input) as Promise<User>,
  logout: () => logoutUser() as Promise<void>
};

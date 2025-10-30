import type { ServicePost, Id, User, Report } from "./types";

/**
 * Karuna Mock Server
 * ------------------
 * LocalStorage-based backend simulation for development and demos.
 * Provides:
 *  - Auth & Profile
 *  - Posts CRUD (read/create)
 *  - Connections, Messages, Gratitude
 *  - Reports (admin)
 */

const LS = {
  users: "karuna.users",
  me: "karuna.me",
  auth: "karuna.auth",
  posts: "karuna.posts",
  connections: "karuna.connections",
  messages: "karuna.messages",
  gratitude: "karuna.gratitude",
  reports: "karuna.reports",
};

const now = () => new Date().toISOString();
const rid = () => Math.random().toString(36).slice(2, 10);
const emailKey = (e: string) => e.trim().toLowerCase();
const delay = (ms = 200) => new Promise((res) => setTimeout(res, ms));

function load<T>(key: string, def: T): T {
  const raw = localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : def;
}
function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* =========================================================
   SEED INITIAL DATA (runs once)
   ========================================================= */
(function seed() {
  if (!localStorage.getItem(LS.users)) {
    const users: User[] = [
      { _id: "u1", name: "Aisha", city: "Toronto", tags: ["guitar", "listening"], role: "user" },
      { _id: "u2", name: "Brian", city: "Mississauga", tags: ["coding"], role: "user" },
      { _id: "admin1", name: "Admin", city: "Toronto", tags: ["moderation"], role: "admin" },
      { _id: "me", name: "You", city: "Toronto", tags: ["coding", "guitar"], role: "user" },
    ];
    save(LS.users, users);
  }

  if (!localStorage.getItem(LS.auth)) {
    const users = load<User[]>(LS.users, []);
    const creds: Record<string, { userId: Id; password: string }> = {};
    users.forEach((u) => {
      creds[emailKey(u.name + "@example.com")] = { userId: u._id, password: "password" };
    });
    save(LS.auth, creds);
  }

  if (!localStorage.getItem(LS.posts)) {
    const posts: ServicePost[] = [
      {
        _id: "p1",
        ownerId: "u1",
        type: "offer",
        title: "Guitar basics for beginners",
        description: "Chords & strumming in 3 sessions.",
        tags: ["guitar", "music", "teaching"],
        city: "Toronto",
        createdAt: now(),
        updatedAt: now(),
      },
      {
        _id: "p2",
        ownerId: "u2",
        type: "offer",
        title: "JS Pair Programming",
        description: "Stuck on React? Let’s pair for an hour.",
        tags: ["coding", "mentorship"],
        city: "Mississauga",
        createdAt: now(),
        updatedAt: now(),
      },
    ];
    save(LS.posts, posts);
  }

  if (!localStorage.getItem(LS.connections)) save(LS.connections, []);
  if (!localStorage.getItem(LS.messages)) save(LS.messages, []);
  if (!localStorage.getItem(LS.gratitude)) save(LS.gratitude, []);
  if (!localStorage.getItem(LS.reports)) save(LS.reports, []);
})();

/* =========================================================
   AUTH / PROFILE
   ========================================================= */
export async function getMe(): Promise<User | null> {
  await delay();
  const me = load<User | null>(LS.me, null);
  if (!me) return null;
  const users = load<User[]>(LS.users, []);
  return users.find((u) => u._id === me._id) ?? null;
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  city?: string;
}): Promise<User> {
  await delay();
  const users = load<User[]>(LS.users, []);
  const auth = load<Record<string, { userId: Id; password: string }>>(LS.auth, {});
  const key = emailKey(input.email);
  if (auth[key]) throw new Error("Email already exists");

  const user: User = {
    _id: rid(),
    name: input.name.trim(),
    city: input.city?.trim(),
    tags: [],
    role: "user",
  };
  users.push(user);
  auth[key] = { userId: user._id, password: input.password };
  save(LS.users, users);
  save(LS.auth, auth);
  save(LS.me, user);
  return user;
}

export async function loginUser(email: string, password: string): Promise<User> {
  await delay();
  const users = load<User[]>(LS.users, []);
  const auth = load<Record<string, { userId: Id; password: string }>>(LS.auth, {});
  const key = emailKey(email);
  const entry = auth[key];
  if (!entry || entry.password !== password) throw new Error("Invalid email or password");
  const user = users.find((u) => u._id === entry.userId);
  if (!user) throw new Error("User not found");
  save(LS.me, user);
  return user;
}

export async function logoutUser(): Promise<void> {
  await delay();
  save<User | null>(LS.me, null);
}

export async function updateMe(partial: Partial<User>): Promise<User> {
  await delay();
  const me = load<User | null>(LS.me, null);
  if (!me) throw new Error("Not authenticated");
  const users = load<User[]>(LS.users, []);
  const idx = users.findIndex((u) => u._id === me._id);
  const updated = { ...me, ...partial };
  if (idx >= 0) users[idx] = updated;
  save(LS.users, users);
  save(LS.me, updated);
  return updated;
}

export async function getUser(id: Id): Promise<User | null> {
  await delay();
  const users = load<User[]>(LS.users, []);
  return users.find((u) => u._id === id) ?? null;
}

/* =========================================================
   POSTS
   ========================================================= */
export async function listPosts(params: {
  type?: "offer" | "request";
  city?: string;
  tag?: string;
  q?: string;
}): Promise<ServicePost[]> {
  await delay();
  const posts = load<ServicePost[]>(LS.posts, []);
  return posts
    .filter((p) => {
      const matchesType = params.type ? p.type === params.type : true;
      const matchesCity = params.city ? p.city === params.city : true;
      const matchesTag = params.tag ? p.tags.includes(params.tag) : true;
      const matchesQuery = params.q
        ? (p.title + p.description).toLowerCase().includes(params.q.toLowerCase())
        : true;
      return matchesType && matchesCity && matchesTag && matchesQuery;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getPost(id: Id): Promise<ServicePost | null> {
  await delay();
  const posts = load<ServicePost[]>(LS.posts, []);
  return posts.find((p) => p._id === id) ?? null;
}

export async function createPost(input: {
  type: "offer" | "request";
  title: string;
  description: string;
  tags: string[];
  city: string;
}): Promise<ServicePost> {
  await delay();
  const posts = load<ServicePost[]>(LS.posts, []);
  const me = load<User | null>(LS.me, null);
  const post: ServicePost = {
    _id: rid(),
    ownerId: me?._id ?? "me",
    type: input.type,
    title: input.title.trim(),
    description: input.description.trim(),
    tags: input.tags,
    city: input.city,
    createdAt: now(),
    updatedAt: now(),
  };
  posts.unshift(post);
  save(LS.posts, posts);
  return post;
}

/* =========================================================
   CONNECTIONS / MESSAGES / GRATITUDE
   ========================================================= */
type ConnectionStatus = "active" | "completed" | "cancelled";
export interface Connection {
  _id: Id;
  postId: Id;
  starterId: Id;
  partnerId: Id;
  status: ConnectionStatus;
  createdAt: string;
  updatedAt: string;
}
export interface Message {
  _id: Id;
  connectionId: Id;
  senderId: Id;
  body: string;
  createdAt: string;
}
export interface GratitudeNote {
  _id: Id;
  connectionId: Id;
  fromUserId: Id;
  toUserId: Id;
  text: string;
  createdAt: string;
}

export async function ensureConnection(postId: Id, partnerId: Id): Promise<Connection> {
  await delay();
  const me = await getMe();
  if (!me) throw new Error("Not authenticated");
  const cons = load<Connection[]>(LS.connections, []);
  const existing = cons.find(
    (c) =>
      c.postId === postId &&
      ((c.starterId === me._id && c.partnerId === partnerId) ||
        (c.starterId === partnerId && c.partnerId === me._id))
  );
  if (existing) {
    existing.updatedAt = now();
    save(LS.connections, cons);
    return existing;
  }
  const created: Connection = {
    _id: rid(),
    postId,
    starterId: me._id,
    partnerId,
    status: "active",
    createdAt: now(),
    updatedAt: now(),
  };
  cons.unshift(created);
  save(LS.connections, cons);
  return created;
}

export async function listConnections(): Promise<Connection[]> {
  await delay();
  const me = await getMe();
  if (!me) return [];
  const cons = load<Connection[]>(LS.connections, []);
  return cons.filter((c) => c.starterId === me._id || c.partnerId === me._id);
}

export async function getConnection(id: Id): Promise<Connection | null> {
  await delay();
  const cons = load<Connection[]>(LS.connections, []);
  return cons.find((c) => c._id === id) ?? null;
}

export async function updateConnectionStatus(id: Id, status: ConnectionStatus): Promise<Connection> {
  await delay();
  const cons = load<Connection[]>(LS.connections, []);
  const i = cons.findIndex((c) => c._id === id);
  if (i < 0) throw new Error("Connection not found");
  cons[i] = { ...cons[i], status, updatedAt: now() };
  save(LS.connections, cons);
  return cons[i];
}

export async function listMessages(connectionId: Id): Promise<Message[]> {
  await delay();
  const msgs = load<Message[]>(LS.messages, []);
  return msgs
    .filter((m) => m.connectionId === connectionId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function sendMessage(connectionId: Id, body: string): Promise<Message> {
  await delay();
  const me = await getMe();
  if (!me) throw new Error("Not authenticated");
  const msg: Message = {
    _id: rid(),
    connectionId,
    senderId: me._id,
    body,
    createdAt: now(),
  };
  const msgs = load<Message[]>(LS.messages, []);
  msgs.push(msg);
  save(LS.messages, msgs);
  return msg;
}

export async function createGratitude(connectionId: Id, toUserId: Id, text: string): Promise<GratitudeNote> {
  await delay();
  const me = await getMe();
  if (!me) throw new Error("Not authenticated");
  const note: GratitudeNote = {
    _id: rid(),
    connectionId,
    fromUserId: me._id,
    toUserId,
    text,
    createdAt: now(),
  };
  const list = load<GratitudeNote[]>(LS.gratitude, []);
  list.unshift(note);
  save(LS.gratitude, list);
  return note;
}

export async function listMyGratitude(): Promise<GratitudeNote[]> {
  await delay();
  const me = await getMe();
  if (!me) return [];
  const list = load<GratitudeNote[]>(LS.gratitude, []);
  return list.filter((n) => n.fromUserId === me._id || n.toUserId === me._id);
}

/* =========================================================
   ADMIN REPORTS
   ========================================================= */
export async function listReports(): Promise<Report[]> {
  await delay();
  return load<Report[]>(LS.reports, []);
}

export async function createReport(payload: {
  reporterId: Id;
  targetUserId?: Id;
  targetPostId?: Id;
  reason: string;
}): Promise<Report> {
  await delay();
  const report: Report = {
    _id: rid(),
    reporterId: payload.reporterId,
    targetUserId: payload.targetUserId,
    targetPostId: payload.targetPostId,
    reason: payload.reason,
    status: "open",
    createdAt: now(),
    updatedAt: now(),
  };
  const list = load<Report[]>(LS.reports, []);
  list.unshift(report);
  save(LS.reports, list);
  return report;
}

export async function closeReport(id: Id): Promise<Report> {
  await delay();
  const list = load<Report[]>(LS.reports, []);
  const i = list.findIndex((x) => x._id === id);
  if (i < 0) throw new Error("Report not found");
  list[i] = { ...list[i], status: "closed", updatedAt: now() };
  save(LS.reports, list);
  return list[i];
}

import type { ServicePost, Id, User, Report } from "./types";

/** Simple localStorage-backed mock server */

const LS = {
  users: "karuna.users",
  me: "karuna.me",
  posts: "karuna.posts",
  connections: "karuna.connections",
  messages: "karuna.messages",
  gratitude: "karuna.gratitude",
  reports: "karuna.reports"
};

const now = () => new Date().toISOString();
const rid = () => Math.random().toString(36).slice(2, 10);

function load<T>(k: string, def: T): T {
  const v = localStorage.getItem(k);
  return v ? (JSON.parse(v) as T) : def;
}
function save<T>(k: string, v: T) {
  localStorage.setItem(k, JSON.stringify(v));
}

/** Seed sample data on first run */
(function seed() {
  if (!localStorage.getItem(LS.users)) {
    const users: User[] = [
      { _id: "u1", name: "Aisha", city: "Toronto", tags: ["guitar", "listening"] },
      { _id: "u2", name: "Brian", city: "Mississauga", tags: ["coding"] },
      { _id: "me", name: "You", city: "Toronto", tags: ["coding", "guitar"] }
    ];
    save(LS.users, users);
  }
  if (!localStorage.getItem(LS.me)) {
    const me = { _id: "me", name: "You", city: "Toronto", tags: ["coding", "guitar"] };
    save(LS.me, me);
  }
  if (!localStorage.getItem(LS.posts)) {
    const posts: ServicePost[] = [
      {
        _id: "p1",
        ownerId: "u1",
        type: "offer",
        title: "Guitar basics for beginners",
        description: "Chords & strumming in 3 sessions.",
        tags: ["guitar"],
        city: "Toronto",
        createdAt: now(),
        updatedAt: now()
      },
      {
        _id: "p2",
        ownerId: "u2",
        type: "offer",
        title: "JS Pair Programming",
        description: "Stuck on React? Let’s pair for an hour.",
        tags: ["coding"],
        city: "Mississauga",
        createdAt: now(),
        updatedAt: now()
      },
      {
        _id: "p3",
        ownerId: "u1",
        type: "request",
        title: "Resume wording help",
        description: "Need candid feedback on resume.",
        tags: ["resume"],
        city: "Toronto",
        createdAt: now(),
        updatedAt: now()
      }
    ];
    save(LS.posts, posts);
  }
  if (!localStorage.getItem(LS.connections)) save(LS.connections, []);
  if (!localStorage.getItem(LS.messages)) save(LS.messages, []);
  if (!localStorage.getItem(LS.gratitude)) save(LS.gratitude, []);
  if (!localStorage.getItem(LS.reports)) save(LS.reports, []);
})();

/** AUTH / PROFILE */
export async function getMe(): Promise<User | null> {
  return load<User | null>(LS.me, null);
}

export async function updateMe(partial: Partial<Pick<User, "name" | "city" | "tags" | "avatarUrl">>): Promise<User> {
  const me = load<User | null>(LS.me, null);
  if (!me) throw new Error("Not authenticated");
  const users = load<User[]>(LS.users, []);
  const idx = users.findIndex((u) => u._id === me._id);
  const updated: User = { ...me, ...partial };
  if (idx >= 0) users[idx] = updated;
  save(LS.users, users);
  save(LS.me, updated);
  return updated;
}

export async function getUser(id: Id): Promise<User | null> {
  const users = load<User[]>(LS.users, []);
  return users.find((u) => u._id === id) ?? null;
}

/** POSTS */
export async function listPosts(params: {
  type?: "offer" | "request";
  city?: string;
  tag?: string;
  q?: string;
}): Promise<ServicePost[]> {
  const posts = load<ServicePost[]>(LS.posts, []);
  return posts
    .filter((p) => {
      const a = params.type ? p.type === params.type : true;
      const b = params.city ? p.city === params.city : true;
      const c = params.tag ? p.tags.includes(params.tag) : true;
      const d = params.q
        ? (p.title + p.description).toLowerCase().includes(params.q.toLowerCase())
        : true;
      return a && b && c && d;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getPost(id: Id): Promise<ServicePost | null> {
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
  const posts = load<ServicePost[]>(LS.posts, []);
  const post: ServicePost = {
    _id: rid(),
    ownerId: "me", // mock current user
    type: input.type,
    title: input.title.trim(),
    description: input.description.trim(),
    tags: input.tags,
    city: input.city,
    createdAt: now(),
    updatedAt: now()
  };
  posts.unshift(post);
  save(LS.posts, posts);
  return post;
}

/** CONNECTIONS + MESSAGES (internal simple types) */
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
  const me = await getMe();
  if (!me) throw new Error("Not authenticated");
  const cons = load<Connection[]>(LS.connections, []);
  // Reuse if either-direction connection exists for this post
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
    updatedAt: now()
  };
  cons.unshift(created);
  save(LS.connections, cons);
  return created;
}

export async function listConnections(): Promise<Connection[]> {
  const me = await getMe();
  if (!me) return [];
  const cons = load<Connection[]>(LS.connections, []);
  return cons.filter((c) => c.starterId === me._id || c.partnerId === me._id);
}

export async function getConnection(id: Id): Promise<Connection | null> {
  const cons = load<Connection[]>(LS.connections, []);
  return cons.find((c) => c._id === id) ?? null;
}

export async function updateConnectionStatus(id: Id, status: ConnectionStatus): Promise<Connection> {
  const cons = load<Connection[]>(LS.connections, []);
  const i = cons.findIndex((c) => c._id === id);
  if (i < 0) throw new Error("Connection not found");
  cons[i] = { ...cons[i], status, updatedAt: now() };
  save(LS.connections, cons);
  return cons[i];
}

export async function listMessages(connectionId: Id): Promise<Message[]> {
  const msgs = load<Message[]>(LS.messages, []);
  return msgs
    .filter((m) => m.connectionId === connectionId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function sendMessage(connectionId: Id, body: string): Promise<Message> {
  const me = await getMe();
  if (!me) throw new Error("Not authenticated");
  const msg: Message = {
    _id: rid(),
    connectionId,
    senderId: me._id,
    body,
    createdAt: now()
  };
  const msgs = load<Message[]>(LS.messages, []);
  msgs.push(msg);
  save(LS.messages, msgs);
  return msg;
}

/** GRATITUDE */
export async function createGratitude(connectionId: Id, toUserId: Id, text: string): Promise<GratitudeNote> {
  const me = await getMe();
  if (!me) throw new Error("Not authenticated");
  const note: GratitudeNote = {
    _id: rid(),
    connectionId,
    fromUserId: me._id,
    toUserId,
    text,
    createdAt: now()
  };
  const list = load<GratitudeNote[]>(LS.gratitude, []);
  list.unshift(note);
  save(LS.gratitude, list);
  return note;
}

export async function listMyGratitude(): Promise<GratitudeNote[]> {
  const me = await getMe();
  if (!me) return [];
  const list = load<GratitudeNote[]>(LS.gratitude, []);
  return list.filter((n) => n.fromUserId === me._id || n.toUserId === me._id);
}

/** ADMIN: Reports */
export async function listReports(): Promise<Report[]> {
  return load<Report[]>(LS.reports, []);
}

export async function createReport(payload: {
  reporterId: Id;
  targetUserId?: Id;
  targetPostId?: Id;
  reason: string;
}): Promise<Report> {
  const r: Report = {
    _id: rid(),
    reporterId: payload.reporterId,
    targetUserId: payload.targetUserId,
    targetPostId: payload.targetPostId,
    reason: payload.reason,
    status: "open",
    createdAt: now(),
    updatedAt: now()
  };
  const list = load<Report[]>(LS.reports, []);
  list.unshift(r);
  save(LS.reports, list);
  return r;
}

export async function closeReport(id: Id): Promise<Report> {
  const list = load<Report[]>(LS.reports, []);
  const i = list.findIndex((x) => x._id === id);
  if (i < 0) throw new Error("Report not found");
  list[i] = { ...list[i], status: "closed", updatedAt: now() };
  save(LS.reports, list);
  return list[i];
}

import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const COOKIE_NAME = "unisize_session";
const SESSION_DAYS = 7;

export function verifyPassword(password: string, stored: string | null) {
  if (!stored) return false;
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await prisma.session.create({ data: { userId, tokenHash: tokenHash(token), expiresAt } });
  const store = await cookies();
  store.set(COOKIE_NAME, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", expires: expiresAt });
}

export async function getCurrentUser() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({ where: { tokenHash: tokenHash(token) }, include: { user: true } });
  if (!session || session.expiresAt <= new Date()) return null;
  return session.user;
}

export async function deleteSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (token) await prisma.session.deleteMany({ where: { tokenHash: tokenHash(token) } });
  store.delete(COOKIE_NAME);
}

export async function requireStaff() {
  const user = await getCurrentUser();
  return user && (user.role === "ADMIN" || user.role === "STAFF") ? user : null;
}

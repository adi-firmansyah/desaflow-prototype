import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";

export async function getSession(requestHeaders?: Headers) {
  return auth.api.getSession({
    headers: requestHeaders ?? (await headers()),
  });
}

export async function requireSession(requestHeaders?: Headers) {
  const session = await getSession(requestHeaders);

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  if (!token) throw new Error("NOT_AUTHENTICATED");
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function apiGet<T>(path: string, authenticated = false): Promise<T> {
  const headers: Record<string, string> = authenticated ? authHeaders() : {};
  const res = await fetch(`${API_BASE}${path}`, { headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `GET ${path} failed`);
  return data as T;
}

export async function apiPost<T>(
  path: string,
  body: unknown,
  authenticated = true
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(authenticated ? authHeaders() : {}),
  };
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `POST ${path} failed`);
  return data as T;
}

export async function apiPatch<T>(
  path: string,
  body: unknown,
  authenticated = true
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(authenticated ? authHeaders() : {}),
  };
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `PATCH ${path} failed`);
  return data as T;
}

export async function apiDelete(
  path: string,
  authenticated = true
): Promise<void> {
  const headers: Record<string, string> = authenticated ? authHeaders() : {};
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `DELETE ${path} failed`);
  }
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function getDiscountedPrice(price: number, discountPercentage: number): string {
  return (price * (1 - discountPercentage / 100)).toFixed(0);
}

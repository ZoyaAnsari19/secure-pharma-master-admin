/**
 * Central API client for super-admin.
 * Replace with your backend base URL and auth.
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function apiClient<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json() as Promise<T>;
}

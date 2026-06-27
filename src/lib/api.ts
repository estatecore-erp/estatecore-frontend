const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  token?: string;
};

export const api = async <T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> => {
  const { method = "GET", body, token } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw data;
  }

  return data;
};

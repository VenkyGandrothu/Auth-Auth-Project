const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      (data && (data.message || data.detail || data.title)) ||
      (typeof data === "string" && data) ||
      (response.status === 403
        ? "Forbidden — check API path or auth config"
        : `Request failed (${response.status})`);
    throw new Error(message);
  }

  return data;
}

export function signup(payload) {
  return request("/api/v1/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload) {
  return request("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getHome(token) {
  return request("/api/v1/user/home", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

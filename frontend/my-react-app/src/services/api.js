const configuredApiUrl =
  import.meta.env.VITE_API_URL?.trim() ||
  "https://backend-splitfy-second.onrender.com";
const normalizedApiUrl = configuredApiUrl.replace(/\/+$/, "");
const API_BASE_URL = /\/api$/i.test(normalizedApiUrl)
  ? normalizedApiUrl
  : `${normalizedApiUrl}/api`;

export class ApiError extends Error {
  constructor(message, status, cause) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    if (cause !== undefined) this.cause = cause;
  }
}

export const getToken = () => localStorage.getItem("splitfy.token");

export const setToken = (token) => localStorage.setItem("splitfy.token", token);

export const clearToken = () => localStorage.removeItem("splitfy.token");

export async function apiRequest(path, { method = "GET", body } = {}) {
  const token = getToken();
  const headers = {};

  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    throw new ApiError(
      "Unable to connect to Splitfy. The service may be starting up; wait a moment and try again.",
      null,
      error
    );
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new ApiError("The server returned an invalid response.", response.status);
  }

  if (!response.ok) {
    throw new ApiError(
      payload.message || `Request failed with status ${response.status}.`,
      response.status
    );
  }

  return payload;
}

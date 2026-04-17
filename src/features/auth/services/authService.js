// src/features/auth/services/authService.js
// All auth-related API calls live here.
// Pages import from here — never call fetch directly in a page.

const BASE_URL = "http://localhost/wanderNepal/api";



function saveSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUser() {
  return JSON.parse(localStorage.getItem("user") || "null");
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function isLoggedIn() {
  return !!getToken();
}



export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Invalid email or password");
  }

  saveSession(data.token, data.user);
  return data.user; // { id, name, email, role }
}

export async function register(name, email, password) {
  const res = await fetch(`${BASE_URL}/auth/register.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Registration failed. Try again.");
  }

  saveSession(data.token, data.user);
  return data.user;
}

export function logout() {
  clearSession();
}

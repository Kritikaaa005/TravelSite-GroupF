/**
 * authService.js
 * All auth-related API calls live here — login, register, logout.
 * Components should import from this file, never fetch directly.
 *
 * What gets stored in localStorage:
 *  - "token"  -> JWT string from the PHP backend
 *  - "user"   -> JSON object { id, name, email, role }
 */

const BASE_URL = "http://localhost/wanderNepal/api";

// saves both token and user info after a successful login/register
function saveSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

// grab the JWT — returns null if not logged in
export function getToken() {
  return localStorage.getItem("token");
}

// grab the user object — returns null if nothing's stored
export function getUser() {
  return JSON.parse(localStorage.getItem("user") || "null");
}

// wipes both token and user from localStorage — called on logout
export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// quick check: are they logged in? just looks for a token
export function isLoggedIn() {
  return !!getToken();
}

/**
 * POST /auth/login.php with email + password.
 * Saves session on success, throws on failure.
 * @throws {Error} bad creds or server unreachable
 * @returns {Object} { id, name, email, role }
 */
export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  // throw so the calling component can show the error
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Invalid email or password");
  }

  saveSession(data.token, data.user);
  return data.user;
}

/**
 * POST /auth/register.php with name, email, password.
 * Saves session on success so user is logged in right away.
 * @throws {Error} duplicate email, validation fail, server error etc.
 * @returns {Object} { id, name, email, role }
 */
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

  // auto-login after register — no need to redirect to login page
  saveSession(data.token, data.user);
  return data.user;
}

// just an alias for clearSession — used by logout buttons in components
export function logout() {
  clearSession();
}
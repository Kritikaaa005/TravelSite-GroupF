/**
 * packageService.js
 * All API calls related to tour packages.
 * Same structure as destinationService.js — connects to
 * the PHP REST API on XAMPP (localhost/wanderNepal/api).
 *
 * Public functions (no auth needed): getPackages, getPackageById
 * Admin functions (JWT required):    createPackage, updatePackage, deletePackage
 */

const BASE_URL = "http://localhost/wanderNepal/api";

// builds auth header for admin requests — same pattern as destinationService
// skips Authorization entirely if no token found in localStorage
function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Traveler (read-only) 

// GET /packages/index.php — fetches all packages
// throws if backend returns success: false
export async function getPackages() {
  const res = await fetch(`${BASE_URL}/packages/index.php`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

// GET /packages/single.php?id=:id — fetches one package by ID
export async function getPackageById(id) {
  const res = await fetch(`${BASE_URL}/packages/single.php?id=${id}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

//  Admin (CRUD) 

// POST /packages/index.php — creates a new package
// payload: { destination_id, title, duration, max_people, price, difficulty, image_url, description }
export async function createPackage(payload) {
  const res = await fetch(`${BASE_URL}/packages/index.php`, {
    method: "POST",
    headers: authHeaders(), // JWT required
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

// PUT /packages/single.php?id=:id — updates an existing package
export async function updatePackage(id, payload) {
  const res = await fetch(`${BASE_URL}/packages/single.php?id=${id}`, {
    method: "PUT",
    headers: authHeaders(), // JWT required
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}

// DELETE /packages/single.php?id=:id — deletes a package by ID
export async function deletePackage(id) {
  const res = await fetch(`${BASE_URL}/packages/single.php?id=${id}`, {
    method: "DELETE",
    headers: authHeaders(), // JWT required
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}
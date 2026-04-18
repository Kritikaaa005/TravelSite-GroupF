/**
 * destinationService.js
 * All API calls related to destinations.
 * Connects to the PHP REST API on XAMPP (localhost/wanderNepal/api).
 *
 * Public functions (no auth needed): getDestinations, getDestinationById
 * Admin functions (JWT required):    createDestination, updateDestination, deleteDestination
 */

const BASE_URL = "http://localhost/wanderNepal/api";

// builds the auth header for admin requests — grabs JWT from localStorage
// if no token found, just skips the Authorization header entirely
function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Traveler (read-only)

// GET /destinations/index.php — fetches all destinations
// throws if the backend returns success: false
export async function getDestinations() {
  const res = await fetch(`${BASE_URL}/destinations/index.php`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

// GET /destinations/single.php?id=:id — fetches one destination by ID
export async function getDestinationById(id) {
  const res = await fetch(`${BASE_URL}/destinations/single.php?id=${id}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

//  Admin (CRUD) 

// POST /destinations/index.php — creates a new destination
// payload: { name, region, category, description, image_url, map_lat, map_lng }
export async function createDestination(payload) {
  const res = await fetch(`${BASE_URL}/destinations/index.php`, {
    method: "POST",
    headers: authHeaders(), // JWT required
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

// PUT /destinations/single.php?id=:id — updates an existing destination
export async function updateDestination(id, payload) {
  const res = await fetch(`${BASE_URL}/destinations/single.php?id=${id}`, {
    method: "PUT",
    headers: authHeaders(), // JWT required
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}

// DELETE /destinations/single.php?id=:id — deletes a destination by ID
export async function deleteDestination(id) {
  const res = await fetch(`${BASE_URL}/destinations/single.php?id=${id}`, {
    method: "DELETE",
    headers: authHeaders(), // JWT required
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}
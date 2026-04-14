// src/features/traveler/services/destinationService.js

const BASE_URL = 'http://localhost/wanderNepal/api';

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ── User (read-only) ─────────────────────────────────────────

export async function getDestinations() {
  const res = await fetch(`${BASE_URL}/destinations/index.php`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function getDestinationById(id) {
  const res = await fetch(`${BASE_URL}/destinations/single.php?id=${id}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

// ── Admin (CRUD) ──────────────────────────────────────────────

export async function createDestination(payload) {
  const res = await fetch(`${BASE_URL}/destinations/index.php`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function updateDestination(id, payload) {
  const res = await fetch(`${BASE_URL}/destinations/single.php?id=${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}

export async function deleteDestination(id) {
  const res = await fetch(`${BASE_URL}/destinations/single.php?id=${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data;
}

<?php
// wanderNepal/api/packages/single.php
// GET    — fetch one package by ?id= (public)
// PUT    — update a package (admin only)
// DELETE — delete a package (admin only)

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int) $_GET['id'] : 0;

if (!$id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Package ID required']);
    exit();
}

// ── GET: fetch single package ─────────────────────────────────
if ($method === 'GET') {
    $db   = getDB();
    $stmt = $db->prepare(
        'SELECT id, destination_id, title, duration, max_people, price,
                difficulty, image_url, description, inclusions, itinerary
         FROM packages WHERE id = ?'
    );
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    $db->close();

    if (!$row) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Package not found']);
        exit();
    }

    echo json_encode([
        'success' => true,
        'data'    => [
            'id'            => (int) $row['id'],
            'destinationId' => (int) $row['destination_id'],
            'title'         => $row['title'],
            'duration'      => (int) $row['duration'],
            'maxPeople'     => (int) $row['max_people'],
            'price'         => (float) $row['price'],
            'difficulty'    => $row['difficulty'],
            'image'         => $row['image_url'],
            'description'   => $row['description'],
            'inclusions'    => json_decode($row['inclusions'] ?? '[]'),
            'itinerary'     => json_decode($row['itinerary']  ?? '[]'),
        ],
    ]);
    exit();
}

// ── PUT: update a package (admin only) ───────────────────────
if ($method === 'PUT') {
    requireAdmin();

    $data = json_decode(file_get_contents('php://input'), true);

    $destination_id = isset($data['destination_id']) ? (int)   $data['destination_id'] : 0;
    $title          = trim($data['title']            ?? '');
    $duration       = isset($data['duration'])        ? (int)   $data['duration']       : 0;
    $max_people     = isset($data['max_people'])      ? (int)   $data['max_people']     : 10;
    $price          = isset($data['price'])           ? (float) $data['price']          : 0;
    $difficulty     = trim($data['difficulty']        ?? '');
    $image_url      = trim($data['image_url']         ?? '');
    $description    = trim($data['description']       ?? '');
    $inclusions     = json_encode($data['inclusions'] ?? []);
    $itinerary      = json_encode($data['itinerary']  ?? []);

    if (!$destination_id || !$title || !$duration || !$price || !$difficulty || !$image_url || !$description) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        exit();
    }

    $allowed = ['Easy', 'Moderate', 'Challenging', 'Hard'];
    if (!in_array($difficulty, $allowed)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid difficulty value']);
        exit();
    }

    $db   = getDB();
    $stmt = $db->prepare(
        'UPDATE packages
         SET destination_id=?, title=?, duration=?, max_people=?, price=?,
             difficulty=?, image_url=?, description=?, inclusions=?, itinerary=?
         WHERE id=?'
    );
    // i s i i d s s s s s i = 11 chars for 11 params
    $stmt->bind_param('isiidsssssi', $destination_id, $title, $duration, $max_people, $price, $difficulty, $image_url, $description, $inclusions, $itinerary, $id);

    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to update package']);
        $stmt->close(); $db->close();
        exit();
    }
    $stmt->close();
    $db->close();

    echo json_encode(['success' => true, 'message' => 'Package updated']);
    exit();
}

// ── DELETE: remove a package (admin only) ────────────────────
if ($method === 'DELETE') {
    requireAdmin();

    $db   = getDB();
    $stmt = $db->prepare('DELETE FROM packages WHERE id = ?');
    $stmt->bind_param('i', $id);

    if (!$stmt->execute() || $stmt->affected_rows === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Package not found']);
        $stmt->close(); $db->close();
        exit();
    }
    $stmt->close();
    $db->close();

    echo json_encode(['success' => true, 'message' => 'Package deleted']);
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);

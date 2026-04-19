<?php


require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int) $_GET['id'] : 0;

if (!$id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Destination ID required']);
    exit();
}

if ($method === 'GET') {
    $db   = getDB();
    $stmt = $db->prepare('SELECT id, name, region, category, description, image_url, map_lat, map_lng, avg_rating FROM destinations WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    $db->close();

    if (!$row) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Destination not found']);
        exit();
    }

    echo json_encode([
        'success' => true,
        'data'    => [
            'id'          => (int) $row['id'],
            'name'        => $row['name'],
            'region'      => $row['region'],
            'category'    => $row['category'],
            'description' => $row['description'],
            'image'       => $row['image_url'],
            'mapLat'      => $row['map_lat'] ? (float) $row['map_lat'] : null,
            'mapLng'      => $row['map_lng'] ? (float) $row['map_lng'] : null,
            'avgRating'   => (float) $row['avg_rating'],
        ],
    ]);
    exit();
}

if ($method === 'PUT') {
    requireAdmin();

    $data        = json_decode(file_get_contents('php://input'), true);
    $name        = trim($data['name'] ?? '');
    $region      = trim($data['region'] ?? '');
    $category    = trim($data['category'] ?? '');
    $description = trim($data['description'] ?? '');
    $image_url   = trim($data['image_url'] ?? '');
    $map_lat     = isset($data['map_lat']) && $data['map_lat'] !== '' ? (float) $data['map_lat'] : null;
    $map_lng     = isset($data['map_lng']) && $data['map_lng'] !== '' ? (float) $data['map_lng'] : null;

    if (!$name || !$region || !$category || !$description || !$image_url) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        exit();
    }

    $db   = getDB();
    $stmt = $db->prepare('UPDATE destinations SET name=?, region=?, category=?, description=?, image_url=?, map_lat=?, map_lng=? WHERE id=?');
$stmt->bind_param('sssssddi', $name, $region, $category, $description, $image_url, $map_lat, $map_lng, $id);

    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to update destination']);
        $stmt->close(); $db->close();
        exit();
    }
    $stmt->close();
    $db->close();

    echo json_encode(['success' => true, 'message' => 'Destination updated']);
    exit();
}

if ($method === 'DELETE') {
    requireAdmin();

    $db   = getDB();
    $stmt = $db->prepare('DELETE FROM destinations WHERE id = ?');
    $stmt->bind_param('i', $id);

    if (!$stmt->execute() || $stmt->affected_rows === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Destination not found']);
        $stmt->close(); $db->close();
        exit();
    }
    $stmt->close();
    $db->close();

    echo json_encode(['success' => true, 'message' => 'Destination deleted']);
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
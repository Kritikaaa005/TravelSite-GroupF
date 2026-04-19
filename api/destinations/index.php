<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];

/*
|--------------------------------------------------------------------------
| GET - Fetch All Destinations
|--------------------------------------------------------------------------
*/
if ($method === 'GET') {

    $db = getDB();

    $sql = "SELECT id, name, region, category, description, image_url, lat, lng, avg_rating 
            FROM destinations 
            ORDER BY name";

    $result = $db->query($sql);

    if (!$result) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'SQL Error: ' . $db->error
        ]);
        $db->close();
        exit();
    }

    $destinations = [];

    while ($row = $result->fetch_assoc()) {
        $destinations[] = [
            'id'          => (int)$row['id'],
            'name'        => $row['name'],
            'region'      => $row['region'],
            'category'    => $row['category'],
            'description' => $row['description'],
            'image'       => $row['image_url'],
            'mapLat'      => $row['lat'] !== null ? (float)$row['lat'] : null,
            'mapLng'      => $row['lng'] !== null ? (float)$row['lng'] : null,
            'avgRating'   => (float)$row['avg_rating']
        ];
    }

    $result->free();
    $db->close();

    echo json_encode([
        'success' => true,
        'data'    => $destinations
    ]);

    exit();
}

/*
|--------------------------------------------------------------------------
| POST - Create Destination (Admin Only)
|--------------------------------------------------------------------------
*/
if ($method === 'POST') {

    requireAdmin();

    $data = json_decode(file_get_contents('php://input'), true);

    $name        = trim($data['name'] ?? '');
    $region      = trim($data['region'] ?? '');
    $category    = trim($data['category'] ?? '');
    $description = trim($data['description'] ?? '');
    $image_url   = trim($data['image_url'] ?? '');

    $lat = isset($data['map_lat']) && $data['map_lat'] !== ''
        ? (float)$data['map_lat']
        : null;

    $lng = isset($data['map_lng']) && $data['map_lng'] !== ''
        ? (float)$data['map_lng']
        : null;

    if (!$name || !$region || !$category || !$description || !$image_url) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'All fields are required'
        ]);
        exit();
    }

    $allowed = ['Trekking', 'Cultural', 'Wildlife', 'Scenic'];

    if (!in_array($category, $allowed)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid category'
        ]);
        exit();
    }

    $db = getDB();

    $stmt = $db->prepare("
        INSERT INTO destinations 
        (name, region, category, description, image_url, lat, lng)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");

    if (!$stmt) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Prepare failed: ' . $db->error
        ]);
        $db->close();
        exit();
    }

    $stmt->bind_param(
        'sssssdd',
        $name,
        $region,
        $category,
        $description,
        $image_url,
        $lat,
        $lng
    );

    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to create destination'
        ]);
        $stmt->close();
        $db->close();
        exit();
    }

    $newId = $db->insert_id;

    $stmt->close();
    $db->close();

    http_response_code(201);

    echo json_encode([
        'success' => true,
        'message' => 'Destination created successfully',
        'data' => [
            'id'        => $newId,
            'name'      => $name,
            'region'    => $region,
            'category'  => $category,
            'image'     => $image_url,
            'mapLat'    => $lat,
            'mapLng'    => $lng,
            'avgRating' => 0
        ]
    ]);

    exit();
}

/*
|--------------------------------------------------------------------------
| Invalid Method
|--------------------------------------------------------------------------
*/
http_response_code(405);

echo json_encode([
    'success' => false,
    'message' => 'Method not allowed'
]);
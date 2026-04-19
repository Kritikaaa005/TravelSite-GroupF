<?php
// wanderNepal/api/packages/index.php

require_once __DIR__ . "/../config/cors.php";
require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../middleware/auth.php";

$method = $_SERVER["REQUEST_METHOD"];

/* =====================================================
   GET - List all packages
===================================================== */
if ($method === "GET") {

    $db = getDB();

    $sql = "
        SELECT 
            id,
            destination_id,
            title,
            duration,
            max_people,
            price,
            difficulty,
            image_url,
            description,
            inclusions,
            itinerary
        FROM packages
        ORDER BY id DESC
    ";

    $result = $db->query($sql);

    /* Prevent fetch_assoc() on bool */
    if (!$result) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "SQL Error: " . $db->error
        ]);
        $db->close();
        exit();
    }

    $packages = [];

    while ($row = $result->fetch_assoc()) {
        $packages[] = [
            "id"            => (int)$row["id"],
            "destinationId" => (int)$row["destination_id"],
            "title"         => $row["title"],
            "duration"      => (int)$row["duration"],
            "maxPeople"     => (int)$row["max_people"],
            "price"         => (float)$row["price"],
            "difficulty"    => $row["difficulty"],
            "image"         => $row["image_url"],
            "description"   => $row["description"],
            "inclusions"    => json_decode($row["inclusions"] ?: "[]", true),
            "itinerary"     => json_decode($row["itinerary"] ?: "[]", true),
        ];
    }

    $result->free();
    $db->close();

    echo json_encode([
        "success" => true,
        "data"    => $packages
    ]);
    exit();
}

/* =====================================================
   POST - Create package (admin only)
===================================================== */
if ($method === "POST") {

    requireAdmin();

    $data = json_decode(file_get_contents("php://input"), true);

    $destination_id = (int)($data["destination_id"] ?? 0);
    $title          = trim($data["title"] ?? "");
    $duration       = (int)($data["duration"] ?? 0);
    $max_people     = (int)($data["max_people"] ?? 10);
    $price          = (float)($data["price"] ?? 0);
    $difficulty     = trim($data["difficulty"] ?? "");
    $image_url      = trim($data["image_url"] ?? "");
    $description    = trim($data["description"] ?? "");

    $inclusions = json_encode($data["inclusions"] ?? []);
    $itinerary  = json_encode($data["itinerary"] ?? []);

    if (
        !$destination_id ||
        !$title ||
        !$duration ||
        !$price ||
        !$difficulty ||
        !$image_url ||
        !$description
    ) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "All fields are required"
        ]);
        exit();
    }

    $allowed = ["Easy", "Moderate", "Challenging", "Hard"];

    if (!in_array($difficulty, $allowed)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Invalid difficulty"
        ]);
        exit();
    }

    $db = getDB();

    $stmt = $db->prepare("
        INSERT INTO packages
        (
            destination_id,
            title,
            duration,
            max_people,
            price,
            difficulty,
            image_url,
            description,
            inclusions,
            itinerary
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    if (!$stmt) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Prepare failed: " . $db->error
        ]);
        $db->close();
        exit();
    }

    $stmt->bind_param(
        "isiidsssss",
        $destination_id,
        $title,
        $duration,
        $max_people,
        $price,
        $difficulty,
        $image_url,
        $description,
        $inclusions,
        $itinerary
    );

    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Failed to create package"
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
        "success" => true,
        "message" => "Package created successfully",
        "data" => [
            "id"         => $newId,
            "title"      => $title,
            "price"      => $price,
            "difficulty" => $difficulty
        ]
    ]);
    exit();
}

/* =====================================================
   Invalid method
===================================================== */
http_response_code(405);

echo json_encode([
    "success" => false,
    "message" => "Method not allowed"
]);
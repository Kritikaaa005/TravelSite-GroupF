<?php
// wanderNepal/api/reviews/index.php
// GET  ?destination_id=:id  — fetch reviews for a destination (public)
// POST                      — submit review (must have CONFIRMED booking for this destination)

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];

// ── GET ──────────────────────────────────────────────────────────────────────
if ($method === 'GET') {
    $dest_id = isset($_GET['destination_id']) ? (int) $_GET['destination_id'] : 0;

    if (!$dest_id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'destination_id is required']);
        exit();
    }

    $db   = getDB();
    $stmt = $db->prepare(
        "SELECT r.id, r.user_id, u.name AS user_name,
                r.destination_id, r.rating, r.comment, r.created_at
         FROM reviews r
         JOIN users u ON r.user_id = u.id
         WHERE r.destination_id = ?
         ORDER BY r.created_at DESC"
    );
    $stmt->bind_param('i', $dest_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $reviews = [];
    while ($row = $result->fetch_assoc()) {
        $reviews[] = [
            'id'            => (int) $row['id'],
            'userId'        => (int) $row['user_id'],
            'user'          =>       $row['user_name'],
            'destinationId' => (int) $row['destination_id'],
            'rating'        => (int) $row['rating'],
            'comment'       =>       $row['comment'],
            'createdAt'     =>       $row['created_at'],
        ];
    }
    $stmt->close();
    $db->close();

    echo json_encode(['success' => true, 'data' => $reviews]);
    exit();
}

// ── POST: submit review ───────────────────────────────────────────────────────
if ($method === 'POST') {
    $authUser = authenticate();

    if ($authUser['role'] === 'admin') {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Admins cannot submit reviews']);
        exit();
    }

    $data           = json_decode(file_get_contents('php://input'), true);
    $destination_id = isset($data['destinationId']) ? (int) $data['destinationId'] : 0;
    $rating         = isset($data['rating'])         ? (int) $data['rating']         : 0;
    $comment        = trim($data['comment']          ?? '');
    $user_id        = (int) $authUser['id'];

    // Validate
    if (!$destination_id || !$rating || !$comment) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        exit();
    }
    if ($rating < 1 || $rating > 5) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Rating must be between 1 and 5']);
        exit();
    }
    if (strlen($comment) < 20) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Review must be at least 20 characters']);
        exit();
    }
    if (strlen($comment) > 500) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Review cannot exceed 500 characters']);
        exit();
    }

    $db = getDB();

    // ── KEY RULE: user must have a CONFIRMED booking for a package at this destination ──
    $chkBooking = $db->prepare(
        "SELECT b.id
         FROM bookings b
         JOIN packages p ON b.package_id = p.id
         WHERE b.user_id        = ?
           AND p.destination_id = ?
           AND b.status         = 'CONFIRMED'
         LIMIT 1"
    );
    $chkBooking->bind_param('ii', $user_id, $destination_id);
    $chkBooking->execute();
    $hasConfirmed = $chkBooking->get_result()->fetch_assoc();
    $chkBooking->close();

    if (!$hasConfirmed) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'You can only review destinations you have visited (requires a confirmed booking).',
        ]);
        $db->close();
        exit();
    }

    // Check for duplicate review (one per user per destination)
    $chkDup = $db->prepare('SELECT id FROM reviews WHERE user_id = ? AND destination_id = ?');
    $chkDup->bind_param('ii', $user_id, $destination_id);
    $chkDup->execute();
    $existing = $chkDup->get_result()->fetch_assoc();
    $chkDup->close();

    if ($existing) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'You have already reviewed this destination']);
        $db->close();
        exit();
    }

    // Insert
    $ins = $db->prepare('INSERT INTO reviews (user_id, destination_id, rating, comment) VALUES (?, ?, ?, ?)');
    $ins->bind_param('iiis', $user_id, $destination_id, $rating, $comment);

    if (!$ins->execute()) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to submit review']);
        $ins->close(); $db->close();
        exit();
    }

    $new_id = $db->insert_id;
    $ins->close();

    // Recalculate avg_rating on the destination row
    $avg = $db->prepare(
        "UPDATE destinations
         SET avg_rating = (SELECT ROUND(AVG(rating), 2) FROM reviews WHERE destination_id = ?)
         WHERE id = ?"
    );
    $avg->bind_param('ii', $destination_id, $destination_id);
    $avg->execute();
    $avg->close();
    $db->close();

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Review submitted',
        'data'    => ['id' => $new_id, 'userId' => $user_id, 'rating' => $rating, 'comment' => $comment],
    ]);
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);

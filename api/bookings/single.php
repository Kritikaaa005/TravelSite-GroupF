<?php
// wanderNepal/api/bookings/single.php
// PUT ?id=:id&action=cancel  — user cancels own PENDING booking
// PUT ?id=:id                — admin changes status

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int) $_GET['id'] : 0;
$action = $_GET['action'] ?? '';

if (!$id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Booking ID required']);
    exit();
}

if ($method === 'PUT') {
    $user = authenticate();
    $db   = getDB();

    $stmt = $db->prepare('SELECT id, user_id, status FROM bookings WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $booking = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$booking) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Booking not found']);
        $db->close();
        exit();
    }

    // ── User cancels their own PENDING booking ────────────────────────────
    if ($action === 'cancel') {
        if ((int) $booking['user_id'] !== (int) $user['id']) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Access denied']);
            $db->close();
            exit();
        }

        if ($booking['status'] !== 'PENDING') {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'Only PENDING bookings can be cancelled']);
            $db->close();
            exit();
        }

        $upd = $db->prepare('UPDATE bookings SET status = ? WHERE id = ?');
        $s   = 'CANCELLED';
        $upd->bind_param('si', $s, $id);
        $upd->execute();
        $upd->close();
        $db->close();

        echo json_encode(['success' => true, 'message' => 'Booking cancelled']);
        exit();
    }

    // ── Admin changes status ──────────────────────────────────────────────
    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Admin access required']);
        $db->close();
        exit();
    }

    $data      = json_decode(file_get_contents('php://input'), true);
    $newStatus = trim($data['status'] ?? '');
    $allowed   = ['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED'];

    if (!in_array($newStatus, $allowed)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid status']);
        $db->close();
        exit();
    }

    $statusMap = [
        'CONFIRMED' => 'REJECTED',
        'REJECTED'  => 'CONFIRMED',
        'PENDING'   => 'PENDING',
        'CANCELLED' => 'CANCELLED',
    ];
    $newStatus = $statusMap[$newStatus] ?? $newStatus;

    $upd = $db->prepare('UPDATE bookings SET status = ? WHERE id = ?');
    $upd->bind_param('si', $newStatus, $id);
    $upd->execute();
    $upd->close();
    $db->close();

    echo json_encode(['success' => true, 'message' => 'Booking status updated successfully']);
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
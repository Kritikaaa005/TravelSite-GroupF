<?php
// wanderNepal/api/bookings/index.php
// GET  — list bookings (admin: all, user: own)
// POST — create a booking (user only)

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];

// ── GET ──────────────────────────────────────────────────────────────────────
if ($method === 'GET') {
    $user = authenticate();
    $db   = getDB();

    if ($user['role'] === 'admin') {
        // Admin sees every booking with user name + package title
        $sql = "SELECT b.id, b.booking_ref, b.user_id, u.name AS user_name, u.email AS user_email,
                       b.package_id, p.title AS package_title,
                       b.travel_date, b.num_persons, b.total_price,
                       b.emergency_contact_name, b.emergency_contact_phone,
                       b.status, b.created_at
                FROM bookings b
                JOIN users    u ON b.user_id    = u.id
                JOIN packages p ON b.package_id = p.id
                ORDER BY b.created_at DESC";
        $result = $db->query($sql);
    } else {
        // Regular user sees only their own bookings
        $uid  = (int) $user['id'];
        $stmt = $db->prepare(
            "SELECT b.id, b.booking_ref, b.user_id,
                    b.package_id, p.title AS package_title, p.image_url AS package_image,
                    p.destination_id, p.duration, p.difficulty,
                    b.travel_date, b.num_persons, b.total_price,
                    b.emergency_contact_name, b.emergency_contact_phone,
                    b.status, b.created_at
             FROM bookings b
             JOIN packages p ON b.package_id = p.id
             WHERE b.user_id = ?
             ORDER BY b.created_at DESC"
        );
        $stmt->bind_param('i', $uid);
        $stmt->execute();
        $result = $stmt->get_result();
    }

    $bookings = [];
    while ($row = $result->fetch_assoc()) {
        $bookings[] = [
            'id'                    => (int)   $row['id'],
            'bookingRef'            =>          $row['booking_ref'],
            'userId'                => (int)   $row['user_id'],
            'userName'              =>          $row['user_name']  ?? null,
            'userEmail'             =>          $row['user_email'] ?? null,
            'packageId'             => (int)   $row['package_id'],
            'packageTitle'          =>          $row['package_title'],
            'packageImage'          =>          $row['package_image']   ?? null,
            'destinationId'         => isset($row['destination_id']) ? (int) $row['destination_id'] : null,
            'duration'              => isset($row['duration'])        ? (int) $row['duration']        : null,
            'difficulty'            =>          $row['difficulty']       ?? null,
            'travelDate'            =>          $row['travel_date'],
            'numPersons'            => (int)   $row['num_persons'],
            'totalPrice'            => (float) $row['total_price'],
            'emergencyContactName'  =>          $row['emergency_contact_name'],
            'emergencyContactPhone' =>          $row['emergency_contact_phone'],
            'status'                =>          $row['status'],
            'createdAt'             =>          $row['created_at'],
        ];
    }
    $db->close();

    echo json_encode(['success' => true, 'data' => $bookings]);
    exit();
}

// ── POST: create booking (user only) ─────────────────────────────────────────
if ($method === 'POST') {
    $user = authenticate();

    if ($user['role'] === 'admin') {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Admins cannot make bookings']);
        exit();
    }

    $data = json_decode(file_get_contents('php://input'), true);

    $package_id              = isset($data['packageId'])             ? (int) $data['packageId']   : 0;
    $travel_date             = trim($data['travelDate']              ?? '');
    $num_persons             = isset($data['numPersons'])            ? (int) $data['numPersons']  : 0;
    $emergency_contact_name  = trim($data['emergencyContactName']    ?? '');
    $emergency_contact_phone = trim($data['emergencyContactPhone']   ?? '');

    // Required fields
    if (!$package_id || !$travel_date || !$num_persons || !$emergency_contact_name || !$emergency_contact_phone) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        exit();
    }

    // Persons range
    if ($num_persons < 1 || $num_persons > 20) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Number of persons must be between 1 and 20']);
        exit();
    }

    // Travel date: min 3 days from today (backend enforces — cannot be bypassed)
    $minDate  = (new DateTime('today'))->modify('+3 days');
    $travelDt = DateTime::createFromFormat('Y-m-d', $travel_date);
    if (!$travelDt || $travelDt < $minDate) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Travel date must be at least 3 days from today']);
        exit();
    }

    $db = getDB();

    // Fetch package — get price and max_people
    $pstmt = $db->prepare('SELECT id, price, max_people FROM packages WHERE id = ?');
    $pstmt->bind_param('i', $package_id);
    $pstmt->execute();
    $pkg = $pstmt->get_result()->fetch_assoc();
    $pstmt->close();

    if (!$pkg) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Package not found']);
        $db->close();
        exit();
    }

    if ($num_persons > $pkg['max_people']) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Exceeds maximum group size of ' . $pkg['max_people']]);
        $db->close();
        exit();
    }

    // Backend calculates price — NEVER trust the frontend total
    $total_price = (float) $pkg['price'] * $num_persons;
    $user_id     = (int) $user['id'];

    // Generate booking reference: WN-YEAR-XXXX
    $year   = date('Y');
    $count  = $db->query("SELECT COUNT(*) AS cnt FROM bookings WHERE YEAR(created_at) = $year")->fetch_assoc()['cnt'];
    $seq    = str_pad($count + 1, 4, '0', STR_PAD_LEFT);
    $booking_ref = "WN-{$year}-{$seq}";

    $ins = $db->prepare(
        "INSERT INTO bookings
            (booking_ref, user_id, package_id, travel_date, num_persons,
             total_price, emergency_contact_name, emergency_contact_phone, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING')"
    );
    $ins->bind_param('siisidss',
        $booking_ref, $user_id, $package_id, $travel_date,
        $num_persons, $total_price, $emergency_contact_name, $emergency_contact_phone
    );

    if (!$ins->execute()) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to create booking']);
        $ins->close(); $db->close();
        exit();
    }

    $new_id = $db->insert_id;
    $ins->close();
    $db->close();

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Booking created',
        'data'    => [
            'id'         => $new_id,
            'bookingRef' => $booking_ref,
            'totalPrice' => $total_price,
            'status'     => 'PENDING',
        ],
    ]);
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);

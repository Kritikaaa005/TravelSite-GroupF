<?php
// htdocs/wandernepal/api/auth/register.php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/jwt.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get request body
$data = json_decode(file_get_contents('php://input'), true);

$name     = trim($data['name'] ?? '');
$email    = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

// --- Validation ---
if (!$name || !$email || !$password) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Name, email and password are required']);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit();
}

if (strlen($password) < 8) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters']);
    exit();
}

$db = getDB();

// --- Check if email already exists ---
$stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
$stmt->bind_param('s', $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    http_response_code(409);
    echo json_encode(['success' => false, 'message' => 'Email already registered']);
    $stmt->close();
    $db->close();
    exit();
}
$stmt->close();

// --- Hash password and insert ---
$passwordHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);

$stmt = $db->prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, "user")');
$stmt->bind_param('sss', $name, $email, $passwordHash);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Registration failed. Try again.']);
    $stmt->close();
    $db->close();
    exit();
}

$userId = $db->insert_id;
$stmt->close();
$db->close();

// --- Generate JWT ---
$token = generateJWT([
    'id'    => $userId,
    'name'  => $name,
    'email' => $email,
    'role'  => 'user',
]);

http_response_code(201);
echo json_encode([
    'success' => true,
    'message' => 'Registration successful',
    'token'   => $token,
    'user'    => [
        'id'    => $userId,
        'name'  => $name,
        'email' => $email,
        'role'  => 'user',
    ],
]);
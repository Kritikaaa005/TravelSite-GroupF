<?php
// htdocs/wandernepal/api/middleware/auth.php
// Include this in any protected endpoint to verify the JWT

require_once __DIR__ . '/../config/jwt.php';

function authenticate() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';

    if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'No token provided']);
        exit();
    }

    $token = substr($authHeader, 7);
    $payload = verifyJWT($token);

    if (!$payload) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid or expired token']);
        exit();
    }

    return $payload; // returns ['id', 'name', 'email', 'role']
}

function requireAdmin() {
    $user = authenticate();
    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Admin access required']);
        exit();
    }
    return $user;
}
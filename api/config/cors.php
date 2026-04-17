<?php
// htdocs/wandernepal/api/config/cors.php
// Include this at the top of every PHP endpoint

header('Access-Control-Allow-Origin: http://localhost:5173'); // Vite dev server
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
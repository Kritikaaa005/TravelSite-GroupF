<?php


define('JWT_SECRET', 'wandernepal_secret_key_2025');
define('JWT_EXPIRY', 86400); 

function base64UrlEncode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64UrlDecode($data) {
    return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($data)) % 4));
}

function generateJWT($payload) {
    $header = base64UrlEncode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload['exp'] = time() + JWT_EXPIRY;
    $payload['iat'] = time();
    $body = base64UrlEncode(json_encode($payload));
    $signature = base64UrlEncode(hash_hmac('sha256', "$header.$body", JWT_SECRET, true));
    return "$header.$body.$signature";
}

function verifyJWT($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return false;

    [$header, $body, $sig] = $parts;
    $expectedSig = base64UrlEncode(hash_hmac('sha256', "$header.$body", JWT_SECRET, true));

    if (!hash_equals($expectedSig, $sig)) return false;

    $payload = json_decode(base64UrlDecode($body), true);
    if (!$payload || $payload['exp'] < time()) return false;

    return $payload;
}
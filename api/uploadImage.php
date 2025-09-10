<?php
// uploadImage.php
header("Content-Type: application/json");

// Directory to store uploads (make sure this exists and is writable)
$uploadDir = __DIR__ . "/../storage/uploads/";

// Ensure the uploads directory exists
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0775, true);
}

// Check if file is uploaded
if (!isset($_FILES['image'])) {
    echo json_encode(["success" => false, "error" => "No file uploaded"]);
    exit;
}

$file = $_FILES['image'];

// Validate upload
if ($file['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(["success" => false, "error" => "Upload error: " . $file['error']]);
    exit;
}

// Allow only certain image types
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
if (!in_array($file['type'], $allowedTypes)) {
    echo json_encode(["success" => false, "error" => "Invalid file type"]);
    exit;
}

// Generate unique filename
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid("img_", true) . "." . strtolower($ext);
$targetPath = $uploadDir . $filename;

// Move uploaded file
if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
    echo json_encode(["success" => false, "error" => "Failed to save file"]);
    exit;
}

// Build public URL (adjust domain accordingly)
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https" : "http";
$host = $_SERVER['HTTP_HOST'];
$publicUrl = $protocol . "://" . $host . "/storage/uploads/" . $filename;

// Return JSON response
echo json_encode([
    "success" => true,
    "url" => $publicUrl
]);

<?php
// /api/upload.php
header("Content-Type: application/json");

require "db.php"; // contains your DB connection

// Connect to MySQL
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die(json_encode(["success" => false, "error" => "DB connection failed: " . $conn->connect_error]));
}

// Ensure uploads directory exists
$uploadDir = __DIR__ . "/../storage/uploads/";
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0775, true);
}

// Handle POST request
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $title     = $_POST["title"] ?? "";
    $content   = $_POST["content"] ?? "";
    $plaintext = strip_tags($content);
    $author    = $_POST["author"] ?? "";
    $excerpt   = $_POST["excerpt"] ?? "";
    $imagePath = $_POST["image"] ?? "";
    $views     = 0; // default for new post

    // Insert into DB
    $stmt = $conn->prepare("
        INSERT INTO articles 
        (title, content, image_path, plaintext, author, excerpt, views, date)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    ");

    if (!$stmt) {
        echo json_encode(["success" => false, "error" => $conn->error]);
        exit;
    }

    $stmt->bind_param("ssssssi", $title, $content, $imagePath, $plaintext, $author, $excerpt, $views);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Article uploaded successfully", "id" => $stmt->insert_id]);
    } else {
        echo json_encode(["success" => false, "error" => $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "error" => "Invalid request"]);
}

$conn->close();

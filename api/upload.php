<?php
// /api/upload.php
header("Content-Type: application/json");
require "db.php"; // ✅ assumes $conn is created here

try {
    // Ensure uploads directory exists
    $uploadDir = realpath(__DIR__ . "/../storage/uploads/");
    if ($uploadDir === false) {
        $uploadDir = __DIR__ . "/../storage/uploads/";
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0775, true);
        }
    }

    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        throw new Exception("Invalid request method");
    }

    $title     = trim($_POST["title"] ?? "");
    $content   = trim($_POST["content"] ?? "");
    $plaintext = strip_tags($content);
    $author    = trim($_POST["author"] ?? "");
    $excerpt   = trim($_POST["excerpt"] ?? "");
    $imagePath = trim($_POST["image"] ?? "");
    $views     = 0; // default for new article

    // Prepare insert
    $stmt = $conn->prepare("
        INSERT INTO articles 
        (title, content, image_path, plaintext, author, excerpt, views, date)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    ");

    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("ssssssi", $title, $content, $imagePath, $plaintext, $author, $excerpt, $views);
    $stmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "Article uploaded successfully",
        "id"      => $stmt->insert_id
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error"   => $e->getMessage()
    ]);
} finally {
    if (isset($stmt) && $stmt instanceof mysqli_stmt) {
        $stmt->close();
    }
    $conn->close();
}

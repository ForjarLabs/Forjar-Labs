<?php
// /api/edit.php
header("Content-Type: application/json");

require "db.php"; // ← contains your DB connection

// Ensure uploads directory exists
$uploadDir = __DIR__ . "/../storage/uploads/";
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0775, true);
}

// Handle POST request
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id        = $_POST["id"] ?? null;
    $title     = $_POST["title"] ?? "";
    $content   = $_POST["content"] ?? "";
    $plaintext = strip_tags($content);
    $author    = $_POST["author"] ?? "";
    $excerpt   = $_POST["excerpt"] ?? "";
    $imagePath = $_POST["image"] ?? null;

    if (!$id) {
        echo json_encode(["success" => false, "error" => "Article ID required"]);
        exit;
    }

    // Always included fields
    $fields = "title=?, content=?, plaintext=?, author=?, excerpt=?, updated_at=NOW()";
    $params = [$title, $content, $plaintext, $author, $excerpt];
    $types  = "sssss";

    // Conditionally include image
    if ($imagePath) {
        $fields .= ", image_path=?";
        $params[] = $imagePath;
        $types   .= "s";
    }

    $sql = "UPDATE articles SET $fields WHERE id=?";
    $params[] = $id;
    $types   .= "i";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode(["success" => false, "error" => $conn->error]);
        exit;
    }

    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Article updated successfully"]);
    } else {
        echo json_encode(["success" => false, "error" => $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "error" => "Invalid request"]);
}

$conn->close();

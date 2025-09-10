<?php
// /api/editDraft.php
header("Content-Type: application/json");
require "db.php"; // contains $conn (MySQLi connection)

try {
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        throw new Exception("Invalid request method");
    }

    $id        = isset($_POST["id"]) ? intval($_POST["id"]) : null;
    $title     = trim($_POST["title"] ?? "");
    $content   = trim($_POST["content"] ?? "");
    $category  = trim($_POST["category"] ?? "");
    $excerpt   = trim($_POST["excerpt"] ?? "");
    $imagePath = trim($_POST["image"] ?? "");

    if (!$id) {
        throw new Exception("Draft ID is required");
    }

    $stmt = $conn->prepare("
        UPDATE drafts 
        SET title = ?, content = ?, image_path = ?, category = ?, excerpt = ?, updated_at = NOW()
        WHERE id = ?
    ");
    if (!$stmt) {
        throw new Exception($conn->error);
    }

    $stmt->bind_param("sssssi", $title, $content, $imagePath, $category, $excerpt, $id);

    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    echo json_encode([
        "success" => true,
        "message" => "Draft updated successfully"
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

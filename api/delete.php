<?php
// /api/deleteArticle.php

header("Content-Type: application/json");
require "db.php"; // contains your DB connection

// Ensure uploads directory exists
$uploadDir = __DIR__ . "/../storage/uploads/";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id = $_POST["id"] ?? null;
    $deleteImages = isset($_POST["deleteImages"]) ? filter_var($_POST["deleteImages"], FILTER_VALIDATE_BOOLEAN) : false;

    if (!$id) {
        echo json_encode(["success" => false, "error" => "Article ID required"]);
        exit;
    }

    // Fetch existing article to get image path
    $stmt = $conn->prepare("SELECT image_path FROM articles WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $article = $result->fetch_assoc();
    $stmt->close();

    if (!$article) {
        echo json_encode(["success" => false, "error" => "Article not found"]);
        exit;
    }

    // Delete article from database
    $stmt = $conn->prepare("DELETE FROM articles WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        // Optionally delete images
        if ($deleteImages && !empty($article["image_path"])) {
            $filePath = __DIR__ . "/../" . ltrim($article["image_path"], "/");
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }

        echo json_encode(["success" => true, "message" => "Article deleted successfully"]);
    } else {
        echo json_encode(["success" => false, "error" => $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "error" => "Invalid request"]);
}

$conn->close();

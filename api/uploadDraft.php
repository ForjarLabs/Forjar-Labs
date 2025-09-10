<?php
// /api/upload.php

require "db.php";
header("Content-Type: application/json");

// Handle POST request
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $title     = $_POST["title"]    ?? "";
    $content   = $_POST["content"]  ?? "";
    $excerpt   = $_POST["excerpt"]  ?? "";
    $author    = $_POST["author"]   ?? "";
    $imagePath = $_POST["image"]    ?? null;

    // Insert into DB
    $stmt = $conn->prepare("
        INSERT INTO drafts 
        (title, content, image_path, author, excerpt, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    ");
    $stmt->bind_param("sssss", $title, $content, $imagePath, $author, $excerpt);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Draft uploaded successfully", "id" => $stmt->insert_id]);
    } else {
        echo json_encode(["success" => false, "error" => $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "error" => "Invalid request"]);
}

$conn->close();

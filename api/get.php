<?php
// /api/getArticle.php
header("Content-Type: application/json");

require "db.php";

// Validate and sanitize ID from query string
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    echo json_encode([
        "success" => false,
        "error" => "Invalid or missing article ID"
    ]);
    exit;
}

$id = intval($_GET['id']);

// Fetch the article
$sql = "SELECT * FROM articles WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode([
        "success" => true,
        "article" => $row
    ]);
} else {
    echo json_encode([
        "success" => false,
        "error" => "Article not found"
    ]);
}

$stmt->close();
$conn->close();

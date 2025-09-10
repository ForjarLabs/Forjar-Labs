<?php
// /api/getArticles.php
header("Content-Type: application/json");

require "db.php"; // contains your DB connection

// Fetch all articles (newest first by date)
$sql = "SELECT *
        FROM articles 
        ORDER BY date DESC";

$result = $conn->query($sql);

$articles = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $articles[] = $row;
    }
}

echo json_encode([
    "success" => true,
    "articles" => $articles
]);

$conn->close();

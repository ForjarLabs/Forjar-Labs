<?php
// post.php?id=123
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

require "db.php";

if (!isset($_GET["id"]) || !is_numeric($_GET["id"])) {
    echo json_encode(["success" => false, "error" => "Missing or invalid article ID"]);
    exit;
}

$articleId = intval($_GET["id"]);

// ✅ Increment view count first
$updateSql = "UPDATE articles SET views = views + 1 WHERE id = ?";
$stmtUpdate = $conn->prepare($updateSql);
$stmtUpdate->bind_param("i", $articleId);
$stmtUpdate->execute();
$stmtUpdate->close();

// ✅ Fetch the updated article
$sql = "SELECT * FROM articles WHERE id = ? LIMIT 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $articleId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "error" => "Article not found"]);
    $stmt->close();
    $conn->close();
    exit;
}

$article = $result->fetch_assoc();
$stmt->close();

// ✅ Fetch related articles (3 random, excluding current)
$relatedSql = "SELECT *
               FROM articles 
               WHERE id != ? 
               ORDER BY RAND() 
               LIMIT 3";
$stmt2 = $conn->prepare($relatedSql);
$stmt2->bind_param("i", $articleId);
$stmt2->execute();
$relatedResult = $stmt2->get_result();

$relatedArticles = [];
while ($row = $relatedResult->fetch_assoc()) {
    $relatedArticles[] = $row;
}
$stmt2->close();

$conn->close();

// ✅ Return JSON response
echo json_encode([
    "success" => true,
    "article" => $article,
    "related" => $relatedArticles
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);

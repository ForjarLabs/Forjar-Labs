<?php
// /api/getPosts.php
header("Content-Type: application/json");
require "db.php"; // DB connection

try {
    $drafts = [];

    $sql = "SELECT id, title, author, excerpt, image_path, created_at, updated_at 
            FROM drafts 
            ORDER BY created_at DESC";
    $result = $conn->query($sql);

    if ($result === false) {
        throw new Exception($conn->error);
    }

    while ($row = $result->fetch_assoc()) {
        $drafts[] = $row;
    }

    echo json_encode([
        "success" => true,
        "count"   => count($drafts),
        "drafts"  => $drafts
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error"   => $e->getMessage()
    ]);
} finally {
    if (isset($result) && $result instanceof mysqli_result) {
        $result->free();
    }
    $conn->close();
}

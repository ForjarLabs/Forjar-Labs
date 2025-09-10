<?php
// /api/delete.php
header("Content-Type: application/json");
require "db.php"; // DB connection

try {
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        throw new Exception("Invalid request method");
    }

    $id = $_POST["id"] ?? null;
    $deleteImages = isset($_POST["deleteImages"]) ? filter_var($_POST["deleteImages"], FILTER_VALIDATE_BOOLEAN) : false;

    if (!$id) {
        throw new Exception("Draft ID is required");
    }

    // Fetch draft to get image path
    $stmt = $conn->prepare("SELECT image_path FROM drafts WHERE id = ?");
    if (!$stmt) {
        throw new Exception($conn->error);
    }
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $draft = $result->fetch_assoc();
    $stmt->close();

    if (!$draft) {
        throw new Exception("Draft not found");
    }

    // Delete draft from DB
    $stmt = $conn->prepare("DELETE FROM drafts WHERE id = ?");
    if (!$stmt) {
        throw new Exception($conn->error);
    }
    $stmt->bind_param("i", $id);

    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    // Optionally delete associated image
    if ($deleteImages && !empty($draft["image_path"])) {
        $uploadDir = realpath(__DIR__ . "/../storage/uploads/");
        $filePath  = realpath(__DIR__ . "/../" . ltrim($draft["image_path"], "/"));

        // ensure file exists & is inside uploads folder
        if ($filePath && strpos($filePath, $uploadDir) === 0 && file_exists($filePath)) {
            unlink($filePath);
        }
    }

    echo json_encode([
        "success" => true,
        "message" => "Draft deleted successfully"
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

<?php
// DB connection
$host = "localhost";
$user = "u352353130_oghenero";
$pass = "W>IyBf=Cq5";
$db   = "u352353130_forjarlabs";

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>

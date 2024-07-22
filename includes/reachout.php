<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['Name'];
    $business = $_POST['Business'];
    $email = $_POST['Email'];
    $phone = $_POST['PhoneNumber'];
    $message = $_POST['Message'];

    // Compose email message
    $to = "hello@forjarlabs.agency";
    $subject = "New Consultation Request";
    $body = "Name: $name\n";
    $body .= "Business: $business\n";
    $body .= "Email: $email\n";
    $body .= "Phone Number: $phone\n";
    $body .= "Message: $message\n";

    // Send email
    $success = mail($to, $subject, $body);

    if ($success) {
        http_response_code(200);
        echo "Form submitted successfully!";
    } else {
        http_response_code(500);
        echo "Failed to submit form. Please try again later.";
    }
} else {
    http_response_code(405);
    echo "Method Not Allowed";
}

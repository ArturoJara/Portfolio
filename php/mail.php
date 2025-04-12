<?php
header('Content-Type: application/json');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Log file path
$logFile = 'mail_log.txt';

// Function to log errors
function logError($message) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[$timestamp] $message\n";
    file_put_contents($logFile, $logMessage, FILE_APPEND);
}

try {
    // Validate required fields
    $requiredFields = ['name', 'email', 'message'];
    foreach ($requiredFields as $field) {
        if (empty($_POST[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }

    // Sanitize input data
    $name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $message = filter_var($_POST['message'], FILTER_SANITIZE_STRING);
    $phone = isset($_POST['phone']) ? filter_var($_POST['phone'], FILTER_SANITIZE_STRING) : '';
    $website = isset($_POST['website']) ? filter_var($_POST['website'], FILTER_SANITIZE_URL) : '';

    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }

    // Email settings
    $to = 'arturojara1994@gmail.com';
    $subject = 'Contact Form Submission - Arturo Jara Portfolio';
    
    // Create email headers
    $headers = array(
        'From: ' . $name . ' <' . $email . '>',
        'Reply-To: ' . $email,
        'X-Mailer: PHP/' . phpversion(),
        'Content-Type: text/html; charset=UTF-8'
    );

    // Create email message
    $emailMessage = "
    <html>
    <head>
        <title>New Contact Form Submission</title>
    </head>
    <body>
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> {$name}</p>
        <p><strong>Email:</strong> {$email}</p>
        " . ($phone ? "<p><strong>Phone:</strong> {$phone}</p>" : "") . "
        " . ($website ? "<p><strong>Website:</strong> {$website}</p>" : "") . "
        <p><strong>Message:</strong></p>
        <p>" . nl2br(htmlspecialchars($message)) . "</p>
    </body>
    </html>";

    // Send email
    if (!mail($to, $subject, $emailMessage, implode("\r\n", $headers))) {
        throw new Exception('Failed to send email');
    }

    // Return success response
    echo json_encode([
        'status' => 'success',
        'message' => 'Thank you for your message. We will get back to you soon!'
    ]);

} catch (Exception $e) {
    // Log the error
    logError($e->getMessage());
    
    // Return error response
    echo json_encode([
        'status' => 'error',
        'message' => 'An error occurred while sending your message. Please try again later.'
    ]);
}
?>

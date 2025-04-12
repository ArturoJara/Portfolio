<?php
// Configuration
$subject = 'Contact Form Submission - Arturo Jara Portfolio'; // Subject of your email
$to = 'arturojara1994@gmail.com'; // Your e-mail address

// Set headers for HTML email
$headers = 'MIME-Version: 1.0' . "\r\n" .
           'Content-type: text/html; charset=UTF-8' . "\r\n" .
           'From: ' . $_POST['name'] . ' <' . $_POST['email'] . '>' . "\r\n" .
           'Reply-To: ' . $_POST['email'] . "\r\n" .
           'X-Mailer: PHP/' . phpversion();

// Sanitize input data
$name = htmlspecialchars($_POST['name']);
$email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
$phone = isset($_POST['phone']) ? htmlspecialchars($_POST['phone']) : 'Not provided';
$website = isset($_POST['website']) ? htmlspecialchars($_POST['website']) : 'Not provided';
$message = htmlspecialchars($_POST['message']);

// Build email message
$emailMessage = '
<html>
<head>
  <title>New Contact Form Submission</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #f8f8f8; padding: 15px; border-radius: 5px; }
    .content { padding: 20px 0; }
    .footer { font-size: 12px; color: #777; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Contact Form Submission</h2>
    </div>
    <div class="content">
      <p><strong>Name:</strong> ' . $name . '</p>
      <p><strong>Email:</strong> ' . $email . '</p>
      <p><strong>Phone:</strong> ' . $phone . '</p>
      <p><strong>Website:</strong> ' . $website . '</p>
      <p><strong>Message:</strong></p>
      <p>' . nl2br($message) . '</p>
    </div>
    <div class="footer">
      <p>This email was sent from the contact form on your portfolio website.</p>
    </div>
  </div>
</body>
</html>';

// Send email
if (mail($to, $subject, $emailMessage, $headers)) {
  // Return success response
  header('Content-Type: application/json');
  echo json_encode(['status' => 'success', 'message' => 'Your message has been sent successfully!']);
} else {
  // Return error response
  header('Content-Type: application/json');
  echo json_encode(['status' => 'error', 'message' => 'Sorry, there was an error sending your message. Please try again later.']);
}
?>

<?php
$subject    = 'E-mail from example'; // Subject of your email
$to         = 'email@example.com'; //Your e-mail address
$headers    = 'MIME-Version: 1.0' . "\r\n" .
              'Content-type: text/html; charset=iso-8859-1' . "\r\n";
$message    = '';

if (!empty($_POST["name"])) {
  $message .= 'Name: ' . $_POST['name'] . ' <br/>';
}
if (!empty($_POST["email"])) {
  $message .= 'Email: ' . $_POST['email'] . ' <br/>';
}
if (!empty($_POST["phone"])) {
  $message .= 'Phone: ' . $_POST['phone'] . ' <br/>';
}
if (!empty($_POST["website"])) {
  $message .= 'Website: ' . $_POST['website'] . ' <br/>';
}
if (!empty($_POST["message"])) {
  $message .= 'Message: ' . $_POST['message'] . ' <br/>';
}

if (@mail($to, $subject, $message, $headers))
{
  echo 'sent';
}
else
{
  echo 'failed';
}
?>

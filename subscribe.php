<?php
// Enable error reporting for debugging
// Comment these out in production
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    
    // Basic validation
    if (empty($name) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Please provide a valid name and email address.']);
        exit;
    }
    
    // Your Moosend API Key
    $apiKey = 'YOUR_MOOSEND_API_KEY';
    
    // Your Moosend List ID
    $listId = 'YOUR_MOOSEND_LIST_ID';
    
    // Prepare the data for the API request
    $data = [
        'Name' => $name,
        'Email' => $email,
        'HasExternalDoubleOptIn' => false // Set to true if you want double opt-in
    ];
    
    // Initialize cURL session
    $ch = curl_init();
    
    // Set cURL options
    curl_setopt($ch, CURLOPT_URL, "https://api.moosend.com/v3/subscribers/{$listId}/subscribe.json?apikey={$apiKey}");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json'
    ]);
    
    // Execute cURL session
    $response = curl_exec($ch);
    
    // Check for cURL errors
    if (curl_errno($ch)) {
        echo json_encode(['success' => false, 'message' => 'Error: ' . curl_error($ch)]);
        curl_close($ch);
        exit;
    }
    
    // Close cURL session
    curl_close($ch);
    
    // Decode the response
    $responseData = json_decode($response, true);
    
    // Check if the API request was successful
    if (isset($responseData['Code']) && $responseData['Code'] === 0) {
        echo json_encode(['success' => true, 'message' => 'Thank you for subscribing!']);
    } else {
        $errorMessage = isset($responseData['Error']) ? $responseData['Error'] : 'An error occurred while subscribing.';
        echo json_encode(['success' => false, 'message' => $errorMessage]);
    }
} else {
    // Not a POST request
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>

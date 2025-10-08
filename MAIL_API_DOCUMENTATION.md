# Mail API Documentation

## Overview

The Mail API provides a professional email sending service that supports both plain text and HTML emails. The API is designed to be simple, reliable, and production-ready.

## Base URL

```
https://sajedabackend.etherstaging.xyz/api
```

## Authentication

Currently, the API does not require authentication. However, it's recommended to implement authentication for production use.

## Endpoints

### Send Email

Send an email with optional HTML content.

**Endpoint:** `POST /send-email`

**Content-Type:** `application/json`

#### Request Body

| Field     | Type    | Required | Description                                          |
| --------- | ------- | -------- | ---------------------------------------------------- |
| `to`      | string  | Yes      | Recipient email address (must be valid email format) |
| `subject` | string  | Yes      | Email subject line (max 255 characters)              |
| `message` | string  | Yes      | Email content (plain text or HTML)                   |
| `is_html` | boolean | No       | Whether the message contains HTML (default: false)   |

#### Request Example

**Plain Text Email:**

```json
{
    "to": "recipient@example.com",
    "subject": "Welcome to Our Service",
    "message": "Thank you for signing up! We're excited to have you on board.",
    "is_html": false
}
```

**HTML Email:**

```json
{
    "to": "recipient@example.com",
    "subject": "Welcome to Our Service",
    "message": "<h1>Welcome!</h1><p>Thank you for signing up! We're excited to have you on board.</p><ul><li>Feature 1</li><li>Feature 2</li></ul>",
    "is_html": true
}
```

#### Response Format

**Success Response (200 OK):**

```json
{
    "success": true,
    "message": "Email sent successfully",
    "data": {
        "to": "recipient@example.com",
        "subject": "Welcome to Our Service",
        "sent_at": "2025-09-25T11:21:35.069311Z"
    }
}
```

**Validation Error Response (422 Unprocessable Entity):**

```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "to": ["The to field must be a valid email address."],
        "subject": ["The subject field is required."]
    }
}
```

**Server Error Response (500 Internal Server Error):**

```json
{
    "success": false,
    "message": "Failed to send email",
    "error": "Connection could not be established with host..."
}
```

## Error Codes

| HTTP Status | Description                             |
| ----------- | --------------------------------------- |
| 200         | Email sent successfully                 |
| 422         | Validation error (invalid input)        |
| 500         | Server error (SMTP/configuration issue) |

## Validation Rules

-   **to**: Required, must be a valid email address
-   **subject**: Required, string, maximum 255 characters
-   **message**: Required, string (can contain HTML if `is_html` is true)
-   **is_html**: Optional, boolean (defaults to false)

## Usage Examples

### cURL Examples

**Send Plain Text Email:**

```bash
curl -X POST "https://sajedabackend.etherstaging.xyz/api/send-email" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Test Email",
    "message": "This is a test email.",
    "is_html": false
  }'
```

**Send HTML Email:**

```bash
curl -X POST "https://sajedabackend.etherstaging.xyz/api/send-email" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "HTML Test Email",
    "message": "<h1>Hello!</h1><p>This is an <strong>HTML</strong> email.</p>",
    "is_html": true
  }'
```

### JavaScript/Fetch Example

```javascript
const sendEmail = async (to, subject, message, isHtml = false) => {
    try {
        const response = await fetch(
            "https://sajedabackend.etherstaging.xyz/api/send-email",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    to,
                    subject,
                    message,
                    is_html: isHtml,
                }),
            }
        );

        const data = await response.json();

        if (data.success) {
            console.log("Email sent successfully:", data.data);
        } else {
            console.error("Email failed:", data.message);
        }

        return data;
    } catch (error) {
        console.error("Network error:", error);
        throw error;
    }
};

// Usage
sendEmail(
    "user@example.com",
    "Welcome!",
    "<h1>Welcome to our service!</h1><p>Thank you for joining us.</p>",
    true
);
```

### PHP Example

```php
<?php
function sendEmail($to, $subject, $message, $isHtml = false) {
    $url = 'https://sajedabackend.etherstaging.xyz/api/send-email';

    $data = [
        'to' => $to,
        'subject' => $subject,
        'message' => $message,
        'is_html' => $isHtml
    ];

    $options = [
        'http' => [
            'header' => "Content-Type: application/json\r\nAccept: application/json\r\n",
            'method' => 'POST',
            'content' => json_encode($data)
        ]
    ];

    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);

    return json_decode($result, true);
}

// Usage
$response = sendEmail(
    'user@example.com',
    'Test Email',
    'This is a test email from PHP.',
    false
);

if ($response['success']) {
    echo "Email sent successfully!";
} else {
    echo "Email failed: " . $response['message'];
}
?>
```

## SMTP Configuration

The API uses the following SMTP configuration:

-   **Host**: sajida.etherstaging.xyz
-   **Port**: 465
-   **Encryption**: SSL
-   **From Address**: no-reply@sajida.etherstaging.xyz
-   **From Name**: Sajida App

## Rate Limiting

Currently, there are no rate limits implemented. Consider implementing rate limiting for production use to prevent abuse.

## Security Considerations

1. **Input Validation**: All inputs are validated to prevent injection attacks
2. **Email Validation**: Recipient email addresses are validated using Laravel's email validation rules
3. **Content Sanitization**: Consider implementing HTML sanitization for production use
4. **Authentication**: Implement API authentication for production use

## Troubleshooting

### Common Issues

1. **"Connection could not be established"**: Check SMTP configuration and server connectivity
2. **"Validation failed"**: Ensure all required fields are provided and email format is valid
3. **"Email sent but not received"**: Check spam folder, verify recipient email address

### Testing

Use the test endpoints to verify email functionality:

-   **Plain Text Test**: `GET /mail-test`
-   **HTML Test**: `GET /mail-welcome-test`

## Support

For technical support or questions about the Mail API, please contact the development team.

---

**Last Updated**: September 25, 2025  
**API Version**: 1.0  
**Laravel Version**: 10.48.29

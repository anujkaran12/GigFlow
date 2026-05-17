# GigFlow CRM API Documentation

Base URL:

```txt
http://localhost:5000/api
```

## Standard Response Format

Success:

```json
{
  "success": true,
  "message": "Request successful",
  "data": {},
  "meta": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

Validation error:

```json
{
  "success": false,
  "message": "Validation failed",
  "data": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

Authentication uses HTTP-only cookies:

- `accessToken`
- `refreshToken`

Requests from the frontend must include credentials.

## Auth Endpoints

### Register

```http
POST /auth/register
```

Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

Response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": null
}
```

### Login

```http
POST /auth/login
```

Body:

```json
{
  "email": "admin@gmail.com",
  "password": "admin123"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "Admin",
      "email": "admin@gmail.com",
      "role": "admin"
    }
  }
}
```

### Refresh Access Token

```http
POST /auth/refresh
```

Response:

```json
{
  "success": true,
  "message": "Access token refreshed successfully",
  "data": null
}
```

### Logout

```http
POST /auth/logout
```

Response:

```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null
}
```

### Current User

```http
GET /auth/me
```

Requires authentication.

Response:

```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "Admin",
      "email": "admin@gmail.com",
      "role": "admin"
    }
  }
}
```

## Lead Endpoints

All lead endpoints require authentication.

Lead fields:

```json
{
  "id": "lead_id",
  "name": "Tom",
  "email": "tom@gmail.com",
  "status": "New",
  "source": "Website",
  "createdAt": "2026-05-17T00:00:00.000Z",
  "createdBy": "user_id"
}
```

Allowed statuses:

```txt
New, Contacted, Qualified, Lost
```

Allowed sources:

```txt
Website, Instagram, Referral
```

### Get Leads

```http
GET /leads
```

Query parameters:

```txt
search?: string
status?: New | Contacted | Qualified | Lost
source?: Website | Instagram | Referral
sort?: latest | oldest
page?: number
```

Example:

```http
GET /leads?search=tom&status=New&sort=latest&page=1
```

Response:

```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": [],
  "meta": {
    "currentPage": 1,
    "totalPages": 1,
    "totalCount": 0,
    "limit": 10
  }
}
```

### Get Lead By ID

```http
GET /leads/:id
```

Response:

```json
{
  "success": true,
  "message": "Lead fetched successfully",
  "data": {
    "id": "lead_id",
    "name": "Tom",
    "email": "tom@gmail.com",
    "status": "New",
    "source": "Website",
    "createdAt": "2026-05-17T00:00:00.000Z",
    "createdBy": "user_id"
  }
}
```

### Create Lead

```http
POST /leads
```

Requires admin role.

Body:

```json
{
  "name": "Tom",
  "email": "tom@gmail.com",
  "status": "New",
  "source": "Website"
}
```

Response:

```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": {
    "id": "lead_id",
    "name": "Tom",
    "email": "tom@gmail.com",
    "status": "New",
    "source": "Website",
    "createdAt": "2026-05-17T00:00:00.000Z",
    "createdBy": "user_id"
  }
}
```

### Update Lead

```http
PUT /leads/:id
```

Body:

```json
{
  "name": "Tom Updated",
  "email": "tom@gmail.com",
  "status": "Contacted",
  "source": "Referral"
}
```

Response:

```json
{
  "success": true,
  "message": "Lead updated successfully",
  "data": {
    "id": "lead_id",
    "name": "Tom Updated",
    "email": "tom@gmail.com",
    "status": "Contacted",
    "source": "Referral",
    "createdAt": "2026-05-17T00:00:00.000Z",
    "createdBy": "user_id"
  }
}
```

### Delete Lead

```http
DELETE /leads/:id
```

Requires admin role.

Response:

```json
{
  "success": true,
  "message": "Lead deleted successfully",
  "data": null
}
```

### Export Leads CSV

```http
GET /leads/export/csv
```

Query parameters are the same as `GET /leads`.

Response:

```txt
Name,Email,Status,Source,Created At
"Tom","tom@gmail.com","New","Website","2026-05-17T00:00:00.000Z"
```

Content type:

```txt
text/csv
```

## Common Status Codes

```txt
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
```

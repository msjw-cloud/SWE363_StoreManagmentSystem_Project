# Store Management Backend Documentation

## Overview
This document provides comprehensive documentation for the Store Management Backend System, a RESTful API server built with Node.js, Express, and MongoDB. The server is deployed on Render platform and accessible at https://store-management-backend-9pp7.onrender.com.

## Table of Contents
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Security Features](#security-features)
- [Models](#models)
- [Testing](#testing)

## Getting Started

### Prerequisites
- Node.js (v16.20.1 or higher)
- MongoDB
- npm or yarn package manager

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables in `.env`:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
```

4. Start the server:
```bash
npm start
```

## Authentication
The system uses JWT (JSON Web Token) for authentication. All protected routes require a valid JWT token in the Authorization header.

### Token Format
```
Authorization: Bearer <token>
```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
```json
{
    "name": "string",
    "email": "string",
    "password": "string",
    "role": "admin|employee"
}
```
- **Success Response**: Status 201
```json
{
    "token": "jwt_token",
    "user": {
        "id": "string",
        "name": "string",
        "email": "string",
        "role": "string",
        "profileImage": "string"
    }
}
```

#### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
```json
{
    "email": "string",
    "password": "string"
}
```
- **Success Response**: Status 200
```json
{
    "token": "jwt_token",
    "user": {
        "id": "string",
        "name": "string",
        "email": "string",
        "role": "string",
        "profileImage": "string"
    }
}
```

### Product Routes (`/api/products`)

#### Get All Products
- **URL**: `/api/products`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: Status 200
```json
[
    {
        "name": "string",
        "companies": [
            {
                "name": "string",
                "quantity": "number",
                "price": "number",
                "weight": "number",
                "color": "string",
                "image": "string"
            }
        ]
    }
]
```

#### Create Product
- **URL**: `/api/products`
- **Method**: `POST`
- **Auth Required**: Yes
- **Body**:
```json
{
    "name": "string",
    "companies": [
        {
            "name": "string",
            "quantity": "number",
            "price": "number",
            "weight": "number",
            "color": "string",
            "image": "string"
        }
    ]
}
```

### Order Routes (`/api/orders`)

#### Get All Orders
- **URL**: `/api/orders`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: Status 200
```json
{
    "pendingOrders": [],
    "approvedOrders": []
}
```

#### Create Order
- **URL**: `/api/orders`
- **Method**: `POST`
- **Auth Required**: Yes
- **Body**:
```json
{
    "product": "string",
    "quantity": "number",
    "date": "date"
}
```

#### Approve Order
- **URL**: `/api/orders/:id/approve`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Success Response**: Status 200

### Task Routes (`/api/tasks`)

#### Get All Tasks
- **URL**: `/api/tasks`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: Status 200
```json
{
    "tasks": [],
    "counts": {
        "pending": "number",
        "inProgress": "number",
        "completed": "number"
    }
}
```

#### Create Task
- **URL**: `/api/tasks`
- **Method**: `POST`
- **Auth Required**: Yes
- **Body**:
```json
{
    "title": "string",
    "description": "string",
    "priority": "low|medium|high",
    "dueDate": "date",
    "category": "general|delivery",
    "assignedTo": "userId"
}
```

### Message Routes (`/api/messages`)

#### Get Received Messages
- **URL**: `/api/messages?userId=<userId>`
- **Method**: `GET`
- **Auth Required**: Yes

#### Send Message
- **URL**: `/api/messages`
- **Method**: `POST`
- **Auth Required**: Yes
- **Body**:
```json
{
    "userId": "string",
    "recipientId": "string",
    "subject": "string",
    "content": "string",
    "attachments": []
}
```

## Error Handling
The server implements comprehensive error handling:

- **400**: Bad Request - Invalid input
- **401**: Unauthorized - Missing or invalid authentication
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource doesn't exist
- **500**: Internal Server Error

Error Response Format:
```json
{
    "message": "Error description"
}
```

## Security Features

### Input Validation
- All user inputs are validated using mongoose schemas
- Special characters are sanitized
- File uploads are restricted to specific types and sizes

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (admin/employee)
- Password hashing using bcrypt
- Token expiration and refresh mechanisms

### Data Protection
- MongoDB injection prevention
- XSS protection
- CORS configuration
- Rate limiting on sensitive endpoints

## Models

### User Model
```javascript
{
    name: String,
    email: String,
    password: String,
    role: String,
    profileImage: String
}
```

### Product Model
```javascript
{
    name: String,
    companies: [{
        name: String,
        quantity: Number,
        price: Number,
        weight: Number,
        color: String,
        image: String
    }]
}
```

### Order Model
```javascript
{
    orderId: String,
    product: String,
    quantity: Number,
    date: Date,
    status: String,
    assignedTo: ObjectId
}
```

## Testing

### Manual Testing
1. Use Postman or similar tool
2. Import the provided collection
3. Set environment variables:
   - `BASE_URL`: https://store-management-backend-9pp7.onrender.com
   - `TOKEN`: Your JWT token after login

### API Health Check
Test the server status:
```bash
curl https://store-management-backend-9pp7.onrender.com/api/test
```

Expected response:
```json
{
    "message": "API is working!"
}
```

## Deployment
The server is deployed on Render platform:
- **URL**: https://store-management-backend-9pp7.onrender.com
- **Environment**: Node.js
- **Auto-deploy**: Enabled for main branch

## Performance Considerations
- Connection pooling for MongoDB
- Efficient query optimization
- Proper indexing on frequently accessed fields
- Caching strategies for repeated requests
- Rate limiting to prevent abuse

## Monitoring and Logging
- Error logging
- Request/Response logging
- Performance metrics
- Resource utilization tracking

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## Support
For issues or questions, please create an issue in the repository or contact the development team.

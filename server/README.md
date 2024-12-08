# User Authentication API Documentation

## Overview
This API provides user authentication functionalities such as registration, login, logout, and re-login for riders and drivers. It also includes an endpoint to fetch all drivers.

## Authentication
All endpoints under the "Protected Routes" section require user authentication using JWT tokens.

## Public Endpoints

### POST /register
**Description**: Registers a new user.

**Request**:
- **Body Parameters**:
  - `name` (string, required): Name of the user.
  - `email` (string, required): Email address of the user (must be a valid email).
  - `password` (string, required): Password for the account (minimum 6 characters).
  - `role` (string, required): Role of the user (must be either 'rider' or 'driver').
  - `vehicleDetails` (object, optional): Vehicle details if the user is a driver.

**Response**:
- **201 Created**: User registered successfully.
- **400 Bad Request**: Missing required fields or invalid input.
- **401 Unauthorized**: Authentication failed.

### POST /login
**Description**: Logs in a user.

**Request**:
- **Body Parameters**:
  - `email` (string, required): Email address of the user (must be a valid email).
  - `password` (string, required): Password for the account (minimum 6 characters).
  - `role` (string, required): Role of the user (must be either 'rider' or 'driver').

**Response**:
- **200 OK**: Login successful.
- **400 Bad Request**: Missing required fields or invalid input.
- **401 Unauthorized**: Authentication failed.

### POST /allDrivers
**Description**: Retrieves all drivers.

**Request**:
- **Body Parameters**:
  - `originCoords` (object, required): Coordinates of the origin (latitude and longitude).
  - `destinationCoords` (object, required): Coordinates of the destination (latitude and longitude).

**Response**:
- **200 OK**: Drivers fetched successfully.
- **400 Bad Request**: Missing required fields.
- **404 Not Found**: No drivers found.

## Protected Endpoints (Authentication required)

### GET /logout
**Description**: Logs out the current user.

**Request**: No request parameters.

**Response**:
- **200 OK**: Logged out successfully.

### GET /relogin
**Description**: Re-authenticates the current user.

**Request**: No request parameters.

**Response**:
- **200 OK**: User is authenticated.
- **401 Unauthorized**: User is not authenticated.

## Examples

### Example Request for Registration
```http
POST /register HTTP/1.1
Host: api.yourservice.com
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "role": "driver",
  "vehicleDetails": {
    "model": "Toyota Prius",
    "year": 2020,
    "licensePlate": "XYZ1234"
  }
}

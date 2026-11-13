# URL Shortener

A full-stack URL Shortener application that converts long URLs into compact, shareable links. Built using **React.js, Spring Boot, Java, JDBC, and MySQL**.

## Overview

The URL Shortener allows users to submit long website URLs and generate shorter links. When someone visits a generated short link, the backend retrieves the original URL from the MySQL database and redirects the browser to the destination webpage.

## Features

- Convert long URLs into short, shareable links.
- Generate and store short-code mappings.
- Redirect users to the original webpage using a short code.
- Store URL information in a MySQL database.
- REST API integration between React and Spring Boot.
- JDBC-based database connectivity.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Vite, CSS |
| Backend | Java, Spring Boot |
| Database | MySQL |
| Database Connectivity | JDBC |
| Build Tool | Maven |
| API Testing | Postman |
| Version Control | Git and GitHub |

## How It Works

### 1. URL Shortening

1. User enters a long URL in the React frontend.
2. Frontend sends a POST request to the Spring Boot backend.
3. Backend generates a short code.
4. Original URL and short code are stored in MySQL.
5. Backend returns the shortened URL.

### 2. URL Redirection

1. User opens the generated short URL.
2. Browser sends a GET request containing the short code.
3. Backend searches MySQL for the matching short code.
4. Database returns the original URL.
5. Spring Boot sends an HTTP redirect response.
6. Browser opens the original webpage.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/urls` | Create a shortened URL |
| GET | `/{shortCode}` | Redirect to the original URL |

### Create Short URL

**Request:**

```http
POST /api/urls
Content-Type: application/json
```

**Request Body:**

```json
{
  "originalUrl": "https://www.example.com/products"
}
```

### Redirect to Original URL

```http
GET /{shortCode}
```

The backend retrieves the original URL using the short code and redirects the browser.

## Database Configuration

Create the MySQL database:

```sql
CREATE DATABASE url_shortener;
```

Configure the connection in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/url_shortener}
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD}
```

Set the environment variables according to your local MySQL configuration. Never commit actual database passwords or credentials to GitHub.

## Installation and Setup

### Prerequisites

- Java JDK
- Maven
- Node.js and npm
- MySQL Server
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Aksha-project/url-shortener.git
cd url-shortener
```

### 2. Configure MySQL

Create the database:

```sql
CREATE DATABASE url_shortener;
```

Configure your database environment variables:

```text
DB_URL=jdbc:mysql://localhost:3306/url_shortener
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
```

Use your own local database credentials. Keep your password private.

### 3. Run the Backend

Open a terminal:

```bash
cd backend
mvn spring-boot:run
```

Backend base URL:

```text
http://localhost:8080
```

### 4. Run the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your terminal.

## Testing

Use Postman to test:

- MySQL database connectivity.
- URL creation using `POST /api/urls`.
- Short-code storage in MySQL.
- Redirection using `GET /{shortCode}`.
- Invalid or unavailable short codes.

## Learning Outcomes

- Building REST APIs using Spring Boot.
- Connecting Java applications to MySQL using JDBC.
- Working with SQL queries and database operations.
- Integrating React frontend with a Spring Boot backend.
- Understanding HTTP requests and redirect responses.
- Managing project versions using Git and GitHub.

## Future Improvements

- User authentication and URL management.
- Custom short codes.
- URL click analytics.
- QR code generation.
- Expiration dates for shortened links.

## Author

**Aksha-project**

GitHub: [https://github.com/Aksha-project](https://github.com/Aksha-project)

---

*Developed as a practical full-stack project to understand frontend-backend integration, REST API development, JDBC connectivity, and relational database operations.*
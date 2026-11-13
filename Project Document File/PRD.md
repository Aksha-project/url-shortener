# Product Requirements Document (PRD)

## Project: URL Shortener (Backend Learning Project 1)

---

### 1. Project Overview
The **URL Shortener** is a beginner-friendly full-stack web application designed to shorten long URLs into compact, unique links and redirect visitors to the original destination. The project focuses on practical backend development fundamentals, REST API design, and direct database interaction using plain JDBC in Java with Spring Boot.

---

### 2. Project Objectives
- Provide a hands-on learning project to master backend fundamentals.
- Understand database persistence using raw JDBC without ORM abstractions.
- Implement robust input validation, HTTP status codes, and error handling.
- Prepare for entry-level backend engineering interview topics (system design basics, SQL queries, JDBC lifecycle, and RESTful architectures).

---

### 3. Target Users
- **General Web Users:** Individuals who want to quickly shorten a long URL, share it, or copy it to their clipboard.
- **Link Visitors:** Anyone accessing a generated short link who expects immediate redirection to the original target URL.
- **Developer / Interview Candidate (Self):** A learner validating backend concepts, API contracts, and database operations.

---

### 4. Technology Stack

| Layer | Technology | Details / Usage |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite) | Single-page UI with standard CSS styling |
| **Backend** | Java + Spring Boot | REST API endpoints, routing, and business logic |
| **Database** | MySQL | Relational data storage for URL mappings |
| **Database Connectivity** | Plain JDBC | Direct SQL execution using `Connection`, `PreparedStatement`, and `ResultSet` |
| **Frontend API Integration**| Axios or Fetch API | Client-side HTTP requests to backend endpoints |
| **API Testing** | Postman | Manual endpoint testing, status verification, and payload inspection |
| **UI Design** | Antigravity | Clean, minimalist, and accessible component layout |

#### Important Technical Restrictions
- **No Spring Data JPA / No Hibernate:** ORM frameworks and entity abstractions are strictly prohibited for this project.
- **Plain JDBC Only:** All persistence logic must rely on standard JDBC classes (`Connection`, `PreparedStatement`, `ResultSet`, and `DataSource` / `DriverManager`).
- **Parameterized Queries:** Use `PreparedStatement` placeholders (`?`) to prevent SQL injection vulnerabilities.
- **Resource Management:** Ensure proper closure of database resources using `try-with-resources`.
- **Keep it Simple:** Avoid overengineering; prioritize clear, readable, and maintainable code.

---

### 5. Functional Requirements

#### 5.1 Enter a Long URL
- The user can input a target long URL into a text field on the frontend.
- The frontend provides a clear "Shorten" submission button.

#### 5.2 Validate URL on the Backend
- Verify that the URL field is not blank or whitespace-only.
- Validate that the URL has a valid format and protocol (e.g., `http://` or `https://`).
- Return a `400 Bad Request` with an informative error message if validation fails.

#### 5.3 Generate a Unique Short Code
- Generate a compact alphanumeric short code (e.g., 6–8 characters using Base62 or alphanumeric characters).
- Ensure the short code is unique before saving to the database.

#### 5.4 Store in MySQL via Plain JDBC
- Store the mapping between the original long URL and the generated short code in MySQL.
- Recommended table schema (`short_urls`):
  - `id` (BIGINT, Primary Key, Auto Increment)
  - `original_url` (TEXT or VARCHAR(2048), NOT NULL)
  - `short_code` (VARCHAR(16), UNIQUE, NOT NULL)
  - `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- Execute queries using `PreparedStatement` to ensure safety against SQL injection.

#### 5.5 Return Shortened URL to Frontend
- On successful insertion, the backend returns a JSON payload containing:
  - `originalUrl`: The submitted long URL.
  - `shortCode`: The generated identifier.
  - `shortUrl`: The full redirect URL (e.g., `http://localhost:8080/{shortCode}`).
- Return appropriate HTTP status (`201 Created` or `200 OK`).

#### 5.6 Copy Shortened URL
- The frontend displays the newly generated short URL in a readable card/box.
- A "Copy" button allows the user to copy the short URL directly to their system clipboard.
- The UI provides immediate visual feedback (e.g., "Copied!").

#### 5.7 Redirect Visitors to Original URL
- When a user navigates to `GET /{shortCode}`, the backend queries the database using `PreparedStatement` and `ResultSet`.
- If the record is found, the server issues an HTTP redirect (`302 Found`) with the `Location` header set to the original URL.

#### 5.8 Error and Edge Case Handling
- **Missing or Empty Input:** Return `400 Bad Request` with message indicating URL is required.
- **Malformed URL:** Return `400 Bad Request` when protocol or syntax is invalid.
- **Unknown Short Code:** Return `404 Not Found` when a requested short code does not exist in MySQL.
- **Duplicate-Code Collision:** If a generated short code already exists in the database, the backend handles the collision gracefully (e.g., regenerates the code or retries).

---

### 6. Non-Functional Requirements
- **Simplicity and Maintainability:** Codebase organized into standard layers (Controller, Service, Repository/DAO) without unnecessary abstractions.
- **Reliability:** Graceful error handling across all layers with clean JSON error responses.
- **Resource Safety:** No database connection leaks; proper use of `try-with-resources`.
- **Performance:** Low latency for URL redirection and short code generation.
- **Usability:** Responsive, intuitive user interface with instant input validation feedback.

---

### 7. Project Scope (Initial Version - V1)
- Single-page frontend UI built with React + Vite + CSS.
- Backend REST API built with Java + Spring Boot.
- Plain JDBC Repository/DAO layer for database interactions with MySQL.
- Creation of short URLs and HTTP 302 redirection.
- Clipboard copy functionality on the frontend.
- Standard error responses for bad input and missing records.

---

### 8. Out-of-Scope Features
The following features are intentionally excluded to keep the project focused and beginner-friendly:
- User registration, login, and authentication (JWT, OAuth, Sessions).
- Analytics, click counts, geographic tracking, or referrer logging.
- Custom alias / vanity URLs (e.g., `/my-custom-link`).
- QR code generation.
- Link expiration dates and automated cleanup jobs.
- Payments or premium subscription tiers.
- Redis, distributed caching, or in-memory key-value stores.
- Docker containers, Docker Compose, or Kubernetes.
- Cloud hosting and CI/CD deployment pipelines.
- Microservices architecture.
- Spring Data JPA, Hibernate, or any ORM framework.

---

### 9. High-Level User Flow

```
[User] ──> Enters Long URL ──> Clicks "Shorten"
   │
   ▼
[React Frontend] ──> Sends POST /api/urls with long URL
   │
   ▼
[Spring Boot Backend]
   ├── 1. Validates URL format (http/https)
   ├── 2. Generates unique short code
   ├── 3. Executes JDBC INSERT via PreparedStatement
   └── 4. Returns JSON with shortUrl & shortCode
   │
   ▼
[React Frontend] ──> Displays Short URL with "Copy" button
   │
   ▼
[User] ──> Clicks "Copy" ──> URL copied to clipboard
```

#### Redirection Flow:
```
[Visitor / Browser] ──> Navigates to GET http://localhost:8080/{shortCode}
   │
   ▼
[Spring Boot Backend]
   ├── 1. Extracts shortCode from URL path
   ├── 2. Executes JDBC SELECT via PreparedStatement & ResultSet
   ├── 3. If FOUND: Returns HTTP 302 (Found) with Location: {originalUrl}
   └── 4. If NOT FOUND: Returns HTTP 404 (Not Found)
   │
   ▼
[Browser] ──> Redirects user to destination URL
```

---

### 10. Acceptance Criteria
- [ ] Submitting a valid URL generates a unique short code and stores the record in MySQL.
- [ ] Submitting an empty or malformed URL returns an HTTP 400 response with a clear error message.
- [ ] Accessing `GET /{shortCode}` redirects the visitor to the original URL via HTTP 302.
- [ ] Accessing a non-existent short code returns an HTTP 404 response.
- [ ] All database queries (INSERT, SELECT) are executed using plain JDBC (`PreparedStatement`, `ResultSet`, `Connection`).
- [ ] No Spring Data JPA or Hibernate dependencies/annotations are used in the backend.
- [ ] The frontend provides an input box, a submit button, a result display, and a functional "Copy" button.
- [ ] API endpoints can be tested and verified independently via Postman.

---

### 11. Learning Outcomes
- **Core JDBC Mastery:** Hands-on understanding of database connections, SQL query execution, mapping `ResultSet` rows to Java objects, and managing database resources safely.
- **SQL Injection Defense:** Practical application of parameterized queries using `PreparedStatement`.
- **REST API Fundamentals:** Proper use of HTTP verbs (`GET`, `POST`) and status codes (`200`, `201`, `302`, `400`, `404`, `500`).
- **Layered Architecture:** Clear separation of concerns between Controller (HTTP routing), Service (business logic), and DAO/Repository (plain JDBC persistence).
- **Full-Stack Connectivity:** Connecting a React single-page application with a Spring Boot backend via HTTP requests.
- **Interview Readiness:** Ability to explain URL shortener system design basics, database indexing on short codes, and the difference between ORMs and raw JDBC.

# Technical Requirements Document (TRD)

## Project: URL Shortener (Backend Learning Project 1)
**Source of Truth:**
- [PRD.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/PRD.md) (Product Requirements Document)
- [ARCHITECTURE.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/ARCHITECTURE.md) (System Architecture Document)
- [UI_UX.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/UI_UX.md) (UI/UX Design Specification)
- [PROJECT_RULES.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/PROJECT_RULES.md) (Project Rules & Guidelines)
- [FLOW.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/FLOW.md) (Application Flow & User Journeys)
- [TASKS.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/TASKS.md) (Implementation Checklist)

---

## 1. Technology Stack

The project uses a lightweight, decoupled full-stack architecture focused on direct backend fundamentals and database interaction without ORM abstractions.

| Component | Technology | Role & Notes |
| :--- | :--- | :--- |
| **Frontend Framework & Build** | React.js + Vite | Lightweight, fast single-page application (SPA) UI |
| **Frontend Styling** | Plain CSS | Clean, responsive, minimalist layout |
| **Frontend HTTP Client** | Axios or Fetch API | Handles client-to-backend asynchronous HTTP requests *(Recommendation: Fetch API for zero external dependencies, or Axios for convenient syntax)* |
| **Backend Language & Framework**| Java + Spring Boot (Spring Web) | RESTful API controllers, dependency injection, and request routing |
| **Database** | MySQL | Relational data persistence for URL records |
| **Database Connectivity** | Plain JDBC (`mysql-connector-j`) | Low-level SQL execution without ORM abstractions |
| **API Testing** | Postman | Verification of HTTP endpoints, headers, payloads, and status codes |

---

## 2. System Requirements

### 2.1 Software & Development Environment
- **Java Development Kit (JDK):** A standard LTS JDK installation *(Recommendation: Java 17 or Java 21 LTS)*.
- **Build Tool:** Maven or Gradle *(Recommendation: Maven via Spring Initializr for beginner simplicity)*.
- **Node.js & Package Manager:** Node.js runtime and npm *(Recommendation: Node.js 18+ or 20+ LTS)*.
- **Database Server:** MySQL Server running locally on default port `3306` with access to a dedicated database schema (e.g., `url_shortener_db`).
- **API Testing Client:** Postman desktop application or web agent.
- **Operating System:** Windows (or any cross-platform environment).
- **Code Editor / IDE:** Any Java- and React-capable IDE (e.g., IntelliJ IDEA, VS Code, or Eclipse).

*(Note: Specific tool versions can follow the developer's local installed environment; LTS releases are recommended.)*

### 2.2 Project Structure Baseline & Build Sequence
- **Verified Current Baseline:** Documentation files reside in `Project Document File/`; top-level application directories `frontend/`, `backend/`, `database/`, and `testing/` exist in root. Internal files and packages will be introduced strictly in their designated phases.
- **Canonical Build Sequence:**
  $$\text{Documentation / Planning} \longrightarrow \text{Frontend} \longrightarrow \text{Backend} \longrightarrow \text{Database Setup / Connectivity} \longrightarrow \text{API Testing} \longrightarrow \text{Frontend / Backend Integration}$$
- *(See [ARCHITECTURE.md Section 7](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/ARCHITECTURE.md#7-verified--planned-project-structure) for the complete canonical directory layout).*

---

## 3. API Specifications

**Base URL:** `http://localhost:8080`

### 3.1 Create Shortened URL
- **Endpoint:** `POST /api/urls`
- **Description:** Accepts a target long URL, validates syntax and protocol, generates a unique short code, persists the mapping in MySQL via JDBC, and returns the short URL details.
- **Headers:** `Content-Type: application/json`

#### Request Format
```json
{
  "originalUrl": "https://www.example.com/very/long/path/article"
}
```

#### Successful Response (`201 Created` or `200 OK` — *Recommendation: `201 Created`*)
- **Status:** `201 Created`
- **Body:**
```json
{
  "originalUrl": "https://www.example.com/very/long/path/article",
  "shortCode": "aB3k9Z",
  "shortUrl": "http://localhost:8080/aB3k9Z",
  "createdAt": "2026-10-16T10:45:00Z"
}
```

#### Error Responses
- **Missing or Blank URL:** `400 Bad Request`
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Original URL is required and cannot be empty."
}
```
- **Malformed URL (Invalid scheme / syntax):** `400 Bad Request`
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid URL format. URL must start with http:// or https://."
}
```
- **Database / Internal Server Failure:** `500 Internal Server Error`
```json
{
  "status": 500,
  "error": "Internal Server Error",
  "message": "An error occurred while creating the short URL. Please try again later."
}
```

---

### 3.2 Redirect to Original URL
- **Endpoint:** `GET /{shortCode}`
- **Description:** Queries the database using the provided short code and issues an HTTP 302 redirect to the original destination URL.
- **Request Parameters:** `shortCode` (Path Variable, e.g., `aB3k9Z`)

#### Successful Response (`302 Found`)
- **HTTP Status:** `302 Found`
- **Headers:**
  - `Location: https://www.example.com/very/long/path/article`
- **Body:** Empty (client/browser automatically follows the `Location` header).

#### Error Responses
- **Unknown Short Code:** `404 Not Found`
```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Short URL code not found."
}
```
- **Database / Internal Failure:** `500 Internal Server Error`
```json
{
  "status": 500,
  "error": "Internal Server Error",
  "message": "Unable to process redirection at this time."
}
```

---

## 4. Database Requirements

### 4.1 Target Engine
- **Database:** MySQL
- **Storage Engine:** InnoDB *(Recommendation: default engine for transactional reliability and foreign key/constraint support)*.

### 4.2 Proposed Table Schema: `short_urls`

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `PRIMARY KEY AUTO_INCREMENT` | Unique identifier for internal record management |
| `original_url` | `VARCHAR(2048)` | `NOT NULL` | The original target URL (supports standard maximum browser URL lengths) |
| `short_code` | `VARCHAR(16)` | `NOT NULL UNIQUE` | Unique short alphanumeric code generated for mapping |
| `created_at` | `TIMESTAMP` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | Timestamp when the short link was generated |

### 4.3 Constraints & Indexes
- **Primary Key Index:** Clustered index automatically established on `id`.
- **Unique Index on `short_code`:** `UNIQUE INDEX idx_short_code (short_code)`
  - Guarantees uniqueness at the database level.
  - Ensures $O(1)$ / fast B-Tree index lookup during high-frequency redirection operations.

*(Note: Database scripts should be executed manually or through standard migration scripts during setup; no scripts are automatically executed here.)*

---

## 5. JDBC Requirements

### 5.1 Strict Technical Boundaries
- **No Spring Data JPA / No Hibernate:** ORM frameworks and entity abstractions must not be used.
- **Plain JDBC Classes:** Use core interfaces from `java.sql.*`:
  - `javax.sql.DataSource` / `java.sql.Connection`: Connection management.
  - `java.sql.PreparedStatement`: Execution of parameterized SQL queries.
  - `java.sql.ResultSet`: Extraction and mapping of query results.

### 5.2 SQL Injection Prevention
- SQL string concatenation (`"SELECT ... WHERE short_code = '" + code + "'"` ) is strictly prohibited.
- All query parameters must be bound using positional parameters (`?`) via `PreparedStatement.setString(index, value)`.

### 5.3 Resource Management
- All JDBC resources (`Connection`, `PreparedStatement`, `ResultSet`) must be managed using Java **`try-with-resources`** blocks.
- This guarantees connections and statement handles are closed deterministically, preventing connection pool exhaustion and memory leaks.

---

## 6. Backend Layer Requirements

The backend is structured into three clean, decoupled layers to maintain single responsibility:

```
[ Client Request ]
       │
       ▼
┌──────────────────────────────────────────────┐
│ 1. Controller Layer (UrlController)          │
│    - Handles HTTP requests and routing       │
│    - Extracts parameters & request body      │
│    - Returns ResponseEntity with status code │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ 2. Service Layer (UrlService)                │
│    - Validates URL syntax and protocol       │
│    - Generates unique short code             │
│    - Handles collisions / retries            │
│    - Coordinates business rules              │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ 3. DAO / Repository Layer (UrlDao)           │
│    - Pure JDBC database operations           │
│    - Executes PreparedStatements             │
│    - Extracts ResultSet and maps to model    │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
               [ MySQL Database ]
```

### 6.1 Controller Layer (`UrlController`)
- **Responsibility:** Expose HTTP API endpoints and manage HTTP request/response lifecycles.
- Maps endpoints: `POST /api/urls` and `GET /{shortCode}`.
- Handles input parsing and delegates operations to `UrlService`.
- Returns proper `ResponseEntity` with HTTP status codes (`201`, `302`, `400`, `404`, `500`).

### 6.2 Service Layer (`UrlService`)
- **Responsibility:** Business logic and orchestration.
- Validates the incoming URL (non-empty, valid HTTP/HTTPS syntax).
- Coordinates short-code generation.
- Handles short-code collisions gracefully before confirming persistence.
- Formulates response objects with complete short URL strings (e.g., prepending `http://localhost:8080/`).

### 6.3 DAO / Repository Layer (`UrlDao` / `UrlRepository`)
- **Responsibility:** Direct data access via plain JDBC.
- Contains methods such as:
  - `save(String originalUrl, String shortCode)`: Executes `INSERT INTO short_urls ...`.
  - `findByShortCode(String shortCode)`: Executes `SELECT original_url FROM short_urls WHERE short_code = ?` and reads `ResultSet`.
- Encapsulates all SQL statements and JDBC `try-with-resources` blocks.

---

## 7. URL Validation and Short-Code Generation

### 7.1 URL Validation Rules
- **Non-Empty Validation:** Reject null, empty, or whitespace-only inputs.
- **Protocol Enforcement:** Must begin with `http://` or `https://` (case-insensitive).
- **Format Verification:** Must conform to standard URI syntax *(Recommendation: validate using `java.net.URI` or Apache Commons Validator)*.
- **Dangerous Scheme Rejection:** Strictly reject non-web schemes such as `javascript:`, `data:`, `file:`, or `ftp:`.
- **Length Check:** Reject URLs exceeding 2048 characters.

### 7.2 Short-Code Generation Strategy
- **Character Pool:** Base62 character set: `[0-9, a-z, A-Z]` (62 possible characters).
- **Length:** 6 to 8 characters *(Recommendation: 6 characters, providing $62^6 \approx 56.8 \text{ billion}$ possible combinations, keeping URLs short and collisions rare)*.
- **Generator:** Pseudorandom selection using `java.security.SecureRandom` or `java.util.Random`.

### 7.3 Duplicate Conflict Resolution
- MySQL enforces uniqueness on `short_code`.
- **Collision Strategy *(Recommendation)*:**
  - When generating a code, either check if it exists in DB, or attempt insert and catch duplicate key `SQLException`.
  - Allow a maximum of 3 to 5 regeneration attempts upon collision.
  - In the extremely unlikely event that collisions persist beyond retry limits, return an internal server error.

---

## 8. Error Handling

### 8.1 Standardized Error Payload
All JSON error responses maintain a consistent structure:
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Specific, actionable error message",
  "timestamp": "2026-10-16T10:45:00Z"
}
```

### 8.2 Error Handling Matrix

| Situation | HTTP Status | Action Taken |
| :--- | :--- | :--- |
| Empty / Missing URL | `400 Bad Request` | Return descriptive validation message |
| Unsupported protocol / Malformed URL | `400 Bad Request` | Return error indicating `http://` or `https://` required |
| Unknown `shortCode` on redirect | `404 Not Found` | Return error indicating short code does not exist |
| Database connection error / query failure | `500 Internal Server Error` | Log error internally; return sanitized generic message |

### 8.3 Security Against Information Leakage
- Never return Java stack traces, database table names, SQL queries, or vendor error codes to the client.
- Catch exceptions centrally (e.g., using `@RestControllerAdvice` or service-level handlers) and log details safely to the server console.

---

## 9. Security and Configuration

### 9.1 Externalized Configuration
- Database credentials (`spring.datasource.url`, `username`, `password`) must reside in `application.properties` or environment variables, outside committed repository files.

### 9.2 SQL Injection Mitigation
- 100% parameterization via `PreparedStatement`. Zero SQL string concatenation.

### 9.3 Open Redirect & Protocol Security
- Backend only stores and redirects to validated `http://` or `https://` URLs.
- Disallowing non-HTTP schemes prevents Cross-Site Scripting (XSS) vectors such as `javascript:` payload execution upon redirect.

### 9.4 Cross-Origin Resource Sharing (CORS)
- Because the Vite development server runs on `http://localhost:5173` while Spring Boot runs on `http://localhost:8080`, CORS must be configured on the backend *(Recommendation: `@CrossOrigin(origins = "http://localhost:5173")` or a global `WebMvcConfigurer`)*.

---

## 10. Testing Requirements

### 10.1 Postman API Testing
1. **Valid URL Creation:**
   - `POST /api/urls` with `{ "originalUrl": "https://google.com" }`.
   - Verify HTTP `201 Created` (or `200 OK`) and response fields (`shortUrl`, `shortCode`, `originalUrl`).
2. **Invalid URL Creation:**
   - `POST /api/urls` with `{ "originalUrl": "" }` -> Verify `400 Bad Request`.
   - `POST /api/urls` with `{ "originalUrl": "invalid-url-string" }` -> Verify `400 Bad Request`.
   - `POST /api/urls` with `{ "originalUrl": "ftp://ftp.example.com" }` -> Verify `400 Bad Request`.
3. **Redirection Verification:**
   - In Postman (with "Follow Redirects" disabled in request settings):
     - `GET /{validShortCode}` -> Verify `302 Found` and check `Location` header.
   - `GET /{nonExistentCode}` -> Verify `404 Not Found`.

### 10.2 Database Verification (Direct MySQL Queries)
- Use MySQL CLI or workbench tools to execute verification queries:
  - `SELECT * FROM short_urls;`: Verify stored long URLs and short codes match API responses.
  - Verify `created_at` timestamp population.
  - Test `UNIQUE` constraint enforcement by attempting duplicate insert of `short_code`.

### 10.3 Failure Mode Testing
- Temporarily stop the local MySQL service and trigger `POST /api/urls`.
- Verify the backend handles the connection outage gracefully, returning `500 Internal Server Error` without exposing stack traces to the caller.

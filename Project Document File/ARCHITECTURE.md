# Architecture Document (ARCHITECTURE.md)

## Project: URL Shortener (Backend Learning Project 1)
**Foundational References:**
- [PRD.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/PRD.md) (Product Requirements Document)
- [TRD.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/TRD.md) (Technical Requirements Document)
- [UI_UX.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/UI_UX.md) (UI/UX Design Specification)
- [PROJECT_RULES.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/PROJECT_RULES.md) (Project Rules & Guidelines)
- [FLOW.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/FLOW.md) (Application Flow & User Journeys)
- [TASKS.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/TASKS.md) (Implementation Checklist)

---

## 1. Architecture Overview

This project is built using a decoupled, client-server architecture designed specifically for educational clarity and backend skill development. It demonstrates how a modern single-page frontend communicates with a RESTful backend service, and how the backend manages data persistence directly using plain JDBC without the abstraction of an Object-Relational Mapping (ORM) framework.

### Major Components and Their Responsibilities

| Component | Layer / Technology | Core Responsibility |
| :--- | :--- | :--- |
| **Frontend UI** | React.js + Vite + CSS | Renders the web interface, captures the user's long URL, manages visual states (idle, loading, success, error), and calls the backend API. |
| **Backend Application** | Java + Spring Boot | Serves as the application host, provides dependency injection, manages configuration, and exposes RESTful HTTP endpoints. |
| **Controller Layer** | Spring Web (`UrlController`) | Entry point for HTTP requests. Parses request payloads and URL paths, delegates execution to the service layer, and packages responses with appropriate HTTP status codes. |
| **Service Layer** | Business Logic (`UrlService`) | Validates URL syntax and protocols, generates unique short codes, coordinates duplicate conflict resolution, and directs database operations. |
| **DAO / Repository Layer**| Data Access (`UrlDao`) | Directly interacts with MySQL using plain JDBC (`Connection`, `PreparedStatement`, `ResultSet`). Translates Java data to SQL statements and SQL results back to Java objects. |
| **Database** | MySQL Server | Persists URL mapping records in the `short_urls` table and enforces short-code uniqueness via a unique B-Tree index. |

---

## 2. High-Level Architecture Diagram

### 2.1 URL Creation Flow (End-to-End Request & Response)

```
[ User Browser / React UI ]
            │
            │  1. HTTP POST /api/urls { "originalUrl": "https://..." }
            ▼
┌────────────────────────────────────────────────────────┐
│ Spring Boot Backend                                    │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Controller Layer (UrlController)                 │  │
│  │ - Receives POST request                          │  │
│  │ - Deserializes JSON payload                      │  │
│  └────────────────────────┬─────────────────────────┘  │
│                           │                            │
│                           │ 2. Call service method     │
│                           ▼                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Service Layer (UrlService)                       │  │
│  │ - Validates URL (http/https format)              │  │
│  │ - Generates unique 6-character short code        │  │
│  └────────────────────────┬─────────────────────────┘  │
│                           │                            │
│                           │ 3. Call DAO insert method  │
│                           ▼                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │ DAO / Repository Layer (UrlDao)                  │  │
│  │ - Obtains JDBC Connection                        │  │
│  │ - Constructs PreparedStatement with parameters   │  │
│  │ - Executes SQL INSERT statement                  │  │
│  └────────────────────────┬─────────────────────────┘  │
└───────────────────────────┼────────────────────────────┘
                            │
                            │ 4. SQL INSERT INTO short_urls ...
                            ▼
               ┌────────────────────────┐
               │     MySQL Database     │
               │ (Table: short_urls)    │
               │ - Saves row & verifies │
               │   uniqueness           │
               └────────────┬───────────┘
                            │
                            │ 5. Rows affected / Success
                            ▼
┌────────────────────────────────────────────────────────┐
│ DAO: Maps result ──> Service: Builds URL DTO           │
│ ──> Controller: Wraps in ResponseEntity                │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ 6. HTTP 201 Created { "shortUrl": "...", "shortCode": "..." }
                            ▼
[ User Browser / React UI ]
- Receives JSON response
- Displays shortened URL card
- Enables "Copy to Clipboard" button
```

---

### 2.2 URL Redirection Flow

```
[ Visitor / Web Browser ]
            │
            │  1. HTTP GET http://localhost:8080/{shortCode}
            ▼
┌────────────────────────────────────────────────────────┐
│ Spring Boot Backend                                    │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Controller Layer (UrlController)                 │  │
│  │ - Captures {shortCode} path variable             │  │
│  └────────────────────────┬─────────────────────────┘  │
│                           │                            │
│                           │ 2. Request lookup by code  │
│                           ▼                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Service Layer (UrlService)                       │  │
│  │ - Coordinates lookup logic                       │  │
│  └────────────────────────┬─────────────────────────┘  │
│                           │                            │
│                           │ 3. Execute query           │
│                           ▼                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │ DAO / Repository Layer (UrlDao)                  │  │
│  │ - Executes: SELECT original_url FROM short_urls  │  │
│  │             WHERE short_code = ?                 │  │
│  │ - Reads ResultSet using try-with-resources       │  │
│  └────────────────────────┬─────────────────────────┘  │
└───────────────────────────┼────────────────────────────┘
                            │
                            │ 4. Parameterized query
                            ▼
               ┌────────────────────────┐
               │     MySQL Database     │
               │ - Index lookup on      │
               │   short_code           │
               └────────────┬───────────┘
                            │
                            │ 5. Returns record (or empty)
                            ▼
┌────────────────────────────────────────────────────────┐
│ Decision Point:                                        │
│                                                        │
│ [Record Found]                                         │
│ Controller returns:                                    │
│ HTTP 302 Found                                         │
│ Location: https://original-destination.com             │
│                                                        │
│ [Record NOT Found]                                     │
│ Controller returns:                                    │
│ HTTP 404 Not Found                                     │
│ Body: { "status": 404, "message": "Code not found" }   │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ 6. HTTP Response
                            ▼
[ Visitor / Web Browser ]
- If 302: Browser automatically follows Location header to destination URL.
- If 404: Browser displays error message indicating the short code does not exist.
```

---

## 3. Frontend Architecture

The frontend is a single-page application (SPA) built using **React.js** and bundled with **Vite**.

### 3.1 Page Layout & Components
- **Header:** Title, subtitle, and brief usage instructions.
- **URL Input Section:** Form containing a text input field for the long URL, client-side validation hints, and a "Shorten URL" submit button.
- **Feedback & Result Card:**
  - Displays the shortened URL upon successful creation.
  - Features an integrated "Copy" button that interacts with the browser's Clipboard API (`navigator.clipboard.writeText`) and shows immediate visual feedback (e.g., "Copied!").
  - Displays clear, user-friendly error banners if an invalid URL is entered or if the server reports an error.

### 3.2 State Management
The UI transitions through four distinct states managed via React component state (`useState`):
1. **Idle State:** Default state waiting for user interaction. Input field is empty or editable.
2. **Loading State:** Triggered when the user submits a URL. The submit button is disabled and shows a spinner/loading indicator to prevent duplicate submissions.
3. **Success State:** Triggered upon receiving a valid response. Renders the shortened link result card and enables the copy action.
4. **Error State:** Triggered if client-side validation fails or if the backend returns a `4xx` or `5xx` response. Displays a dismissible error message.

### 3.3 Backend API Integration
- The frontend initiates an asynchronous HTTP `POST` request to `/api/urls` using either the native browser **Fetch API** or **Axios**.
- The request payload is sent as JSON: `{ "originalUrl": "..." }`.
- Response headers and status codes are checked:
  - If `201 Created` (or `200 OK`): Parses the JSON response body and updates state to Success.
  - If `400 Bad Request` or `500 Server Error`: Parses the error message from the response body and displays it in the Error state.

### 3.4 Mock API Strategy for Early Development *(Proposed Recommendation)*
Before the Spring Boot backend is fully connected, the frontend can be developed and tested independently using a lightweight mock API module:
- A mock service function simulates network latency using `setTimeout` (e.g., 500ms delay).
- It validates the input URL format locally and returns a mock response matching the backend contract:
  ```json
  {
    "originalUrl": "https://example.com/long/path",
    "shortCode": "mock12",
    "shortUrl": "http://localhost:8080/mock12",
    "createdAt": "2026-10-21T18:00:00Z"
  }
  ```
- This allows full verification of UI states (loading, success, copy button, error alerts) before connecting to the live backend.

---

## 4. Backend Layer Responsibilities

The backend follows a classic 3-tier enterprise architecture. Each layer has strict, isolated boundaries:

### 4.1 Controller Layer (`UrlController`)
- **HTTP Endpoint Mapping:** Maps incoming HTTP requests (`POST /api/urls` and `GET /{shortCode}`) using Spring MVC annotations (`@RestController`, `@PostMapping`, `@GetMapping`, `@PathVariable`, `@RequestBody`).
- **Request Parsing:** Validates that incoming request bodies are structurally sound.
- **Delegation:** Calls the appropriate business methods in `UrlService`.
- **Response Construction:** Wraps data inside `ResponseEntity` with explicit HTTP status codes (`201 Created`, `302 Found`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`).
- **Redirection Header:** For `GET /{shortCode}`, constructs an HTTP 302 redirect response with the `Location` header set to the destination URL.

### 4.2 Service Layer (`UrlService`)
- **Business Logic & Coordination:** Orchestrates the core URL shortening and lookup workflow.
- **URL Validation:** Verifies that the original URL is non-empty, uses an accepted web scheme (`http://` or `https://`), and conforms to standard URL/URI syntax.
- **Short-Code Generation:** Generates a randomized 6-character Base62 string (`[0-9, a-z, A-Z]`).
- **Collision Resolution:** In the event of a short-code collision in the database, manages retry logic (generating a new short code and attempting persistence up to a defined limit).
- **Domain Object Assembly:** Prepares the response object containing the complete shortened URL (combining server host base URL with the generated short code).

### 4.3 DAO / Repository Layer (`UrlDao` / `UrlRepository`)
- **Direct Database Access:** Exclusively handles all SQL interactions using **Plain JDBC**.
- **No ORM:** Strictly prohibits Spring Data JPA, Hibernate, or entity managers.
- **Core Operations:**
  - `save(String originalUrl, String shortCode)`: Executes a parameterized `INSERT` query using `PreparedStatement`.
  - `findByShortCode(String shortCode)`: Executes a parameterized `SELECT` query, reads the `ResultSet`, and extracts the `original_url`.
- **Resource Safety:** Wraps every `Connection`, `PreparedStatement`, and `ResultSet` in Java `try-with-resources` blocks to ensure deterministic closure and prevent connection pool exhaustion.
- **Security:** Guarantees 100% parameter binding to protect against SQL injection.

### 4.4 MySQL Database Layer
- **Persistent Storage:** Stores URL mappings reliably on disk in the `short_urls` table.
- **Uniqueness Guarantee:** Enforces unique constraint on `short_code` via a database index.
- **Data Integrity:** Rejects invalid lengths or null values according to column definitions.

---

## 5. URL Creation Request Flow

### Detailed Step-by-Step Sequence

1. **User Action:** The user enters a target long URL into the React input field and clicks the "Shorten URL" button.
2. **Frontend Dispatch:** React triggers an asynchronous `POST` request to `http://localhost:8080/api/urls` with JSON payload `{"originalUrl": "https://example.com"}`. React sets UI state to `Loading`.
3. **Controller Receipt:** Spring Boot's `UrlController` receives the request, extracts the `originalUrl` from the request body, and calls `urlService.createShortUrl(originalUrl)`.
4. **Validation & Code Generation:**
   - `UrlService` validates that the URL is not empty and begins with `http://` or `https://`. (If invalid, throws a validation exception resulting in HTTP 400).
   - `UrlService` generates a random 6-character alphanumeric code (e.g., `aB3k9Z`).
5. **JDBC Persistence:**
   - `UrlService` passes the URL and short code to `urlDao.save(originalUrl, shortCode)`.
   - `UrlDao` opens a connection from the `DataSource` using `try-with-resources`.
   - `UrlDao` creates a `PreparedStatement` with SQL:
     ```sql
     INSERT INTO short_urls (original_url, short_code) VALUES (?, ?)
     ```
   - Sets parameters via `preparedStatement.setString(1, originalUrl)` and `preparedStatement.setString(2, shortCode)`.
6. **Database Execution:** MySQL executes the statement, inserts the row, and returns the generated key/row count.
7. **Response Serialization:**
   - `UrlService` constructs the response payload containing `originalUrl`, `shortCode`, and the full `shortUrl` (`http://localhost:8080/aB3k9Z`).
   - `UrlController` returns `ResponseEntity.status(HttpStatus.CREATED).body(response)`.
8. **Frontend Rendering:** React receives HTTP 201, updates its state to `Success`, displays the result card, and enables the user to copy the short link.

---

## 6. URL Redirection Request Flow

### Detailed Step-by-Step Sequence

1. **Visitor Navigation:** A visitor clicks or enters a shortened URL in their browser (e.g., `http://localhost:8080/aB3k9Z`).
2. **Browser Request:** The browser issues an HTTP `GET /aB3k9Z` request to the Spring Boot server.
3. **Controller Handling:** `UrlController` matches the path variable `shortCode = "aB3k9Z"` and calls `urlService.getOriginalUrl(shortCode)`.
4. **Service Delegation:** `UrlService` delegates to `urlDao.findByShortCode(shortCode)`.
5. **JDBC Query Execution:**
   - `UrlDao` acquires a connection and creates a `PreparedStatement` using `try-with-resources`:
     ```sql
     SELECT original_url FROM short_urls WHERE short_code = ?
     ```
   - Sets parameter: `preparedStatement.setString(1, shortCode)`.
   - Executes query and iterates over the `ResultSet`.
6. **Database Lookup:** MySQL uses the unique index on `short_code` to perform a fast index seek and returns the matching row.
7. **Resolution & Response:**
   - **Case A: Short Code Exists:**
     - The DAO extracts `original_url` from the `ResultSet` and returns it to the Service.
     - The Controller constructs an HTTP redirect response:
       - Status: `302 Found`
       - Header: `Location: https://example.com/very/long/url`
     - The browser receives HTTP 302 and automatically redirects the visitor to the original URL.
   - **Case B: Short Code Does Not Exist:**
     - The `ResultSet` is empty. The DAO returns an empty `Optional` (or `null`).
     - The Service identifies the missing code and notifies the Controller (via an exception or empty result).
     - The Controller returns an HTTP `404 Not Found` response with a JSON payload:
       ```json
       {
         "status": 404,
         "error": "Not Found",
         "message": "Short URL code not found."
       }
       ```
     - The browser or user receives a clear 404 notification rather than hanging or encountering a server crash.

---

## 7. Verified & Planned Project Structure

### 7.1 Verified Current Workspace Baseline (Existing Files & Directories)
The current project workspace contains the verified documentation files inside `Project Document File/` alongside the top-level application directories:

```
URL Shortner/ (Project Root)
├── Project Document File/
│   ├── PRD.md                         # [Verified: Present] Product Requirements Document
│   ├── TRD.md                         # [Verified: Present] Technical Requirements Document
│   ├── ARCHITECTURE.md                # [Verified: Present] System Architecture Document (this file)
│   ├── UI_UX.md                       # [Verified: Present] UI/UX Design Specification
│   ├── PROJECT_RULES.md               # [Verified: Present] Project Rules & Development Guidelines
│   ├── FLOW.md                        # [Verified: Present] Application Flow & User Journeys
│   └── TASKS.md                       # [Verified: Present] Phased Implementation Checklist & Tasks
├── frontend/                          # [Verified: Directory created] React + Vite application
├── backend/                           # [Verified: Directory created] Spring Boot application
├── database/                          # [Verified: Directory created] Database scripts
└── testing/                           # [Verified: Directory created] API testing & Postman collections
```

---

### 7.2 Agreed Development Sequence
All future development must follow this strict dependency sequence:
$$\text{Documentation / Planning} \longrightarrow \text{Frontend} \longrightarrow \text{Backend} \longrightarrow \text{Database Setup / Connectivity} \longrightarrow \text{API Testing} \longrightarrow \text{Frontend / Backend Integration}$$

---

### 7.3 Planned Project Structure (Organized by Development Sequence)

Below is the complete target file tree. All components not present in the verified baseline above are labeled as **Planned — not yet present**:

#### 1. Project Root and Documentation *(Status: Verified Present)*
- `PRD.md`: Core requirements, user flows, and project scope.
- `TRD.md`: API specifications, plain JDBC rules, and MySQL schema.
- `ARCHITECTURE.md`: 3-tier layering, request flow, and directory layout.
- `UI_UX.md`: Practical, human-designed UI guidelines and state transitions.
- `PROJECT_RULES.md`: Explicit development constraints and safety rules.
- `FLOW.md`: Step-by-step user journeys and Mermaid sequence diagrams.
- `TASKS.md`: Granular, phased checklist with completion criteria.

#### 2. Frontend — React + Vite + CSS *(Status: Planned — not yet present)*
```
frontend/                              # [Planned — not yet present] React SPA
├── index.html                         # [Planned — not yet present] HTML entry point
├── package.json                       # [Planned — not yet present] Dependencies & scripts
├── vite.config.js                     # [Planned — not yet present] Vite build configuration
└── src/
    ├── main.jsx                       # [Planned — not yet present] React DOM bootstrap
    ├── App.jsx                        # [Planned — not yet present] Root component & state orchestrator
    ├── App.css                        # [Planned — not yet present] Component-level styles
    ├── index.css                      # [Planned — not yet present] Base styles & color system
    ├── api/
    │   ├── mockUrlApi.js              # [Planned — not yet present] Mock service for initial UI testing
    │   └── urlApi.js                  # [Planned — not yet present] Live backend HTTP client (Fetch/Axios)
    └── components/
        ├── UrlForm.jsx                # [Planned — not yet present] Input field & "Shorten URL" button
        ├── ResultCard.jsx             # [Planned — not yet present] Result link display & "Copy" button
        └── ErrorAlert.jsx             # [Planned — not yet present] Accessible inline error alert banner
```

#### 3. Backend — Java + Spring Boot *(Status: Planned — not yet present)*
```
backend/                               # [Planned — not yet present] Spring Boot application
├── pom.xml                            # [Planned — not yet present] Maven configuration (Spring Web, mysql-connector-j)
└── src/
    └── main/
        ├── java/com/example/urlshortener/
        │   ├── UrlShortenerApplication.java   # [Planned — not yet present] Application entry point
        │   ├── controller/
        │   │   └── UrlController.java         # [Planned — not yet present] REST endpoints & HTTP 302 redirects
        │   ├── service/
        │   │   └── UrlService.java            # [Planned — not yet present] Validation, Base62 generator, retry logic
        │   ├── dao/
        │   │   └── UrlDao.java                # [Planned — not yet present] Plain JDBC data access (no ORM)
        │   ├── model/
        │   │   ├── UrlRequest.java            # [Planned — not yet present] Request DTO (originalUrl)
        │   │   ├── UrlResponse.java           # [Planned — not yet present] Response DTO (shortUrl, shortCode, etc.)
        │   │   └── ShortUrl.java              # [Planned — not yet present] Internal entity mapping table columns
        │   └── config/
        │       ├── DatabaseConfig.java        # [Planned — not yet present] Optional DataSource/Connection helper
        │       └── WebConfig.java             # [Planned — not yet present] CORS configuration for localhost:5173
        └── resources/
            └── application.properties         # [Planned — not yet present] Database connection properties
```

#### 4. Database — MySQL *(Status: Planned — executed directly on MySQL server)*
- **Database Engine:** MySQL Server (running locally on port `3306`).
- **Database Name:** `url_shortener_db`.
- **Target Table:** `short_urls` (`id`, `original_url`, `short_code`, `created_at`).
- **SQL Scripts:** No SQL scripts currently reside in the repository; table creation SQL is documented in [TRD.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/TRD.md) and will be executed directly via MySQL CLI/Workbench. *(Optional schema file `backend/src/main/resources/schema.sql`: Planned — not yet present).*

#### 5. Testing and Integration *(Status: Planned — not yet present)*
```
postman/                               # [Planned — not yet present] API test collection
└── URL_Shortener_API.postman_collection.json # [Planned — not yet present] Exported Postman test suite
```

---

## 8. Configuration and Integration

### 8.1 Frontend-to-Backend Communication
- **API Base URL:** The frontend needs to know where the backend server resides. This is stored in a centralized configuration constant or Vite environment variable (e.g., `VITE_API_BASE_URL = "http://localhost:8080"`).
- **Decoupled Ports & CORS:**
  - During local development, the React frontend runs on its Vite development server (typically port `5173`).
  - The Spring Boot backend runs on its embedded web server (default port `8080`).
  - Because requests cross port boundaries (`localhost:5173` to `localhost:8080`), browser security requires Cross-Origin Resource Sharing (CORS) to be explicitly permitted by the backend.
  - The Spring Boot backend configures CORS (via `@CrossOrigin` or `WebMvcConfigurer`) to allow `POST` requests originating from the frontend development port.

### 8.2 Database Configuration & Credential Safety
- **Spring Boot Connection Properties:** Configured in `backend/src/main/resources/application.properties`:
  ```properties
  spring.datasource.url=jdbc:mysql://localhost:3306/url_shortener_db?useSSL=false&serverTimezone=UTC
  spring.datasource.username=${DB_USERNAME:root}
  spring.datasource.password=${DB_PASSWORD:}
  spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
  ```
- **Credential Protection:**
  - Database passwords and sensitive credentials must **never** be hardcoded in committed Java files or committed version control.
  - Use environment variables (`DB_USERNAME`, `DB_PASSWORD`) or an uncommitted local properties file included in `.gitignore`.

---

## 9. Architecture Decisions and Scope

### 9.1 Summary of Key Decisions

| Decision | Selection | Rationale | Status |
| :--- | :--- | :--- | :--- |
| **Architectural Pattern** | 3-Tier Layered (Controller → Service → DAO) | Clean separation of concerns; easy for beginners to trace request flow. | Approved / Documented |
| **Data Access Strategy** | Plain JDBC (`PreparedStatement`, `ResultSet`) | Master fundamental database concepts, SQL writing, and connection management without ORM hiding mechanics. | Approved / Documented |
| **Database** | MySQL | Reliable relational database with native support for unique indexing and auto-increment keys. | Approved / Documented |
| **API Protocol** | RESTful HTTP (JSON payloads & standard redirects) | Standardized, easy to test via Postman, aligns with industry practices. | Approved / Documented |
| **Short-Code Strategy** | 6-Character Base62 (`[0-9, a-z, A-Z]`) | Yields ~56.8 billion combinations; maintains compact URLs with low collision probability. | Proposed Recommendation |
| **Frontend Mock Service** | Modular mock API helper | Enables independent frontend development and testing before backend readiness. | Proposed Recommendation |

### 9.2 Scope Restrictions (What Is Excluded)
To keep this project educational, beginner-friendly, and focused on core backend essentials, the following technologies and features are strictly excluded from the initial version:
- **No ORM Frameworks:** No Spring Data JPA, Hibernate, or MyBatis.
- **No Authentication or Authorization:** No user login, registration, JWT, or sessions.
- **No Advanced Caching or In-Memory Stores:** No Redis or Memcached.
- **No Microservices or Message Brokers:** Single monolithic Spring Boot application; no Kafka or RabbitMQ.
- **No Containerization or Cloud Ops:** No Docker, Docker Compose, Kubernetes, or cloud deployment pipelines.
- **No Complex Analytics:** No click counters, geographical tracking, or referrer logging.
- **No QR Code Generation or Custom Vanity URLs:** Purely standard automated short-code generation.

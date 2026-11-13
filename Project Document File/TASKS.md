# Implementation Checklist & Tasks (TASKS.md)

## Project: URL Shortener (Backend Learning Project 1)

**Source of Truth Documents:**
- [PRD.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/PRD.md) — Product requirements, scope boundaries, and acceptance criteria
- [TRD.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/TRD.md) — Technical specifications, API payloads, and database schema
- [ARCHITECTURE.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/ARCHITECTURE.md) — System layers, request lifecycles, and directory layout
- [UI_UX.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/UI_UX.md) — Visual styling, layout, component specs, and interaction states
- [PROJECT_RULES.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/PROJECT_RULES.md) — Development constraints, plain JDBC enforcement, and testing rules
- [FLOW.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/FLOW.md) — Step-by-step user journeys and system sequence diagrams

---

## Roadmap Overview

```
Phase 1: Review & Prepare (Documentation & Baseline Verification)
   └── Phase 2: Frontend with Mock Behavior (React + Vite)
          └── Phase 3: Spring Boot Backend Foundations
                 └── Phase 4: MySQL Database Setup & JDBC Connectivity
                        └── Phase 5: Incremental Backend Implementation (Plain JDBC)
                               └── Phase 6: Postman API Testing
                                      └── Phase 7: Frontend / Backend Integration
                                             └── Phase 8: Final Review & Acceptance
```

$$\text{Documentation / Planning} \longrightarrow \text{Frontend} \longrightarrow \text{Backend} \longrightarrow \text{Database Setup / Connectivity} \longrightarrow \text{API Testing} \longrightarrow \text{Frontend / Backend Integration}$$

---

## Phase 1 — Review and Prepare

- [ ] **Task 1.1: Verify Specification Consistency**
  - **Description:** Review all 7 foundational documents (`PRD.md`, `TRD.md`, `ARCHITECTURE.md`, `UI_UX.md`, `PROJECT_RULES.md`, `FLOW.md`, `TASKS.md`) to ensure alignment on API endpoints, JDBC constraints, and UI design rules.
  - **Measurable Completion:** All documents are verified with zero contradictory requirements.

- [ ] **Task 1.2: Inspect Workspace Baseline**
  - **Description:** Inspect the current project root to establish what files and folders already exist and confirm that no application source code has been introduced prematurely.
  - **Measurable Completion:** Directory baseline is recorded: documentation files reside in `Project Document File/`; top-level directories `frontend/`, `backend/`, `database/`, and `testing/` exist in root; internal application source files are verified as **Planned — not yet present**.

- [ ] **Task 1.3: Confirm Local Environment Tools** `[User Task: Environment]`
  - **Description:** Confirm local installation of required tools: Node.js & npm (v18+ or v20+), Java JDK (17 or 21 LTS), MySQL Server (running on localhost:3306), and Postman.
  - **Measurable Completion:** Running `node -v`, `npm -v`, `java -version`, and connecting to MySQL via CLI or Workbench succeeds.

---

## Phase 2 — Frontend with Mock Behavior

*Goal: Build a fully functional, responsive React interface adhering to `UI_UX.md`, using an isolated mock service to test all UI states before starting backend development.*

- [ ] **Task 2.1: Initialize React + Vite Project** `[User Task: Setup]`
  - **Description:** Create the frontend application inside a `frontend/` directory using Vite (`npm create vite@latest frontend -- --template react`).
  - **Measurable Completion:** Project initializes cleanly and `npm run dev` displays the default Vite starter page at `http://localhost:5173`.

- [ ] **Task 2.2: Establish Design System & Base CSS** `[User Task: Coding]`
  - **Description:** Configure global styles in `frontend/src/App.css` and `index.css` following `UI_UX.md`: off-white body background (`#F9FAFB`), deep charcoal primary text (`#111827`), system font stack, and centered card layout (max-width `560px`).
  - **Measurable Completion:** Browser renders a centered white card against an off-white background with no custom decorative gradients or non-standard fonts.

- [ ] **Task 2.3: Build Header and URL Input Form** `[User Task: Coding]`
  - **Description:** Create `UrlForm.jsx` containing the title ("URL Shortener"), subtitle, a text input field with placeholder `https://example.com/long-page-address`, and a rectangular "Shorten URL" submit button (`6px` border radius).
  - **Measurable Completion:** Input accepts typed text; button is styled in muted blue (`#2563EB`) with modest rounding (strictly no pill buttons).

- [ ] **Task 2.4: Implement Mock API Service** `[User Task: Coding]`
  - **Description:** Create `frontend/src/api/mockUrlApi.js` with a function simulating a network delay (400ms) that validates URL prefix and returns a realistic mock payload: `{ originalUrl, shortCode: "xyz789", shortUrl: "http://localhost:8080/xyz789", createdAt: "..." }`.
  - **Measurable Completion:** Calling the mock service returns a resolved Promise with mock data on valid URLs, or rejects with an error message on invalid input.

- [ ] **Task 2.5: Implement UI State Transitions in App.jsx** `[User Task: Coding]`
  - **Description:** Manage state in `App.jsx` for `Idle`, `Loading`, `Success`, and `Error`. When the form is submitted, disable the input and change button text to `"Shortening..."` during the simulated delay.
  - **Measurable Completion:** Submitting the form visually disables the input and displays the loading state before transitioning to success or error.

- [ ] **Task 2.6: Build Result Display Card & Copy Button** `[User Task: Coding]`
  - **Description:** Create `ResultCard.jsx` to render the shortened URL as a clickable link and a rectangular "Copy" button. Integrate `navigator.clipboard.writeText` to copy the URL and display `"Copied!"` in green for 2 seconds.
  - **Measurable Completion:** Clicking "Copy" places the short URL onto the system clipboard and toggles button text to "Copied!" for 2 seconds.

- [ ] **Task 2.7: Build Error Alert Component** `[User Task: Coding]`
  - **Description:** Create `ErrorAlert.jsx` to display an inline soft red banner (`#FEF2F2` background, `#991B1B` text) when client validation fails or when the mock service reports an error.
  - **Measurable Completion:** Entering an empty string or invalid URL displays the inline error alert below the input while preserving user text.

- [ ] **Task 2.8: Responsive & Accessibility Audit** `[User Task: Testing]`
  - **Description:** Test layout at mobile (<640px) and desktop ($\ge$640px) viewports; verify keyboard navigation (`Tab` and `Enter` to submit) and visible focus rings.
  - **Measurable Completion:** Input and button stack vertically on mobile with 44px+ touch targets; desktop aligns inline; full keyboard navigation works without mouse.

---

## Phase 3 — Spring Boot Backend Foundations

*Goal: Initialize a clean Spring Boot project, establish the package architecture, and configure runtime dependencies.*

- [ ] **Task 3.1: Initialize Spring Boot Project** `[User Task: Setup]`
  - **Description:** Create the backend inside `backend/` using Spring Initializr (Maven, Java 17/21, Spring Boot 3.x, dependency: **Spring Web**). *Do not include Spring Data JPA.*
  - **Measurable Completion:** Project builds successfully with `mvn clean compile` inside `backend/`.

- [ ] **Task 3.2: Add MySQL JDBC Driver Dependency** `[User Task: Setup]`
  - **Description:** Add `mysql-connector-j` to `backend/pom.xml`. Ensure no ORM, Hibernate, or JPA dependencies are present.
  - **Measurable Completion:** `pom.xml` contains `mysql-connector-j` runtime dependency; `mvn dependency:tree` confirms zero JPA/Hibernate libraries.

- [ ] **Task 3.3: Establish Package Hierarchy** `[User Task: Setup]`
  - **Description:** Set up package hierarchy under `com.example.urlshortener`:
    - `controller/`
    - `service/`
    - `dao/`
    - `model/`
    - `config/`
  - **Measurable Completion:** Package directories exist cleanly as documented in `ARCHITECTURE.md`.

---

## Phase 4 — MySQL Database Setup & JDBC Connectivity

*Goal: Configure the relational database, table `short_urls`, and establish verified JDBC connectivity from Spring Boot.*

- [ ] **Task 4.1: Create Dedicated Database Schema** `[User Task: Database]`
  - **Description:** Access local MySQL Server via CLI or GUI tool and create database `url_shortener_db` using UTF-8 encoding.
  - **Measurable Completion:** `SHOW DATABASES;` displays `url_shortener_db`.

- [ ] **Task 4.2: Create Table `short_urls`** `[User Task: Database]`
  - **Description:** Execute table creation SQL per `TRD.md`:
    - `id BIGINT PRIMARY KEY AUTO_INCREMENT`
    - `original_url VARCHAR(2048) NOT NULL`
    - `short_code VARCHAR(16) NOT NULL UNIQUE`
    - `created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP`
  - **Measurable Completion:** `DESCRIBE short_urls;` displays the 4 expected columns with correct types.

- [ ] **Task 4.3: Verify Unique Constraint & Index** `[User Task: Database]`
  - **Description:** Verify that a unique index exists on `short_code` using `SHOW INDEX FROM short_urls;`.
  - **Measurable Completion:** Index `idx_short_code` or unique constraint on `short_code` is confirmed.

- [ ] **Task 4.4: Configure Database Connection Properties** `[User Task: Configuration]`
  - **Description:** Configure `backend/src/main/resources/application.properties` with DataSource settings using environment variable fallbacks:
    - `spring.datasource.url=jdbc:mysql://localhost:3306/url_shortener_db`
    - `spring.datasource.username=${DB_USERNAME:root}`
    - `spring.datasource.password=${DB_PASSWORD:}`
    - `spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver`
  - **Measurable Completion:** Configuration contains no hardcoded sensitive production passwords.

- [ ] **Task 4.5: Verify Application Startup & JDBC DataSource** `[User Task: Testing]`
  - **Description:** Run `UrlShortenerApplication` and check console logs to confirm Spring Boot starts on port `8080` and acquires a valid database connection pool handle without errors.
  - **Measurable Completion:** Application log outputs `Started UrlShortenerApplication in ... seconds` with zero SQL connection errors.

---

## Phase 5 — Incremental Backend Implementation (Plain JDBC)

*Goal: Build the backend piece-by-piece, ensuring each layer has a single responsibility and plain JDBC is used exclusively.*

- [ ] **Task 5.1: Create Data Models and DTOs** `[User Task: Coding]`
  - **Description:** In `model/`, create:
    - `UrlRequest.java`: DTO containing `String originalUrl` with getters/setters.
    - `UrlResponse.java`: DTO containing `originalUrl`, `shortCode`, `shortUrl`, and `createdAt`.
    - `ShortUrl.java`: Internal domain model matching table columns (`id`, `originalUrl`, `shortCode`, `createdAt`).
  - **Measurable Completion:** Classes compile with proper constructors and accessors.

- [ ] **Task 5.2: Implement Backend URL Validator in Service Layer** `[User Task: Coding]`
  - **Description:** In `service/UrlService.java`, create a validation method `boolean isValidUrl(String url)` that checks: not null/blank, length $\le 2048$, begins with `http://` or `https://` (case-insensitive), and passes URI syntax parsing.
  - **Measurable Completion:** Unit/smoke test confirms `"https://example.com"` returns `true`; `""`, `"ftp://foo"`, and `"invalid"` return `false`.

- [ ] **Task 5.3: Implement Short-Code Generator in Service Layer** `[User Task: Coding]`
  - **Description:** In `service/UrlService.java`, implement `String generateShortCode()` using Base62 characters (`[0-9, a-z, A-Z]`) and `java.security.SecureRandom` or `Random` to produce a random 6-character code.
  - **Measurable Completion:** Method generates a 6-character alphanumeric string; repeated invocations produce distinct random codes.

- [ ] **Task 5.4: Implement Plain JDBC INSERT in DAO Layer** `[User Task: Coding]`
  - **Description:** In `dao/UrlDao.java`, implement `void save(String originalUrl, String shortCode)` using:
    - `DataSource.getConnection()` inside `try-with-resources`.
    - `PreparedStatement` with SQL `INSERT INTO short_urls (original_url, short_code) VALUES (?, ?)`.
    - Parameter binding via `setString(1, originalUrl)` and `setString(2, shortCode)`.
    - `executeUpdate()`.
  - **Measurable Completion:** Invoking `save(...)` inserts a row into MySQL verified via SQL CLI; all JDBC resources close automatically.

- [ ] **Task 5.5: Implement Plain JDBC SELECT Lookup in DAO Layer** `[User Task: Coding]`
  - **Description:** In `dao/UrlDao.java`, implement `Optional<String> findOriginalUrlByShortCode(String shortCode)` using:
    - `try-with-resources` wrapping `Connection`, `PreparedStatement`, and `ResultSet`.
    - SQL `SELECT original_url FROM short_urls WHERE short_code = ?`.
    - Parameter binding via `setString(1, shortCode)`.
  - **Measurable Completion:** Query returns `Optional.of(originalUrl)` for existing codes and `Optional.empty()` for non-existent codes.

- [ ] **Task 5.6: Implement Service Layer Workflow & Collision Handling** `[User Task: Coding]`
  - **Description:** In `service/UrlService.java`, implement `createShortUrl(String originalUrl)`:
    - Validates URL (throws `IllegalArgumentException` on invalid).
    - Generates short code.
    - Attempts `urlDao.save(...)`.
    - If a collision occurs (caught `SQLException` / duplicate key), retries up to 3 times before failing.
    - Constructs and returns `UrlResponse`.
  - **Measurable Completion:** Method returns populated `UrlResponse` on valid input and handles retries gracefully.

- [ ] **Task 5.7: Implement REST Endpoint `POST /api/urls`** `[User Task: Coding]`
  - **Description:** In `controller/UrlController.java`, create `@PostMapping("/api/urls")` accepting `@RequestBody UrlRequest request`. Delegates to `UrlService` and returns `ResponseEntity.status(HttpStatus.CREATED).body(response)`.
  - **Measurable Completion:** Endpoint accepts JSON and returns HTTP 201 Created with expected response JSON.

- [ ] **Task 5.8: Implement Redirect Endpoint `GET /{shortCode}`** `[User Task: Coding]`
  - **Description:** In `controller/UrlController.java`, create `@GetMapping("/{shortCode}")` accepting `@PathVariable String shortCode`. Queries `UrlService`:
    - If found: returns `ResponseEntity.status(HttpStatus.FOUND).header(HttpHeaders.LOCATION, originalUrl).build()`.
    - If not found: returns `ResponseEntity.status(HttpStatus.NOT_FOUND).body(...)`.
  - **Measurable Completion:** Endpoint returns HTTP 302 Found with `Location` header when code exists, and HTTP 404 when it does not.

- [ ] **Task 5.9: Implement Centralized Error Handling** `[User Task: Coding]`
  - **Description:** Create `@RestControllerAdvice` class (or controller-level exception handlers) to intercept `IllegalArgumentException` (HTTP 400), Not Found exceptions (HTTP 404), and unhandled database errors (HTTP 500 with sanitized message).
  - **Measurable Completion:** Errors return standard JSON matching `TRD.md` schema with zero stack traces exposed.

- [ ] **Task 5.10: Configure CORS for Local Development** `[User Task: Configuration]`
  - **Description:** In `config/WebConfig.java`, implement `WebMvcConfigurer` to allow CORS requests from `http://localhost:5173` on `/api/**` with methods `GET, POST, OPTIONS`.
  - **Measurable Completion:** Pre-flight `OPTIONS` requests and cross-origin `POST` requests from Vite frontend are allowed.

---

## Phase 6 — Postman API Testing

*Goal: Thoroughly verify all backend endpoints, status codes, and error conditions using Postman before connecting the frontend.*

- [ ] **Task 6.1: Set Up Postman Collection** `[User Task: Testing]`
  - **Description:** Create a new Postman Collection named `URL Shortener API` with base URL variable `{{baseUrl}} = http://localhost:8080`.
  - **Measurable Completion:** Collection created with organized request folders.

- [ ] **Task 6.2: Test Successful URL Creation (`POST /api/urls`)** `[User Task: Testing]`
  - **Description:** Send `POST {{baseUrl}}/api/urls` with `{ "originalUrl": "https://spring.io" }`.
  - **Measurable Completion:** Response status is `201 Created`; body contains non-empty `shortCode`, `shortUrl`, `originalUrl`, and `createdAt`.

- [ ] **Task 6.3: Test Invalid URL Inputs (`POST /api/urls`)** `[User Task: Testing]`
  - **Description:** Execute tests with:
    1. Empty body: `{}` -> Verify `400 Bad Request`.
    2. Blank URL: `{ "originalUrl": "   " }` -> Verify `400 Bad Request`.
    3. Unsupported protocol: `{ "originalUrl": "ftp://files.example.com" }` -> Verify `400 Bad Request`.
    4. Malformed syntax: `{ "originalUrl": "not_a_url" }` -> Verify `400 Bad Request`.
  - **Measurable Completion:** All 4 invalid inputs return HTTP 400 with descriptive error messages.

- [ ] **Task 6.4: Test URL Redirection (`GET /{shortCode}`)** `[User Task: Testing]`
  - **Description:** In Postman request settings, disable **"Automatically follow redirects"**. Send `GET {{baseUrl}}/{validShortCode}` using code created in Task 6.2.
  - **Measurable Completion:** Response status is `302 Found`; `Location` header exactly matches `"https://spring.io"`.

- [ ] **Task 6.5: Test Unknown Short Code (`GET /{shortCode}`)** `[User Task: Testing]`
  - **Description:** Send `GET {{baseUrl}}/nonExistentCode999`.
  - **Measurable Completion:** Response status is `404 Not Found`; JSON body contains `"Short URL code not found."`.

- [ ] **Task 6.6: Test Database Outage Resilience** `[User Task: Testing]`
  - **Description:** Temporarily stop MySQL service (`net stop MySQL80` or service stop) and trigger `POST {{baseUrl}}/api/urls`.
  - **Measurable Completion:** Backend returns `500 Internal Server Error` with a sanitized message; console logs stack trace safely; application does not crash. Restart MySQL after test.

---

## Phase 7 — Frontend and Backend Integration

*Goal: Connect the React frontend to the real Spring Boot backend and verify complete end-to-end functionality.*

- [ ] **Task 7.1: Configure Live API Service in Frontend** `[User Task: Coding]`
  - **Description:** Create `frontend/src/api/urlApi.js` using Fetch API or Axios to call `POST http://localhost:8080/api/urls`. Replace mock API call in `App.jsx` with live API call.
  - **Measurable Completion:** Submitting form sends a real HTTP request across localhost to port 8080.

- [ ] **Task 7.2: Verify End-to-End URL Creation in Browser** `[User Task: Testing]`
  - **Description:** Open `http://localhost:5173`, enter a real URL (e.g., `https://news.ycombinator.com`), and click "Shorten URL".
  - **Measurable Completion:** Result box displays generated short link (e.g., `http://localhost:8080/xyz123`); newly inserted row is visible in MySQL database table `short_urls`.

- [ ] **Task 7.3: Verify End-to-End Redirection in Browser** `[User Task: Testing]`
  - **Description:** Click or paste the generated short URL into a new browser tab.
  - **Measurable Completion:** Browser opens `http://localhost:8080/xyz123` and immediately redirects to `https://news.ycombinator.com`.

- [ ] **Task 7.4: Verify Clipboard Copy Integration** `[User Task: Testing]`
  - **Description:** Click "Copy" on the live generated result, then paste into another tab or text editor.
  - **Measurable Completion:** Exact short URL is pasted; button shows "Copied!" green feedback for 2 seconds.

- [ ] **Task 7.5: Verify Live Error Handling** `[User Task: Testing]`
  - **Description:** Test error display with invalid inputs and test behavior when the backend server is stopped.
  - **Measurable Completion:** Frontend displays clear, inline red alert banners matching server error messages without page crashes.

---

## Phase 8 — Final Review & Acceptance

*Goal: Audit the entire project against PRD acceptance criteria, verify technical compliance, and document interview learning takeaways.*

- [ ] **Task 8.1: PRD Acceptance Criteria Audit** `[User Task: Verification]`
  - **Description:** Verify all checkboxes in `PRD.md` Section 10:
    - [ ] Valid URL shortening works.
    - [ ] Redirection via HTTP 302 works.
    - [ ] Empty/malformed URLs return HTTP 400.
    - [ ] Unknown short codes return HTTP 404.
    - [ ] Clipboard copy functions as expected.
  - **Measurable Completion:** All functional acceptance tests pass cleanly.

- [ ] **Task 8.2: Technical & Architecture Constraints Audit** `[User Task: Verification]`
  - **Description:** Audit the backend codebase against `PROJECT_RULES.md` and `TRD.md`:
    - Confirm zero references to Spring Data JPA, Hibernate, or ORM annotations (`@Entity`, `@Table`, `JpaRepository`).
    - Confirm all database interactions use `Connection`, `PreparedStatement`, and `ResultSet`.
    - Confirm all JDBC statements use `try-with-resources`.
    - Confirm zero SQL string concatenation.
  - **Measurable Completion:** Codebase conforms 100% to plain JDBC technical restrictions.

- [ ] **Task 8.3: UI/UX Compliance Audit** `[User Task: Verification]`
  - **Description:** Verify frontend compliance against `UI_UX.md`:
    - Clean rectangular elements (`6px` radius); zero capsule/pill buttons.
    - Neutral palette (white/charcoal/muted blue); zero neon, pink, purple, or gradients.
    - Centered `560px` container; responsive on mobile and desktop.
  - **Measurable Completion:** Visual presentation matches human-designed, utility-focused UI guidelines.

- [ ] **Task 8.4: Document Learning Outcomes & Interview Reflection**
  - **Description:** Review `PRD.md` Section 11 and prepare notes on:
    - Raw JDBC lifecycle vs. ORM trade-offs.
    - Preventing SQL injection via `PreparedStatement`.
    - HTTP status codes and REST design principles.
    - Short-code generation algorithms (Base62 vs hashing).
  - **Measurable Completion:** Summary of key backend takeaways is ready for interview discussions.

---

## Items to Be Confirmed During Implementation

1. **404 Handling for Browser Visitors:**
   - *Status:* **To be confirmed**
   - *Detail:* When a visitor enters an unknown short URL directly in a browser, the backend returns JSON `{"status": 404, "message": "Short URL code not found."}`. Confirm during Phase 5 whether a lightweight HTML error page or standard JSON response is preferred.
2. **Dynamic vs. Configured Base URL:**
   - *Status:* **To be confirmed**
   - *Detail:* In `UrlResponse`, `shortUrl` is currently prefixed with `http://localhost:8080/`. Confirm whether this should be configured in `application.properties` (e.g., `app.base-url=http://localhost:8080`) or determined dynamically from `HttpServletRequest`.
3. **Short-Code Collision Retry Limit:**
   - *Status:* **To be confirmed**
   - *Detail:* Setting the exact retry count (recommended: 3 retries) when an unlikely short-code collision occurs before returning an error response.

# Project Rules & Development Guidelines (PROJECT_RULES.md)

## Project: URL Shortener (Backend Learning Project 1)

**Source of Truth Documents:**
- [PRD.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/PRD.md) — Product requirements and project scope boundaries
- [TRD.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/TRD.md) — Technical specifications, API contracts, and database schema
- [ARCHITECTURE.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/ARCHITECTURE.md) — System layers, request lifecycles, and folder layouts
- [UI_UX.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/UI_UX.md) — Visual styling, interface layout, and interaction states
- [FLOW.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/FLOW.md) — Step-by-step user journeys and system sequence diagrams
- [TASKS.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/TASKS.md) — Phased implementation checklist and measurable completion tasks

---

### Purpose
This project is an educational, hands-on application designed to build strong backend fundamentals. All work must remain simple, practical, readable, and beginner-friendly. Complex enterprise design patterns, premature optimizations, and unrequested frameworks are prohibited.

---

## 1. Follow the Project Scope
- **Implement only what is in [PRD.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/PRD.md):** The scope of V1 is strictly limited to shortening long URLs, generating unique short codes, storing them in MySQL, redirecting visitors via HTTP 302, and copying shortened links.
- **Strictly Out of Scope:** Do **not** implement or suggest:
  - User registration, login, JWT, sessions, or role-based access control.
  - Analytics, visit counts, referrer tracking, or geographical logging.
  - Custom vanity aliases or QR code generators.
  - Redis or other caching systems.
  - Docker, Docker Compose, Kubernetes, or cloud deployment pipelines.
  - Microservices, message queues (Kafka, RabbitMQ), or scheduled expiration cleanup jobs.

---

## 2. Follow the Approved Technical Stack
- **Approved Stack Components ([TRD.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/TRD.md)):**
  - **Frontend:** React.js + Vite + plain CSS.
  - **Backend:** Java + Spring Boot (Spring Web).
  - **Database:** MySQL (table `short_urls`).
  - **Database Access:** Plain JDBC with `mysql-connector-j`.
  - **API Testing:** Postman.
  - **HTTP Client:** Fetch API or Axios.
- **Strict Plain JDBC Enforcement:**
  - Database access must use core `java.sql` interfaces: `Connection`, `PreparedStatement`, and `ResultSet`.
  - **Strictly Forbidden:** Spring Data JPA, Hibernate, MyBatis, entity managers, or any other ORM framework.
- **Dependency Restraint:**
  - Do not introduce third-party libraries without explicit prior explanation and user approval.

---

## 3. Keep the Architecture Understandable
- **Follow 3-Tier Layering ([ARCHITECTURE.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/ARCHITECTURE.md)):**
  - **Controller (`UrlController`):** Only handles HTTP routing, request parsing, response codes, and HTTP 302 redirects. Contains no business or SQL logic.
  - **Service (`UrlService`):** Only handles business logic—URL syntax validation, 6-character Base62 code generation, and collision retry coordination. Executes no direct SQL.
  - **DAO (`UrlDao`):** Only manages database communication via raw JDBC. Contains no HTTP logic.
- **Avoid Overengineering:**
  - Keep code explicit, procedural, and readable.
  - Avoid unnecessary design patterns (e.g., Abstract Factory, CQRS, Event Sourcing, Generic Repository hierarchies).

---

## 4. Protect Data and Handle Input Safely
- **SQL Injection Prevention:**
  - Never concatenate variables into SQL strings (`"WHERE short_code = '" + code + "'"` is strictly forbidden).
  - Always use `PreparedStatement` with parameterized placeholders (`?`).
- **Mandatory Backend Validation:**
  - Client-side validation is purely for UI convenience; all incoming URLs must be validated on the backend.
  - Accept only valid `http://` and `https://` URLs.
  - Strictly reject blank inputs, malformed URIs, and dangerous schemes (e.g., `javascript:`, `data:`, `ftp:`).
- **Graceful Error Handling:**
  - Return HTTP `400 Bad Request` for invalid or missing inputs.
  - Return HTTP `404 Not Found` for non-existent short codes.
  - Return HTTP `500 Internal Server Error` with sanitized messages for database errors.
  - Never leak database table names, SQL syntax errors, or Java stack traces to the client.
- **Resource & Credential Safety:**
  - Wrap all JDBC resources (`Connection`, `PreparedStatement`, `ResultSet`) in Java `try-with-resources` to eliminate connection leaks.
  - Keep database usernames and passwords out of committed source code; use `application.properties` and environment variables (`DB_USERNAME`, `DB_PASSWORD`).

---

## 5. Keep the UI Consistent
- **Adhere to [UI_UX.md](file:///c:/Users/aksha/OneDrive/Desktop/Basic%20Project%20for%20backend/URL%20Shortner/Project%20Document%20File/UI_UX.md):**
  - Use a clean, centered layout with a maximum container width of `560px`.
  - Primary color palette: White/off-white background (`#F9FAFB` / `#FFFFFF`), deep charcoal text (`#111827`), neutral gray borders (`#E5E7EB`), and muted blue accents (`#2563EB`).
  - Use conventional accessible green for success and soft red for errors.
- **Anti-AI Design Rules:**
  - Buttons must be rectangular with modest corner rounding (`6px`). **No capsule or pill buttons.**
  - **No** pink, purple, neon, or multi-color gradients.
  - **No** glassmorphism, floating decorative shapes, animated glow effects, or oversized hero sections.
  - Labels must remain plain and direct: `"Shorten URL"` and `"Copy"`.

---

## 6. Build and Test Incrementally
- **One Small Task at a Time:**
  - Focus on one component, endpoint, or feature per iteration.
  - Clearly explain what each change does and list the exact files it affects.
- **Postman Verification First:**
  - Verify every backend endpoint (`POST /api/urls` and `GET /{shortCode}`) with Postman before connecting the frontend.
  - Test valid URLs, invalid URLs, empty payloads, and missing short codes.
- **No False Claims:**
  - Never claim a feature works unless it has been explicitly written and tested.
- **Debugging Support:**
  - If a test or query fails, identify the root cause clearly, explain the solution simply, and resolve it before proceeding.

---

## 7. Keep Documentation and Implementation Aligned
- **Single Source of Truth:**
  - If a route, database column, or behavior must be adjusted during development, explain the technical necessity and update the corresponding specification document (`PRD.md`, `TRD.md`, `ARCHITECTURE.md`, or `UI_UX.md`).
  - Never introduce implementation details that contradict the agreed documentation without explicit user sign-off.

---

## 8. Respect the Existing Project Structure
- **Inspect Before Action:**
  - Always verify existing files and directories before creating or modifying code.
  - **Verified Baseline:** The repository organizes documentation inside `Project Document File/`; top-level directories `frontend/`, `backend/`, `database/`, and `testing/` exist in root. Internal application files and packages are planned and must only be created in their designated implementation phases.
- **Preserve Existing Files:**
  - Do not delete, rename, or reorganize existing files or folders without prior user consultation.
- **Strict Development Sequence:**
  - Follow the canonical dependency progression:
    $$\text{Documentation / Planning} \longrightarrow \text{Frontend} \longrightarrow \text{Backend} \longrightarrow \text{Database Setup / Connectivity} \longrightarrow \text{API Testing} \longrightarrow \text{Frontend / Backend Integration}$$
- **Isolated Integration:**
  - Develop and test the React frontend and Spring Boot backend independently before joining them via the live API.

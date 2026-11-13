/**
 * Mock URL Shortener API Service
 *
 * NOTE: This is a client-side mock service used exclusively to develop and verify
 * all UI states (idle, loading, validation, success, copy feedback, error) before
 * connecting to the live Spring Boot backend.
 *
 * It simulates network latency (400ms) and returns a payload conforming to TRD.md:
 * {
 *   originalUrl: string,
 *   shortCode: string,
 *   shortUrl: string,
 *   createdAt: string,
 *   isMock: boolean
 * }
 *
 * In Phase 7 (Frontend/Backend Integration), this will be replaced with real backend
 * HTTP API calls (POST http://localhost:8080/api/urls).
 */

/**
 * Generates a random 6-character Base62 string (0-9, a-z, A-Z)
 * mirroring the backend Base62 generator logic.
 */
function generateMockShortCode() {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let code = ''
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    code += chars[randomIndex]
  }
  return code
}

/**
 * Simulates shortening a URL with 400ms artificial latency.
 *
 * @param {string} originalUrl - The long URL to shorten
 * @returns {Promise<{ originalUrl: string, shortCode: string, shortUrl: string, createdAt: string, isMock: boolean }>}
 */
export async function mockShortenUrl(originalUrl) {
  // Simulate network response latency
  await new Promise((resolve) => setTimeout(resolve, 400))

  // Test hook: including "simulate-error" in the URL triggers a mock server failure
  if (originalUrl.includes('simulate-error')) {
    throw new Error('Unable to connect to server. Please try again.')
  }

  const shortCode = generateMockShortCode()

  // Base URL matches the planned local backend host: http://localhost:8080
  return {
    originalUrl,
    shortCode,
    shortUrl: `http://localhost:8080/${shortCode}`,
    createdAt: new Date().toISOString(),
    isMock: true,
  }
}

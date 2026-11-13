export async function shortenUrl(originalUrl) {
    const response = await fetch("http://localhost:8080/api/urls", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            originalUrl: originalUrl,
        }),
    });

    const responseText = await response.text();

    if (!response.ok) {
        throw new Error(
            responseText || `Server request failed (${response.status})`
        );
    }

    const shortUrl = responseText.trim();

    const shortCode = new URL(shortUrl).pathname.split("/").filter(Boolean).pop();

    return {
        originalUrl,
        shortCode,
        shortUrl,
        isMock: false,
    };
}
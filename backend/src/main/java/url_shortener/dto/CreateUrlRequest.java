package url_shortener.dto;

public class CreateUrlRequest {

    private String originalUrl;

    public String getOriginalUrl() {
        return originalUrl;
    }

    public void setOriginalUrl(String originalUrl) {
        this.originalUrl = originalUrl;
    }

    public boolean isValidUrl() {
    if (originalUrl == null || originalUrl.isBlank()) {
        return false;
    }

    try {
        java.net.URI uri = new java.net.URI(originalUrl);
        String scheme = uri.getScheme();

        return uri.isAbsolute()
                && ("http".equalsIgnoreCase(scheme)
                || "https".equalsIgnoreCase(scheme))
                && uri.getHost() != null;

    } catch (java.net.URISyntaxException e) {
        return false;
    }
}
}
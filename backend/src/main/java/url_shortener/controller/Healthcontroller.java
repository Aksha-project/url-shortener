package url_shortener.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import url_shortener.service.UrlService;
import org.springframework.http.ResponseEntity;
import url_shortener.dto.CreateUrlRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class Healthcontroller {

    private final UrlService urlService;

    public Healthcontroller(UrlService urlService) {
        this.urlService = urlService;
    }

    @GetMapping("/api/health")
    public String checkHealth() {
        return "URL Shortener backend is running";
    }

    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirectToOriginal(
        @PathVariable String shortCode) {

            String originalUrl = urlService.findOriginalUrl(shortCode);

            if(originalUrl == null) {
                return ResponseEntity.notFound().build();
            }
                return ResponseEntity
                    .status(HttpStatus.FOUND)
                    .header("Location", originalUrl)
                    .build();
        }

    @PostMapping("/api/urls")
    public ResponseEntity<String> receiveUrl(@RequestBody CreateUrlRequest request) {

        try {
            String shortCode = urlService.createShortUrl(request);

            String shortUrl = "http://localhost:8080/" + shortCode;

            return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(shortUrl);

            } catch(IllegalArgumentException e) {
                return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
                }
            }
    }
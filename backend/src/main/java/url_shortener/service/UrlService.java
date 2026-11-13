package url_shortener.service;

import url_shortener.dto.CreateUrlRequest;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;

import url_shortener.dao.UrlDao;
import java.sql.SQLException;

@Service 
public class UrlService {

    public boolean isValidUrl(CreateUrlRequest request) {
        return request.isValidUrl();
    }

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    private final SecureRandom random= new SecureRandom();

    public String generateShortCode() {
        StringBuilder shortCode = new StringBuilder();

        for(int i=0;i<6;i++) {
            int index = random.nextInt(CHARACTERS.length());
            char character = CHARACTERS.charAt(index);

            shortCode.append(character);
        }
            return shortCode.toString();
    }    

    private final UrlDao urlDao;

    public UrlService(UrlDao urlDao) {
        this.urlDao=urlDao;
    }

    public String createShortUrl(CreateUrlRequest request) {

        if(!isValidUrl(request)) {
            throw new IllegalArgumentException("Invalid URL");
        }

        String shortCode = generateShortCode();

        try {
            urlDao.saveUrl(request.getOriginalUrl(), shortCode);
        } catch (SQLException e) {
            throw new RuntimeException("Could not save URL to database", e);
        }
            return shortCode;
        }

        public String findOriginalUrl(String shortCode) {
            try {
                return urlDao.findOriginalUrlByShortCode(shortCode);
            } catch (SQLException e) {
                throw new RuntimeException("Could not look up short URL", e);
            }
        }
    }





    


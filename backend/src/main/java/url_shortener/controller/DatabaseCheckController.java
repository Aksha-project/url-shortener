package url_shortener.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

@RestController
public class DatabaseCheckController {

    @GetMapping("/api/db-check")
    public String checkDatabase() {

        String url="jdbc:mysql://localhost:3306/url_shortener";
        String username="root";
        String password="Aksha@426@";

        try (
            Connection connection = DriverManager.getConnection(url, username, password);

            Statement statement = connection.createStatement();

            ResultSet result = statement.executeQuery(
                "SELECT COUNT(*) FROM short_urls"
            )
        ) {
            result.next();
            int rowcount = result.getInt(1);

            return "Database connection successful." + "Rows in short_urls: " + rowcount;
        } catch (Exception e) {
            return "Database connection faiked: " + e.getMessage();
        }
    }
    
}

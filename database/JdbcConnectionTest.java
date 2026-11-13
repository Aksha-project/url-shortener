package url_shortener.database;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@Component
public class JdbcConnectionTest implements CommandLineRunner {

        @Value("${spring.datasource.url}")
        private String databaseUrl;

        @Value("${spring.datasource.username}")
        private String databaseUsername;

        @Value("${spring.datasource.password}")
        private String databasePassword;

        @Override
        public void run(String... args) {
            try (Connection connection = DriverManager.getConnection(
                databaseUrl,
                databaseUsername,
                databasePassword)) {
                

            System.out.println("Mysql JDBC connection successful!");
            System.out.println("Connected to database: " + connection.getCatalog());

            } catch(SQLException e) {
                System.out.println("MySQL JDBC connection failed.");
                e.printStackTrace();
            }
        }
    }
    


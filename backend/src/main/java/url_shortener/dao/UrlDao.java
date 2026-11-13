package url_shortener.dao;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.ResultSet;


@Repository
public class UrlDao {

    @Value("${spring.datasource.url}")
    private String databaseUrl;

    @Value("${spring.datasource.username}")  
    private String databaseUsername;

    @Value("${spring.datasource.password}")
    private String databasePassword;

    public void saveUrl(String originalUrl, String shortCode)
        throws SQLException {

    String sql = "INSERT INTO short_urls (original_url, short_code)" + "VALUES (?, ?)";

    try (
        Connection connection = DriverManager.getConnection(
            databaseUrl,
            databaseUsername,
            databasePassword
        );

        PreparedStatement preparedStatement = connection.prepareStatement(sql)
    ) {
        preparedStatement.setString(1, originalUrl);
        preparedStatement.setString(2, shortCode);

        preparedStatement.executeUpdate();
        }    
    }

    public String findOriginalUrlByShortCode(String shortCode) throws SQLException {

            String sql = "SELECT original_url From short_urls Where short_code = ?";

            try (
                Connection connection = DriverManager.getConnection(
                    databaseUrl,
                    databaseUsername,
                    databasePassword
                );
                
                PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
                preparedStatement.setString(1, shortCode);

                try(ResultSet resultSet = preparedStatement.executeQuery()) {

                    if(resultSet.next()) {
                        return resultSet.getString("original_url");
                    }

                        return null;
                }
            }   
        }
    }


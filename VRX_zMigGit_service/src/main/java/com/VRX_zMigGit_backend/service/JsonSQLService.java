package com.VRX_zMigGit_backend.service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Types;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class JsonSQLService {
    @Value("${custom.mysql.dbname}")
    private String dbName;

    @Value("${custom.mysql.url}")
    private String jdbcURL;

    @Value("${custom.mysql.username}")
    private String username;

    @Value("${custom.mysql.password}")
    private String password;

    public String dbCreation(InputStream input) throws Exception {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection con = DriverManager.getConnection(jdbcURL, username, password);
            Statement smtm = con.createStatement();

            ResultSet rs = smtm.executeQuery("SHOW DATABASES LIKE '" + dbName + "'");

            if (rs.next()) {

                for (int i = 1; i <= 3; i++) {
                try {
                    Thread.sleep(900);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
                System.out.println("Database already exists: " + dbName);
                return "✅ Database '" + dbName + "' already exists in SQL.";
            } else {
                smtm.executeUpdate("CREATE DATABASE " + dbName);
                System.out.println("Database created: " + dbName);

                tableCreation(jdbcURL, username, password, dbName);

                insJson(jdbcURL, username, password, dbName, input);

                return "✅ Database '" + dbName + "' created successfully in SQL.";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "❌ Error while creating database: " + e.getMessage();
        }
    }

    public void tableCreation(String jdbcUrl, String username, String password, String dbName) {

        String url = jdbcUrl + dbName;

        String filePath = "D:\\Documents\\TABLE_CREATION.txt";

        try (Connection con = DriverManager.getConnection(url, username, password)) {

            String sqlScript = new String(Files.readAllBytes(Paths.get(filePath)), StandardCharsets.UTF_8);

            String[] sqlStatements = sqlScript.split(";");

            for (String statement : sqlStatements) {
                statement = statement.trim();

                if (statement.isEmpty())
                    continue;

                try (Statement stmt = con.createStatement()) {
                    stmt.execute(statement);
                    System.out.println("Executed:\n" + statement + "\n");
                } catch (Exception e) {
                    System.err.println("Error executing statement: " + statement);
                    System.err.println("SQLException: " + e.getMessage());
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void insJson(String jdbcUrl, String username, String password, String dbName, InputStream input) {
        
        String url = jdbcUrl + dbName;

        try (
                BufferedReader reader = new BufferedReader(new InputStreamReader(input));
                Connection conn = DriverManager.getConnection(url, username, password)) {
            String line;
            String currentTable = null;
            ObjectMapper mapper = new ObjectMapper();

            while ((line = reader.readLine()) != null) {
                line = line.trim();

                // Detect section
                if (line.startsWith("##")) {
                    currentTable = line.replace("##", "").trim().toLowerCase().replace("-", "_");
                    System.out.println("\nSwitching to table: " + currentTable);
                    continue;
                }

                if (line != null && line.startsWith("{") && currentTable.equalsIgnoreCase("elementcontent")) {
                    StringBuilder jsonBuilder = new StringBuilder();
                    jsonBuilder.append(line);

                    while (!line.endsWith("}")) {
                        line = reader.readLine();
                        if (line == null)
                            break;
                        jsonBuilder.append(line.trim());
                    }
                    JsonNode node = mapper.readTree(jsonBuilder.toString());

                    String sql = "INSERT INTO elementcontent (element, version, level, ccid, comment, content) VALUES (?, ?, ?, ?, ?, ?)";

                    try (PreparedStatement ps = conn.prepareStatement(sql)) {
                        ps.setString(1, node.get("element").asText());
                        ps.setString(2, node.get("version").asText());
                        ps.setString(3, node.get("level").asText());
                        ps.setString(4, node.get("CCID").asText());
                        ps.setString(5, node.get("comment").asText());

                        // Store content array as JSON string
                        String contentJson = mapper.writeValueAsString(node.get("content"));
                        ps.setString(6, contentJson);

                        ps.executeUpdate();
                    }
                    System.out.println("Inserted row into: " + currentTable);
                }

                else if (line.startsWith("{") && currentTable != null) {
                    StringBuilder jsonBuilder = new StringBuilder();
                    jsonBuilder.append(line);
                    while (!line.endsWith("}")) {
                        line = reader.readLine();
                        if (line == null)
                            break;
                        jsonBuilder.append(line.trim());
                    }

                    String jsonStr = jsonBuilder.toString();

                    // FIX: Replace leading zero numbers with strings
                    jsonStr = jsonStr.replaceAll(":(\\s*)0+(\\d+)", ":\"$2\"");

                    try {
                        Map<String, Object> jsonMap = mapper.readValue(jsonStr, new TypeReference<>() {
                        });
                        insertIntoTable(conn, currentTable, jsonMap);
                    } catch (Exception e) {
                        System.err.println("Failed to parse JSON for table: " + currentTable);
                        System.err.println(jsonStr);
                        e.printStackTrace();
                    }
                }
            }

            System.out.println("\nAll data inserted successfully!");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void insertIntoTable(Connection conn, String table, Map<String, Object> jsonMap) {
        try {
            List<String> columns = new ArrayList<>(jsonMap.keySet());
            String colNames = String.join(",", columns.stream().map(col -> "`" + col + "`").toList());
            String placeholders = String.join(",", Collections.nCopies(columns.size(), "?"));

            String sql = "INSERT INTO `" + table + "` (" + colNames + ") VALUES (" + placeholders + ")";
            try (PreparedStatement ps = conn.prepareStatement(sql)) {
                for (int i = 0; i < columns.size(); i++) {
                    Object value = jsonMap.get(columns.get(i));

                    if (value == null || String.valueOf(value).equalsIgnoreCase("null")) {
                        ps.setNull(i + 1, Types.NULL);
                    }

                    // Convert JSONArray to plain text
                    else if (value instanceof List<?> listVal) {
                        StringBuilder sb = new StringBuilder();
                        for (Object item : listVal) {
                            sb.append(String.valueOf(item)).append("\n");
                        }
                        ps.setString(i + 1, sb.toString().trim());
                    }

                    // Convert DATE_yyyyMMddHHmmssSS(...) to MySQL datetime
                    else if (value instanceof String strVal && strVal.startsWith("DATE_")) {
                        String raw = strVal.replaceAll(".*\\((\\d+)\\)", "$1");
                        try {
                            SimpleDateFormat input = new SimpleDateFormat("yyyyMMddHHmmssSS");
                            SimpleDateFormat output = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                            Date date = input.parse(raw);
                            ps.setString(i + 1, output.format(date));
                        } catch (Exception ex) {
                            ps.setNull(i + 1, Types.TIMESTAMP);
                        }
                    }

                    // Default
                    else {
                        ps.setObject(i + 1, value);
                    }
                }

                ps.executeUpdate();
                System.out.println("Inserted row into: " + table);
            }

        } catch (SQLException e) {
            System.err.println("SQL error while inserting into " + table + ": " + e.getMessage());
        }
    }
}

import java.io.*;

// HTTP/Network libraries
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

// Json/Gson libraries
import com.google.gson.Gson;
import com.google.gson.JsonObject;

// Salting and hashing libraries
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import javax.crypto.spec.PBEKeySpec;
import java.security.spec.InvalidKeySpecException;
import javax.crypto.SecretKeyFactory;

// JDBC libraries
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class SignUp implements HttpHandler {
    public void handle(HttpExchange s) throws IOException {
        // Retrieving sign-up form data
        String signUpData = getSignUpDataAsString(s);
        System.out.println(signUpData);
        JsonObject jsonObject = new Gson().fromJson(signUpData, JsonObject.class);
        String fname = jsonObject.get("fname").toString();
        String lname = jsonObject.get("lname").toString();
        String username = jsonObject.get("uname").toString();
        String email = jsonObject.get("email").toString();
        String password = jsonObject.get("password").toString();
        String confirmPassword = jsonObject.get("confirmPassword").toString();
        String response;

        s.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        s.getResponseHeaders().add("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        s.getResponseHeaders().add("Access-Control-Allow-Credentials", "true");
        s.getResponseHeaders().add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,HEAD");
        s.getResponseHeaders().add("Content-type", "application/json");

        // Response if passwords do not match
        if (!password.equals(confirmPassword)) {
            System.out.println("Passwords do not match!");
            response = "Passwords do not match!";
            s.sendResponseHeaders(403, response.getBytes(StandardCharsets.UTF_8).length);
            OutputStream os = s.getResponseBody();
            os.write(response.getBytes());
            os.flush();
            os.close();
            return;
        }
        System.out.println("test4");

        // Hashed password
        String[] hashData = hash(password);
        String salt = hashData[0];
        String hashedPassword = hashData[1];

        // Inserting hashed password and rest of user data in the database
        boolean signUpSuccess = insertIntoDatabase(username, hashedPassword, fname, lname, email, salt);
        System.out.println(signUpSuccess);
        if (signUpSuccess) {
            System.out.println("Inserted into database.");
            response = "Successfully signed up! You can now draw on the canvas!";
            s.sendResponseHeaders(200, response.getBytes(StandardCharsets.UTF_8).length);
        }
        else {
            System.out.println("Username already exists.");
            response = "Username is already in use.";
            s.sendResponseHeaders(404, response.getBytes(StandardCharsets.UTF_8).length);
        }
        OutputStream os = s.getResponseBody();
        os.write(response.getBytes());
        os.flush();
        os.close();
    }

    // Returns sign-up data as a JSON-formatted String
    public String getSignUpDataAsString(HttpExchange s) throws IOException {
        InputStreamReader isr = new InputStreamReader(s.getRequestBody());
        BufferedReader br = new BufferedReader(new InputStreamReader(s.getRequestBody()));

        // Reading the login information from the input fields in the login page
        StringBuilder buffer = new StringBuilder();
        int temp;
        while ((temp = br.read()) != -1) {
            buffer.append((char) temp);
        }
        br.close();
        isr.close();

        return buffer.toString();
    }

    // Inserts user's sign-up data and saves their information into the database
    private boolean insertIntoDatabase(String username, String hashedPassword, String fname, String lname, String email, String salt) {
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            // Connecting with database
            conn = DriverManager.getConnection("jdbc:mysql://localhost/csci201project?user=root&password=root");
            // Check if username already exists in database
            String checkQuery = "SELECT username FROM users WHERE username=?";
            ps = conn.prepareStatement(checkQuery);
            ps.setString(1, username);
            rs = ps.executeQuery();
            if (!rs.next()) {
                String insertQuery = "INSERT INTO users VALUES (?,?,?,?,?,?)";
                ps = conn.prepareStatement(insertQuery);
                ps.setString(1, username);
                ps.setString(2, hashedPassword);
                ps.setString(3, fname);
                ps.setString(4, lname);
                ps.setString(5, email);
                ps.setString(6, salt);
                ps.executeUpdate();
                return true;
            }
            else {
                // Username already exists
                return false;
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        } finally {
            try {
                if (rs != null)
                    rs.close();
                if (ps != null)
                    ps.close();
                if (conn != null)
                    conn.close();
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }
    }

    // Hashes and salts the user's password using the PBKDF2 hashing algorithm
    private String[] hash(String password) {
        String[] arr = new String[2];

        // Generating the salt
        SecureRandom sr = new SecureRandom();
        byte[] salt = new byte[16];
        sr.nextBytes(salt);
        StringBuilder saltHex = new StringBuilder(salt.length * 2);

        // Converting salt to hex string
        for (byte b : salt) {
            saltHex.append(String.format("%02x", b));
        }
        String saltString = saltHex.toString();
        arr[0] = saltString;

        // Generating the hash
        char[] passwordAsChar = password.toCharArray();
        int iterations = 32768; // Number of times the password is hashed
        int keyLength = 256; // Length of key (in bits)
        PBEKeySpec keySpec = new PBEKeySpec(passwordAsChar, salt, iterations, keyLength);
        SecretKeyFactory skf;
        byte[] hash;
        try {
            skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
            hash = skf.generateSecret(keySpec).getEncoded();
        }
        catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new RuntimeException(e);
        }

        // Converting hash to hex string
        StringBuilder hashHex = new StringBuilder(hash.length * 2);
        for (byte b : hash) {
            hashHex.append(String.format("%02x", b));
        }

        // Appending salt to the hash to get salted and hashed password
        arr[1] = saltString + hashHex.toString();
        return arr;
    }

}



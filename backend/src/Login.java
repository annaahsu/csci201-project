// File/Misc. libraries
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

// HTTP/Networking libraries
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

// Json/Gson libraries
import com.google.gson.Gson;
import com.google.gson.JsonObject;

// JDBC Libraries
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

// Hashing/Salting libraries
import java.security.NoSuchAlgorithmException;
import javax.crypto.spec.PBEKeySpec;
import java.security.spec.InvalidKeySpecException;
import javax.crypto.SecretKeyFactory;

// HMAC/JWT libraries
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;


public class Login implements HttpHandler {
    public void handle(HttpExchange l) throws IOException { // Must override handle() method
        String loginData = getLoginDataAsString(l);
        System.out.println(loginData);
        JsonObject jsonObject = new Gson().fromJson(loginData, JsonObject.class);
        String username = jsonObject.get("username").toString();
        String password = jsonObject.get("password").toString();
        String response = "";
        if(authenticate(username, password)) {
            response = generateJWTToken();
            l.sendResponseHeaders(200, response.getBytes(StandardCharsets.UTF_8).length);
        }
        else {
            response = "401 Error";
            l.sendResponseHeaders(401, response.getBytes(StandardCharsets.UTF_8).length);
        }
        OutputStream os = l.getResponseBody();
        os.write(response.getBytes());
        os.flush();
        os.close();
    }

    // Authenticates user with database; returns true if user has an account, false otherwise
    public boolean authenticate(String username, String password) {
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            conn = DriverManager.getConnection("jdbc:mysql://localhost/csci201project?user=root&password=theadmiral123");
            String query = "SELECT salt FROM users WHERE username=?";
            ps = conn.prepareStatement(query);
            ps.setString(1, username);
            rs = ps.executeQuery();
            if(rs.next()) {
                String salt = rs.getString("salt");
                // Hashing the password
                String hashedPassword = hashPasswordUsedToLogin(password, salt);
                String query2 = "SELECT * FROM users WHERE username=? AND password=?";
                ps = conn.prepareStatement(query2);
                ps.setString(1, username);
                ps.setString(2, hashedPassword);
                rs = ps.executeQuery();
                // User is logged in if hashed password matches username's hashed password in the database
                if (rs.next()) {
                    System.out.println("Logged in!");
                    return true;
                }
                else {
                    System.out.println("Password incorrect!");
                    return false;
                }
            }
        } catch(SQLException | NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new RuntimeException(e);
        }
        finally {
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
        return false;
    }

    // Generates JWT Token to send to the client, who then sends it to the Web Socket (extra layer of security)
    public String generateJWTToken() throws IOException {
        // Retrieving the secret key used for the HMAC algorithm
        String fileName = "/Users/brandonchoi/Documents/201gp_jwtkey/jwt_key.txt";
        FileReader fr = new FileReader(fileName);
        BufferedReader br = new BufferedReader(fr);
        String secret = "";
        String temp;
        while((temp = br.readLine()) != null){
            secret += temp;
        }
        fr.close();
        br.close();

        // Generating the JWT
        String token = "";
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            token = JWT.create()
                    .withIssuedAt(new Date())
                    .withExpiresAt(new Date(System.currentTimeMillis() + 5000))
                    .sign(algorithm);

        } catch (JWTCreationException e) {
            System.out.println(e.getMessage());
        }
        System.out.println("JWT Token: \n" + token);
        return token;
    }

    // Verifies the JWT; static so it could be used by the Web Socket
    public static boolean verifyJWT(String token) {
        String fileName = "/Users/brandonchoi/Documents/201gp_jwtkey/jwt_key.txt";
        Path path = Paths.get(fileName);
        byte[] secret = null;
        try {
            secret = Files.readAllBytes(path);
        }
        catch (IOException e) {
            throw new RuntimeException(e);
        }

        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            JWTVerifier verifier = JWT.require(algorithm)
                    .build();
            DecodedJWT jwt = verifier.verify(token);
            return true;
        }
        catch (JWTVerificationException e) {
            System.out.println(e.getMessage());
            return false;
        }

    }

    // Returns login data as a JSON-formatted String
    public String getLoginDataAsString(HttpExchange l) throws IOException {
        InputStreamReader isr = new InputStreamReader(l.getRequestBody());
        BufferedReader br = new BufferedReader(isr);

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

    // Returns the hashed password of the login-input password
    private String hashPasswordUsedToLogin(String password, String s) throws NoSuchAlgorithmException, InvalidKeySpecException {
        // Converting hex string to byte array
        byte[] salt = new byte[s.length() / 2];
        for (int i = 0; i < salt.length; i++) {
            int index = i * 2;
            int j = Integer.parseInt(s.substring(index, index + 2), 16);
            salt[i] = (byte) j;
        }

        char[] passwordAsChar = password.toCharArray();
        PBEKeySpec keySpec = new PBEKeySpec(passwordAsChar, salt, 32768, 256);
        SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
        byte[] hash = skf.generateSecret(keySpec).getEncoded();
        StringBuilder hashHex = new StringBuilder(hash.length * 2);
        for (byte b : hash) {
            hashHex.append(String.format("%02x", b));
        }

        return s + hashHex.toString();
    }
}

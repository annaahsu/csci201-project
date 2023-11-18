import java.io.*;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonElement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;


public class Login implements HttpHandler {
    public void handle(HttpExchange t) throws IOException { // Must override handle() method
        String loginData = getLoginDataAsString(t);
        JsonObject jsonObject = new Gson().fromJson(loginData, JsonObject.class);
        JsonElement username_element = jsonObject.get("username");
        JsonElement password_element = jsonObject.get("password");

        if (jsonObject.isEmpty()) {
            System.out.println("No entries in login field!");
            // TODO Send response that there were no entries in login field
        }
        else if (username_element.isJsonNull()) {
            System.out.println("No username was entered!");
            // TODO Send response that username field needs to be filled
        }
        else if (password_element.isJsonNull()) {
            System.out.println("No password was entered!");
            // TODO Send response that password field needs to be filled
        }
        else {
            String username = username_element.toString();
            String password = password_element.toString();
            System.out.println(username);
            System.out.println(password);

            try {
                authenticate(username, password);
            } catch (SQLException sqle) {
                System.out.println("sqle: " + sqle.getMessage());
            }
        }
    }

    public void authenticate(String uname, String pw) throws SQLException {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost/csci201project?user=root&password=theadmiral123");
        Statement st = conn.createStatement();
        ResultSet rs = st.executeQuery("SELECT * FROM users WHERE username = " + uname + " AND password = " + pw + " ");
        if(rs.next()) {
            System.out.println("Logged in!");
        }
        else {
            System.out.println("lol");
        }

    }

    // Returns the login information as a json-formatted String
    public String getLoginDataAsString(HttpExchange t) throws IOException {
        InputStreamReader isr = new InputStreamReader(t.getRequestBody());
        BufferedReader br = new BufferedReader(isr);
        int temp;
        // Reading the login information from the input fields in the login page
        StringBuilder buffer = new StringBuilder();
        while ((temp = br.read()) != -1) {
            buffer.append((char) temp);
        }
        br.close();
        isr.close();
        return buffer.toString();
    }
}

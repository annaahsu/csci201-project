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

public class SignUp implements HttpHandler {
    public void handle(HttpExchange s) throws IOException {
        String signUpData = getSignUpDataAsString(s);
        System.out.println(signUpData);

    }

    public String getSignUpDataAsString(HttpExchange s) throws IOException {
        // TODO
        InputStreamReader isr = new InputStreamReader(s.getRequestBody());
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

    public String hashAndSalt(String password) {
        //TODO
        return "";
    }

    public void insertIntoDatabase(String username, String hashedPassword, String fname, String lastname, String email) {
        //TODO
    }
}



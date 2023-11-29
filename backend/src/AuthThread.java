/**
 * HTTP server that verifies authentication requests
 */
import java.io.*;
import java.net.InetSocketAddress;
import com.sun.net.httpserver.HttpServer;

public class AuthThread extends Thread {

    @Override
    public void run() {
        try {
            startAuthentication();
        }
        catch (IOException ioe) {
            System.out.println("ioe: " + ioe.getMessage());
        }

    }
    public void startAuthentication() throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8089), 0);
        server.createContext("/login", new Login());
        server.createContext("/signup", new SignUp());
        server.setExecutor(null);
        server.start();
    }
}
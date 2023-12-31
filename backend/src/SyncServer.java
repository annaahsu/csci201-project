import java.net.InetSocketAddress;
import java.util.*;

import com.google.gson.Gson;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

public class SyncServer extends WebSocketServer {

    private SyncThread syncThread;
    Gson gson;
    Set<InetSocketAddress> checkedEndpoints;
    Set<InetSocketAddress> loggedInEndpoints;

    public SyncServer(SyncThread syncThread, InetSocketAddress address) {
        super(address);
        this.gson = new Gson();
        this.syncThread = syncThread;
        this.checkedEndpoints = new HashSet<>();
        this.loggedInEndpoints = new HashSet<>();
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        Update initialUpdate = new Update();
        initialUpdate.palette = syncThread.palette;
        initialUpdate.pixels = new PixelWithXY[syncThread.canvasData.size()];
        int i = 0;
        for(Map.Entry<XY, Pixel> entry : syncThread.canvasData.entrySet()) {
            PixelWithXY curr = new PixelWithXY(entry.getValue().getColorIndex(), entry.getValue().getTimestamp(), entry.getKey().getX(), entry.getKey().getY());
            initialUpdate.pixels[i] = curr;
            ++i;
        }

        conn.send(gson.toJson(initialUpdate));
        System.out.println("new connection to " + conn.getRemoteSocketAddress());
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        checkedEndpoints.remove(conn.getLocalSocketAddress());
        loggedInEndpoints.remove(conn.getLocalSocketAddress());
        System.out.println("closed " + conn.getRemoteSocketAddress() + " with exit code " + code + " additional info: " + reason);
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        if(!checkedEndpoints.contains(conn.getLocalSocketAddress())) {
            System.out.println(message);
            checkedEndpoints.add(conn.getLocalSocketAddress());
            if(message.equals("guest")) {
                return;
            }

            // tried logging in with token
            if(Login.verifyJWT(message)) {
                loggedInEndpoints.add(conn.getLocalSocketAddress());
            }
            else {
                conn.closeConnection(-1, "Invalid token");
                return;
            }
            return;
        }

        if(!loggedInEndpoints.contains(conn.getLocalSocketAddress())) {
            conn.closeConnection(-1, "Not logged in user tried to write");
            return;
        }

        System.out.println(message);



        Update update = gson.fromJson(message, Update.class);
        System.out.println("received message from "	+ conn.getRemoteSocketAddress() + ": " + message);
        ArrayList<WebSocket> toBroadcast = new ArrayList<>();
        for(WebSocket connection : getConnections()) {
            if(!connection.equals(conn)) {
                toBroadcast.add(connection);
            }
        }
        broadcast(message, toBroadcast);
        if(update.palette != null) {
            syncThread.palette.setColors(update.palette.getColors(), update.palette.getTimestamp());
        }
        if(update.pixels != null) {
            System.out.println("Yup");
            for(PixelWithXY pixelWithXY : update.pixels) {
                System.out.println(syncThread.canvasData.get(new XY(pixelWithXY.getX(), pixelWithXY.getY())));
                syncThread.canvasData.computeIfPresent(new XY(pixelWithXY.getX(), pixelWithXY.getY()), ((xy, pixel) -> pixelWithXY.getTimestamp() > pixel.getTimestamp() ? new Pixel(pixelWithXY.getColorIndex(), pixelWithXY.getTimestamp()) : pixel));
            }
        }
        System.out.println("Finished processing message: " + message);
    }

    @Override
    public void onError(WebSocket conn, Exception ex) {
        System.err.println("an error occurred on connection " + conn.getRemoteSocketAddress()  + ":" + ex);
    }

    @Override
    public void onStart() {
        System.out.println("server started successfully");
    }
}
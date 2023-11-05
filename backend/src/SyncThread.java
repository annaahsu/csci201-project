import java.net.InetSocketAddress;

public class SyncThread extends Thread {
    @Override
    public void run() {
        SyncServer server = new SyncServer(new InetSocketAddress("localhost", 8124));
        server.run();
    }
}
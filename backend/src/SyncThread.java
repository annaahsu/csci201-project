import java.awt.*;
import java.net.InetSocketAddress;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class SyncThread extends Thread {

    public ConcurrentMap<XY, Pixel> canvasData;
    public Palette palette;


    public SyncThread(int canvasWidth, int canvasHeight) {
        this.canvasData = new ConcurrentHashMap<>();
        this.palette = new Palette();

        for(int i = 0; i < canvasWidth; ++i) {
            for(int j = 0; j < canvasHeight; ++j) {
                canvasData.put(new XY(i, j), new Pixel(12));
            }
        }
    }

    @Override
    public void run() {
        SyncServer server = new SyncServer(this, new InetSocketAddress("localhost", 8124));
        server.run();
    }
}
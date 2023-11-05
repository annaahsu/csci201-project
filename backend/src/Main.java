import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Main entrypoint of the backend - manages the various threads that serve the sync server and auth server
 */
public class Main {
    public static void main(String[] args) {
        System.out.println("Starting backend...");

        ExecutorService threadpool = Executors.newCachedThreadPool();

        threadpool.execute(new AuthThread());
        threadpool.execute(new SyncThread());
    }
}
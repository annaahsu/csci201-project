import org.java_websocket.server.DefaultSSLWebSocketServerFactory;

import javax.net.ssl.KeyManager;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.xml.bind.DatatypeConverter;
import java.awt.*;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.interfaces.RSAPrivateKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

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
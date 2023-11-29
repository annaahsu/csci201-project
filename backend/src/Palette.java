import java.awt.*;

public class Palette {

    private String[] colors;
    private long timestamp;

    public long getTimestamp() {
        return timestamp;
    }

    public Palette() {
        colors = new String[] {
                "#f6dbba", "#db604c",
                "#b13353", "#5e2052",
                "#74c99e", "#317c87",
                "#271854", "#1a1016"
        };
        timestamp = System.currentTimeMillis();
    }

    public synchronized String[] getColors() {
        return colors;
    }

    public synchronized void setColors(String[] colors, long timestamp) {
        if(timestamp > this.timestamp) {
            this.colors = colors;
        }
    }
}

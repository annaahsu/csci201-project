import java.awt.*;

public class Palette {

    private String[] colors;
    private long timestamp;

    public long getTimestamp() {
        return timestamp;
    }

    public Palette() {
        colors = new String[] {
                "#1a1c2c", "#5d275d", "#b13e53", "#ef7d57",
                "#ffcd75", "#a7f070", "#38b764", "#257179",
                "#29366f", "#3b5dc9", "#41a6f6", "#73eff7",
                "#f4f4f4", "#94b0c2", "#566c86", "#333c57"
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

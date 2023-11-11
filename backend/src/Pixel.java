public class Pixel {

    private int colorIndex;
    private long timestamp;

    public Pixel(int colorIndex) {
        this.colorIndex = colorIndex;
        this.timestamp = System.currentTimeMillis();
    }

    public Pixel(int colorIndex, long timestamp) {
        this.colorIndex = colorIndex;
        this.timestamp = timestamp;
    }

    public int getColorIndex() {
        return colorIndex;
    }

    public void setColorIndex(int colorIndex) {
        this.colorIndex = colorIndex;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
}

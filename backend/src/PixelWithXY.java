public class PixelWithXY {
    private int colorIndex;
    private long timestamp;
    private int x;
    private int y;

    public PixelWithXY(int colorIndex, long timestamp, int x, int y) {
        this.colorIndex = colorIndex;
        this.timestamp = timestamp;
        this.x = x;
        this.y = y;
    }

    public int getColorIndex() {
        return colorIndex;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }
}

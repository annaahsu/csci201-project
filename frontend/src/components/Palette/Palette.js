import { FiPenTool, FiXCircle, FiTrash, FiRefreshCw } from "react-icons/fi";
import styles from "./Palette.module.css";

export default function Palette({
  colors,
  handleLineColor,
  widths,
  handleLineWidth,
  isLoggedIn,
  handleClearAll,
  handleChangePalette,
}) {
  return (
    <div className={[styles.palette].join(" ")}>
      <div
        className={[
          styles.paletteInside,
          isLoggedIn ? "" : styles.paletteGuest,
        ].join(" ")}
      >
        <div className={`${styles.tools} ${styles.paletteSection}`}>
          <div className={styles.tool}>
            <FiPenTool />
          </div>
          <div className={styles.tool}>
            <FiXCircle />
          </div>
          <div className={styles.tool} onClick={handleClearAll}>
            <FiTrash />
          </div>
          <div className={styles.tool} onClick={handleChangePalette}>
            <FiRefreshCw />
          </div>
        </div>
        <div className={`${styles.colorPalette} ${styles.paletteSection}`}>
          {colors.map((c, i) => (
            <Color
              color={c}
              handleLineColor={handleLineColor}
              index={i}
              key={i}
            />
          ))}
        </div>
        <div className={`${styles.stroke} ${styles.paletteSection}`}>
          {widths.map((w, i) => (
            <div
              className={styles.width}
              onClick={() => handleLineWidth(w)}
              key={i}
            >
              <svg
                width="14"
                height="22"
                viewBox="0 0 14 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="13"
                  y1="1"
                  x2="0.5"
                  y2="21.5"
                  stroke="black"
                  strokeWidth={w}
                />
              </svg>
            </div>
          ))}
        </div>
      </div>
      <div
        className={styles.paletteOverlay}
        style={isLoggedIn ? { display: "none" } : { display: "flex" }}
      >
        <div>Log in to draw on the canvas</div>
      </div>
    </div>
  );
}

function Color({ color, handleLineColor, index }) {
  return (
    <div
      className={styles.color}
      style={{ background: `${color}` }}
      onClick={() => handleLineColor(index)}
    />
  );
}

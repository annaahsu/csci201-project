"use client";

import { useEffect, useRef, useState } from "react";
import Palette from "@/components/Palette/Palette";
import styles from "./Canvas.module.css";
import useWebSocket from "react-use-websocket";

export default function Canvas() {
  const width = 360;
  const height = 240;
  const [colors, setColors] = useState([]);
  const [colorsTimestamp, setColorsTimestamp] = useState(0);
  const widths = [1, 2, 4];
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const prevX = useRef(0);
  const prevY = useRef(0);
  const [lineColor, setLineColor] = useState(null);
  const [lineColorIndex, setLineColorIndex] = useState(-1);
  const [lineWidth, setLineWidth] = useState(widths[0]);

  const timestamps = new Array(width).fill(new Array(height).fill(0));

  const socketUrl = "ws://localhost:8124";

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log("opened"),
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
  });

  // to receive updates
  useEffect(() => {
    if (lastJsonMessage) {
      console.log("updating with", lastJsonMessage);
      const newPalette = lastJsonMessage.palette;
      const newPixels = lastJsonMessage.pixels;
      if (newPalette.timestamp > colorsTimestamp) {
        setColors(newPalette.colors);
        setColorsTimestamp(newPalette.timestamp);
        if (!lineColor) {
          setLineColor(newPalette.colors[0]);
          setLineColorIndex(0);
        }
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      newPixels.map(({ colorIndex, timestamp, x, y }) => {
        if (timestamp > timestamps[x][y]) {
          ctx.fillStyle = newPalette.colors[colorIndex];
          ctx.fillRect(x, y, 1, 1);
        }
      });
    }
  }, [lastJsonMessage]);

  const handleLineColor = (i) => {
    setLineColor(colors[i]);
    setLineColorIndex(i);
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    prevX.current = e.nativeEvent.offsetX;
    prevY.current = e.nativeEvent.offsetY;
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseMove = async (e) => {
    if (!isDrawing || lineColor === null) return;

    const currentX = e.nativeEvent.offsetX;
    const currentY = e.nativeEvent.offsetY;

    const myPrevX = prevX.current;
    const myPrevY = prevY.current;

    prevX.current = currentX;
    prevY.current = currentY;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    const container = document.getElementById("canvas");
    const scaleX = container.offsetWidth / width;
    const scaleY = container.offsetHeight / height;

    // implementation of Bresenham's line algorithm
    // based on https://storage.googleapis.com/jblate/medium/bresenham-line-algorithm.html
    let pixelsSet = new Set();
    const encode = (x, y) => {
      return x * 9999 + y;
    };
    const bresenhamAlgorithm = (startX, startY, endX, endY) => {
      const deltaCol = Math.abs(endX - startX); // zero or positive number
      const deltaRow = Math.abs(endY - startY); // zero or positive number

      let pointX = startX;
      let pointY = startY;

      const horizontalStep = startX < endX ? 1 : -1;

      const verticalStep = startY < endY ? 1 : -1;

      let difference = deltaCol - deltaRow;

      while (true) {
        const doubleDifference = 2 * difference; // necessary to store this value

        if (doubleDifference > -deltaRow) {
          difference -= deltaRow;
          pointX += horizontalStep;
        }
        if (doubleDifference < deltaCol) {
          difference += deltaCol;
          pointY += verticalStep;
        }

        pixelsSet.add(encode(pointX, pointY));

        if (pointX == endX && pointY == endY) {
          break;
        }
      }

      // width adjustment - copy out set, apply mask to each point
      if (lineWidth === 2) {
        // todo - a no good very bad implementation
        const pixelSetCopy = new Set(pixelsSet);
        for (const pix of pixelSetCopy) {
          const x = Math.floor(pix / 9999);
          const y = pix % 9999;
          pixelsSet.add(encode(x + 1, y));
          pixelsSet.add(encode(x, y + 1));
        }
      } else if (lineWidth === 4) {
        const pixelSetCopy = new Set(pixelsSet);
        for (const pix of pixelSetCopy) {
          const x = Math.floor(pix / 9999);
          const y = pix % 9999;
          pixelsSet.add(encode(x - 1, y));
          pixelsSet.add(encode(x + 1, y));
          pixelsSet.add(encode(x, y - 1));
          pixelsSet.add(encode(x, y + 1));
        }
      }
    };
    bresenhamAlgorithm(
      Math.round(myPrevX / scaleX),
      Math.round(myPrevY / scaleY),
      Math.round(currentX / scaleX),
      Math.round(currentY / scaleY),
    );
    const bigint = parseInt(lineColor.replaceAll("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    const pixel = ctx.createImageData(1, 1);
    pixel.data[0] = r;
    pixel.data[1] = g;
    pixel.data[2] = b;
    pixel.data[3] = 255;
    const newChanges = [];
    const tstamp = Date.now();
    for (const pix of pixelsSet) {
      const x = Math.floor(pix / 9999);
      const y = pix % 9999;
      if (x < 0 || x >= width || y < 0 || y >= height) {
        continue;
      }
      const p = { x: x, y: y, timestamp: tstamp, colorIndex: lineColorIndex };
      ctx.putImageData(pixel, p.x, p.y);
      newChanges.push(p);
    }

    const update = {
      pixels: newChanges,
      palette: {
        colors: colors,
        timestamp: Date.now(),
      },
    };
    sendJsonMessage(update);
    console.log(update);
  };

  return (
    <div className={styles.canvasWrapper}>
      <canvas
        className={styles.canvas}
        id="canvas"
        width={width}
        height={height}
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        The canvas could not be displayed. Please try again.
      </canvas>
      <Palette
        colors={colors}
        // handleLineColor={setLineColor}
        handleLineColor={handleLineColor}
        widths={widths}
        handleLineWidth={setLineWidth}
      />
    </div>
  );
}

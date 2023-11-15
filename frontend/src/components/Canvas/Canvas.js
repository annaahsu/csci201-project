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
  const [prevX, setPrevX] = useState(0);
  const [prevY, setPrevY] = useState(0);
  const [lineColor, setLineColor] = useState(null);
  const [lineColorIndex, setLineColorIndex] = useState(-1);
  const [lineWidth, setLineWidth] = useState(widths[0]);

  const [changes, setChanges] = useState([]);
  const timestamps = new Array(width).fill(new Array(height).fill(0));

  const socketUrl = "ws://localhost:8124";

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log("opened"),
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
  });

  // to send out updates
  useEffect(() => {
    const intervalID = setInterval(() => {
      if (changes.length > 0) {
        const update = {
          pixels: changes,
          palette: {
            colors: colors,
            timestamp: Date.now(),
          },
        };
        sendJsonMessage(update);
        console.log(update)
        setChanges([]);
      }
    }, 1000);

    return () => clearInterval(intervalID);
  }, [changes]);

  // to receive updates
  useEffect(() => {
    if (lastJsonMessage) {
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
    setPrevX(e.nativeEvent.offsetX);
    setPrevY(e.nativeEvent.offsetY);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const currentX = e.nativeEvent.offsetX;
    const currentY = e.nativeEvent.offsetY;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = "bevel";
    ctx.lineCap = "round";
    ctx.imageSmoothingEnabled = false;

    const container = document.getElementById("canvas");
    const scaleX = container.offsetWidth / width;
    const scaleY = container.offsetHeight / height;

    ctx.beginPath();
    ctx.moveTo(prevX / scaleX, prevY / scaleY);
    ctx.lineTo(currentX / scaleX, currentY / scaleY);
    ctx.stroke();

    setPrevX(currentX);
    setPrevY(currentY);
    setChanges([
      ...changes,
      {
        colorIndex: lineColorIndex,
        timestamp: Date.now(),
        x: currentX,
        y: currentY,
      },
    ]);
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

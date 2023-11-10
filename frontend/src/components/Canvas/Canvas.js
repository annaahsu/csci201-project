"use client";

import { useRef, useState } from "react";
import Palette from "@/components/Palette/Palette";
import styles from "./Canvas.module.css";

export default function Canvas() {
  const colors = [
    "#000000",
    "#ffffff",
    "#00ff00",
    "#0000ff",
    "#00ffff",
    "#ff0000",
    "#ff00ff",
    "#ff9f00",
    "#ffff00",
    "#d9d9d9",
  ];
  const widths = [1, 2, 4];

  let changes = [];

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prevX, setPrevX] = useState(0);
  const [prevY, setPrevY] = useState(0);
  const [lineColor, setLineColor] = useState(colors[0]);
  const [lineWidth, setLineWidth] = useState(widths[0]);
  const width = 360;
  const height = 240;

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
    changes.push([currentX, currentY]);
  };

  const pushChanges = () => {
    // get current time, array of pixel changes, color
    const json = {
      timestamp: Date.now(),
      pixels: changes,
      color: lineColor,
    };
    changes = []; // empty out the changes for next push
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
        handleLineColor={setLineColor}
        widths={widths}
        handleLineWidth={setLineWidth}
      />
    </div>
  );
}

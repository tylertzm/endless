'use client';

import { useEffect, useRef } from 'react';

/**
 * Configuration for the wave simulation
 */
const config = {
  lineCount: 3,
  segmentLength: 10,
  amplitude: 100,
  frequency: 0.002,
  speed: 0.0005,
  lineWidth: 2,
  color: '#FFFFFF'
};

/**
 * Represents a single flowing line
 */
class FluidLine {
  index: number;
  total: number;
  randomOffset: number;
  speedMod: number;
  ampMod: number;
  baseX: number;

  constructor(index: number, total: number, width: number) {
    this.index = index;
    this.total = total;
    this.randomOffset = Math.random() * 1000;
    this.speedMod = 0.8 + Math.random() * 0.4;
    this.ampMod = 0.8 + Math.random() * 0.5;

    this.baseX = (width / (total + 1)) * (index + 1);
  }

  updateBaseX(width: number) {
    this.baseX = (width / (this.total + 1)) * (this.index + 1);
  }

  draw(ctx: CanvasRenderingContext2D, t: number, height: number) {
    ctx.beginPath();
    ctx.strokeStyle = config.color;
    ctx.lineWidth = config.lineWidth;
    ctx.lineCap = 'round';

    let started = false;

    // Loop down the screen in segments
    for (let y = -50; y < height + 50; y += config.segmentLength) {

      // Layer 1: Large slow wave
      const wave1 = Math.sin(y * config.frequency + t * this.speedMod + this.randomOffset);

      // Layer 2: Medium faster wave
      const wave2 = Math.sin(y * config.frequency * 2.5 + t * this.speedMod * 1.5 + this.randomOffset);

      // Layer 3: Subtle detail wave
      const wave3 = Math.sin(y * config.frequency * 5 + t * 0.5);

      const xOffset = (wave1 * config.amplitude * this.ampMod) +
                    (wave2 * (config.amplitude * 0.5)) +
                    (wave3 * (config.amplitude * 0.1));

      const x = this.baseX + xOffset;

      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
  }
}

export default function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width: number, height: number;
    let time = 0;
    let lines: FluidLine[] = [];

    // Resize handler
    function resize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      lines.forEach(line => line.updateBaseX(width));
    }

    // Initialize Lines
    function initLines() {
      if (!canvas) return;
      lines = [];
      for (let i = 0; i < config.lineCount; i++) {
        lines.push(new FluidLine(i, config.lineCount, width));
      }
    }

    // Animation Loop
    function animate() {
      if (!canvas || !ctx) return;
      // Clear the canvas to transparent so the CSS background-color shows through
      ctx.clearRect(0, 0, width, height);

      time += config.speed;

      lines.forEach(line => line.draw(ctx, time * 5, height));

      animationRef.current = requestAnimationFrame(animate);
    }

    resize();
    initLines();
    animate();

    window.addEventListener('resize', () => {
      resize();
      initLines();
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: '#000000',
        zIndex: -1,
      }}
    />
  );
}
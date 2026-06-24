/**
 * Visual background interface mimicking synaptic nodes and network architecture.
 * Implements performance constraints to avoid execution bottlenecks on high node densities.
 */
import React, { useEffect, useRef, memo } from 'react';

interface NetworkNode {
  id: number;
  x: number;
  y: number;
  z: number;
  px: number;
  py: number;
  pz: number;
  connections: NetworkNode[];
}

interface NetworkSpark {
  from: NetworkNode;
  to: NetworkNode;
  progress: number;
  speed: number;
}

interface NeuralNetworkBackgroundProps {
  isThinking?: boolean;
}

function NeuralNetworkBackground({ isThinking = false }: NeuralNetworkBackgroundProps): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isThinkingRef = useRef(isThinking);

  useEffect(() => {
    isThinkingRef.current = isThinking;
  }, [isThinking]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let nodes: NetworkNode[] = [];
    let sparks: NetworkSpark[] = [];
    let w = 0;
    let h = 0;
    let angle = 0;

    const themeColors = {
      bg: '10, 14, 23',
      cyan: '0, 240, 255',
      amber: '255, 179, 0'
    };

    const syncColors = (): void => {
      try {
        const style = getComputedStyle(document.documentElement);
        themeColors.bg = style.getPropertyValue('--bg-primary').trim() || '10, 14, 23';
        themeColors.cyan = style.getPropertyValue('--accent-cyan').trim() || '0, 240, 255';
        themeColors.amber = style.getPropertyValue('--accent-amber').trim() || '255, 179, 0';
      } catch {}
    };

    syncColors();
    const themeObserver = new MutationObserver(syncColors);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const resize = (): void => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const spawnSpark = (): void => {
      if (nodes.length === 0) return;
      let attempts = 0;

      while (attempts < 15) {
        const from = nodes[Math.floor(Math.random() * nodes.length)];
        if (from.connections.length > 0) {
          const to = from.connections[Math.floor(Math.random() * from.connections.length)];
          sparks.push({ from, to, progress: 0, speed: 0.005 + Math.random() * 0.015 });
          return;
        }
        attempts++;
      }
    };

    const initNetwork = (): void => {
      nodes = [];
      sparks = [];
      let idCounter = 0;

      for (let i = 0; i < 40000; i++) {
        const x = (Math.random() * 2 - 1) * 1.3;
        const y = (Math.random() * 2 - 1) * 1.1;
        const z = (Math.random() * 2 - 1) * 0.8;

        const tilt = 0.2;
        const tx = x * Math.cos(tilt) - y * Math.sin(tilt);
        const ty = x * Math.sin(tilt) + y * Math.cos(tilt);

        const inCerebrum = (Math.pow(tx / 1.1, 2) + Math.pow(ty / 0.8, 2) + Math.pow(z / 0.65, 2)) <= 1;
        const inCerebellum = (Math.pow((x + 0.6) / 0.35, 2) + Math.pow((y + 0.4) / 0.35, 2) + Math.pow(z / 0.4, 2)) <= 1;
        const inStem = x > -0.4 && x < -0.1 && y > -1.0 && y < -0.4 && z > -0.2 && z < 0.2;

        let valid = inCerebrum || inCerebellum || inStem;

        if (valid && inCerebrum) {
          const fold = Math.sin(x * 14) * Math.cos(y * 14) * Math.sin(z * 14);
          if (fold > 0.25) valid = false;
        }

        if (valid) {
          nodes.push({ id: idCounter++, x, y, z, px: 0, py: 0, pz: 0, connections: [] });
          if (nodes.length >= 3000) break;
        }
      }

      const MAX_DIST_SQ = 0.0225;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        let connCount = 0;

        for (let j = 1; j < Math.min(nodes.length, 500); j++) {
          const target = nodes[(i + j) % nodes.length];
          const dx = target.x - node.x;
          const dy = target.y - node.y;
          const dz = target.z - node.z;

          if (dx*dx + dy*dy + dz*dz < MAX_DIST_SQ) {
            node.connections.push(target);
            connCount++;
            if (connCount >= 3) break;
          }
        }
      }

      for (let i = 0; i < 200; i++) {
        spawnSpark();
      }
    };

    initNetwork();
    window.addEventListener('resize', resize);
    resize();

    const draw = (): void => {
      try {
        const { bg, cyan, amber } = themeColors;
        ctx.fillStyle = `rgb(${bg})`;
        ctx.fillRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h / 2;
        const radius = Math.min(cx, cy) * 1.1;
        const fov = 3.5;

        angle += 0.00018;
        const cosT = Math.cos(angle);
        const sinT = Math.sin(angle);
        const isThinkingNow = isThinkingRef.current;

        nodes.forEach(node => {
          const rx = node.x * cosT + node.z * sinT;
          const rz = -node.x * sinT + node.z * cosT;
          const scale = fov / (fov + rz);

          node.px = cx + rx * radius * scale;
          node.py = cy - node.y * radius * scale;
          node.pz = rz;
        });

        const depthBuckets = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
        nodes.forEach(node => {
          node.connections.forEach(target => {
            if (node.id < target.id) {
              const avgZ = (node.pz + target.pz) / 2;
              let bIdx = Math.floor(((1.5 - avgZ) / 3) * 4);
              bIdx = Math.max(0, Math.min(3, bIdx));

              depthBuckets[bIdx].moveTo(node.px, node.py);
              depthBuckets[bIdx].lineTo(target.px, target.py);
            }
          });
        });

        ctx.lineWidth = 0.4;
        depthBuckets.forEach((path, i) => {
          ctx.strokeStyle = `rgba(${cyan}, ${0.02 + i * 0.06})`;
          ctx.stroke(path);
        });

        if (isThinkingNow) {
          const frontalX = 0.7;
          const frontalZ = 0.0;

          const rx = frontalX * cosT + frontalZ * sinT;
          const rz = -frontalX * sinT + frontalZ * cosT;
          const scale = fov / (fov + rz);

          const glowPx = cx + rx * radius * scale;
          const glowPy = cy - 0.4 * radius * scale;

          const pulse = Math.sin(Date.now() / 100) * 0.5 + 0.5;
          const glowRadius = Math.max(1, 250 * scale);

          const gradient = ctx.createRadialGradient(glowPx, glowPy, 0, glowPx, glowPy, glowRadius);
          gradient.addColorStop(0, `rgba(${cyan}, ${0.15 + 0.2 * pulse})`);
          gradient.addColorStop(0.5, `rgba(${cyan}, ${0.05 + 0.1 * pulse})`);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.fillStyle = gradient;
          ctx.globalCompositeOperation = 'screen';
          ctx.beginPath();
          ctx.arc(glowPx, glowPy, glowRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
        }

        for (let i = sparks.length - 1; i >= 0; i--) {
          const spark = sparks[i];
          spark.progress += spark.speed * (isThinkingNow ? 3.5 : 1);

          if (spark.progress >= 1) {
            sparks.splice(i, 1);
            spawnSpark();
            continue;
          }

          const currX = spark.from.x + (spark.to.x - spark.from.x) * spark.progress;
          const currY = spark.from.y + (spark.to.y - spark.from.y) * spark.progress;
          const currZ = spark.from.z + (spark.to.z - spark.from.z) * spark.progress;

          const rx = currX * cosT + currZ * sinT;
          const rz = -currX * sinT + currZ * cosT;
          const scale = fov / (fov + rz);

          const px = cx + rx * radius * scale;
          const py = cy - currY * radius * scale;
          const sparkSize = Math.max(0.5, (isThinkingNow ? 2.5 : 1.8) * scale);

          ctx.beginPath();
          ctx.arc(px, py, sparkSize, 0, Math.PI * 2);

          const sparkAlpha = Math.max(0.1, Math.min(1, (1.5 - rz) / 2));
          const isFrontal = currX > 0.2 && currY > 0;

          ctx.fillStyle = (isThinkingNow && isFrontal) ? `rgba(${cyan}, ${sparkAlpha})` : `rgba(${amber}, ${sparkAlpha})`;
          ctx.fill();

          if (scale > 1.0 && sparkAlpha > 0.7) {
            ctx.shadowBlur = isThinkingNow ? 12 : 6;
            ctx.shadowColor = ctx.fillStyle;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      } catch {}

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      themeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

export default memo(NeuralNetworkBackground);
/**
 * Dual-Layer Rendering Engine for the Landing Background.
 * Layer 1 (Canvas 2D): Handles crisp, static structural UI (Grids, Nodes, Connectors).
 * Layer 2 (WebGPU): Overlays a 2,000-particle fluid dynamic simulation attracted to the UI nodes.
 * Colors mapped to the global dark theme palette (--chart-X, --primary, --background).
 */
import React, { useEffect, useRef } from 'react';

declare global {
  interface Navigator {
    gpu?: any;
  }
}

const PARTICLE_COUNT = 2000;

export default function LandingBackground(): React.JSX.Element {
  const gpuCanvasRef = useRef<HTMLCanvasElement>(null);
  const uiCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const gpuCanvas = gpuCanvasRef.current;
    const uiCanvas = uiCanvasRef.current;
    if (!gpuCanvas || !uiCanvas) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    let animationFrameId = 0;

    // Structural map of the Zero-Trust RAG pipeline using new palette (--chart-1 to --chart-5)
    const nodes = [
      { px: 0.12, py: 0.5, label: 'Ingestion', color: '#64b5f6' },      // chart-3
      { px: 0.32, py: 0.3, label: 'Sparse Vector', color: '#a48fff' },  // chart-1
      { px: 0.52, py: 0.7, label: 'Dense Vector', color: '#7986cb' },   // chart-2
      { px: 0.72, py: 0.4, label: 'Cross-Encoder', color: '#4db6ac' },  // chart-4
      { px: 0.88, py: 0.6, label: 'Generation', color: '#ff79c6' },     // chart-5
    ];

    // ─── 1. Static UI Drawing (Canvas 2D) ───────────────────────────────────
    const drawStaticUI = () => {
      const ctx = uiCanvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Draw Cyber Grid (Using --primary #a48fff at 5% opacity)
      ctx.strokeStyle = 'rgba(164, 143, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 40) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
      for (let y = 0; y < height; y += 40) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
      ctx.stroke();

      // Draw Bezier Pipeline Connections (Using --primary #a48fff at 20% opacity)
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(164, 143, 255, 0.2)';
      ctx.beginPath();
      ctx.moveTo(nodes[0].px * width, nodes[0].py * height);
      for (let i = 1; i < nodes.length; i++) {
        const prev = nodes[i - 1];
        const curr = nodes[i];
        const cp1x = prev.px * width + (curr.px * width - prev.px * width) / 2;
        ctx.bezierCurveTo(cp1x, prev.py * height, cp1x, curr.py * height, curr.px * width, curr.py * height);
      }
      ctx.stroke();

      // Draw Pipeline Nodes
      nodes.forEach(n => {
        const nx = n.px * width;
        const ny = n.py * height;

        ctx.beginPath();
        ctx.arc(nx, ny, 12, 0, Math.PI * 2);
        ctx.fillStyle = '#0f0f1a'; // --background
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = n.color;
        ctx.stroke();

        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = n.color;
        ctx.textAlign = 'center';
        ctx.fillText(n.label.toUpperCase(), nx, ny + 28);
      });
    };

    // ─── 2. Physics Engine Orchestration ────────────────────────────────────
    let cleanupGPU: (() => void) | null = null;

    const initEngines = async () => {
      if (navigator.gpu) {
        try {
          const adapter = await navigator.gpu.requestAdapter();
          if (adapter) {
            const device = await adapter.requestDevice();
            const ctx = gpuCanvas.getContext('webgpu') as any;
            if (ctx) {
              const format = navigator.gpu.getPreferredCanvasFormat();
              ctx.configure({ device, format, alphaMode: 'premultiplied' });
              cleanupGPU = runWebGPU(device, ctx, format);
              return;
            }
          }
        } catch (e) {
          console.warn('WebGPU failed, routing telemetry particles to Canvas 2D fallback', e);
        }
      }
      cleanupGPU = runCanvas2D(gpuCanvas.getContext('2d')!);
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      [gpuCanvas, uiCanvas].forEach(c => {
        c.width = width * dpr;
        c.height = height * dpr;
        c.style.width = `${width}px`;
        c.style.height = `${height}px`;
      });
      drawStaticUI();
    };

    window.addEventListener('resize', resize);
    resize();
    initEngines();

    // ─── 3. WebGPU Compute & Render Shaders ─────────────────────────────────
    function runWebGPU(device: any, context: any, format: any) {
      const computeCode = `
        struct Particle { pos: vec2f, vel: vec2f }
        @group(0) @binding(0) var<storage, read_write> particles: array<Particle>;
        @group(0) @binding(1) var<uniform> attractors: array<vec4f, 5>;
        @group(0) @binding(2) var<uniform> params: vec4f;

        @compute @workgroup_size(64)
        fn main(@builtin(global_invocation_id) id: vec3u) {
          let i = id.x;
          if (i >= u32(params.w)) { return; }
          var p = particles[i];

          var force = vec2f(0.0);
          for (var n = 0; n < 5; n++) {
            let diff = attractors[n].xy - p.pos;
            let dist = length(diff) + 0.5;
            force += (diff / dist) * (0.03 / dist);
          }
          let angle = params.x * 0.5 + p.pos.x * 0.01 + p.pos.y * 0.01;
          force += vec2f(cos(angle), sin(angle)) * 0.008;

          p.vel = p.vel * 0.95 + force;
          p.pos += p.vel;

          if (p.pos.x < 0.0) { p.pos.x = params.y; }
          if (p.pos.x > params.y) { p.pos.x = 0.0; }
          if (p.pos.y < 0.0) { p.pos.y = params.z; }
          if (p.pos.y > params.z) { p.pos.y = 0.0; }

          particles[i] = p;
        }
      `;

      const renderCode = `
        struct Particle { pos: vec2f, vel: vec2f }
        struct VertexOutput { @builtin(position) pos: vec4f, @location(0) uv: vec2f, @location(1) color: vec4f }
        @group(0) @binding(0) var<storage, read> particles: array<Particle>;
        @group(0) @binding(1) var<uniform> params: vec4f;

        @vertex fn vs_main(@builtin(vertex_index) vi: u32, @builtin(instance_index) ii: u32) -> VertexOutput {
          var out: VertexOutput;
          if (ii >= u32(params.w)) { out.pos = vec4f(0.0); return out; }
          let p = particles[ii];
          let corners = array<vec2f, 4>(vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0), vec2f(1.0, 1.0));
          let localPos = corners[vi] * 3.5;
          out.pos = vec4f((p.pos.x + localPos.x) / params.y * 2.0 - 1.0, 1.0 - (p.pos.y + localPos.y) / params.z * 2.0, 0.0, 1.0);
          out.uv = corners[vi] * 0.5 + 0.5;
          let t = sin(params.x * 2.0 + f32(ii) * 0.1) * 0.5 + 0.5;

          // Normalized vec4f values for --primary (#a48fff) and --chart-3 (#64b5f6)
          out.color = mix(vec4f(0.643, 0.560, 1.0, 1.0), vec4f(0.392, 0.710, 0.965, 1.0), t);
          return out;
        }
        @fragment fn fs_main(in: VertexOutput) -> @location(0) vec4f {
          let alpha = 1.0 - smoothstep(0.4, 1.0, length(in.uv - 0.5) * 2.0);
          return vec4f(in.color.rgb, in.color.a * alpha * 0.6);
        }
      `;

      const particleData = new Float32Array(PARTICLE_COUNT * 4);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particleData[i * 4 + 0] = Math.random() * width * dpr;
        particleData[i * 4 + 1] = Math.random() * height * dpr;
      }

      const pBuffer = device.createBuffer({ size: particleData.byteLength, usage: 0x0080 | 0x0008 });
      device.queue.writeBuffer(pBuffer, 0, particleData);

      const aBuffer = device.createBuffer({ size: 5 * 4 * 4, usage: 0x0040 | 0x0008 });
      const paramBuffer = device.createBuffer({ size: 4 * 4, usage: 0x0040 | 0x0008 });

      const cPipe = device.createComputePipeline({ layout: 'auto', compute: { module: device.createShaderModule({ code: computeCode }), entryPoint: 'main' } });
      const rPipe = device.createRenderPipeline({
        layout: 'auto', vertex: { module: device.createShaderModule({ code: renderCode }), entryPoint: 'vs_main' },
        fragment: { module: device.createShaderModule({ code: renderCode }), entryPoint: 'fs_main', targets: [{ format, blend: { color: { srcFactor: 'src-alpha', dstFactor: 'one', operation: 'add' }, alpha: { srcFactor: 'one', dstFactor: 'one', operation: 'add' } } }] },
        primitive: { topology: 'triangle-strip' }
      });

      const bindGroup = device.createBindGroup({ layout: cPipe.getBindGroupLayout(0), entries: [{ binding: 0, resource: { buffer: pBuffer } }, { binding: 1, resource: { buffer: aBuffer } }, { binding: 2, resource: { buffer: paramBuffer } }] });

      const t0 = performance.now();
      const tick = () => {
        // Dynamically bind attractor positions to the current canvas dimensions
        device.queue.writeBuffer(aBuffer, 0, new Float32Array([
          nodes[0].px * width * dpr, nodes[0].py * height * dpr, 0, 0,
          nodes[1].px * width * dpr, nodes[1].py * height * dpr, 0, 0,
          nodes[2].px * width * dpr, nodes[2].py * height * dpr, 0, 0,
          nodes[3].px * width * dpr, nodes[3].py * height * dpr, 0, 0,
          nodes[4].px * width * dpr, nodes[4].py * height * dpr, 0, 0
        ]));

        device.queue.writeBuffer(paramBuffer, 0, new Float32Array([(performance.now() - t0) / 1000, width * dpr, height * dpr, PARTICLE_COUNT]));

        const encoder = device.createCommandEncoder();
        const cp = encoder.beginComputePass(); cp.setPipeline(cPipe); cp.setBindGroup(0, bindGroup); cp.dispatchWorkgroups(Math.ceil(PARTICLE_COUNT / 64)); cp.end();
        const rp = encoder.beginRenderPass({ colorAttachments: [{ view: context.getCurrentTexture().createView(), clearValue: { r: 0, g: 0, b: 0, a: 0 }, loadOp: 'clear', storeOp: 'store' }] });
        rp.setPipeline(rPipe); rp.setBindGroup(0, bindGroup); rp.draw(4, PARTICLE_COUNT); rp.end();
        device.queue.submit([encoder.finish()]);

        animationFrameId = requestAnimationFrame(tick);
      };
      tick();
      return () => cancelAnimationFrame(animationFrameId);
    }

    // ─── 4. Canvas 2D Fallback ──────────────────────────────────────────────
    function runCanvas2D(ctx: CanvasRenderingContext2D) {
      const pData = Array.from({ length: PARTICLE_COUNT }, () => ({ x: Math.random() * width, y: Math.random() * height, vx: 0, vy: 0 }));

      const sprite = document.createElement('canvas'); sprite.width = 16; sprite.height = 16;
      const sCtx = sprite.getContext('2d')!;
      const grad = sCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
      // Utilizing --primary RGBA equivalence: rgba(164, 143, 255, alpha)
      grad.addColorStop(0, 'rgba(164, 143, 255, 0.8)'); grad.addColorStop(1, 'rgba(164, 143, 255, 0)');
      sCtx.fillStyle = grad; sCtx.fillRect(0, 0, 16, 16);

      const t0 = performance.now();
      const tick = () => {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'lighter';

        const t = (performance.now() - t0) / 1000;
        for (const p of pData) {
          let fx = 0, fy = 0;
          for (const n of nodes) {
            const dx = (n.px * width) - p.x; const dy = (n.py * height) - p.y;
            const dSq = dx * dx + dy * dy + 0.25;
            fx += (dx / Math.sqrt(dSq)) * (0.03 / dSq); fy += (dy / Math.sqrt(dSq)) * (0.03 / dSq);
          }
          const a = t * 0.5 + p.x * 0.01 + p.y * 0.01;
          p.vx = p.vx * 0.95 + fx + Math.cos(a) * 0.008; p.vy = p.vy * 0.95 + fy + Math.sin(a) * 0.008;
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = width; else if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height; else if (p.y > height) p.y = 0;
          ctx.drawImage(sprite, p.x - 8, p.y - 8);
        }
        ctx.globalCompositeOperation = 'source-over';
        animationFrameId = requestAnimationFrame(tick);
      };
      tick();
      return () => cancelAnimationFrame(animationFrameId);
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (cleanupGPU) cleanupGPU();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Layer 1: Structural UI (Grid, Nodes, Connections) */}
      <canvas ref={uiCanvasRef} className="absolute inset-0 w-full h-full" />
      {/* Layer 2: Transparent Particle Physics Overlay */}
      <canvas ref={gpuCanvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
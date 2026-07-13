import { useEffect, useRef, useState, useCallback } from 'react';
import { ForceSim } from '../engine/ForceSim';
import type { GraphNode, GraphEdge } from '../engine/ForceSim';
import { drawBackground, drawEdges, drawPackets, drawNode, screenToWorld } from '../engine/renderer';
import type { Camera, Packet } from '../engine/renderer';
import { projects, experiences, deriveEdges, deriveExperienceEdges } from '../content/portfolioData';

interface Props {
  activeId: string | null;
  onSelect: (id: string | null) => void;
  activeTag: string | null;
}

export default function SystemCanvas({ activeId, onSelect, activeTag }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simRef = useRef<ForceSim | null>(null);
  const camRef = useRef<Camera>({ x: 0, y: 0, zoom: 1, targetX: 0, targetY: 0, targetZoom: 1 });
  const packetsRef = useRef<Packet[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hoveredIdRef = useRef<string | null>(null);
  const mouseWorldRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });
  const activeIdRef = useRef(activeId);
  const activeTagRef = useRef(activeTag);

  useEffect(() => { activeIdRef.current = activeId; }, [activeId]);
  useEffect(() => { activeTagRef.current = activeTag; }, [activeTag]);
  useEffect(() => { hoveredIdRef.current = hoveredId; }, [hoveredId]);

  const nodeTagsOf = useCallback((id: string) => {
    const p = projects.find(p => p.id === id);
    if (p) return p.stack;
    const e = experiences.find(e => e.id === id);
    return e ? e.stack : [];
  }, []);

  // init sim once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const w = parent.clientWidth, h = parent.clientHeight;
    sizeRef.current = { w, h };

    const isMobile = w < 700;
    // reserve room at top (identity panel) and bottom (tag filter panel) so
    // the graph settles between them instead of underneath them
    const safeTop = isMobile ? 130 : 0;
    const safeBottom = isMobile ? 210 : 0;
    // scale node spread down to fit narrow viewports
    const spreadScale = isMobile ? Math.min(1, (w - 80) / 480) : 1;

    const edgeData = deriveEdges();
    const expEdgeData = deriveExperienceEdges();
    const nodes: GraphNode[] = [];

    // graph center sits in the middle of the safe zone between top/bottom panels, not raw viewport center
    const cx = w / 2;
    const cy = safeTop + (h - safeTop - safeBottom) / 2;

    // core node at center
    nodes.push({
      id: 'core', label: 'Amit', kind: 'core', tags: [],
      x: cx, y: cy, vx: 0, vy: 0, radius: isMobile ? 26 : 34,
    });

    // project nodes seeded in a circle around core
    const angleStep = (Math.PI * 2) / projects.length;
    projects.forEach((p, i) => {
      const angle = i * angleStep;
      const dist = 220 * spreadScale;
      nodes.push({
        id: p.id, label: p.name, kind: 'project', tags: p.stack,
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        vx: 0, vy: 0, radius: (p.status === 'live' ? 22 : 18) * (isMobile ? 0.82 : 1),
      });
    });

    // experience nodes seeded on an outer orbit, beyond the project ring
    const expAngleStep = (Math.PI * 2) / Math.max(experiences.length, 1);
    experiences.forEach((e, i) => {
      const angle = expAngleStep * i - Math.PI / 2; // start pointing up
      const dist = 340 * spreadScale;
      nodes.push({
        id: e.id, label: e.company, kind: 'experience', tags: e.stack,
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        vx: 0, vy: 0, radius: 20 * (isMobile ? 0.82 : 1),
      });
    });

    // contact node, offset to bottom-right
    nodes.push({
      id: 'contact', label: 'Contact', kind: 'contact', tags: [],
      x: cx + 300 * spreadScale, y: cy + 260 * spreadScale, vx: 0, vy: 0, radius: 26 * (isMobile ? 0.82 : 1),
    });

    const edges: GraphEdge[] = [
      // core connects to every project + contact, weaker weight (structural, not thematic)
      ...projects.map(p => ({ a: 'core', b: p.id, weight: 0.6 })),
      // core connects to experience nodes on the outer ring, similar pull to projects
      ...experiences.map(e => ({ a: 'core', b: e.id, weight: 0.5 })),
      { a: 'core', b: 'contact', weight: 0.6 },
      // thematic edges from shared stack
      ...edgeData.map(e => ({ a: e.a, b: e.b, weight: Math.min(e.weight, 3) * 0.5 })),
      ...expEdgeData.map(e => ({ a: e.a, b: e.b, weight: Math.min(e.weight, 3) * 0.4 })),
    ];

    simRef.current = new ForceSim(nodes, edges, {
      width: w, height: h, safeTop, safeBottom,
      repulsion: 18000,
      linkDistance: 210,
      linkStrength: 0.02,
      centerStrength: 0.0006,
      damping: 0.88,
    });

    camRef.current = { x: w / 2, y: h / 2, zoom: 1, targetX: w / 2, targetY: h / 2, targetZoom: 1 };

    // seed packets: a handful traveling on random edges continuously
    packetsRef.current = Array.from({ length: 14 }).map(() => ({
      edgeIndex: Math.floor(Math.random() * edges.length),
      t: Math.random(),
      speed: 0.15 + Math.random() * 0.25,
      reverse: Math.random() > 0.5,
    }));

    function handleResize() {
      const parent2 = canvas!.parentElement!;
      const w2 = parent2.clientWidth, h2 = parent2.clientHeight;
      sizeRef.current = { w: w2, h: h2 };
      const isMobile2 = w2 < 700;
      simRef.current?.setSize(w2, h2, isMobile2 ? 130 : 0, isMobile2 ? 210 : 0);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // main render/sim loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let last = performance.now();
    let pulsePhase = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resizeCanvasBuffer() {
      const { w, h } = sizeRef.current;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + 'px';
      canvas!.style.height = h + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeCanvasBuffer();
    const roObserver = new ResizeObserver(resizeCanvasBuffer);
    roObserver.observe(canvas.parentElement!);

    function loop(now: number) {
      const dt = Math.min((now - last) / 16.67, 2.5);
      last = now;
      pulsePhase += 0.03;

      const sim = simRef.current;
      const cam = camRef.current;
      const { w, h } = sizeRef.current;

      if (sim) {
        // mark active node fixed so camera can settle on it without jitter
        for (const n of sim.nodes) n.fixed = n.id === activeIdRef.current;

        if (!reduced) sim.step(dt);

        // mouse repulsion for "system under load" feel — deliberately gentle,
        // and the node currently under the cursor is exempt so it never runs from a click
        if (mouseWorldRef.current && !activeIdRef.current) {
          const { x: mx, y: my } = mouseWorldRef.current;
          const REPEL_RADIUS = 90;
          for (const n of sim.nodes) {
            if (n.fixed) continue;
            if (n.id === hoveredIdRef.current) continue; // never push away what you're aiming at
            const dx = n.x - mx, dy = n.y - my;
            const d2 = dx * dx + dy * dy;
            if (d2 < REPEL_RADIUS * REPEL_RADIUS) {
              const d = Math.sqrt(d2) || 1;
              const f = (1 - d / REPEL_RADIUS) * 1.4;
              n.vx += (dx / d) * f;
              n.vy += (dy / d) * f;
            }
          }
        }

        // camera target: follow active node (zoomed in) or reset to overview
        if (activeIdRef.current) {
          const n = sim.nodes.find(n => n.id === activeIdRef.current);
          if (n) {
            cam.targetX = n.x;
            cam.targetY = n.y - h * 0.08;
            cam.targetZoom = 1.5;
          }
        } else {
          const coreNode = sim.nodes.find(n => n.id === 'core');
          cam.targetX = coreNode ? coreNode.x : w / 2;
          cam.targetY = coreNode ? coreNode.y : h / 2;
          cam.targetZoom = 1;
        }
        cam.x += (cam.targetX - cam.x) * 0.08;
        cam.y += (cam.targetY - cam.y) * 0.08;
        cam.zoom += (cam.targetZoom - cam.zoom) * 0.08;

        // packets
        if (!reduced) {
          for (const p of packetsRef.current) {
            p.t += p.speed * 0.01 * dt;
            if (p.t >= 1) {
              p.t = 0;
              p.edgeIndex = Math.floor(Math.random() * sim.edges.length);
              p.reverse = Math.random() > 0.5;
            }
          }
        }

        drawBackground(ctx!, w, h, cam);
        drawEdges(ctx!, sim.nodes, sim.edges, cam, w, h, hoveredIdRef.current || activeIdRef.current, activeTagRef.current, nodeTagsOf);
        drawPackets(ctx!, sim.nodes, sim.edges, packetsRef.current, cam, w, h);
        for (const n of sim.nodes) {
          const isDimmed = !!activeTagRef.current && (n.kind === 'project' || n.kind === 'experience') && !nodeTagsOf(n.id).includes(activeTagRef.current);
          drawNode(ctx!, n, cam, w, h, n.id === hoveredIdRef.current, n.id === activeIdRef.current, isDimmed, pulsePhase);
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      roObserver.disconnect();
    };
  }, [nodeTagsOf]);

  function getMousePos(e: React.MouseEvent) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { sx: e.clientX - rect.left, sy: e.clientY - rect.top };
  }

  function hitTest(sx: number, sy: number): string | null {
    const sim = simRef.current;
    const cam = camRef.current;
    const { w, h } = sizeRef.current;
    if (!sim) return null;
    for (let i = sim.nodes.length - 1; i >= 0; i--) {
      const n = sim.nodes[i];
      const cx = (n.x - cam.x) * cam.zoom + w / 2;
      const cy = (n.y - cam.y) * cam.zoom + h / 2;
      const r = n.radius * cam.zoom + 14;
      const dx = sx - cx, dy = sy - cy;
      if (dx * dx + dy * dy <= r * r) return n.id;
    }
    return null;
  }

  function handleMouseMove(e: React.MouseEvent) {
    const { sx, sy } = getMousePos(e);
    const hit = hitTest(sx, sy);
    setHoveredId(hit);
    const { w, h } = sizeRef.current;
    const [wx, wy] = screenToWorld(sx, sy, camRef.current, w, h);
    mouseWorldRef.current = { x: wx, y: wy };
    const canvas = canvasRef.current;
    if (canvas) canvas.style.cursor = hit ? 'pointer' : 'default';
  }

  function handleClick(e: React.MouseEvent) {
    const { sx, sy } = getMousePos(e);
    const hit = hitTest(sx, sy);
    if (hit) {
      onSelect(hit === activeId ? null : hit);
    } else {
      onSelect(null);
    }
  }

  function handleMouseLeave() {
    setHoveredId(null);
    mouseWorldRef.current = null;
  }

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
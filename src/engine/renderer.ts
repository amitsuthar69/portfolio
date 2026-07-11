import type { GraphNode, GraphEdge } from './ForceSim';

export interface Packet {
  edgeIndex: number;
  t: number; // 0..1 progress along edge
  speed: number;
  reverse: boolean;
}

export interface Camera {
  x: number; // world-space center point camera looks at
  y: number;
  zoom: number;
  targetX: number;
  targetY: number;
  targetZoom: number;
}

const COLORS = {
  bg: '#07080A',
  bgGrid: 'rgba(255,255,255,0.028)',
  edge: 'rgba(255,255,255,0.3)',
  edgeDim: 'rgba(255,255,255,0.04)',
  edgeHighlight: 'rgba(120,240,200,0.6)',
  nodeCore: '#78F0C8',
  nodeProject: '#EDEEE9',
  nodeExperience: '#B79CFF',
  nodeContact: '#FF6A3D',
  nodeDim: 'rgba(237,238,233,0.18)',
  packet: '#78F0C8',
  packetExperience: '#B79CFF',
  packetContact: '#FF6A3D',
  text: '#EDEEE9',
  textDim: 'rgba(237,238,233,0.4)',
};

export { COLORS };

export function worldToScreen(wx: number, wy: number, cam: Camera, cw: number, ch: number) {
  const sx = (wx - cam.x) * cam.zoom + cw / 2;
  const sy = (wy - cam.y) * cam.zoom + ch / 2;
  return [sx, sy];
}

export function screenToWorld(sx: number, sy: number, cam: Camera, cw: number, ch: number) {
  const wx = (sx - cw / 2) / cam.zoom + cam.x;
  const wy = (sy - ch / 2) / cam.zoom + cam.y;
  return [wx, wy];
}

export function drawBackground(ctx: CanvasRenderingContext2D, cw: number, ch: number, cam: Camera) {
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, cw, ch);

  // subtle dot grid, parallax-shifted by camera
  const spacing = 42 * cam.zoom;
  if (spacing > 8) {
    const offsetX = ((-cam.x * cam.zoom) % spacing + spacing) % spacing;
    const offsetY = ((-cam.y * cam.zoom) % spacing + spacing) % spacing;
    ctx.fillStyle = COLORS.bgGrid;
    for (let x = offsetX; x < cw; x += spacing) {
      for (let y = offsetY; y < ch; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // radial vignette
  const grad = ctx.createRadialGradient(cw / 2, ch / 2, 0, cw / 2, ch / 2, Math.max(cw, ch) * 0.7);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, cw, ch);
}

export function drawEdges(
  ctx: CanvasRenderingContext2D,
  nodes: GraphNode[],
  edges: GraphEdge[],
  cam: Camera, cw: number, ch: number,
  activeNodeId: string | null,
  dimmedTag: string | null,
  nodeTagsOf: (id: string) => string[]
) {
  for (const e of edges) {
    const a = nodes.find(n => n.id === e.a);
    const b = nodes.find(n => n.id === e.b);
    if (!a || !b) continue;
    const [ax, ay] = worldToScreen(a.x, a.y, cam, cw, ch);
    const [bx, by] = worldToScreen(b.x, b.y, cam, cw, ch);

    let dimmed = false;
    if (dimmedTag) {
      const aHas = nodeTagsOf(a.id).includes(dimmedTag);
      const bHas = nodeTagsOf(b.id).includes(dimmedTag);
      dimmed = !(aHas && bHas);
    }

    const isActive = activeNodeId && (e.a === activeNodeId || e.b === activeNodeId);
    ctx.strokeStyle = dimmed ? COLORS.edgeDim : (isActive ? COLORS.edgeHighlight : COLORS.edge);
    ctx.lineWidth = Math.max(0.6, (isActive ? 1.6 : 0.9) * e.weight * cam.zoom * 0.7);
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  }
}

export function drawPackets(
  ctx: CanvasRenderingContext2D,
  nodes: GraphNode[],
  edges: GraphEdge[],
  packets: Packet[],
  cam: Camera, cw: number, ch: number
) {
  for (const p of packets) {
    const e = edges[p.edgeIndex];
    if (!e) continue;
    const a = nodes.find(n => n.id === e.a);
    const b = nodes.find(n => n.id === e.b);
    if (!a || !b) continue;
    const t = p.reverse ? 1 - p.t : p.t;
    const wx = a.x + (b.x - a.x) * t;
    const wy = a.y + (b.y - a.y) * t;
    const [sx, sy] = worldToScreen(wx, wy, cam, cw, ch);
    const isContactEdge = a.kind === 'contact' || b.kind === 'contact';
    const isExperienceEdge = !isContactEdge && (a.kind === 'experience' || b.kind === 'experience');

    const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 8 * cam.zoom);
    const color = isContactEdge ? COLORS.packetContact : (isExperienceEdge ? COLORS.packetExperience : COLORS.packet);
    glow.addColorStop(0, color);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(sx, sy, 8 * cam.zoom, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(sx, sy, 2 * cam.zoom, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawNode(
  ctx: CanvasRenderingContext2D,
  n: GraphNode,
  cam: Camera, cw: number, ch: number,
  isHovered: boolean,
  isActive: boolean,
  isDimmed: boolean,
  pulsePhase: number
) {
  const [sx, sy] = worldToScreen(n.x, n.y, cam, cw, ch);
  const r = n.radius * cam.zoom;

  let color = COLORS.nodeProject;
  if (n.kind === 'core') color = COLORS.nodeCore;
  if (n.kind === 'experience') color = COLORS.nodeExperience;
  if (n.kind === 'contact') color = COLORS.nodeContact;
  if (isDimmed) color = COLORS.nodeDim;

  // ambient pulse ring for core node
  if (n.kind === 'core') {
    const pulseR = r + 10 + Math.sin(pulsePhase) * 4;
    ctx.strokeStyle = 'rgba(120,240,200,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(sx, sy, pulseR, 0, Math.PI * 2);
    ctx.stroke();
  }

  // hover / active halo
  if (isHovered || isActive) {
    const haloR = r + (isActive ? 14 : 8);
    const halo = ctx.createRadialGradient(sx, sy, r * 0.5, sx, sy, haloR);
    halo.addColorStop(0, isDimmed ? 'rgba(255,255,255,0.08)' : `${color}55`);
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(sx, sy, haloR, 0, Math.PI * 2);
    ctx.fill();
  }

  // node body — project nodes render hollow (outline only); core, experience,
  // and contact render as solid filled circles
  ctx.fillStyle = n.kind === 'project' ? COLORS.bg : color;
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1, 1.6 * cam.zoom);
  ctx.beginPath();
  ctx.arc(sx, sy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // status dot for project nodes
  if (n.kind === 'project') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(sx, sy, r * 0.22, 0, Math.PI * 2);
    ctx.fill();
  }

  // label (only when zoomed enough or hovered/active to avoid clutter)
  if (cam.zoom > 0.55 || isHovered || isActive) {
    ctx.fillStyle = isDimmed ? COLORS.textDim : COLORS.text;
    ctx.font = `600 ${Math.max(10, 12 * Math.min(cam.zoom, 1.4))}px 'IBM Plex Mono', monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(n.label.toUpperCase(), sx, sy + r + 8);
  }
}
export type NodeId = string;

export interface GraphNode {
  id: NodeId;
  label: string;
  kind: 'core' | 'project' | 'experience' | 'contact';
  tags: string[];
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  // target position when "opened" (camera focuses here) — physics pauses for this node
  fixed?: boolean;
}

export interface GraphEdge {
  a: NodeId;
  b: NodeId;
  // 0..1 strength, used for spring tension + visual weight
  weight: number;
}

interface SimOptions {
  width: number;
  height: number;
  repulsion: number;
  linkDistance: number;
  linkStrength: number;
  centerStrength: number;
  damping: number;
}

export class ForceSim {
  nodes: GraphNode[];
  edges: GraphEdge[];
  opts: SimOptions;
  private adjacency: Map<NodeId, NodeId[]>;

  constructor(nodes: GraphNode[], edges: GraphEdge[], opts: SimOptions) {
    this.nodes = nodes;
    this.edges = edges;
    this.opts = opts;
    this.adjacency = new Map();
    for (const n of nodes) this.adjacency.set(n.id, []);
    for (const e of edges) {
      this.adjacency.get(e.a)?.push(e.b);
      this.adjacency.get(e.b)?.push(e.a);
    }
  }

  neighborsOf(id: NodeId): NodeId[] {
    return this.adjacency.get(id) || [];
  }

  setSize(w: number, h: number) {
    this.opts.width = w;
    this.opts.height = h;
  }

  step(dt: number) {
    const { nodes, edges, opts } = this;
    const cx = opts.width / 2;
    const cy = opts.height / 2;

    // repulsion (n^2, fine for our small graphs ~10-15 nodes)
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      if (a.fixed) continue;
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let distSq = dx * dx + dy * dy;
        if (distSq < 0.01) { dx = (Math.random() - 0.5); dy = (Math.random() - 0.5); distSq = 1; }
        const dist = Math.sqrt(distSq);
        const force = (opts.repulsion / distSq) * dt;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        a.vx += fx; a.vy += fy;
        if (!b.fixed) { b.vx -= fx; b.vy -= fy; }
      }
    }

    // springs along edges
    for (const e of edges) {
      const a = nodes.find(n => n.id === e.a);
      const b = nodes.find(n => n.id === e.b);
      if (!a || !b) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
      const targetDist = opts.linkDistance;
      const force = (dist - targetDist) * opts.linkStrength * e.weight * dt;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      if (!a.fixed) { a.vx += fx; a.vy += fy; }
      if (!b.fixed) { b.vx -= fx; b.vy -= fy; }
    }

    // weak centering
    for (const n of nodes) {
      if (n.fixed) continue;
      n.vx += (cx - n.x) * opts.centerStrength * dt;
      n.vy += (cy - n.y) * opts.centerStrength * dt;
    }

    // integrate + damping
    for (const n of nodes) {
      if (n.fixed) { n.vx = 0; n.vy = 0; continue; }
      n.vx *= opts.damping;
      n.vy *= opts.damping;
      n.x += n.vx * dt;
      n.y += n.vy * dt;

      // soft bounds
      const margin = n.radius + 40;
      if (n.x < margin) { n.x = margin; n.vx *= -0.4; }
      if (n.x > opts.width - margin) { n.x = opts.width - margin; n.vx *= -0.4; }
      if (n.y < margin) { n.y = margin; n.vy *= -0.4; }
      if (n.y > opts.height - margin) { n.y = opts.height - margin; n.vy *= -0.4; }
    }
  }
}
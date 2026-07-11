export interface ProjectData {
  id: string;
  name: string;
  desc: string;
  metric: string;
  stack: string[];
  status: 'live' | 'build';
  statusLabel: string;
}

export interface ExperienceData {
  id: string;
  company: string;
  role: string;
  duration: string;
  desc: string;
  highlight: string;
  stack: string[];
}
 
export const experiences: ExperienceData[] = [
  {
    id: 'exp-10matrix', company: '10Matrix Prime',
    role: 'Software Engineering Intern',
    duration: 'Jul 2025 - Oct 2025',
    desc: 'Built a mobile app to compute a Google Business Profile Health Score, enabling businesses to benchmark their profile quality against competitors.',
    highlight: 'Custom Genetic Algorithm',
    stack: ['React Native', 'Firebase', 'Python', 'GitHub Actions (CI/CD)', 'Razorpay'],
  },
  {
    id: 'exp-poisecode', company: 'PoiseCode',
    role: 'Software Developer Intern',
    duration: 'May 2024 - Aug 2024',
    desc: 'Designed and built a chat and voice interview module for real-time interview Q&A, integrated OpenAI TTS for audio responses, proctoring controls: tab-switch detection and video-based cheating monitoring.',
    highlight: '20+ enterprise clients in 4 countries',
    stack: ['Vue.js', 'Node.js', 'MongoDB', 'TTS'],
  },
];

export const projects: ProjectData[] = [
  {
    id: 'parsel', name: 'Parsel',
    desc: 'Distributed log aggregation on Redis Streams. Consumer groups, XAUTOCLAIM-based PEL recovery, and a live WebSocket dashboard for tailing logs across services.',
    metric: 'Open source · feature-complete',
    stack: ['Go', 'Redis', 'Postgres'],
    status: 'live', statusLabel: 'Stable',
  },
  {
    id: 'portsicle', name: 'Portsicle',
    desc: 'Creates a public ingress endpoint to expose local web servers. Tunnels HTTPS traffic over secure Websocket. (ngrok CLI alternative)',
    metric: 'MessagePack + LZ4 (~70% fatser than JSON)',
    stack: ['Go'],
    status: 'live', statusLabel: 'Stable',
  },
  {
    id: 'gotth', name: 'GoTTH',
    desc: 'GoTTH allows you to spin up a quick Full-Stack Go Web Project using HTMX, TailwindCSS, Templ and Turso SQlite db.',
    metric: 'They call it GoTTH Stack',
    stack: ['Go', 'TailwindCSS', 'SQLite', 'HTMX'],
    status: 'live', statusLabel: 'Stable',
  },
  {
    id: 'flow', name: 'Flow',
    desc: 'A CLI tool to Live reload for Golang apps.',
    metric: 'Re-run program without hard exit',
    stack: ['Go'],
    status: 'live', statusLabel: 'Stable',
  },
  {
    id: 'neuwidget', name: 'NeuWidget',
    desc: 'A minimal, Electron-free Javascript framework for building cross-platform Desktop Widgets with low resource overhead.',
    metric: 'npx create-neuwidget',
    stack: ['JavaScript', 'NeutralinoJS'],
    status: 'live', statusLabel: 'Building',
  },
  {
    id: 'storm', name: 'Storm',
    desc: 'A Discord bot for clipping servers to manage and authenticate clippers for by verifying clipper profiles and tracking submitted content.',
    metric: 'Calculate clipper revenue',
    stack: ['JavaScript', 'MongoDB'],
    status: 'live', statusLabel: 'Live',
  },
  {
    id: 'handover', name: 'HandOver',
    desc: 'A platform for college students to discover and exchange academic resources within their institution.',
    metric: '20+ exchanges in first month of launch',
    stack: ['Node.js', 'ReactJS', 'MongoDB'],
    status: 'live', statusLabel: 'Live',
  },
];

// derive edges: two project nodes connect if they share stack tags.
// weight scales with number of shared tags.
export function deriveEdges() {
  const edges: { a: string; b: string; weight: number; shared: string[] }[] = [];
  for (let i = 0; i < projects.length; i++) {
    for (let j = i + 1; j < projects.length; j++) {
      const shared = projects[i].stack.filter(s => projects[j].stack.includes(s));
      if (shared.length > 0) {
        edges.push({ a: projects[i].id, b: projects[j].id, weight: shared.length, shared });
      }
    }
  }
  return edges;
}

// experience nodes connect to project nodes that share stack tags —
// e.g. an internship using Go will pull toward your Go projects on the graph.
export function deriveExperienceEdges() {
  const edges: { a: string; b: string; weight: number; shared: string[] }[] = [];
  for (const exp of experiences) {
    for (const proj of projects) {
      const shared = exp.stack.filter(s => proj.stack.includes(s));
      if (shared.length > 0) {
        edges.push({ a: exp.id, b: proj.id, weight: shared.length, shared });
      }
    }
  }
  return edges;
}
 
export const allTags = Array.from(
  new Set([...projects.flatMap(p => p.stack), ...experiences.flatMap(e => e.stack)])
).sort();

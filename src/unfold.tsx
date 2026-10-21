import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export const NODE_LEVELS = {
  g: 0, v: 1, os: 1, i: 0, h: 1,
  p1: 0, p1b: 1, p2: 0, p2b: 1, p3: 0, p3b: 1, p4: 0, p5: 0, p6: 0, p6b: 1,
  e1: 0, e2: 0, e2b: 1, e3: 0, e3b: 1,
  c1: 0, c2: 0, c3: 0,
} as const;

export type NodeKey = keyof typeof NODE_LEVELS;

const NODE_KEYS = Object.keys(NODE_LEVELS) as NodeKey[];
const MAX_ZOOM = Math.max(...NODE_KEYS.map((k) => NODE_LEVELS[k] + 1));

type OpenMap = Partial<Record<NodeKey, boolean>>;

interface UnfoldApi {
  isOpen: (k: NodeKey) => boolean;
  open: (k: NodeKey) => void;
  jump: (k: NodeKey, id: string) => void;
  flashClass: (id: string) => string;
  zoom: number;
  maxZoom: number;
  atMin: boolean;
  atMax: boolean;
  zoomIn: () => void;
  zoomOut: () => void;
  count: number;
  total: number;
}

const UnfoldContext = createContext<UnfoldApi | null>(null);

export function useUnfold(): UnfoldApi {
  const api = useContext(UnfoldContext);
  if (!api) throw new Error('useUnfold must be used inside <UnfoldProvider>');
  return api;
}

export function UnfoldProvider({ children }: { children: ReactNode }) {
  const [openMap, setOpenMap] = useState<OpenMap>({});
  const [zoom, setZoom] = useState(0);
  const [flash, setFlash] = useState<{ id: string; n: number } | null>(null);
  const [pendingScroll, setPendingScroll] = useState<string | null>(null);

  const open = useCallback((k: NodeKey) => {
    setOpenMap((prev) => (prev[k] ? prev : { ...prev, [k]: true }));
  }, []);

  const applyZoom = useCallback((z: number) => {
    const next: OpenMap = {};
    for (const k of NODE_KEYS) {
      if (NODE_LEVELS[k] < z) next[k] = true;
    }
    setZoom(z);
    setOpenMap(next);
  }, []);

  const jump = useCallback((k: NodeKey, id: string) => {
    open(k);
    setFlash((prev) => ({ id, n: (prev?.n ?? 0) + 1 }));
    setPendingScroll(id);
  }, [open]);

  useEffect(() => {
    if (!pendingScroll) return;
    const el = document.getElementById(pendingScroll);
    if (el) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    }
    setPendingScroll(null);
  }, [pendingScroll]);

  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 2700);
    return () => clearTimeout(t);
  }, [flash]);

  const api = useMemo<UnfoldApi>(() => ({
    isOpen: (k) => !!openMap[k],
    open,
    jump,
    flashClass: (id) => (flash?.id === id ? (flash.n % 2 ? 'flash' : 'flash2') : ''),
    zoom,
    maxZoom: MAX_ZOOM,
    atMin: zoom <= 0,
    atMax: zoom >= MAX_ZOOM,
    zoomIn: () => applyZoom(Math.min(MAX_ZOOM, zoom + 1)),
    zoomOut: () => applyZoom(Math.max(0, zoom - 1)),
    count: NODE_KEYS.filter((k) => openMap[k]).length,
    total: NODE_KEYS.length,
  }), [openMap, zoom, flash, open, jump, applyZoom]);

  return <UnfoldContext.Provider value={api}>{children}</UnfoldContext.Provider>;
}

export function Unfold({ k, label, children }: { k: NodeKey; label: string; children: ReactNode }) {
  const { isOpen, open } = useUnfold();

  if (!isOpen(k)) {
    return (
      <button className="tw" onClick={() => open(k)} aria-expanded="false">
        {label}
        <sup>+</sup>
      </button>
    );
  }
  return <span className="grow">{children}</span>;
}

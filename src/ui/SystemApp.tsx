import { useState } from 'react';
import SystemCanvas from './SystemCanvas';
import HUD from './HUD';
import SystemCursor from './SystemCursor';
import './SystemApp.css';

export default function SystemApp() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  return (
    <div className="system-root">
      <SystemCursor />
      <div className="system-canvas-wrap">
        <SystemCanvas activeId={activeId} onSelect={setActiveId} activeTag={activeTag} />
      </div>
      <HUD activeId={activeId} onSelect={setActiveId} activeTag={activeTag} onTag={setActiveTag} />
    </div>
  );
}

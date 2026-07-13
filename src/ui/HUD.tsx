import { useEffect, useState } from 'react';
import { projects, experiences, allTags } from '../content/portfolioData';
import './HUD.css';

interface Props {
  activeId: string | null;
  onSelect: (id: string | null) => void;
  activeTag: string | null;
  onTag: (tag: string | null) => void;
}

export default function HUD({ activeId, onSelect, activeTag, onTag }: Props) {
  const [clock, setClock] = useState('');

  useEffect(() => {
    function tick() {
      const d = new Date();
      setClock(d.toTimeString().slice(0, 8) + ' IST');
    }
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onSelect(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onSelect]);

  const activeProject = projects.find(p => p.id === activeId);
  const activeExperience = experiences.find(e => e.id === activeId);
  const isContact = activeId === 'contact';
  const isCore = activeId === 'core';

  return (
    <>
      {/* top-left identity readout */}
      <div className="hud-identity">
        <div className="hud-id-row">
          <span className="hud-dot" />
          <span className="hud-name">AMIT SUTHAR</span>
        </div>
        <div className="hud-sub">BACKEND ENGINEER</div>
        <div className="hud-clock">{clock}</div>
      </div>

      {/* top-right hint */}
      <div className="hud-hint">
        <span>CLICK A NODE TO INSPECT</span>
        <span className="hud-hint-dim">DRAG TO PERTURB · ESC TO CLOSE</span>
      </div>

      {/* bottom-left legend / filter — hidden on mobile while a detail panel is open, since both dock to the bottom */}
      <div className={'hud-legend' + (activeId ? ' hud-legend-panel-open' : '')}>
        <div className="hud-legend-title">FILTER BY STACK</div>
        <div className="hud-legend-tags">
          {allTags.map(tag => (
            <button
              key={tag}
              className={'hud-tag' + (activeTag === tag ? ' active' : '')}
              onClick={() => onTag(activeTag === tag ? null : tag)}
              data-cursor="FILTER"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* bottom-right legend for node kinds */}
      <div className="hud-key">
        <div className="hud-key-row"><span className="dot core" /> Core</div>
        <div className="hud-key-row"><span className="dot project" /> Project</div>
        <div className="hud-key-row"><span className="dot experience" /> Experience</div>
        <div className="hud-key-row"><span className="dot contact" /> Contact</div>
      </div>

      {/* detail panel */}
      {activeProject && (
        <div className="hud-panel" key={activeProject.id}>
          <button className="hud-panel-close" onClick={() => onSelect(null)} data-cursor="CLOSE">×</button>
          <div className="hud-panel-status">
            <span className={'status-pill ' + activeProject.status}>{activeProject.statusLabel}</span>
          </div>
          <h2>{activeProject.name}</h2>
          <p className="hud-panel-desc">{activeProject.desc}</p>
          <div className="hud-panel-metric">{activeProject.metric}</div>
          <div className="hud-panel-stack">
            {activeProject.stack.map(s => (
              <button key={s} className="hud-tag small" onClick={() => onTag(s)} data-cursor="FILTER">{s}</button>
            ))}
          </div>
        </div>
      )}

      {activeExperience && (
        <div className="hud-panel" key={activeExperience.id}>
          <button className="hud-panel-close" onClick={() => onSelect(null)} data-cursor="CLOSE">×</button>
          <div className="hud-panel-status">
            <span className="status-pill experience">{activeExperience.duration}</span>
          </div>
          <h2>{activeExperience.company}</h2>
          <div className="hud-panel-role">{activeExperience.role}</div>
          <p className="hud-panel-desc">{activeExperience.desc}</p>
          <div className="hud-panel-metric">{activeExperience.highlight}</div>
          <div className="hud-panel-stack">
            {activeExperience.stack.map(s => (
              <button key={s} className="hud-tag small" onClick={() => onTag(s)} data-cursor="FILTER">{s}</button>
            ))}
          </div>
        </div>
      )}

      {isCore && (
        <div className="hud-panel" key="core">
          <button className="hud-panel-close" onClick={() => onSelect(null)} data-cursor="CLOSE">×</button>
          <div className="hud-panel-status">
            <span className="status-pill live">Open to Work</span>
          </div>
          <h2>Amit Suthar</h2>
          <p className="hud-panel-desc">
            B.Tech in AI/ML from TCET Mumbai, class of 2026. Focused on Backend and Full Stack development.
            Open Source enthusiast, Computer Networks and Distributed Systems fanboy.
          </p>
          <div className="hud-panel-metric">MUMBAI, INDIA · EndeavourOS</div>
          <div className="hud-panel-stack">
            {['Go', 'JavaScript', 'React', 'Redis', 'Postgres'].map(s => (
              <button key={s} className="hud-tag small" onClick={() => onTag(s)} data-cursor="FILTER">{s}</button>
            ))}
          </div>
        </div>
      )}

      {isContact && (
        <div className="hud-panel" key="contact">
          <button className="hud-panel-close" onClick={() => onSelect(null)} data-cursor="CLOSE">×</button>
          <div className="hud-panel-status">
            <span className="status-pill contact">Outbound Port</span>
          </div>
          <h2>Let's Talk</h2>
          <p className="hud-panel-desc">
            Actively looking for opportunities.
            If you're hiring for Backend, Full Stack or anything, let's connect!
          </p>
          <div className="hud-panel-links">
            <a href="mailto:sutharamit707@gmail.com" data-cursor="OPEN">Email →</a>
            <a href="https://github.com/amitsuthar69/" target="_blank" rel="noopener" data-cursor="OPEN">GitHub →</a>
            <a href="https://www.linkedin.com/in/amitsuthar69/" target="_blank" rel="noopener" data-cursor="OPEN">LinkedIn →</a>
          </div>
        </div>
      )}
    </>
  );
}
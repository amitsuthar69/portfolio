import { useEffect, useState } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { Unfold, UnfoldProvider, useUnfold } from './unfold';
import type { NodeKey } from './unfold';
import { EMAIL, GITHUB, LINKEDIN, RESUME, VAURD, repo } from './links';

function useIstClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(iv);
  }, []);

  try {
    return now.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return 'daytime';
  }
}

function ZoomControl() {
  const { zoom, maxZoom, atMin, atMax, zoomIn, zoomOut } = useUnfold();

  return (
    <div className="zoomctl">
      <span className="zoomctl-count zl">Zoom {zoom} of {maxZoom}</span>
      <span className="zoomctl-count zs">{zoom}/{maxZoom}</span>
      <button className="zm" onClick={zoomOut} disabled={atMin} aria-label="Fold one level">−</button>
      <button className="zm" onClick={zoomIn} disabled={atMax} aria-label="Unfold one level">+</button>
    </div>
  );
}

function Section({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <section className="sec" id={id}>
      <h2 className="lbl">{label}</h2>
      <div className="txt">{children}</div>
    </section>
  );
}

function Jump({ to, node, children }: { to: string; node: NodeKey; children: ReactNode }) {
  const { jump } = useUnfold();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    jump(node, to);
  }

  return <a href={`#${to}`} onClick={handleClick}>{children}</a>;
}

function Ext({ href, className, download, children }: { href: string; className?: string; download?: boolean; children: ReactNode }) {
  return (
    <a
      href={href}
      className={className}
      download={download}
      target={download ? undefined : '_blank'}
      rel={download ? undefined : 'noopener'}
    >
      {children}
    </a>
  );
}

function Project({ id, children }: { id: string; children: ReactNode }) {
  const { flashClass } = useUnfold();
  return <p id={id} className={`proj ${flashClass(id)}`.trim()}>{children}</p>;
}

function Page() {
  const { count, total } = useUnfold();
  const time = useIstClock();

  return (
    <div className="page">
      <header className="hdr-bar">
        <div className="hdr">
          <span className="brand">amitsuthar.dev</span>
          <ZoomControl />
        </div>
      </header>

      <div className="wrap">
        <div className="fold">
          <section className="hero">
            <p>
              Hi, I’m Amit. I write{' '}
              <Unfold k="g" label="Golang">
                Golang, by day as a backend developer at{' '}
                <Unfold k="v" label="Vaurd">
                  <Ext href={VAURD}>Vaurd</Ext>, building the runtime observability platform
                  for business ops
                </Unfold>
                , and after hours on{' '}
                <Unfold k="os" label="open-source tools">
                  open-source tools like <Jump to="parsel" node="p1">Parsel</Jump>,{' '}
                  <Jump to="portsicle" node="p2">Portsicle</Jump> and{' '}
                  <Jump to="flow" node="p4">Flow</Jump>
                </Unfold>
              </Unfold>
              . I live in{' '}
              <Unfold k="i" label="India">
                India, where it’s {time} right now. If you’re up too,{' '}
                <Unfold k="h" label="say hi">
                  say hi at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </Unfold>
              </Unfold>
              .
            </p>
          </section>

          <p className="hint">
            Tap any underlined phrase to unfold it, or press + at the top to unfold the whole
            page one level at a time. ↓
          </p>
        </div>

        <Section id="work" label="01 · Built">
          <Project id="parsel">
            I built{' '}
            <Unfold k="p1" label="a log aggregator on Redis Streams">
              <Ext className="pname" href={repo('parsel')}>Parsel</Ext>, distributed log aggregation
              on Redis Streams: consumer groups, a live WebSocket dashboard for tailing logs
              across services, and{' '}
              <Unfold k="p1b" label="crash recovery">
                XAUTOCLAIM-based PEL recovery, so a consumer can die mid-message and nothing
                gets lost. Open source and feature-complete.{' '}
                <span className="meta">Go · Redis · Postgres</span>
              </Unfold>
            </Unfold>
          </Project>

          <Project id="portsicle">
            I built{' '}
            <Unfold k="p2" label="my own ngrok">
              <Ext className="pname" href={repo('portsicle')}>Portsicle</Ext>, which gives a local
              web server a public HTTPS endpoint by tunnelling traffic over a secure WebSocket,{' '}
              <Unfold k="p2b" label="and it’s quick">
                and it’s quick: frames are MessagePack + LZ4 instead of JSON, roughly 70%
                faster. <span className="meta">Go</span>
              </Unfold>
            </Unfold>
          </Project>

          <Project id="neuwidget">
            I’m building{' '}
            <Unfold k="p5" label="desktop widgets without Electron">
              <Ext className="pname" href={repo('neuwidget')}>NeuWidget</Ext>, a minimal JavaScript
              framework for cross-platform desktop widgets on NeutralinoJS, with low resource
              overhead. Still in progress. Try it with <code>npx create-neuwidget</code>
            </Unfold>
            .
          </Project>

          <Project id="flow">
            Tired of restarting Go apps, I built{' '}
            <Unfold k="p4" label="Flow">
              <Ext className="pname" href={repo('flow')}>Flow</Ext>, a CLI that live-reloads Go
              apps: save a file and the program re-runs, no hard exit.{' '}
              <span className="meta">Go</span>
            </Unfold>
          </Project>

          <Project id="gotth">
            I built{' '}
            <Unfold k="p3" label="a tech stack with an unfortunate name">
              <Ext className="pname" href={repo('gotth')}>GoTTH</Ext>: Go, Templ, Tailwind and HTMX,
              on Turso SQLite. One command and you have a full-stack Go web project.{' '}
              <Unfold k="p3b" label="About the name">
                They call it the GoTTH stack. {" "}
                <span className="meta">Go · Templ · Tailwind · HTMX · SQLite</span>
              </Unfold>
            </Unfold>
          </Project>

          <Project id="others">
            And a couple{' '}
            <Unfold k="p6" label="for other people">
              for other people: <Ext className="pname" href={repo('storm')}>Storm</Ext>, a Discord
              bot that verifies clipper profiles, tracks content and calculates
              revenue for clipping servers; and{' '}
              <Ext className="pname" href={repo('handover')}>HandOver</Ext>, where college peers
              sell academic resources within their institution.{' '}
            </Unfold>
          </Project>
        </Section>

        <Section id="experience" label="02 · Worked">
          <p>
            Now: backend (Go) developer at{' '}
            <Unfold k="e1" label="Vaurd">
              <Ext className="pname" href={VAURD}>Vaurd</Ext>{' '}
              <span className="meta">Aug 2026 – now</span>
            </Unfold>
          </p>

          <p>
            Before that I interned at{' '}
            <Unfold k="e2" label="10Matrix Prime">
              10Matrix Prime, building a mobile app that scores a business’s Google Business
              Profile so it can benchmark against competitors. The scoring runs on{' '}
              <Unfold k="e2b" label="a custom genetic algorithm">
                a custom genetic algorithm, with Razorpay for payments and GitHub Actions for
                CI/CD. <span className="meta">React Native · Firebase · Python</span>
              </Unfold>{' '}
              <span className="meta">Jul – Oct 2025</span>
            </Unfold>
          </p>

          <p>
            and at{' '}
            <Unfold k="e3" label="PoiseCode">
              PoiseCode, where I built a chat-and-voice interview module for real-time Q&amp;A,
              with OpenAI TTS for spoken responses and{' '}
              <Unfold k="e3b" label="proctoring">
                proctoring that catches tab switches and flags cheating on video. It shipped to
                20+ enterprise clients in 4 countries.{' '}
                <span className="meta">Vue.js · Node.js · MongoDB</span>
              </Unfold>{' '}
              <span className="meta">May – Aug 2024</span>
            </Unfold>
          </p>
        </Section>

        <Section id="contact" label="03 · Reachable">
          <p>
            That’s the short version. The{' '}
            <Unfold k="c1" label="long version">
              long version is a <Ext href={RESUME} download>résumé</Ext>
            </Unfold>
            , the{' '}
            <Unfold k="c3" label="source version">
              source version is on <Ext href={GITHUB}>GitHub</Ext>
            </Unfold>
            , and the{' '}
            <Unfold k="c2" label="real version">
              real version is a conversation: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </Unfold>
            .
          </p>
        </Section>

        <footer className="foot">
          <div className="foot-links">
            <Ext href={GITHUB}>GitHub</Ext>
            <Ext href={LINKEDIN}>LinkedIn</Ext>
            <Ext href={RESUME} download>Résumé</Ext>
          </div>
          <span>{count} of {total} unfolded · © 2026 Amit Suthar</span>
        </footer>
      </div>
    </div>
  );
}

export default function Portfolio() {
  return (
    <UnfoldProvider>
      <Page />
    </UnfoldProvider>
  );
}

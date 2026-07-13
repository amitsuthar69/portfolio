import { useEffect } from 'react';
import './SystemCursor.css';

export default function SystemCursor() {
  useEffect(() => {
    if (window.matchMedia('(max-width: 900px)').matches) return;
    const dot = document.getElementById('sysCursorDot');
    const ring = document.getElementById('sysCursorRing');
    const label = document.getElementById('sysCursorLabel');
    if (!dot || !ring || !label) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    let raf: number;

    let lastCheck = 0;
    function move(e: MouseEvent) {
      mx = e.clientX; my = e.clientY;
      dot!.style.left = mx + 'px'; dot!.style.top = my + 'px';
      label!.style.left = mx + 'px'; label!.style.top = my + 'px';

      const now = performance.now();
      if (now - lastCheck > 80) {
        lastCheck = now;
        const under = document.elementFromPoint(mx, my) as HTMLElement | null;
        const stillOverTarget = under?.closest('[data-cursor]');
        if (!stillOverTarget) {
          ring!.classList.remove('hovering');
          label!.style.opacity = '0';
        }
      }
    }
    window.addEventListener('mousemove', move);

    // extra safety net: any click (e.g. the close button unmounting itself)
    // should never leave a stale label on screen
    function clickHandler() {
      ring!.classList.remove('hovering');
      label!.style.opacity = '0';
    }
    document.addEventListener('click', clickHandler, true);

    function loop() {
      rx += (mx - rx) * 0.22;
      ry += (my - ry) * 0.22;
      ring!.style.left = rx + 'px';
      ring!.style.top = ry + 'px';
      raf = requestAnimationFrame(loop);
    }
    loop();

    function overHandler(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('[data-cursor]');
      if (target) {
        ring!.classList.add('hovering');
        label!.textContent = target.getAttribute('data-cursor') || '';
        label!.style.opacity = '1';
      } else if ((e.target as HTMLElement).closest('canvas')) {
        // canvas hover state handled by cursor:pointer via inline style; keep ring default here
      }
    }
    function outHandler(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('[data-cursor]');
      if (target) {
        ring!.classList.remove('hovering');
        label!.style.opacity = '0';
      }
    }
    document.addEventListener('mouseover', overHandler);
    document.addEventListener('mouseout', outHandler);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', overHandler);
      document.removeEventListener('mouseout', outHandler);
      document.removeEventListener('click', clickHandler, true);
    };
  }, []);

  return (
    <>
      <div className="sys-cursor-dot" id="sysCursorDot"></div>
      <div className="sys-cursor-ring" id="sysCursorRing"></div>
      <div className="sys-cursor-label" id="sysCursorLabel"></div>
    </>
  );
}
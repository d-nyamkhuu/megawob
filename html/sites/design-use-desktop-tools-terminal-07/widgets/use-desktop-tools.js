// Clearlooks terminal design: preserve its shell frame, startup listing, scrollbar, and footer controls.
(function () {
  'use strict';

  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-terminal-07',
    name: 'design',
    split: 'train',
    scenarios: ['terminal'],
    template: 'use-desktop-tools/workspace',
    design: {
      frame: 'plain',
      frameTitle: 'Terminal',
      siteCssLast: true,
      host: 'user@localhost',
      welcomeFiles: true,
      focusLine: true,
      parts: {
        termSetup: () => (X) => {
          X.initial = JSON.parse(JSON.stringify(X.ctx.model));
        },
        termTabs: () => (X) => {
          X.util.el('span', 'on', X.tabs, 'bash');
          X.caption = X.util.el('span', 'terminal-caption', X.tabs, '');
          const controls = X.util.el('div', 'terminal-controls', X.tabs);
          X.util.el('i', 'pane-minimize', controls);
          X.util.el('i', 'pane-close', controls);
        },
        termScroller: () => (X) => {
          const { util, sc } = X;
          const scrollbar = X.scrollbar = util.el('div', 'terminal-scrollbar', X.term);
          const up = X.scrollUp = util.el('button', 'scroll-up', scrollbar);
          up.type = 'button';
          up.setAttribute('aria-label', 'Scroll terminal up');
          const track = X.scrollTrack = util.el('div', 'scroll-track', scrollbar);
          X.scrollThumb = util.el('div', 'scroll-thumb', track);
          const down = X.scrollDown = util.el('button', 'scroll-down', scrollbar);
          down.type = 'button';
          down.setAttribute('aria-label', 'Scroll terminal down');

          X.drawScroll = () => {
            const ratio = Math.min(1, sc.clientHeight / Math.max(1, sc.scrollHeight));
            X.scrollThumb.style.height = ratio * 100 + '%';
            X.scrollThumb.style.top = (1 - ratio) * (sc.scrollTop / Math.max(1, sc.scrollHeight - sc.clientHeight)) * 100 + '%';
          };
          up.addEventListener('click', () => { sc.scrollTop -= 100; X.drawScroll(); });
          down.addEventListener('click', () => { sc.scrollTop += 100; X.drawScroll(); });
          sc.addEventListener('scroll', X.drawScroll);
          const scrollAt = (e) => {
            const r = track.getBoundingClientRect();
            sc.scrollTop = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)) * (sc.scrollHeight - sc.clientHeight);
            X.drawScroll();
          };
          track.addEventListener('pointerdown', (e) => { track.setPointerCapture(e.pointerId); scrollAt(e); });
          track.addEventListener('pointermove', (e) => { if (track.hasPointerCapture(e.pointerId)) scrollAt(e); });
        },
        termWelcome: () => (X) => {
          X.line('out', 'Available files in this workspace:');
          for (const f of X.spec.files) X.line('out', '~/' + f);
        },
        termReady: () => (X) => {
          const doc = document.querySelector('.gk-btn[data-action="doc"]');
          if (doc) doc.addEventListener('click', () => {
            const m = X.fam.run(X.ctx.model, X.spec, 'clear');
            X.ctx.update(m);
            X.paint(m);
          });
          const reset = document.querySelector('.gk-btn[data-action="gear"]');
          if (reset) reset.addEventListener('click', () => {
            const m = JSON.parse(JSON.stringify(X.initial));
            X.shown = null;
            X.ctx.update(m);
            X.paint(m);
          });
          const help = document.querySelector('.gk-btn[data-action="help"]');
          if (help) help.addEventListener('click', () => {
            X.line('dim', 'Use cd to change directory, ls to list files, and rm to delete a file.');
            X.sc.scrollTop = X.sc.scrollHeight;
            X.drawScroll();
          });
        },
        termPaintStart: () => (X, m) => {
          X.caption.textContent = 'user@localhost: ' + (m.cwd ? '~/' + m.cwd : '~');
          X.prompt.classList.toggle('empty-command', !m.line);
        },
        termScroll: () => (X) => {
          X.sc.scrollTop = X.sc.scrollHeight;
          X.drawScroll();
        },
      },
    },
  });
})();

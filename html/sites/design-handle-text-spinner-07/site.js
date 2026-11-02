(function () {
  'use strict';
  const palette = { bg: '#f1f5f9', panel: '#f1f5f9', fg: '#0f172a', muted: '#52627d', line: '#cbd5e1' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'kinetic');
      const shell = u.el('main', 'shell', document.body);
      const ribbon = u.el('header', 'ribbon', shell);
      const brand = u.el('div', 'brand', ribbon);
      u.el('strong', 'brand-name', brand, 'TypeLab');
      u.el('span', 'brand-tag', brand, 'EXPERIMENTAL\nTYPOGRAPHY TOOL');
      const group = (name, content) => {
        const g = u.el('section', 'tool-group', ribbon);
        u.el('span', 'group-label', g, name);
        content(u.el('div', 'group-controls', g));
      };
      group('Font', (c) => { u.el('div', 'fake-select', c).innerHTML = 'Inter <b>⌄</b>'; });
      group('Style', (c) => {
        ['B', 'I', 'U'].forEach((v, i) => u.el('div', 'style-key k' + i, c, v));
      });
      group('Alignment', (c) => {
        ['☰', '☷', '☰'].forEach((v, i) => u.el('div', 'align-key a' + i, c, v));
      });
      group('Color', (c) => {
        const x = u.el('div', 'swatch-control', c);
        u.el('i', 'swatch paper', x);
        u.el('span', '', x, '#F1F5F9');
        u.el('b', '', x, '⌄');
      });
      group('Background', (c) => {
        const x = u.el('div', 'swatch-control', c);
        u.el('i', 'swatch ink', x);
        u.el('span', '', x, '#0F172A');
        u.el('b', '', x, '⌄');
      });
      const work = u.el('main', 'work', shell);
      Object.assign(_c, { shell, ribbon, work, header: work });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.ribbon;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction');
        panel.dataset.display = 'panel';
      }
    },
    'frame.stage': () => (_c) => {
      const label = _c.util.el('div', 'task-label', _c.work);
      _c.util.el('span', '', label, 'TASK');
      _c.util.el('i', '', label);
      _c.stage = _c.util.el('section', 'stage', _c.work);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = 'toast';
        _c.work.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      const status = u.el('div', 'status');
      foot.prepend(status);
      u.el('i', 'ready-dot', status);
      u.el('span', 'ready-text', status, 'Ready');
      [['Font:', 'Inter'], ['Size:', '14 pt'], ['Color:', '#F1F5F9'], ['Background:', '#0F172A']].forEach((pair) => {
        const x = u.el('span', 'status-item', status);
        u.el('b', '', x, pair[0]);
        u.el('span', '', x, pair[1]);
      });
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
      for (const note of _c.work.querySelectorAll('.instruction')) {
        for (let i = 0; i < 8 && note.scrollHeight > note.clientHeight + 1; i++) {
          note.style.fontSize = parseFloat(getComputedStyle(note).fontSize) * 0.9 + 'px';
        }
      }
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong', '', el,
        { cookie: 'Cookie preferences', toast: 'Notification', chat: 'Support', promo: 'A special offer', banner: 'Service notice' }[ctx.kind],
      );
      ctx.util.el(
        'p', '', el,
        { cookie: 'Choose your preferences to continue.', toast: 'Your workspace is ready.', chat: 'How can we help?', promo: 'Explore the latest tools.', banner: 'A new update is available.' }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-handle-text-spinner-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-handle-text-spinner-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0956df'],
      LOW_ACCENTS: ['#0956df'],
      parts,
    },
  });
})();

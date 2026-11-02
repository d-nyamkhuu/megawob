(function () {
  'use strict';
  const C = {
    title: 'Document Editor',
    doc: 'Q2_Project_Plan.docx',
    font: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  };
  const palette = { bg: '#ffffff', panel: '#f2f2f2', fg: '#2b2f36', muted: '#6b7280', line: '#c9cdd2' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'design yos';
      _c.root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', document.body);
      const head = u.el('header', 'yos-bar', shell);
      const lights = u.el('div', 'yos-lights', head);
      for (const c of ['r', 'y', 'g']) u.el('i', c, lights);
      u.el('div', 'yos-apptitle', head, C.title);
      const dn = u.el('div', 'yos-docname', head, C.doc);
      u.el('span', '', dn, ' — ');
      u.el('span', 'edited', dn, 'Edited');
      const search = u.el('div', 'yos-search', head);
      u.svg('path', { d: 'M10 10L15 15M7 12A5 5 0 1 1 7 2A5 5 0 0 1 7 12Z' },
        u.svg('svg', { width: 16, height: 16, viewBox: '0 0 17 17', fill: 'none', stroke: '#555', 'stroke-width': 1.5 }, search));
      u.el('span', '', search, 'Search');
      const left = u.el('section', 'yos-left', shell);
      const note = u.el('div', 'yos-note yos-note-' + _c.display, left);
      note.hidden = _c.display === 'hidden';
      const pv = u.el('button', 'yos-preview', left, 'Preview');
      pv.type = 'button';
      pv.onclick = () => env.log('preview');
      const caption = u.el('p', 'yos-cap pv', left, 'See a full preview of this document');
      u.el('br', '', caption);
      caption.appendChild(document.createTextNode('(with sample annotations).'));
      u.el('hr', 'yos-sep', left);
      Object.assign(_c, { shell, left, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) text.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.left;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const main = u.el('section', 'yos-main', _c.shell);
      const paper = u.el('div', 'yos-paper', main);
      const at = (tag, cls, text, x, y, w) => {
        const e = u.el(tag, cls, paper, text);
        e.style.setProperty('--x', x);
        e.style.setProperty('--y', y);
        if (w) e.style.setProperty('--w', w);
        return e;
      };
      at('h1', 'p-h1', 'Project Plan', 66, 86);
      at('div', 'p-sub', 'Q2 2025', 66, 144);
      at('div', 'p-rule', '', 66, 197, '470');
      at('h2', 'p-h2', '1. Overview', 66, 236);
      at('p', 'p-para', 'Our goal for Q2 is to deliver a simpler, faster experience for our customers. This plan outlines the key initiatives, milestones, and owners.', 66, 279, '470');
      at('h2', 'p-h2', '2. Key Initiatives', 66, 412);
      ['Improve onboarding flow', 'Enhance performance and reliability', 'Expand to additional customer segments'].forEach((t, i) => {
        at('div', 'p-li', i + 1 + '.', 72, 452 + i * 31);
        at('div', 'p-li t', t, 98, 452 + i * 31);
      });
      at('h2', 'p-h2', '3. Milestones', 66, 593);
      const tbl = at('table', 'p-table', '', 66, 639, '646');
      const rows = [
        ['Milestone', 'Owner', 'Target Date'],
        ['Design complete', 'A. Chen', 'Apr 4, 2025'],
        ['Development complete', 'M. Patel', 'May 16, 2025'],
        ['Launch', 'T. Nguyen', 'Jun 30, 2025'],
      ];
      rows.forEach((r, i) => {
        const tr = u.el('tr', '', tbl);
        r.forEach((v) => u.el(i ? 'td' : 'th', '', tr, v));
      });
      const rail = u.el('aside', 'yos-rail', _c.shell);
      const icons = [
        'M5 3L5 21L10 16L14 24L17 22.5L13 15H20Z',
        'M4 5H24V19H12L7 24V19H4Z M9 10H19M9 14H16',
        'M5 5H23V23H5Z',
        'M14 4A10 10 0 1 1 14 24A10 10 0 0 1 14 4Z',
        'M5 23L23 5',
        'M5 5H23M14 5V24',
        'M12 4A8 8 0 1 1 12 20A8 8 0 0 1 12 4ZM18 18L25 25',
      ];
      icons.forEach((d, i) => {
        const b = u.el('button', 'yos-tool' + (i === 0 ? ' sel' : ''), rail);
        b.type = 'button';
        b.onclick = () => {
          rail.querySelectorAll('.yos-tool').forEach((x) => x.classList.remove('sel'));
          b.classList.add('sel');
        };
        u.svg('path', { d }, u.svg('svg', { width: 30, height: 30, viewBox: '0 0 28 28', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.7, 'stroke-linejoin': 'round' }, b));
      });
      Object.assign(_c, { body: main, paper });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const text = _c.header.querySelector('.ref-panel-text');
      if (text) text.classList.add('instruction');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.paper);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.header.appendChild(note);
        note.querySelector('.ref-note-text').classList.add('instruction');
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const st = u.el('footer', 'yos-status', _c.shell);
      u.el('span', '', st, 'Page 1 of 1');
      u.el('span', 'wc', st, '148 words');
      const zoom = u.el('span', 'yos-zoom', st, '100%');
      u.el('em', '', zoom, '⌄');
      u.el('span', 'yos-minus', st, '−');
      const sl = u.el('span', 'yos-slider', st);
      u.el('i', '', sl);
      u.el('span', 'yos-plus', st, '+');
      st.appendChild(document.body.querySelector('.ref-foot'));
      _c.status = st;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.left.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title = {
        cookie: 'Your privacy',
        toast: 'Changes saved',
        chat: 'Support',
        promo: 'Workspace update',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This application stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with this workspace?',
        promo: 'Explore the latest workspace features.',
        banner: 'You are viewing a shared workspace.',
      }[kind];
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-resize-element-ghost-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-resize-element-ghost-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1f6feb'],
      LOW_ACCENTS: ['#1f6feb'],
      parts,
    },
  });
})();

(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#000000', muted: '#333333', line: '#0a3fa8' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original directory has a responsive task card even on narrow screens.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('has-instruction-toast', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'wwd');
      document.documentElement.style.setProperty('--font', 'Arial, Helvetica, sans-serif');
      const shell = u.el('div', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const top = u.el('div', 'top', head);
      const logo = u.el('div', 'logo', top);
      const g = u.svg('svg', { width: 84, height: 84, viewBox: '0 0 84 84', class: 'globe' }, logo);
      const defs = u.svg('defs', {}, g);
      const sea = u.svg('radialGradient', { id: 'wwd-sea', cx: '35%', cy: '27%', r: '75%' }, defs);
      for (const [offset, color] of [['0', '#48b9f6'], ['.55', '#0879d1'], ['.85', '#005095'], ['1', '#003875']])
        u.svg('stop', { offset, 'stop-color': color }, sea);
      const land = u.svg('linearGradient', { id: 'wwd-land', x1: '0', y1: '0', x2: '1', y2: '1' }, defs);
      u.svg('stop', { offset: '0', 'stop-color': '#ffe768' }, land);
      u.svg('stop', { offset: '1', 'stop-color': '#efa42a' }, land);
      u.svg('circle', { cx: 42, cy: 42, r: 39, fill: 'url(#wwd-sea)', stroke: '#063c8c', 'stroke-width': 1.5 }, g);
      u.svg('path', { d: 'M20 12L27 9 32 10 30 14 35 16 30 20 27 18 25 22 20 23 18 29 21 33 26 32 29 36 26 40 22 39 21 36 17 35 16 30 12 29 13 23 16 20ZM31 5L40 4 44 7 42 11 38 10 36 13 34 10ZM32 40L36 41 39 45 46 45 47 48 54 49 57 53 53 58 51 64 47 65 44 71 40 74 39 68 37 63 37 57 33 54 31 49 28 46ZM51 8L57 10 57 13 63 15 65 19 70 20 71 26 76 27 78 33 76 38 72 36 70 30 67 31 65 27 62 25 58 24 57 20 52 21 48 18 51 16 48 13ZM69 34L74 36 77 41 77 49 74 48 71 42 68 42 66 38Z', fill: 'url(#wwd-land)' }, g);
      u.svg('path', { d: 'M36 19L39 18 40 21 37 22ZM42 14L45 14 46 17 43 18ZM26 38L29 38 31 41 29 43ZM59 28L61 29 61 32 59 31', fill: '#ffdc53' }, g);
      const tt = u.el('div', 'brand', logo);
      u.el('div', 'brand-name', tt, 'WorldWeb Directory');
      u.el('div', 'brand-sub', tt, 'Your Guide to the Internet');
      const nav = u.el('nav', 'topnav', top);
      ['Home', 'Site Map', 'Help', 'Contact Us'].forEach((t, i) => {
        if (i) u.el('span', 'sep', nav, '|');
        const a = u.el('a', '', nav, t);
        a.href = '#';
        a.onclick = (e) => e.preventDefault();
      });
      u.el('div', 'date', top, 'Mon, Apr 27, 1998');
      const row = u.el('div', 'panels', head);
      const panel = (cls, title) => {
        const p = u.el('section', 'panel ' + cls, row);
        u.el('h2', '', p, title);
        return u.el('div', 'pbody', p);
      };
      const ps = panel('p-search', 'Search the Directory');
      const inp = u.el('input', 'sbox', ps);
      inp.type = 'text';
      inp.onkeydown = (e) => e.stopPropagation();
      const sb = u.el('button', 'sbtn', ps, 'Search');
      sb.type = 'button';
      const rr = u.el('div', 'radios', ps);
      for (const [i, t] of ['Web Sites', 'Categories'].entries()) {
        const l = u.el('label', '', rr);
        const r = u.el('input', '', l);
        r.type = 'radio';
        r.name = 'scope';
        r.checked = i === 0;
        u.el('span', '', l, t);
      }
      const links = (cls, title, items, cols) => {
        const b = panel(cls, title);
        const lk = u.el('div', 'links cols' + cols, b);
        for (const t of items) {
          const a = u.el('a', '', lk, t);
          a.href = '#';
          a.onclick = (e) => e.preventDefault();
        }
      };
      links('p-browse', 'Browse by Category', ['Arts & Humanities', 'Entertainment', 'Business & Economy', 'Health & Science', 'Computers & Internet', 'News & Media', 'Education', 'Recreation & Sports'], 2);
      links('p-pop', 'Popular Links', ['Yahoo!', 'GeoCities', 'AltaVista', 'HotBot', 'Excite', 'Infoseek', 'Lycos', 'LookSmart'], 2);
      links('p-member', 'Member Tools', ['Sign In', 'Create Account', 'Preferences', 'Help'], 1);
      const content = u.el('div', 'content' + (_c.display === 'panel' ? ' panel-mode' : ''));
      const note = u.el('section', 'task-note', content);
      note.hidden = _c.display !== 'header';
      Object.assign(_c, { shell, top, content, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) text.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.shell.appendChild(_c.content);
      _c.body = _c.content;
      _c.util.el('p', 'brief-copy', _c.body, 'Drag and drop the items into the correct order. Use the handle at the left of each item to move it.');
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note', 'instruction-panel');
        panel.querySelector('.ref-panel-text').classList.add('instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note', 'instruction-toast');
        note.querySelector('.ref-note-text').classList.add('instruction');
        _c.body.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('footer');
      _c.shell.appendChild(footer);
      const copy = footer.querySelector('.ref-foot-text');
      copy.classList.add('footer-copy');
      copy.textContent = 'Ready.';
      const btns = footer.querySelector('.ref-tools');
      btns.classList.add('fbtns');
      const reset = _c.util.el('button', 'clear', null, 'Reset');
      reset.type = 'button';
      reset.onclick = () => env.widgetDef.clear?.();
      btns.prepend(reset);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
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
        promo: 'Directory update',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This site stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with the directory?',
        promo: 'Explore the latest directory features.',
        banner: 'You are viewing a shared page.',
      }[kind];
      const label = kind === 'cookie' ? 'Reject optional' : 'Close';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, label);
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
    name: 'design-reorder-items-list-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'wwd.css'],
    design: { THEMES: { 'design-reorder-items-list-04': palette }, LOW_THEME: palette,
      ACCENTS: ['#0a3fa8'], LOW_ACCENTS: ['#0a3fa8'], parts },
  });
})();

(function () {
  'use strict';
  const palette = { bg: '#151120', panel: '#211d32', fg: '#ece9fa', muted: '#b9b1ce', line: '#403751' };
  function icon(node, paths) {
    node.style.background = 'none';
    node.innerHTML = '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>';
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original keeps its side briefing and inline toast at small sizes too.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const bw = u.el('span', 'ds-brandwrap', top);
      u.el('i', 'ds-logo', bw);
      u.el('span', 'ds-brand', bw, 'FocusTask');
      const wc = u.el('span', 'ds-wctl', top);
      u.el('b', 'ds-wmin', wc);
      u.el('b', 'ds-wmax', wc);
      u.el('b', 'ds-wx', wc, '✕');
      const menu = u.el('nav', 'ds-menu', document.body);
      'File|Edit|View|Window|Help'.split('|').forEach((t) => u.el('span', '', menu, t));
      const workspace = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', workspace);
      const rh = u.el('div', 'ds-ph', rail);
      icon(u.el('i', 'ds-ico ds-ico-list', rh), '<path d="M2 5h7m5 0h12M2 14h7m5 0h12M2 23h7m5 0h12M6 2v6m-3 3v6m4 3v6"/>');
      u.el('span', '', rh, 'Find Tools');
      const fs = u.el('div', 'ds-fake', rail, 'Find in text...');
      fs.dataset.ph = '1';
      ['Match case', 'Whole words'].forEach((t) => {
        const r = u.el('div', 'ds-chk', rail);
        u.el('i', '', r);
        u.el('span', '', r, t);
      });
      const content = u.el('div', 'ds-content', workspace);
      u.el('h1', 'ds-title', content, 'Text Search Challenge');
      const side = u.el('aside', 'ds-side', workspace);
      const p1 = u.el('div', 'ds-panel', side);
      const h1 = u.el('div', 'ds-ph', p1);
      icon(u.el('i', 'ds-ico ds-ico-sun', h1), '<circle cx="14" cy="14" r="6"/><path d="M14 1v4m0 18v4M1 14h4m18 0h4M5 5l3 3m12 12 3 3M5 23l3-3M20 8l3-3"/>');
      u.el('span', '', h1, 'Appearance');
      [['Theme', 'Aubergine'], ['Text size', 'Medium']].forEach((a) => {
        const r = u.el('div', 'ds-row', p1);
        u.el('span', '', r, a[0]);
        u.el('div', 'ds-fake ds-sel', r, a[1]);
      });
      const wr = u.el('div', 'ds-chk on', p1);
      u.el('i', '', wr);
      u.el('span', '', wr, 'Word wrap');
      const p2 = u.el('div', 'ds-panel', side);
      const h2 = u.el('div', 'ds-ph', p2);
      icon(u.el('i', 'ds-ico ds-ico-bolt', h2), '<path d="M17 1 4 16h9l-2 11 13-16h-9z"/>');
      u.el('span', '', h2, 'Quick Actions');
      ['Clear answer', 'Copy text', 'Reset task'].forEach((t) => {
        const b = u.el('div', 'ds-qa', p2);
        icon(u.el('i', 'ds-qi', b), t === 'Clear answer'
          ? '<path d="m4 17 13-14a2 2 0 0 1 3 0l6 6a2 2 0 0 1 0 3L13 26H9l-5-5a3 3 0 0 1 0-4zM12 9l10 10M7 14l10 10"/>'
          : t === 'Copy text'
            ? '<path d="M9 7H5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3M9 3h9l6 6v13H9zM18 3v6h6M6 1H3v18"/>'
            : '<path d="M3 11a12 12 0 1 1 0 9M3 3v8h8"/>');
        u.el('span', '', b, t);
      });
      const status = u.el('footer', 'ds-status', document.body);
      const rd = u.el('span', 'ds-ready', status);
      u.el('i', '', rd);
      u.el('span', '', rd, 'Ready');
      u.el('span', 'ds-sp', status);
      u.el('span', 'ds-word-count', status, 'Words: —');
      u.el('span', 'ds-char-count', status, 'Characters: —');
      u.el('span', 'ds-zoom', status, '100%');
      Object.assign(_c, { header: content, content, menu, status });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-header-note');
        const text = _c.util.el('div', 'ds-instruction');
        text.append(...note.childNodes);
        note.appendChild(text);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-title').textContent = 'Instructions';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.status.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.status.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-find-fact-find-word-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-find-word-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ff7468'],
      LOW_ACCENTS: ['#ff7468'],
      parts,
    },
  });
})();

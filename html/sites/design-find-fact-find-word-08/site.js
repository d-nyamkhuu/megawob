(function () {
  'use strict';
  const palette = { bg: '#838383', panel: '#ecebe7', fg: '#111111', muted: '#66707d', line: '#aaa' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const appIcon = u.el('span', 'ds-logo', top);
      appIcon.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><g fill="none" stroke="#aaa" stroke-width=".85" stroke-linecap="round" stroke-linejoin="round" transform="rotate(-28 16 16)"><path d="M10 25C6 21 5 18 5 15Q5 12 7 12L10 16 9 7Q9 4 11 5L13 13 13 4Q14 1 16 4L17 13 18 5Q20 3 21 6L21 14 23 9Q25 7 26 10L25 20Q24 24 22 26Z"/><path d="M10 16L17 17 21 21M13 13L21 14M9 25L11 29 21 29 22 26M17 17L16 23M8 18L12 22"/></g></svg>';
      'File|Edit|Find|Format|Windows|Help'.split('|').forEach((t) => u.el('span', 'ds-mi', top, t));
      u.el('span', 'ds-clock', top, 'Mon Apr 12  9:24 AM');
      const shell = u.el('div', 'ds-body', document.body);
      const tb = u.el('div', 'ds-title', shell);
      u.el('i', 'ds-tbtn', tb, '');
      u.el('span', 'ds-brand', tb, 'Notebook — Find Word');
      u.el('i', 'ds-tbtn r', tb, '×');
      const rail = u.el('aside', 'ds-rail', shell);
      'Task|Notes|Reference|Workspace|Results'.split('|').forEach((t, i) => {
        const d = u.el('div', i === 0 ? 'on' : '', rail);
        u.el('span', '', d, t);
        d.style.top = 8.6 + i * 13.85 - (i ? 1 : 0) + 'vh';
        d.style.height = '12vh';
      });
      const sp = u.el('div', 'ds-spiral', shell);
      for (let i = 0; i < 20; i++) u.el('i', '', sp);
      const doc = u.el('aside', 'ds-doc', document.body);
      const dt = u.el('div', 'ds-dt', doc);
      u.el('i', 'ds-tbtn', dt, '');
      u.el('span', '', dt, 'Document');
      u.el('i', 'ds-tbtn r', dt, '×');
      [['Title:', 'Find Word'], ['Size:', '1 page'], ['Modified:', 'Apr 12, 1993  9:24 AM'], ['Format:', 'Plain Text']].forEach((r) => {
        const row = u.el('div', 'ds-dr', doc);
        u.el('span', '', row, r[0]);
        u.el('span', '', row, r[1]);
      });
      const nx = u.el('div', 'ds-next', document.body);
      const cube = u.el('div', 'ds-cube', nx);
      cube.innerHTML = '<svg viewBox="0 0 100 120" aria-hidden="true"><defs><linearGradient id="cube-top" x2="1" y2="1"><stop stop-color="#292929"/><stop offset="1" stop-color="#080808"/></linearGradient></defs><path d="M15 29L76 3 94 62 37 93Z" fill="url(#cube-top)" stroke="#444"/><path d="M15 29L37 93 29 117 4 65Z" fill="#171717" stroke="#444"/><path d="M37 93L94 62 83 94 29 117Z" fill="#090909" stroke="#444"/><g fill="#999" font-family="Helvetica,Arial,sans-serif" font-weight="300" font-size="35" transform="matrix(.89,-.39,.29,.94,13,33)"><text x="0" y="0" dominant-baseline="hanging">Ne</text><text x="0" y="34" dominant-baseline="hanging">XT</text></g></svg>';
      u.el('div', '', nx, 'NeXTSTEP');
      const content = u.el('div', 'ds-content', shell);
      Object.assign(_c, { shell, tb, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.content.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.tb;
      base(_c);
      _c.header = h;
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
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      if (!_c.ctx.finish) {
        const clr = _c.util.el('button', 'ds-clear', foot, 'Clear');
        clr.type = 'button';
        foot.insertBefore(clr, foot.querySelector('.ref-tools'));
        clr.addEventListener('click', () => {
          const f = document.querySelector('[data-role="field"]');
          if (f) {
            f.value = '';
            f.dispatchEvent(new Event('input', { bubbles: true }));
            f.focus();
          }
        });
      }
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-find-fact-find-word-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-find-word-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#444d32'],
      LOW_ACCENTS: ['#444d32'],
      parts,
    },
  });
})();

(function () {
  'use strict';
  const palette = { bg: '#4d8ccc', panel: '#f3f8fd', fg: '#10172b', muted: '#66707d', line: '#98b8d5' };
  const parts = {
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
      u.el('span', 'ds-brand', top, 'Finder');
      u.el('span', '', top, '−    □    ×');
      const status = u.el('div', 'ds-status', top);
      status.innerHTML =
        '<svg viewBox="0 0 30 24"><path d="M2 7Q15-3 28 7M6 11q9-7 18 0M10 15q5-4 10 0" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="15" cy="20" r="2"/></svg><svg viewBox="0 0 30 24"><path d="M3 9h6l7-6v18l-7-6H3Z"/><path d="M20 7q6 5 0 10m3-14q10 9 0 18" fill="none" stroke="currentColor" stroke-width="2"/></svg><span>Mon 10:24 AM</span><svg viewBox="0 0 30 28"><circle cx="12" cy="11" r="8" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M18 17l8 8" stroke="currentColor" stroke-width="2.6"/></svg>';
      const shell = u.el('div', 'ds-body', document.body);
      const controls = u.el('div', 'ds-window-controls', shell);
      ['red', 'yellow', 'green'].forEach((c) => u.el('i', c, controls));
      const content = u.el('div', 'ds-content', shell);
      content.dataset.mode = _c.display;
      content.dataset.finish = _c.ctx.finish ? 'yes' : 'no';
      content.dataset.end = _c.placement || '';
      const toolbar = u.el('div', 'ds-toolbar', content);
      Object.assign(_c, { shell, content, toolbar, header: content });
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'ds-menu', document.body);
      'File|Edit|View|Go|Window|Help'.split('|').forEach((t) => _c.util.el('span', '', nav, t));
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.toolbar;
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
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.content.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
      const width = _c.foot.getBoundingClientRect().width;
      // Reserve the answer row for all controls placed at its right edge.
      _c.content.style.setProperty('--end-width', width + 'px');
      _c.content.dataset.bottomTools = width > 0 ? 'yes' : 'no';
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
    name: 'design-find-fact-find-word-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-find-word-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#287bd8'],
      LOW_ACCENTS: ['#287bd8'],
      parts,
    },
  });
})();

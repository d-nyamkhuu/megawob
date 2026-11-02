(function () {
  'use strict';
  const palette = { bg: '#453027', panel: '#f6ebcc', fg: '#3a1c10', muted: '#8d7453', line: '#ba9659' };
  const icons = [
    '<path fill="currentColor" d="M2 13L14 2l12 11h-4v13h-6v-9h-5v9H5V13Z"/>',
    '<path d="M5 2h13l6 6v19H5Z M18 2v7h6M9 13h11M9 17h11M9 21h11"/>',
    '<rect x="3" y="5" width="23" height="22" rx="2"/><path d="M8 1v8M21 1v8M3 11h23M8 15h2m4 0h2m4 0h2M8 20h2m4 0h2m4 0h2M8 24h2m4 0h2m4 0h2"/>',
    '<circle cx="14" cy="14" r="12"/><path stroke-width="3" d="m7 14 5 5 10-12"/>',
    '<path fill="currentColor" stroke="none" d="M12 0h5l1 5 4 2 4-2 3 5-4 3v4l4 3-3 5-4-2-4 2-1 4h-5l-1-4-4-2-4 2-3-5 4-3v-4L0 10l3-5 4 2 4-2Z"/><circle cx="14" cy="14" r="5" fill="#654635" stroke="none"/>',
  ];
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The notebook has its own note positions, including a toast at short heights.
      _c.display = _c.ctx.display || 'header';
      if (_c.display === 'panel' && _c.W * 0.928 < 1100) _c.display = 'header';
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
      u.el('div', 'ds-straps', document.body);
      const paper = u.el('div', 'ds-paper', document.body);
      const top = u.el('header', 'ds-top', paper);
      u.el('span', 'ds-logo', top);
      const bb = u.el('span', 'ds-brandbox', top);
      u.el('span', 'ds-brand', bb, 'EverNotes');
      u.el('span', 'ds-tag', bb, 'Keep What Matters');
      Object.assign(_c, { paper, top, header: top });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const nav = u.el('nav', 'ds-menu', _c.paper);
      'Home|Notes|Calendar|Tasks|Settings'.split('|').forEach((t, i) => {
        const item = u.el('span', '', nav);
        item.innerHTML = '<svg viewBox="0 0 29 29" aria-hidden="true">' + icons[i] + '</svg>';
        item.append(document.createTextNode(t));
        item.addEventListener('click', () => env.log('decoy', { label: t }));
      });
      const outer = u.el('div', 'ds-body', _c.paper);
      _c.contentPane = u.el('div', 'ds-content', outer);
    },
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.contentPane;
      base(_c);
      _c.header = header;
      const note = _c.contentPane.querySelector('.ref-instruction');
      if (note) {
        const card = _c.util.el('aside', 'ds-header-note', _c.contentPane);
        note.classList.add('ds-instruction');
        card.appendChild(note);
      }
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('ds-top-tools');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.contentPane);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
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
        _c.contentPane.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      if (_c.ctx.finish) foot.classList.add('ds-footer-finish');
      else if (_c.placement === 'header' || _c.placement === 'icon') foot.classList.add('ds-footer-toolbar');
      else if (_c.placement === 'link') foot.classList.add('ds-footer-link');
      foot.querySelector('.ref-foot-text').textContent = _c.ctx.finish ? 'Ready' : 'Notebook ready';
      _c.contentPane.appendChild(foot);
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
    name: 'design-type-text-login-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-type-text-login-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#667149'],
      LOW_ACCENTS: ['#667149'],
      parts,
    },
  });
})();

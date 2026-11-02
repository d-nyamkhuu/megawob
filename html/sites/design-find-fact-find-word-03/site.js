(function () {
  'use strict';
  const palette = { bg: '#efefef', panel: '#efefef', fg: '#000', muted: '#222', line: '#000' };
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
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const mb = u.el('span', 'ds-menus', top);
      mb.innerHTML =
        '<svg width="30" height="30" viewBox="0 0 30 30"><path d="M15 1L3 14h24z M3 16h24L15 29z" fill="#000"/></svg>';
      ['File', 'Edit', 'Find', 'Options', 'Help'].forEach((t) => u.el('span', '', mb, t));
      u.el('span', 'ds-clock', top, 'Mon  Jun 16, 1987      10:24 AM');
      const shell = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', shell);
      const IC = {
        Tasks: '<path d="M7 3h17l7 7v25H7zM24 3v8h7M11 13h15M11 18h15M11 23h15M11 28h15"/>',
        Lookup: '<path d="M2 9V6h10l4 4h17v4H2z" fill="#fff"/><path d="M1 12h36v24H1z" fill="#fff"/>',
        Notes: '<path d="M7 6h24v28H7zM11 2v8M16 2v8M22 2v8M27 2v8M10 13h18M11 18h14M11 23h14M11 28h8M27 29l5 4-4 3"/>',
        Settings:
          '<path d="M16 2h6l1 4 4 2 4-2 4 5-3 4 1 4 4 2-1 6-5 1-3 3v5l-6 2-3-4h-4l-3 4-6-3 1-5-3-3-4-1v-6l4-2 1-4-2-4 4-4 4 2 4-2z"/><circle cx="19" cy="20" r="7"/>',
        Exit: '<path d="M5 9h28l-2-3H24l-2-3h-7l-2 3H7zM7 10l2 25h20l2-25M13 14v17M19 14v17M25 14v17"/>',
      };
      ['Tasks', 'Lookup', 'Notes', 'Settings', 'Exit'].forEach((t) => {
        const it = u.el('div', 'ds-ri' + (t === 'Lookup' ? ' on' : '') + (t === 'Exit' ? ' exit' : ''), rail);
        const ic = u.el('span', 'ds-ico', it);
        ic.innerHTML =
          '<svg viewBox="0 0 38 38" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2">' + IC[t] + '</svg>';
        u.el('span', '', it, t);
      });
      const content = u.el('div', 'ds-content', shell);
      const toolbar = u.el('div', 'ds-titlebar', content);
      u.el('span', 'ds-dia', toolbar, '◆');
      u.el('span', 'ds-wt', toolbar, 'Word Finder');
      const wb = u.el('span', 'ds-wb', toolbar);
      ['–', '□', '×'].forEach((t) => u.el('b', '', wb, t));
      const header = _c.display === 'header' ? u.el('aside', 'ds-header-note', content) : content;
      Object.assign(_c, { content, toolbar, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
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
      if (foot) {
        foot.classList.add('ds-footer');
        _c.content.appendChild(foot);
        _c.foot = foot;
      }
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
    name: 'design-find-fact-find-word-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#ddd'],
      LOW_ACCENTS: ['#ddd'],
      parts,
    },
  });
})();

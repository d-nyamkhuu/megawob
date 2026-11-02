(function () {
  'use strict';
  const palette = { bg: '#c4c7c9', panel: '#d5d7d8', fg: '#111820', muted: '#333b42', line: '#858b90' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
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
      const brand = u.el('span', 'ds-brand', top, 'Shape Catcher - Qt');
      brand.dataset.role = 'brand';
      const controls = u.el('div', 'ds-window-meta', top);
      ['−', '□', '×'].forEach((t) => {
        const b = u.el('button', '', controls, t);
        b.type = 'button';
        b.setAttribute('aria-label', t === '×' ? 'Close' : 'Window control');
      });
      Object.assign(_c, { header: top });
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'ds-menu', document.body);
      ['File', 'Game', 'Options', 'Help'].forEach((t) => _c.util.el('span', '', nav, t));
      _c.contentBox = _c.util.el('div', 'ds-content', document.body);
    },
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.contentBox;
      base(_c);
      _c.header = header;
      const note = _c.contentBox.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction-band', 'ds-instruction');
      const spacer = _c.contentBox.querySelector('.ref-spacer');
      if (spacer) spacer.remove();
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.contentBox;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('ds-instruction-band', 'ds-instruction-panel');
        note.querySelector('.ref-panel-title').classList.add('ds-panel-label');
        note.querySelector('.ref-panel-text').classList.add('ds-instruction');
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
        _c.body.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.body.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      const tools = foot.querySelector('.ref-tools');
      const preview = _c.headerTools.querySelector('.ref-xtra') || tools.querySelector('.ref-xtra');
      if (preview) {
        tools.insertBefore(preview, tools.firstChild);
        preview.classList.add('ds-preview');
        const label = preview.textContent;
        preview.textContent = '';
        const icon = _c.util.el('span', 'ds-preview-icon', preview);
        icon.setAttribute('aria-hidden', 'true');
        const copy = _c.util.el('span', 'ds-preview-copy', preview);
        _c.util.el('b', '', copy, label);
        _c.util.el('small', '', copy, 'Show upcoming shapes');
      }
      const status = _c.util.el('div', 'ds-chase-status', document.body);
      _c.util.el('span', '', status, 'Ready.');
      _c.util.el('span', '', status, 'Game: Shapes');
      _c.util.el('span', '', status, 'v1.0');
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
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-moving-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-moving-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#168be0'],
      LOW_ACCENTS: ['#168be0'],
      parts,
    },
  });
})();

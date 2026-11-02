(function () {
  'use strict';
  const palette = { bg: '#f7f4ef', panel: '#fffdfa', fg: '#111315', muted: '#62666a', line: '#dedbd6' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original rail and corner card support every instruction mode.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const head = u.el('header', 'df-top', document.body);
      u.el('strong', 'df-brand', head, 'DocuFill');
      const nav = u.el('nav', 'df-nav', head);
      [
        ['▤', 'Document to Form', true],
        ['▯', 'Documents'],
        ['▦', 'Templates'],
        ['◷', 'History'],
      ].forEach(([ico, label, on]) => {
        const x = u.el('div', 'df-tab' + (on ? ' active' : ''), nav);
        u.el('b', '', x, ico);
        u.el('span', '', x, label);
      });
      const toolbar = u.el('div', 'df-actions', head);
      u.el('span', '', toolbar, '⚙');
      u.el('span', 'df-user', toolbar, '●');
      const body = u.el('div', 'ds-body', document.body);
      const side = u.el('aside', 'df-side', body);
      const content = u.el('div', 'ds-content', body);
      Object.assign(_c, { toolbar, body, side, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('df-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const side = _c.side;
      [
        ['▣', 'Identity Cards', '12', true],
        ['◎', 'Passports', '3'],
        ['▤', 'Utility Bills', '7'],
        ['■', 'Other Documents', '5'],
      ].forEach(([ico, label, n, on]) => {
        const row = u.el('div', 'df-row' + (on ? ' selected' : ''), side);
        u.el('b', '', row, ico);
        u.el('span', '', row, label);
        u.el('strong', '', row, n);
      });
      u.el('hr', '', side);
      [
        ['✓', 'Processed', '0'],
        ['◷', 'Remaining', '12'],
      ].forEach(([ico, label, n]) => {
        const row = u.el('div', 'df-stat', side);
        u.el('b', '', row, ico);
        u.el('span', '', row, label);
        u.el('strong', '', row, n);
      });
      _c.main = u.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.side;
      base(_c);
      _c.body = body;
      const panel = _c.side.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('ds-footer');
        _c.content.appendChild(foot);
        foot.querySelector('.ref-foot-text').textContent = 'Ready';
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        dock.classList.add('df-dock');
        _c.content.appendChild(dock);
      }
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
    name: 'design-fill-form-idcard-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-fill-form-idcard-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#c92325'],
      LOW_ACCENTS: ['#c92325'],
      parts,
    },
  });
})();

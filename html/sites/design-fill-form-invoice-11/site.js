(function () {
  'use strict';
  const palette = { bg: '#faf9f5', panel: '#faf9f4', fg: '#090b0a', muted: '#66717e', line: '#949da9' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Preserve the original note modes and its 1280px side-card threshold.
      _c.display = _c.ctx.display || 'header';
      if (_c.display === 'panel' && _c.W < 1280) _c.display = 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
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
      const br = u.el('span', 'ds-brand', top);
      u.el('b', '', br, 'DOC');
      u.el('b', 'ds-fill', br, 'FILL');
      u.el('i', 'ds-tag', top, 'Process invoices faster');
      const nav = u.el('nav', 'ds-menu', top);
      ['Invoices', 'Help'].forEach((t) => {
        const item = u.el('span', '', nav, t);
        item.addEventListener('click', () => env.log('decoy', { label: t }));
      });
      u.el('span', 'ds-avatar', nav, 'JD');
      const outer = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', outer);
      u.el('div', 'ds-band', content);
      const header = u.el('div', '', content);
      header.hidden = _c.display !== 'header';
      Object.assign(_c, { top, navArea: nav, content, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        _c.header.classList.add('ds-header-note');
        note.classList.add('ds-instruction');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.navArea;
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
        panel.style.order = '2';
        panel.querySelector('.ref-panel-title').textContent = 'Your Task';
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
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      if (ctx.initial) {
        const el = u.el('section', 'ds-initial ds-initial-tip', document.body);
        el.dataset.role = 'overlay';
        const ic = u.el('div', 'ds-bulb', el);
        ic.innerHTML =
          '<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#111" stroke-width="1.8"><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/><path d="M9 18h6M9.6 20h4.8M11 21.7h2" stroke-width="1.2" stroke-linecap="round"/></svg>';
        u.el('h2', '', el, 'Tip of the day');
        u.el('p', '', el, 'Double-check amounts and dates before submitting.');
        const x = u.el('span', 'ds-x', el, '×');
        x.addEventListener('click', () => ctx.dismiss('close'));
        const l = u.el('label', '', el);
        const cb = u.el('input', '', l);
        cb.type = 'checkbox';
        l.append(' Do not show again');
        const dismiss = u.el('button', '', el, 'Close');
        dismiss.type = 'button';
        dismiss.addEventListener('click', () => ctx.dismiss('close'));
        return { el, dismiss };
      }
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
    name: 'design-fill-form-invoice-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'promo' },
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#bdff4e'],
      LOW_ACCENTS: ['#bdff4e'],
      parts,
    },
  });
})();

(function () {
  'use strict';
  const palette = {
    bg: '#fcfaf9', panel: '#fcfaf9', fg: '#0b1321', muted: '#5b6470', line: '#d9dde3',
  };
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
      document.body.dataset.instruction = _c.display;
      const top = u.el('header', 'ds-top', document.body);
      const brand = u.el('span', 'ds-brand', top, 'Task Center');
      brand.insertAdjacentHTML(
        'afterbegin',
        '<svg width="30" height="40" viewBox="0 0 30 40" style="margin-right:22px"><rect x="1" y="1" width="28" height="38" rx="5" fill="#1a6cf0"/><rect x="7" y="6" width="16" height="7" rx=".5" fill="#fff"/><path d="M7 20h16M7 26h16M7 32h12" stroke="#fff" stroke-width="2"/></svg>',
      );
      const wins = u.el('div', 'ds-wincontrols', top);
      ['minimize', 'maximize', 'close'].forEach((key) => {
        const b = u.el('button', 'ds-wincontrol', wins);
        b.type = 'button';
        b.setAttribute('aria-label', key);
        b.innerHTML =
          '<svg width="16" height="16" viewBox="0 0 16 16"><path d="' +
          {
            minimize: 'M2 8h12',
            maximize: 'M4 2.5h8a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H4a1.5 1.5 0 0 1-1.5-1.5V4A1.5 1.5 0 0 1 4 2.5z',
            close: 'M2 2l12 12M14 2 2 14',
          }[key] + '" fill="none" stroke="#1b2430" stroke-width="1.3"/></svg>';
      });
      const body = u.el('div', 'ds-body');
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      Object.assign(_c, { top, body, content, main, header: top });
    },
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      if (_c.display === 'header') _c.header = _c.util.el('aside', 'ds-brief', _c.main);
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      _c.header = _c.top;
      base(_c);
    },
    'frame.body': () => (_c) => {
      document.body.appendChild(_c.body);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.content;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.content.insertBefore(note, _c.main);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.content.appendChild(foot);
        foot.querySelector('.ref-foot-text').textContent = 'Ready';
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.content.appendChild(dock);
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
    name: 'design-type-text-single-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#0067ff'],
      LOW_ACCENTS: ['#0067ff'],
      parts,
    },
  });
})();

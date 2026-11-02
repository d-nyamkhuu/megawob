(function () {
  'use strict';
  const C = { 'site': 'design-type-text-password-11', 'brand': 'Account Setup' };
  const BULB =
    '<svg viewBox="0 0 60 86" width="100%" height="100%"><defs><radialGradient id="bulb-glass" cx="40%" cy="30%" r="70%"><stop offset="0" stop-color="#fffedb"/><stop offset=".6" stop-color="#fff39a"/><stop offset="1" stop-color="#e3bf35"/></radialGradient><linearGradient id="bulb-metal"><stop stop-color="#40516a"/><stop offset=".5" stop-color="#afbbc4"/><stop offset="1" stop-color="#40516a"/></linearGradient></defs><path d="M30 2C14 2 3 14 3 30c0 11 5 17 11 24 4 5 5 7 5 12h22c0-5 1-7 5-12 6-7 11-13 11-24C57 14 46 2 30 2z" fill="url(#bulb-glass)" stroke="#bd9217" stroke-width="2"/><path d="M24 66l-4-28 6 4 4-6 4 6 6-4-4 28" fill="none" stroke="#dec75f" stroke-width="1"/><path d="M12 24C13 12 22 7 30 7" fill="none" stroke="#fffbd3" stroke-width="3"/><path d="M19 64h22v12q-3 7-11 7t-11-7z" fill="url(#bulb-metal)" stroke="#3d4b5e" stroke-width="1.5"/><path d="M19 68q11 5 22 0m-22 5q11 5 22 0m-20 5q9 4 18 0" fill="none" stroke="#394b60" stroke-width="1.5"/><path d="M25 83h10q-5 5-10 0" fill="#354251"/></svg>';
  const palette = { bg: '#ece9e4', panel: '#ece9e4', fg: '#101020', muted: '#484848', line: '#b6b4b0' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has dedicated space for both panel and toast notes.
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
      const ic = u.el('span', 'ds-ico', top);
      ic.innerHTML = BULB;
      u.el('span', 'ds-brand', top, C.brand);
      const wb = u.el('span', 'ds-wbtns', top);
      ['_', '', 'x'].forEach((t, i) => {
        const b = u.el('i', 'ds-wb' + (i === 2 ? ' x' : ''), wb);
        b.dataset.k = String(i);
      });
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      Object.assign(_c, { top, wb, content, header: top, body });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.content;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.top.insertBefore(_c.headerTools, _c.wb);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.content.insertBefore(note, _c.body);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      const u = _c.util;
      const help = u.el('button', 'ds-btn ds-help');
      help.type = 'button';
      u.el('span', 'ds-q', help, '?');
      u.el('span', '', help, 'Help');
      foot.insertBefore(help, foot.firstChild);
      const spacer = u.el('span', 'ds-sp');
      foot.insertBefore(spacer, help.nextSibling);
      const cancel = u.el('button', 'ds-btn', null, 'Cancel');
      cancel.type = 'button';
      foot.insertBefore(cancel, foot.querySelector('.ref-tools'));
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.querySelector('.ds-sp'));
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const tb = u.el('div', 'ds-otitle', el);
      const i = u.el('span', 'ds-oico', tb);
      i.innerHTML = BULB;
      u.el('span', '', tb, 'Tip of the day');
      const x = u.el('button', 'ds-ox', tb, '✕');
      x.type = 'button';
      x.addEventListener('click', () => ctx.dismiss('close'));
      const bd = u.el('div', 'ds-obody', el);
      const big = u.el('span', 'ds-obulb', bd);
      big.innerHTML = BULB;
      const tx = u.el('div', 'ds-otext', bd);
      u.el('h3', '', tx, 'Keep your account safe');
      u.el(
        'p',
        '',
        tx,
        'Use a strong password with a mix of letters, numbers and symbols. Avoid using personal information.',
      );
      const row = u.el('div', 'ds-orow', el);
      const lab = u.el('label', 'ds-ocheck', row);
      const cb = u.el('input', '', lab);
      cb.type = 'checkbox';
      u.el('span', '', lab, 'Do not show again');
      const dismiss = u.el('button', 'ds-btn ds-oclose', row, 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#1c6fe0'],
      LOW_ACCENTS: ['#1c6fe0'],
      parts,
    },
  });
})();

(function () {
  'use strict';
  const C = {
    site: 'design-choose-option-dropdown-11',
    menu: 'File|Edit|Records|Options|Help',
    tabs: ['Tasks', 'Inventory', 'Returns', 'Customers', 'Reports', 'Settings'],
    pageTitle: 'Store Operations',
    clock: 'Mon  Apr 27, 1987  10:14 AM',
  };
  const ENVELOPE =
    '<svg viewBox="0 0 110 110" width="110" height="110" fill="none" stroke="#000" stroke-width="3"><defs><pattern id="env-hatch" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M-1 1L1-1M0 5L5 0M4 6L6 4" stroke-width="1.4"/></pattern></defs><path d="M3 43 L55 10 L107 43 V106 H3 Z" fill="url(#env-hatch)"/><rect x="13" y="17" width="85" height="61" fill="#fff"/><path d="M24 28h18M50 28h37M24 38h63M24 49h63M24 59h31M62 59h25M24 69h50"/><path d="M3 43 L55 88 L107 43 V106 H3 Z" fill="url(#env-hatch)"/><path d="M3 43 L55 88 L107 43"/></svg>';
  const DOC =
    '<svg viewBox="0 0 34 40" width="34" height="40" fill="#fff" stroke="#000" stroke-width="2.5"><path d="M4 2h18l8 8v28H4z"/><path d="M22 2v8h8M10 18h16M10 24h16M10 30h12"/></svg>';
  const palette = { bg: '#c4c4c4', panel: '#f1f1f1', fg: '#000', muted: '#333', line: '#000' };
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
      const nav = u.el('nav', 'ds-menu', document.body);
      u.el('span', 'ds-sysbox', nav);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      u.el('span', 'ds-clock', nav, C.clock);
      const body = u.el('div', 'ds-body', document.body);
      const tabs = u.el('aside', 'ds-tabs', body);
      C.tabs.forEach((t, i) => u.el('div', 'ds-tab' + (i === 0 ? ' on' : ''), tabs, t));
      u.el('div', 'ds-spiral', body);
      const content = u.el('div', 'ds-content', body);
      const pagehead = u.el('div', 'ds-pagehead', content);
      u.el('span', 'ds-title', pagehead, C.pageTitle);
      const tools = u.el('div', 'ds-headtools', pagehead);
      const foot = u.el('footer', 'ds-footer', content);
      Object.assign(_c, { content, tools, foot, header: foot });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tools;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'ds-main', _c.content);
      _c.content.insertBefore(body, _c.foot);
      _c.body = body;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.foot;
      base(_c);
      _c.body = body;
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
      if (foot) _c.foot.appendChild(foot);
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
      const bar = u.el('div', 'ds-nl-bar', el);
      bar.insertAdjacentHTML('beforeend', DOC);
      u.el('span', 't', bar, 'Shop Notes Newsletter');
      const x = u.el('button', 'ds-nl-x', bar, '×');
      x.type = 'button';
      x.setAttribute('aria-label', 'Close');
      x.addEventListener('click', () => ctx.dismiss('close'));
      const b = u.el('div', 'ds-nl-body', el);
      const ic = u.el('div', '', b);
      ic.innerHTML = ENVELOPE;
      u.el('p', '', b, 'Get product updates, care tips, and more in your inbox.');
      const form = u.el('div', 'ds-nl-form', b);
      u.el('div', 'em', form, 'Your email address');
      const su = u.el('button', 'ds-nl-btn', form, 'Sign Up');
      su.type = 'button';
      const foot = u.el('div', 'ds-nl-foot', b);
      const no = u.el('a', '', foot, "No thanks, I'll pass.");
      no.addEventListener('click', () => ctx.dismiss('close'));
      const dismiss = u.el('button', 'ds-nl-btn', foot, 'Close');
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
      ACCENTS: ['#000'],
      LOW_ACCENTS: ['#000'],
      parts,
    },
  });
})();

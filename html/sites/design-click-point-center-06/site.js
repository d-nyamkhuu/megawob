(function () {
  'use strict';
  const C = {
    title: 'Geometry Practice',
    brand: 'GeoLab',
    nav: ['Tasks', 'History', 'Settings', 'Help'],
    accent: '#a8141c',
  };
  const palette = { bg: '#faf9f6', panel: '#fdfcfa', fg: '#1c1c1c', muted: '#6a665f', line: '#1c1c1c' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original instruction strip fits each display at every viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'design mag' + (_c.display === 'toast' ? ' has-instruction-toast' : '');
      const shell = u.el('div', 'shell', document.body);
      const rail = u.el('nav', 'rail', shell);
      u.el('div', 'brand', rail, C.brand);
      u.el('hr', 'rail-rule', rail);
      C.nav.forEach((t, i) => {
        const a = u.el('div', 'rail-item' + (i === 0 ? ' on' : ''), rail, t);
        a.onclick = () => env.log('nav', { label: t });
      });
      u.el('hr', 'rail-rule low', rail);
      const ver = u.el('div', 'ver', rail);
      ver.innerHTML = 'v1.0<br>© 2008';
      const content = u.el('div', 'content', shell);
      const head = u.el('header', 'head', content);
      u.el('h1', 'title', head, C.title);
      const pager = u.el('div', 'pager', head);
      u.el('span', '', pager, 'Problem 3 of 12');
      for (const d of ['prev', 'next']) {
        const b = u.el('button', 'pg ' + d, pager);
        b.type = 'button';
        b.setAttribute('aria-label', d);
        const s = u.svg('svg', { width: 20, height: 32, viewBox: '0 0 20 32' }, b);
        u.svg('path', { d: d === 'prev' ? 'M18 2L2 16L18 30Z' : 'M2 2L18 16L2 30Z', fill: C.accent }, s);
      }
      const noteSlot = u.el('div', 'note-slot', content);
      Object.assign(_c, { shell, content, pager, noteSlot, header: pager });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.noteSlot;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => { base(_c); },
    'frame.body': () => (_c) => { _c.body = _c.content; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.noteSlot.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = _c.util.el('footer', 'footer', _c.content);
      const foot = document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      for (const label of ['Clear', 'Reset']) {
        const button = _c.util.el('button', 'clear', footer, label);
        button.type = 'button';
        button.onclick = () => { env.widgetDef.clear?.(); };
      }
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.insertBefore(dock, _c.footer.firstChild);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title = {
        cookie: 'Your privacy',
        toast: 'Changes saved',
        chat: 'Support',
        promo: 'Workspace update',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This application stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with this workspace?',
        promo: 'Explore the latest workspace features.',
        banner: 'You are viewing a shared workspace.',
      }[kind];
      const label = kind === 'cookie' ? 'Reject optional' : 'Close';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, label);
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-click-point-center-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-point-center-06': palette },
      LOW_THEME: palette,
      ACCENTS: [C.accent],
      LOW_ACCENTS: [C.accent],
      parts,
    },
  });
})();

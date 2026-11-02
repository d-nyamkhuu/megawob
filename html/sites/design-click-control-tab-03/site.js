(function () {
  'use strict';
  const C = {
    title: 'World Explorer',
    sub: 'CD-ROM COMPANION',
    nav: ['DISCOVER', 'LEARN', 'EXPLORE'],
    quick: ['Tab #1 — Overview', 'Tab #2 — Places', 'Tab #3 — Cultures', 'Tab #4 — Photos'],
    intro:
      'Explore countries, cultures, natural wonders and more from around the globe. Use the tabs above to browse different sections of the CD-ROM.',
  };
  const DISC =
    '<svg viewBox="0 0 100 100"><defs><linearGradient id="dg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6d1e8"/><stop offset=".25" stop-color="#8fd3f0"/><stop offset=".5" stop-color="#f4ee9a"/><stop offset=".75" stop-color="#e48fc4"/><stop offset="1" stop-color="#7fb0ee"/></linearGradient></defs><circle cx="50" cy="50" r="47" fill="url(#dg)" stroke="#cfd3d8" stroke-width="3"/><circle cx="50" cy="50" r="16" fill="#eef"/><circle cx="50" cy="50" r="8" fill="#223"/></svg>';
  const GLOBE =
    '<svg viewBox="0 0 100 100"><defs><radialGradient id="gg" cx=".35" cy=".3"><stop offset="0" stop-color="#7cc4ff"/><stop offset=".6" stop-color="#1c5aa8"/><stop offset="1" stop-color="#08224a"/></radialGradient></defs><circle cx="50" cy="50" r="47" fill="url(#gg)"/><path d="M22 30c10-8 22-6 26 2-6 6-10 14-18 12-6-4-10-8-8-14ZM52 52c8-4 20 0 24 8-2 12-10 22-18 24-6-8-10-20-6-32Z" fill="#3f9a4c"/><circle cx="50" cy="50" r="47" fill="none" stroke="#0a1a33" stroke-width="2"/></svg>';
  const ICONS = [
    '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#1f6fd0" stroke="#123" stroke-width="1.5"/><path d="M8 12c6-6 12-4 12 2-4 4-8 6-10 12-4-4-4-10-2-14ZM22 22c6-2 10 2 10 6-2 6-6 8-8 8-3-4-4-10-2-14Z" fill="#3ea04a"/></svg>',
    '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="#e8dcb0" stroke="#6a4a1a" stroke-width="3"/><path d="M20 5l3 15-3 15-3-15Z" fill="#a22"/><path d="M5 20l15-3 15 3-15 3Z" fill="#555"/></svg>',
    '<svg viewBox="0 0 40 40"><path d="M3 9c6-2 12-2 17 2 5-4 11-4 17-2v24c-6-2-12-2-17 2-5-4-11-4-17-2Z" fill="#f5ecd0" stroke="#222" stroke-width="2.5"/><path d="M20 11v24" stroke="#222" stroke-width="2"/></svg>',
    '<svg viewBox="0 0 40 40"><rect x="3" y="11" width="34" height="23" rx="3" fill="#222"/><rect x="13" y="7" width="12" height="6" fill="#222"/><circle cx="20" cy="23" r="8" fill="#ddd" stroke="#666" stroke-width="2"/><circle cx="20" cy="23" r="4.5" fill="#223"/></svg>',
  ];
  const palette = { bg: '#00304d', panel: '#f4ecd6', fg: '#111111', muted: '#715000', line: '#c9a53c' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original uses its dedicated side pane for both panel and toast notes.
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
      document.body.classList.add('ref', 'cdrom');
      const shell = u.el('main', 'shell', document.body);
      const marble = u.el('div', 'cd-marble', shell);
      marble.setAttribute('aria-hidden', 'true');
      marble.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="cd-marble-tile" width="220" height="100" patternUnits="userSpaceOnUse"><svg width="220" height="100" viewBox="750 8 220 100"><image href="sites/design-click-control-tab-03/assets/reference-art.webp" width="1672" height="941"/></svg></pattern></defs><rect width="100%" height="100%" fill="url(#cd-marble-tile)"/></svg>';
      const head = u.el('header', 'head', shell);
      head.classList.toggle('has-instruction', _c.display === 'header');
      const disc = u.el('span', 'cd-disc', head);
      disc.innerHTML = DISC;
      const tt = u.el('div', 'cd-titles', head);
      u.el('div', 'cd-title', tt, C.title);
      u.el('div', 'cd-sub', tt, C.sub);
      const nav = u.el('div', 'cd-nav', head);
      C.nav.forEach((n, i) => {
        if (i) u.el('i', '', nav, '·');
        u.el('span', '', nav, n);
      });
      const gl = u.el('span', 'cd-globe', head);
      gl.innerHTML = GLOBE;
      Object.assign(_c, { shell, header: head });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction', 'instruction-header');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'work', _c.shell);
      const center = u.el('section', 'center', body);
      const aside = u.el('aside', 'inspector', body);
      u.el('h2', '', aside, 'Quick Links');
      const ql = u.el('ul', 'cd-quick', aside);
      C.quick.forEach((q, i) => {
        const li = u.el('li', '', ql);
        const ic = u.el('span', 'cd-ic', li);
        ic.innerHTML = ICONS[i];
        u.el('span', 'cd-ql', li, q);
      });
      Object.assign(_c, { body, center, aside });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const panel = _c.aside.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction', 'instruction-panel');
        panel.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.aside.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.shell.appendChild(foot);
      const hb = _c.util.el('span', 'cd-btn cd-help');
      hb.innerHTML = '<b>?</b>Help';
      const ob = _c.util.el('span', 'cd-btn cd-opt');
      ob.innerHTML = '<b>&#9881;</b>Options';
      foot.prepend(hb, ob);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-click-control-tab-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'ref.css'],
    design: {
      THEMES: { 'design-click-control-tab-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#c9a53c'],
      LOW_ACCENTS: ['#c9a53c'],
      parts,
    },
  });
})();

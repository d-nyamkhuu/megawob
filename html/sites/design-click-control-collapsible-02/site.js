(function () {
  'use strict';
  const cfg = { title: 'Knowledge Guide', menus: ['File', 'Edit', 'View', 'Go', 'Help'] };
  const palette = { bg: '#edeae4', panel: '#edeae4', fg: '#1c1c1c', muted: '#666666', line: '#bcb9b3' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The document sheet has its own responsive note layout in every mode.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'gtk');
      const win = u.el('main', 'gwin', document.body);
      const tb = u.el('header', 'gtitle', win);
      const ic = u.el('span', 'gicon', tb);
      ic.innerHTML =
        '<svg viewBox="0 0 20 20" aria-hidden="true"><defs><linearGradient id="paper" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#d9dfed"/></linearGradient></defs><rect x="1" y="1" width="18" height="18" rx="4" fill="url(#paper)" stroke="#476181"/><path d="M4 5h5l2 2h5v9H4Z" fill="#9aaabe" stroke="#687a94"/><path d="M6 5v8l3-1 2 2 3-1V6l-3 1-2-2Z" fill="#f8f6eb" stroke="#9d9a8c" stroke-width=".6"/><path d="M6 8h2m3 2h2m-7 1h2m3 1h2" stroke="#78859b" stroke-width=".6"/></svg>';
      u.el('span', 'gtitle-text', tb, cfg.title);
      const wc = u.el('span', 'gwc', tb);
      wc.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M4 12h8"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3.5 3.5h9v9h-9Z"/></svg></i><i class="gx"><svg viewBox="0 0 16 16"><path d="m3.5 3.5 9 9M12.5 3.5l-9 9"/></svg></i>';
      const menu = u.el('nav', 'gmenu', win);
      cfg.menus.forEach((m) => u.el('span', '', menu, m));
      const work = u.el('div', 'gwork', win);
      const index = u.el('nav', 'gindex', work);
      for (let n = 37; n <= 50; n++) u.el('span', '', index, String(n));
      const sheet = u.el('section', 'gsheet', work);
      Object.assign(_c, { win, menu, sheet, header: menu });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.sheet;
      base(_c);
      _c.header = header;
      const note = _c.sheet.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = 'header';
      }
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('gmenu-actions');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.sheet;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.sheet.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction');
        panel.dataset.display = 'panel';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.sheet);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = 'toast';
        _c.sheet.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.sheet.appendChild(foot);
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
    name: 'design-click-control-collapsible-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'gtk.css'],
    design: {
      THEMES: { 'design-click-control-collapsible-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#5b84b3'],
      LOW_ACCENTS: ['#5b84b3'],
      parts,
    },
  });
})();

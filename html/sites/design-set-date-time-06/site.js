(function () {
  'use strict';
  const C = { 'site': 'design-set-date-time-06', 'app': 'Appointment Scheduler', 'group': 'Appointment Details' };
  const CAL =
    '<svg viewBox="0 0 24 24" width="100%" height="100%"><rect x="2.5" y="4.5" width="19" height="17" fill="#fff" stroke="#000" stroke-width="1.5"/><rect x="2.5" y="4.5" width="19" height="4" fill="#000080"/><path d="M7 2v5M12 2v5M17 2v5" stroke="#000" stroke-width="2"/><path d="M5 11h14M5 14h14M5 17h14M8 9v11M12 9v11M16 9v11" stroke="#000080" stroke-width="1.2"/></svg>';
  const BIG =
    '<svg viewBox="0 0 64 64" width="100%" height="100%"><rect x="5" y="9" width="54" height="52" fill="#000"/><rect x="2" y="6" width="54" height="52" fill="#fff" stroke="#000" stroke-width="2"/><rect x="2" y="6" width="54" height="11" fill="#ad1828" stroke="#000" stroke-width="2"/><path d="M10 2v10M22 2v10M34 2v10M46 2v10" stroke="#000" stroke-width="4"/><path d="M10 2v8M22 2v8M34 2v8M46 2v8" stroke="#eee" stroke-width="1.5"/><g fill="none" stroke="#939aa3" stroke-width="1.4"><path d="M9 25h6v6H9zM18 25h6v6h-6zM27 25h6v6h-6zM36 25h6v6h-6zM45 25h6v6h-6zM9 35h6v6H9zM18 35h6v6h-6zM27 35h6v6h-6zM36 35h6v6h-6zM45 35h6v6h-6zM9 45h6v6H9zM18 45h6v6h-6zM27 45h6v6h-6zM36 45h6v6h-6zM45 45h6v6h-6z"/></g></svg>';
  const palette = { bg: '#008080', panel: '#c0c4cc', fg: '#000', muted: '#000', line: '#808080' };
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
      const u = _c.util;
      const shell = u.el('div', 'ds-body', document.body);
      const win = u.el('div', 'ds-win', shell);
      const tb = u.el('div', 'ds-title', win);
      const ic = u.el('span', 'ds-ticon', tb);
      ic.innerHTML = CAL;
      u.el('span', 'ds-ttext', tb, C.app);
      const toolbar = u.el('span', 'ds-tctl', tb);
      ['min', 'max', 'close'].forEach((t) => u.el('span', 'ds-tbtn ds-tbtn-' + t, toolbar));
      const band = u.el('div', 'ds-band', win);
      const bi = u.el('span', 'ds-bigicon', band);
      bi.innerHTML = BIG;
      Object.assign(_c, { shell, win, toolbar, band, header: band });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      const grp = _c.util.el('div', 'ds-group', _c.win);
      _c.util.el('span', 'ds-legend', grp, C.group);
      Object.assign(_c, { body: grp });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.band;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.band.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.win.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.remove();
      for (const label of ['Clear', 'Cancel']) {
        const button = _c.util.el('button', 'ds-cancel', foot, label);
        button.type = 'button';
      }
      const rail = _c.util.el('aside', 'ds-rail', _c.shell);
      _c.util.el('div', 'ds-reservation-values', rail);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.prepend(dock);
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
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#000080'], LOW_ACCENTS: ['#000080'], parts,
    },
  });
})();

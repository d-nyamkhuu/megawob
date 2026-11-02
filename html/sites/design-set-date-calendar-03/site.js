(function () {
  'use strict';
  const C = {
    site: 'design-set-date-calendar-03',
    app: 'Calendar Manager',
    doc: 'New Meeting',
    menus: ['File', 'Edit', 'View', 'Options'],
    task: 'Task',
  };
  const SUN =
    '<svg viewBox="0 0 44 44"><g transform="translate(22 22) rotate(-45)" fill="none" stroke="#183583" stroke-width="2.1"><path id="sun-u" d="M-14-14h11v11h-8v-8h5v5h-2M-14-11v11h14"/><use href="#sun-u" transform="rotate(90)"/><use href="#sun-u" transform="rotate(180)"/><use href="#sun-u" transform="rotate(270)"/></g></svg>';
  const palette = { bg: '#cbcdd0', panel: '#e9eaee', fg: '#111', muted: '#333', line: '#8a8d95' };
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
      const win = u.el('div', 'ol-win', document.body);
      const tb = u.el('header', 'ol-title', win);
      const logo = u.el('span', 'ol-logo', tb);
      logo.innerHTML = SUN + '<i>Sun</i>';
      const tt = u.el('span', 'ol-ttext', tb);
      u.el('span', '', tt, C.app);
      u.el('span', 'ol-dash', tt, '-');
      u.el('b', '', tt, C.doc);
      const wb = u.el('span', 'ol-wbtns', tb);
      u.el('span', 'ol-wb min', wb);
      u.el('span', 'ol-wb max', wb);
      u.el('span', 'ol-wb cls', wb);
      Object.assign(_c, { win, header: win });
    },
    'frame.nav': () => (_c) => {
      const mb = _c.util.el('nav', 'ol-menu', _c.win);
      C.menus.forEach((m) => {
        const s = _c.util.el('span', '', mb);
        s.innerHTML = '<u>' + m[0] + '</u>' + m.slice(1);
      });
      const hp = _c.util.el('span', 'ol-help', mb);
      hp.innerHTML = '<u>H</u>elp';
      _c.menu = mb;
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.win.querySelector('.ref-instruction');
      if (note) note.setAttribute('aria-label', 'Task instruction');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ol-main', _c.win);
      const pane = u.el('aside', 'ol-task', body);
      u.el('div', 'ol-taskhead', pane, C.task);
      const bodyp = u.el('div', 'ol-taskbody', pane);
      Object.assign(_c, { body, pane, bodyp });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.bodyp;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
      _c.body.insertBefore(_c.stage, _c.pane);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.bodyp.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ol-foot');
      _c.pane.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
      if (!_c.foot.querySelector('[data-role]')) _c.pane.classList.add('ol-no-footer');
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
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#1d3f8c'],
      LOW_ACCENTS: ['#1d3f8c'],
      parts,
    },
  });
})();

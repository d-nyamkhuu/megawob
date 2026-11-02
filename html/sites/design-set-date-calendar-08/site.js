(function () {
  'use strict';
  const C = {
    site: 'design-set-date-calendar-08',
    menu: ['Desk', 'File', 'Edit', 'Record', 'Tools', 'Window', 'Help'],
    clock: 'Mon 14 Sep 1986   10:24',
  };
  const FLOPPY = '<svg width="46" height="46" viewBox="0 0 24 24"><path d="M2 2h17l3 3v17H2z" fill="#fff" stroke="#000" stroke-width="2"/><rect x="6" y="2" width="11" height="7" fill="#000"/><rect x="13" y="3.5" width="2.5" height="4" fill="#fff"/><rect x="5" y="13" width="14" height="9" fill="#fff" stroke="#000" stroke-width="1.5"/><rect x="7" y="19" width="2" height="2"/></svg>';
  const TRASH = '<svg width="42" height="46" viewBox="0 0 24 26"><rect x="3" y="3" width="18" height="3" fill="#fff" stroke="#000" stroke-width="2"/><path d="M5 7h14l-1 17H6z" fill="#fff" stroke="#000" stroke-width="2"/><path d="M9 10v11M12 10v11M15 10v11" stroke="#000" stroke-width="1.5"/></svg>';
  const INFO = '<svg width="56" height="68" viewBox="0 0 28 34"><path d="M2 2h16l8 8v22H2z" fill="#ddd" stroke="#000" stroke-width="2.5"/><path d="M18 2v8h8" fill="#eee" stroke="#000" stroke-width="1.5"/><circle cx="14" cy="11" r="2.4"/><path d="M10 15h7v11h3v3h-10v-3h3v-8h-3z"/></svg>';
  const DOC = '<svg width="38" height="46" viewBox="0 0 24 30"><path d="M3 2h13l5 6v20H3z" fill="#ddd" stroke="#000" stroke-width="2"/><path d="M16 2v6h5M7 11h10M7 15h10M7 19h10M7 23h10" fill="none" stroke="#000" stroke-width="1.6"/></svg>';
  function win(u, cls, title, min) {
    const w = u.el('section', 'gm-win ' + cls, document.body);
    const t = u.el('div', 'gm-title', w);
    u.el('i', 'gm-gad gm-gl', t);
    u.el('span', 'gm-tt', t, title);
    if (min) u.el('i', 'gm-gad gm-gmin', t);
    u.el('i', 'gm-gad gm-gx', t);
    return u.el('div', 'gm-wbody', w);
  }
  const palette = { bg: '#156322', panel: '#e8e9e9', fg: '#000000', muted: '#777777', line: '#000000' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      if ((_c.display === 'panel' || _c.display === 'toast') && (_c.W < 1260 || _c.H < 700)) _c.display = 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const bar = u.el('header', 'gm-bar', document.body);
      const mn = u.el('nav', 'gm-menu', bar);
      C.menu.forEach((t) => u.el('span', '', mn, t));
      u.el('span', 'gm-clock', bar, C.clock);
      const sv = u.el('span', 'gm-save', bar);
      sv.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M2 2h17l3 3v17H2z" fill="#fff" stroke="#000" stroke-width="2.5"/><rect x="6" y="2" width="10" height="7" fill="#000"/><rect x="5" y="13" width="14" height="9" fill="#fff" stroke="#000" stroke-width="1.5"/></svg>';
      const dk = u.el('div', 'gm-icon gm-disk', document.body);
      dk.innerHTML = FLOPPY;
      u.el('span', '', dk, 'DISK');
      const tr = u.el('div', 'gm-icon gm-trash', document.body);
      tr.innerHTML = TRASH;
      u.el('span', '', tr, 'TRASH');
      const header = win(u, 'gm-task', 'Task', false);
      header.parentNode.hidden = _c.display !== 'header';
      const ic = u.el('div', 'gm-info', header);
      ic.innerHTML = INFO;
      Object.assign(_c, { header, bar });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.bar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const body = win(_c.util, 'gm-main', 'Adoption Records', true);
      const feedback = win(_c.util, 'gm-fb', 'Feedback', true);
      Object.assign(_c, { body, feedback });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.feedback;
      base(_c);
      _c.body = body;
      const heading = _c.feedback.querySelector('.ref-panel-title');
      if (heading) heading.textContent = 'Task';
      const hd = _c.util.el('div', 'gm-fbh', _c.feedback);
      const d = _c.util.el('span', '', hd);
      d.innerHTML = DOC;
      _c.util.el('b', '', hd, 'Record Details');
      _c.util.el('div', 'ds-reservation-values', _c.feedback);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => { base(_c); },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.body.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      _c.foot = foot;
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
    design: { THEMES: { 'design-set-date-calendar-08': palette }, LOW_THEME: palette, ACCENTS: ['#000000'], LOW_ACCENTS: ['#000000'], parts },
  });
})();

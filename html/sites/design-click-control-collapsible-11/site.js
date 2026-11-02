(function () {
  'use strict';
  const ICON = {};
  ['tree', 'house', 'people', 'news', 'mail', 'pin', 'flower', 'cat', 'bulb'].forEach((key) => {
    ICON[key] = '<img src="sites/design-click-control-collapsible-11/assets/' + key + '.webp" alt="" draggable="false">';
  });
  const palette = { bg: '#edece7', panel: '#f4f2ea', fg: '#080d29', muted: '#384b68', line: '#9a9a9a' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
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
      document.body.classList.add('ref', 'sunny');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('span', 'tree l', head).innerHTML = ICON.tree;
      const mast = u.el('div', 'mast', head);
      u.el('div', 'title', mast, 'Sunnybrook Online');
      u.el('div', 'tag', mast, 'A Small Town. A Friendly Place.');
      u.el('div', 'rule', mast).innerHTML = '<i></i><b>✾</b><i></i>';
      u.el('span', 'tree r', head).innerHTML = ICON.tree;
      u.el('div', 'date', head, 'Tuesday, April 23, 1996');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const bar = u.el('div', 'cbar', center);
      u.el('span', 'ct', bar, 'Community Resources');
      const cl = u.el('span', 'cl', bar);
      cl.innerHTML = '<span class="mh">' + ICON.house + '</span>Neighbors <b>•</b> Information <b>•</b> A Brighter Tomorrow';
      Object.assign(_c, { shell, work, center, bar, header: work });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const nav = u.el('nav', 'snav', _c.work);
      [['house', 'Home'], ['people', 'Our Town'], ['news', 'Local News'], ['tree', 'Guestbook'], ['mail', 'Contact Us']].forEach((p) => {
        const r = u.el('div', 'ni', nav);
        u.el('span', 'ic', r).innerHTML = ICON[p[0]];
        u.el('a', '', r, p[1]);
      });
      const l = u.el('div', 'deco dl', _c.work);
      u.el('span', '', l).innerHTML = ICON.flower;
      u.el('p', '', l, 'Good Neighbors Stronger Together');
      const r = u.el('div', 'deco dr', _c.work);
      u.el('span', '', r).innerHTML = ICON.cat;
      u.el('p', '', r, 'Kind People Make a Brighter Tomorrow');
      _c.siteNav = nav;
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = 'header';
      }
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.bar;
      base(_c);
      _c.header = h;
      _c.bar.classList.toggle('has-tools', !!_c.headerTools.children.length);
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction', 'instruction-panel');
        panel.dataset.display = 'panel';
        const pin = _c.util.el('span', 'pin');
        pin.innerHTML = ICON.pin;
        panel.prepend(pin);
      }
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('div', 'stage', _c.center); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = 'toast';
        _c.work.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      const link = foot.querySelector('.ref-endlink');
      if (link) _c.siteNav.appendChild(link);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.shell.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb tip ' + ctx.kind, document.body);
      const t = ctx.util.el('div', 'tip-t', el);
      ctx.util.el('span', 'tb', t).innerHTML = ICON.bulb;
      ctx.util.el('span', 'tt', t, 'Tip of the Day');
      const x = ctx.util.el('button', 'tip-x', t, '×');
      x.type = 'button';
      x.title = 'Close tip';
      x.setAttribute('aria-label', 'Close tip');
      x.addEventListener('click', ctx.dismiss);
      const b = ctx.util.el('div', 'tip-b', el);
      ctx.util.el('h3', '', b, 'Discover More!');
      ctx.util.el('p', '', b).innerHTML =
        'You can explore our <b>Resources</b> section for links to local information, helpful tools, and fun places on the web.';
      const lab = ctx.util.el('label', 'tip-c', b);
      const cb = ctx.util.el('input', '', lab);
      cb.type = 'checkbox';
      ctx.util.el('span', '', lab, 'Do not show again');
      const dismiss = ctx.util.el('button', 'dismiss', b, 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-click-control-collapsible-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'promo' },
    design: {
      THEMES: { sunnybrook: palette },
      LOW_THEME: palette,
      ACCENTS: ['#0000ee'],
      LOW_ACCENTS: ['#0000ee'],
      parts,
    },
  });
})();

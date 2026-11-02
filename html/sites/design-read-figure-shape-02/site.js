// E-ink workspace design on the shared frame; the dock and window chrome are site-specific.
(function () {
  'use strict';

  function windowBar(u, top) {
    const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
    u.svg('rect', { x: 3, y: 2, width: 20, height: 22, rx: 1, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
    u.svg('path', { d: 'M12 7h3v3h-3zM13 11v8', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
    u.el('span', '', top, 'Shape Finder');
    const controls = u.el('div', 'native-window-controls', top);
    for (const d of ['M3 12h14', 'M4 4h12v12H4z', 'M4 4l12 12M16 4L4 16']) {
      const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, controls);
      u.svg('path', { d, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, svg);
    }
    // The shape widget fills this menu; the e-ink stylesheet hides it.
    u.el('nav', 'menu', top);
  }

  const parts = {
    'frame.layout': () => (_c) => {
      const { ctx } = _c;
      const W = window.innerWidth, H = window.innerHeight;
      document.body.className = 'eink2 stagger instruction-' + ctx.display;
      Object.assign(_c, { W, H, roomy: W >= 1260, tall: H >= 700, display: ctx.display });
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      // This design always has a bottom tool dock, including short and finish-mode episodes.
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const { util: u } = _c;
      const app = u.el('main', 'app', document.body);
      const header = u.el('header', 'top', app);
      windowBar(u, header);
      const body = u.el('div', 'center ref-body', app);
      Object.assign(_c, { app, header, body });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base({ ..._c, header: _c.body });
      const brief = _c.body.querySelector('.ref-instruction');
      if (brief) brief.classList.add('brief');
      else {
        _c.body.querySelector('.ref-spacer').remove();
        _c.body.classList.add('center-no-brief');
      }
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const { util: u, display } = _c;
      const instructions = u.el('div', 'dk ins');
      u.el('h3', '', instructions, 'Instructions');
      base({ ..._c, body: instructions });
      const note = instructions.querySelector('.ref-panel-text');
      if (note) note.classList.add('mode-note');
      if (display === 'header') {
        const ol = u.el('ol', '', instructions);
        for (const text of ['Look at the shapes and letters.', 'Read the task.', 'Click on it to select.'])
          u.el('li', '', ol, text);
      }
      _c.instructions = instructions;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.body);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const { app, ctx, instructions, util: u } = _c;
      const footer = document.querySelector('.ref-foot');
      footer.className = 'bottom';
      app.append(footer);
      footer.querySelector('.ref-foot-text').remove();
      const act = footer.querySelector('.ref-tools');
      act.className = 'dk act';
      const details = u.el('div', 'dk td');
      u.el('h3', '', details, 'Figure Details');
      for (const label of ['Shape:', 'Color:', 'Size:']) {
        const row = u.el('div', 'row', details);
        u.el('span', '', row, label);
        u.el('i', 'figure-value', row, 'Various');
      }
      footer.prepend(details, u.el('div', 'sep'), instructions, u.el('div', 'sep'));
      const clear = u.el('button', 'clear', act, 'Clear Selection');
      clear.type = 'button';
      if (ctx.finish) act.classList.add('finish-actions');
      _c.act = act;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.act.prepend(dock);
    },
    'frame.end': (base) => (_c) => {
      const { header, submit } = _c;
      if (submit) {
        submit.classList.add('submit');
        if (header.contains(submit)) submit.classList.add('header-submit');
        if (submit.classList.contains('ref-endlink')) submit.classList.add('link-submit');
      }
      return base(_c);
    },
  };

  env.site({
    name: 'design-read-figure-shape-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['../base/site.css', 'site.css', 'eink.css'],
    design: {
      THEMES: { eink: { bg: '#f1efe9', panel: '#f1efe9', fg: '#111', muted: '#555', line: '#111' } },
      LOW_THEME: { bg: '#f1efe9', panel: '#f1efe9', fg: '#111', muted: '#555', line: '#111' },
      ACCENTS: ['#111'],
      LOW_ACCENTS: ['#111'],
      parts,
    },
  });
})();

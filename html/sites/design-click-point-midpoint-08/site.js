(function () {
  'use strict';
  const C = { title: 'Point Task', menus: ['File', 'Edit', 'View', 'Tools', 'Help'] };
  const palette = { bg: '#cdcac3', panel: '#cdcac3', fg: '#111', muted: '#55524d', line: '#8c8a84' };

  function drawDock(u, win, stage) {
    const dock = u.el('footer', 'dock', win);
    const grp = (cls, title) => {
      const g = u.el('section', 'grp ' + cls, dock);
      u.el('h4', '', g, title);
      return u.el('div', 'g-body', g);
    };
    const gi = grp('g-info', 'Pointer Info');
    const fl = u.el('div', 'fl', gi);
    const mk = (lab, val) => {
      const r = u.el('div', 'fld', fl);
      u.el('label', '', r, lab);
      const i = u.el('input', '', r);
      i.value = val;
      i.readOnly = true;
      return i;
    };
    const ix = mk('X:', '—'), iy = mk('Y:', '—');
    u.el('div', 'vsep', gi);
    const mkchk = (p, t, on, change) => {
      const l = u.el('label', 'chk', p);
      const b = u.el('i', '', l, on ? '✓' : '');
      u.el('span', '', l, t);
      l.onclick = () => {
        on = !on;
        b.textContent = on ? '✓' : '';
        change?.(on);
      };
    };
    mkchk(gi, 'Show coordinates', true, (on) => { fl.style.visibility = on ? 'visible' : 'hidden'; });
    stage.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      ix.value = String(Math.round(e.clientX - r.left));
      iy.value = String(Math.round(e.clientY - r.top));
    });
    const gv = grp('g-view', 'View');
    const vc = u.el('div', 'vcol', gv);
    mkchk(vc, 'Show grid', false, (on) => stage.classList.toggle('show-grid', on));
    mkchk(vc, 'Show labels', true, (on) => stage.classList.toggle('hide-labels', !on));
    mkchk(vc, 'Snap to grid', false);
    const ga = grp('g-act', 'Actions');
    const clear = u.el('button', 'mb clear', ga, 'Clear');
    clear.type = 'button';
    clear.onclick = () => { env.widgetDef.clear?.(); };
    const gz = grp('g-zoom', 'Zoom');
    const zr = u.el('div', 'zrow', gz);
    u.el('span', '', zr, '100%');
    const sl = u.el('div', 'slider', zr);
    u.el('b', '', sl, '◀');
    const tr = u.el('div', 'tr', sl);
    u.el('div', 'th', tr);
    u.el('b', '', sl, '▶');
    return ga;
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
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
      document.body.classList.add('design', 'motif');
      document.documentElement.style.setProperty('--font', 'Helvetica, Arial, sans-serif');
      const win = u.el('div', 'mw', document.body);
      const tbar = u.el('div', 'tbar', win);
      const appIcon = u.el('span', 'ico', tbar);
      const icon = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none', stroke: '#565650', 'stroke-width': 1 }, appIcon);
      u.svg('path', { d: 'M3 3H17V17H3ZM4 13L8 8L12 12L16 5M6 4V7M4 6H7M13 13V16M11 15H15M8 11L6 16M11 4L9 7' }, icon);
      u.el('span', 'tt', tbar, C.title);
      const wb = u.el('div', 'wb', tbar);
      for (const l of ['_', '□', '×']) {
        const b = u.el('button', '', wb, l);
        b.type = 'button';
        b.onclick = () => env.log('window-control', { label: l });
      }
      const mbar = u.el('nav', 'mbar', win);
      const work = u.el('div', 'work', win);
      const header = u.el('section', 'task-note', work);
      header.hidden = _c.display !== 'header';
      Object.assign(_c, { win, mbar, work, header });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const pop = u.el('div', 'menu-pop', _c.mbar);
      pop.hidden = true;
      let tb = null;
      for (const t of ['Ruler', 'Grid', 'Crosshair', '-', 'Preferences...']) {
        if (t === '-') u.el('hr', '', pop);
        else {
          const d = u.el('div', '', pop, t);
          d.onclick = () => { pop.hidden = true; tb.classList.remove('open'); };
        }
      }
      for (const m of C.menus) {
        const b = u.el('button', '', _c.mbar, m);
        b.type = 'button';
        if (m === 'Tools') {
          tb = b;
          b.onclick = () => { pop.hidden = !pop.hidden; b.classList.toggle('open', !pop.hidden); };
        }
      }
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.mbar;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.work.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note', 'instruction-panel');
        panel.querySelector('.ref-panel-title').textContent = 'Task Instructions';
      }
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('main', 'stage', _c.work);
      stage.dataset.role = 'stage';
      _c.stage = stage;
      _c.actions = drawDock(_c.util, _c.win, stage);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note', 'instruction-toast');
        _c.work.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('status');
      foot.querySelector('.ref-foot-text').textContent = 'Ready.';
      _c.util.el('span', 'grip', foot);
      _c.win.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.actions.appendChild(dock);
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
    name: 'design-click-point-midpoint-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-point-midpoint-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#111'],
      LOW_ACCENTS: ['#111'],
      parts,
    },
  });
})();

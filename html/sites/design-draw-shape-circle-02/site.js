(function () {
  'use strict';
  const C = {
    title: 'Geometry Practice',
    menu: ['File', 'Edit', 'View', 'Help'],
    accent: '#2685dd',
    bg: '#d8e8f6',
    surface: '#fff',
    font: '"Segoe UI",Tahoma,Arial,sans-serif',
  };
  const palette = { bg: C.bg, panel: C.surface, fg: '#111820', muted: '#657080', line: '#c9cfd5' };

  function drawTools(u, side) {
    const tools = u.el('div', 'vg-sec vg-tools', side);
    u.el('h3', '', tools, 'Tools');
    const row = u.el('div', 'vg-toolrow', tools);
    const icons = {
      Pencil: 'M3 29L5 20L22 3Q23 2 24 3L29 8Q30 9 29 10L12 27ZM5 20L12 27M19 6L26 13',
      Eraser: 'M3 21L20 4L29 13L12 30H10ZM10 14L20 24',
      Clear: 'M5 7H27V10H5ZM12 7V3H20V7M7 10L9 30H23L25 10ZM12 13V26M16 13V26M20 13V26',
    };
    const btns = [];
    for (const name of ['Pencil', 'Eraser', 'Clear']) {
      const w = u.el('div', 'vg-tool', row);
      const bt = u.el('button', 'vg-toolbtn', w);
      bt.type = 'button';
      const sv = u.svg('svg', {
        width: 30, height: 30, viewBox: '0 0 32 32',
        fill: name === 'Pencil' ? '#a7c6e7' : name === 'Eraser' ? '#a2a6ab' : '#85888c',
        stroke: name === 'Pencil' ? '#142f4f' : '#4a4e53',
        'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round',
      }, bt);
      u.svg('path', { d: icons[name] }, sv);
      if (name === 'Eraser')
        u.svg('path', { d: 'M3 21L10 14L20 24L12 30H10Z', fill: '#fff', stroke: '#4a4e53', 'stroke-width': 1.8 }, sv);
      u.el('span', '', w, name);
      if (name === 'Pencil') { bt.classList.add('on'); w.classList.add('on'); }
      btns.push([name, bt, w]);
      bt.onclick = () => {
        if (name === 'Clear') { env.widgetDef.clear?.(); return; }
        env.widgetDef.setDrawingTool?.(name);
        for (const [n, b, ww] of btns) {
          if (n === 'Clear') continue;
          b.classList.toggle('on', n === name);
          ww.classList.toggle('on', n === name);
        }
      };
    }
  }

  function drawPalette(u, desk) {
    const pal = u.el('div', 'vg-pal', desk), pt = u.el('div', 'vg-ptitle', pal);
    u.el('span', '', pt, 'Line Style');
    const pc = u.el('button', 'vg-wcb close', pt);
    pc.type = 'button';
    pc.setAttribute('aria-label', 'close');
    pc.onclick = () => env.log('window-control', { label: 'close' });
    const pb = u.el('div', 'vg-pbody', pal),
      styles = [['Solid', ''], ['Dashed', '7 5'], ['Dotted', '2 5']], pbs = [];
    for (const [i, [name, dash]] of styles.entries()) {
      const c = u.el('div', 'vg-style' + (i === 0 ? ' on' : ''), pb);
      const bt = u.el('button', 'vg-stylebtn', c);
      bt.type = 'button';
      const sv = u.svg('svg', { width: 44, height: 20, viewBox: '0 0 44 20' }, bt);
      u.svg('path', {
        d: 'M1 10H43', stroke: '#222', 'stroke-width': 2.4,
        'stroke-dasharray': name === 'Dotted' ? '1 8' : dash,
        fill: 'none', 'stroke-linecap': name === 'Dotted' ? 'round' : 'butt',
      }, sv);
      u.el('span', '', c, name);
      pbs.push(c);
      bt.onclick = () => {
        pbs.forEach((x) => x.classList.remove('on'));
        c.classList.add('on');
        env.widgetDef.setLineStyle?.(dash);
      };
    }
  }

  const styleControls = (parent) => {
    parent.querySelectorAll('.ref-submit, .ref-float').forEach((b) => b.classList.add('vg-submit', 'submit'));
    parent.querySelectorAll('.ref-icon').forEach((b) => b.classList.add('vg-submit-icon'));
    parent.querySelectorAll('.ref-endlink').forEach((b) => b.classList.add('vg-submit', 'submit', 'vg-submit-link'));
    parent.querySelectorAll('.ref-xtra').forEach((b) => b.classList.add('vg-xtra'));
  };

  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'vista', 'vg');
      document.body.classList.toggle('has-instruction-toast', _c.display === 'toast');
      document.documentElement.style.setProperty('--font', C.font);
      const desk = u.el('div', 'vg-desk', document.body);
      const win = u.el('div', 'vg-win', desk), head = u.el('header', 'vg-title', win);
      const ic = u.svg('svg', { class: 'vg-appicon', width: 20, height: 20, viewBox: '0 0 20 20' }, head);
      u.svg('circle', { cx: 10, cy: 10, r: 9, fill: '#2f86e0', stroke: '#dff0ff', 'stroke-width': 1.5 }, ic);
      u.svg('circle', { cx: 10, cy: 10, r: 4, fill: 'none', stroke: '#fff', 'stroke-width': 2 }, ic);
      u.el('div', 'vg-title-text', head, C.title);
      const wc = u.el('div', 'vg-wc', head);
      for (const [cls, label] of [['min', 'min'], ['max', 'max'], ['close', 'close']]) {
        const bt = u.el('button', 'vg-wcb ' + cls, wc);
        bt.type = 'button';
        bt.setAttribute('aria-label', label);
        bt.onclick = () => env.log('window-control', { label });
      }
      const menu = u.el('nav', 'vg-menu', win);
      for (const m of C.menu) u.el('span', '', menu, m);
      const client = u.el('div', 'vg-client', win);
      const header = u.el('section', 'vg-note task-note', client);
      header.hidden = _c.display !== 'header';
      Object.assign(_c, { desk, win, menu, client, header });
      drawPalette(u, desk);
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('vg-instr', 'instruction');
        _c.util.el('div', 'vg-sub', _c.header, 'Click and drag to draw. Release to finish.');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('vg-head-actions');
      styleControls(_c.headerTools);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'vg-mid', _c.client);
      const side = u.el('aside', 'vg-side', body);
      drawTools(u, side);
      const opt = u.el('div', 'vg-sec vg-opt', side);
      u.el('h3', '', opt, 'Options');
      const help = u.el('div', 'vg-sec vg-help', side);
      u.el('h3', '', help, 'Help');
      u.el('p', '', help, 'Use Pencil to draw and Eraser to make corrections. Clear removes your drawing. The Line Style palette changes the stroke.');
      Object.assign(_c, { body, side, opt });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.opt;
      base(_c);
      _c.body = body;
      const text = _c.opt.querySelector('.ref-panel-text');
      if (text) text.classList.add('vg-panel-instruction');
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('main', 'stage', _c.body);
      stage.dataset.role = 'stage';
      _c.body.insertBefore(stage, _c.side);
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('vg-note', 'task-note', 'vg-toast-note');
        note.querySelector('.ref-note-text').classList.add('vg-instr', 'instruction');
        note.querySelector('.ref-note-x').classList.add('vg-noteclose');
        _c.client.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('vg-foot');
      _c.client.appendChild(foot);
      styleControls(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) { _c.foot.appendChild(dock); styleControls(dock); }
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      u.el('h3', '', box, 'Product Updates Newsletter');
      u.el('p', '', box, 'Get occasional updates about new features and tips.');
      const dismiss = u.el('button', 'dismiss', box, 'Close');
      const icon = u.svg(
        'svg',
        {
          class: 'ob-icon',
          width: 64,
          height: 64,
          viewBox: '0 0 64 64',
          fill: 'none',
          stroke: C.accent,
          'stroke-width': 3,
        },
        box,
      );
      u.svg('path', { d: 'M8 14H56V50H8ZM8 14L32 34L56 14' }, icon);
      u.el('div', 'nl-input', box, 'Your email address (optional)');
      const cb = u.el('div', 'nl-check', box);
      u.el('span', 'nl-box', cb);
      u.el('span', '', cb, 'Send me product updates');
      const x = u.el('button', 'nl-x', box, '✕');
      x.type = 'button';
      x.onclick = () => dismiss.click();
      if (env.timeText) env.timeText.textContent = 'Time: Paused (starts after you close the newsletter)';
      dismiss.type = 'button';
      dismiss.onclick = () => {
        if (env.timeText) env.timeText.textContent = 'Time: Ready';
        ctx.dismiss('close');
      };
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };

  env.site({
    name: 'design-draw-shape-circle-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'vg.css'],
    design: {
      THEMES: { 'design-draw-shape-circle-02': palette },
      LOW_THEME: palette,
      ACCENTS: [C.accent],
      LOW_ACCENTS: [C.accent],
      parts,
    },
  });
})();

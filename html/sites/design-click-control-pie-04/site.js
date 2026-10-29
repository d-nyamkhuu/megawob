(function () {
  'use strict';
  const MENUS = ['File', 'Edit', 'View', 'Objects', 'Tools', 'Options', 'Help'];
  const TOOLS = [
    ['Select', '<path d="M8 4l16 14h-8l5 10-4 2-5-10-6 5z" fill="#565168" stroke="#171722" stroke-width=".7"/>'],
    [
      'Move',
      '<path d="M16 3v26M3 16h26M16 3l-4 5h8zM16 29l-4-5h8zM3 16l5-4v8zM29 16l-5-4v8z" fill="#222" stroke="#222" stroke-width="1.5"/>',
    ],
    [
      'Rotate',
      '<path d="M15 5a11 11 0 0 1 11 13M17 27A11 11 0 0 1 6 14" fill="none" stroke="#2c2b42" stroke-width="3.5"/><path d="M23 14l6 4-7 4zM9 17l-6-4 7-4z" fill="#222"/>',
    ],
    [
      'Scale',
      '<path d="M4 8l12-5 12 5-12 6z" fill="#aaa6cf" stroke="#222" stroke-width=".6"/><path d="M4 8l12 6v15L4 24z" fill="#807ba9" stroke="#222" stroke-width=".6"/><path d="M16 14L28 8v16l-12 5z" fill="#4c486a" stroke="#222" stroke-width=".6"/>',
    ],
    ['Create', '<circle cx="16" cy="16" r="11" fill="#8f8bc0" stroke="#4a4870"/>'],
    [
      'Modify',
      '<path d="M3 19l13-6 13 6-13 7z" fill="#8f8bc0" stroke="#222" stroke-width=".6"/><path d="M3 19v5l13 7v-5z" fill="#77729a" stroke="#222" stroke-width=".6"/><path d="M16 26l13-7v5l-13 7z" fill="#363347"/><path d="M4 11l12-8 12 8-12 7z" fill="#a8a0cb" stroke="#222" stroke-width=".6"/><path d="M4 11v4l12 7v-4z" fill="#7b759f"/><path d="M16 18l12-7v4l-12 7z" fill="#37344d"/>',
    ],
    [
      'Measure',
      '<path d="M16 3L3 28l14 2z" fill="#9c96c3" stroke="#4a4870" stroke-width=".6"/><path d="M16 3l1 27 13-3z" fill="#5f587f" stroke="#353344" stroke-width=".6"/>',
    ],
  ];
  // A small, deterministic shaded mesh, like the workstation's polygon preview.
  function sphere(cx, cy, r) {
    let s = '';
    const pt = (a, b) => [cx + r * Math.cos(a) * Math.sin(b), cy + r * Math.sin(a)];
    for (let j = 0; j < 16; j++)
      for (let i = 0; i < 16; i++) {
        const a = -Math.PI / 2 + (j * Math.PI) / 16,
          b = -Math.PI / 2 + (i * Math.PI) / 16,
          da = Math.PI / 16,
          db = Math.PI / 16;
        const am = a + da / 2,
          bm = b + db / 2;
        const light =
          0.46 +
          0.54 *
            Math.max(0, -0.32 * Math.cos(am) * Math.sin(bm) - 0.46 * Math.sin(am) + 0.7 * Math.cos(am) * Math.cos(bm));
        const color = [151, 149, 177].map((v) => Math.round(v * light));
        s +=
          '<polygon points="' +
          [pt(a, b), pt(a + da, b), pt(a + da, b + db), pt(a, b + db)].map((p) => p.join(',')).join(' ') +
          '" fill="rgb(' +
          color.join(',') +
          ')" stroke="rgb(' +
          color.join(',') +
          ')" stroke-width=".5"/>';
      }
    return s;
  }
  function grid() {
    let g = '';
    const p = (x, z) => [480 + (800 * (x - z)) / (10 + x + z), -50 + 1800 / (10 + x + z)];
    for (let i = -29; i <= 4; i += 0.75) {
      for (const flip of [false, true]) {
        let d = '';
        for (let j = -29; j <= 4; j += 0.75) {
          if (10 + i + j < 1) continue;
          const q = flip ? p(j, i) : p(i, j);
          d += (d ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1);
        }
        g += '<path d="' + d + '"/>';
      }
    }
    return g;
  }
  function shadeIcon(svg, i) {
    let defs = '',
      count = 0;
    const body = svg.replace(/fill="#([a-f0-9]{6})"/gi, (_, hex) => {
      const id = 'shade-' + i + '-' + count++;
      const rgb = [0, 2, 4].map((k) => parseInt(hex.slice(k, k + 2), 16));
      const color = (d) => 'rgb(' + rgb.map((v) => Math.max(0, Math.min(255, v + d))).join(',') + ')';
      defs +=
        '<linearGradient id="' +
        id +
        '" x1="0" y1="0" x2="1" y2="1"><stop stop-color="' +
        color(19) +
        '"/><stop offset="1" stop-color="' +
        color(-19) +
        '"/></linearGradient>';
      return 'fill="url(#' + id + ')"';
    });
    return '<defs>' + defs + '</defs>' + body;
  }
  // The scene, previews and tool icons belong only to this workstation design.
  function drawScene(u, left) {
    u.el('div', 'irx-persp', left, 'Perspective');
    const scene = u.el('div', 'irx-scene', left);
    scene.innerHTML =
      '<svg viewBox="0 0 975 770" preserveAspectRatio="none"><g stroke="#777886" stroke-width="1" fill="none" opacity=".48">' +
      grid() +
      '</g>' +
      '<ellipse cx="829" cy="270" rx="73" ry="24" transform="rotate(15 829 270)" fill="#252630" opacity=".7"/>' +
      sphere(845, 215, 69) +
      '<path d="M125 185L65 345 135 365z" fill="#8b8a9d"/><path d="M125 185L135 365 208 332z" fill="#6a6b7e" stroke="#343542"/>' +
      '<path d="M225 137L309 119 365 138 280 157z" fill="#8d8b9f"/><path d="M225 137L280 157 288 260 234 236z" fill="#646576"/><path d="M280 157L365 138 365 235 288 260z" fill="#585968" stroke="#888799" stroke-width=".8"/>' +
      '<g transform="translate(0,-90)"><path d="M91 745V695" stroke-width="2" fill="none" stroke="#6c6"/><path d="M91 745H144" stroke="#e55" stroke-width="2"/><path d="M91 745L55 778" stroke="#66e" stroke-width="2"/>' +
      '<text x="150" y="755" fill="#d44" font-size="18">X</text><text x="84" y="680" fill="#6c6" font-size="18">Y</text><text x="48" y="798" fill="#55e" font-size="18">Z</text></g></svg>';
  }
  function drawProperties(u, right) {
    const oh = u.el('div', 'irx-ph irx-sec', right);
    u.el('i', '', oh, '▼');
    u.el('span', '', oh, 'Object Properties');
    const op = u.el('div', 'irx-props', right);
    const rows = u.el('div', 'irx-rows', op);
    const r1 = u.el('div', 'irx-row', rows);
    u.el('label', '', r1, 'Name:');
    u.el('span', 'irx-f irx-wide', r1, 'Sphere');
    const r2 = u.el('div', 'irx-row', rows);
    u.el('label', '', r2, 'Type:');
    u.el('span', '', r2, 'Polygon Mesh');
    [
      ['Position:', '0.0'],
      ['Rotation:', '0.0'],
      ['Scale:', '1.0'],
    ].forEach(([l, v]) => {
      const r = u.el('div', 'irx-row', rows);
      u.el('label', '', r, l);
      for (let i = 0; i < 3; i++) u.el('span', 'irx-f', r, v);
    });
    const pv = u.el('div', 'irx-prev', op);
    const ball = u.el('div', 'irx-ball', pv);
    ball.innerHTML =
      '<svg viewBox="0 0 186 203" preserveAspectRatio="xMidYMid meet"><g transform="translate(-53,55) scale(.3)" stroke="#757582" stroke-width="2" fill="none" opacity=".5">' +
      grid() +
      '</g><ellipse cx="94" cy="142" rx="45" ry="14" fill="#23252e"/>' +
      sphere(93, 99, 49) +
      '</svg>';
    u.el('span', '', pv, 'Sphere');
    const sh = u.el('div', 'irx-ph irx-sec', right);
    u.el('i', '', sh, '▼');
    u.el('span', '', sh, 'Tool Shelf');
    const shelf = u.el('div', 'irx-shelf', right);
    TOOLS.forEach(([n, svg], i) => {
      const t = u.el('div', 'irx-tool' + (i === 0 ? ' on' : ''), shelf);
      const b = u.el('span', 'irx-ti', t);
      b.innerHTML = '<svg viewBox="0 0 32 32">' + shadeIcon(svg, i) + '</svg>';
      if (n === 'Create')
        b.innerHTML =
          '<svg viewBox="0 0 32 32"><ellipse cx="18" cy="27" rx="12" ry="3" fill="#62616d"/>' +
          sphere(16, 15, 12) +
          '</svg>';
      u.el('em', '', t, n);
    });
  }

  function styleControls(parent) {
    parent.querySelectorAll('.ref-submit').forEach((b) => b.classList.add('submit'));
    parent.querySelectorAll('.ref-endlink').forEach((b) => b.classList.add('irx-endlink'));
    parent.querySelectorAll('.ref-xtra').forEach((b) => b.classList.add('irx-xtra'));
  }

  const palette = { bg: '#90919b', panel: '#9798a1', fg: '#11111c', muted: '#2c2c3a', line: '#55546e' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This frame has a dedicated task pane at every supported viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      // The workstation's status bar is always present.
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'irix');
      const shell = u.el('main', 'irx-shell', document.body);
      const tb = u.el('header', 'irx-title', shell);
      u.el('span', 'irx-grid', tb);
      u.el('span', 'irx-t1', tb, 'Workstation Tools');
      u.el('span', 'irx-t2', tb, '–');
      u.el('span', 'irx-t1', tb, 'Scene Editor');
      const logo = u.el('span', 'irx-logo', tb);
      logo.innerHTML =
        '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M16 3l9 5v10l-9 5-9-5V8l9-5M7 8l9 5 9-5M16 13v10M11 1L3 7v12l8 5M27 6l3 6v12l-10 6-8-4M21 6l-9 5v10l9 5"/></svg><span>IRIX</span>';
      const right = u.el('aside', 'irx-right');
      const th = u.el('div', 'irx-ph', right);
      u.el('span', 'irx-grid', th);
      u.el('span', '', th, 'Task');
      const tbox = u.el('div', 'irx-task', right);
      th.hidden = tbox.hidden = _c.display === 'hidden';
      right.classList.toggle('irx-panel-mode', _c.display === 'panel');
      Object.assign(_c, { shell, right, header: tbox });
    },
    'frame.nav': () => (_c) => {
      const menu = _c.util.el('nav', 'irx-menu', _c.shell);
      MENUS.forEach((m) => _c.util.el('span', '', menu, m));
      _c.menu = menu;
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction', 'instruction-header');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('irx-toptools');
      styleControls(_c.headerTools);
      if (_c.submit) _c.submit.classList.add('irx-top-end');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'irx-body', _c.shell);
      const left = u.el('section', 'irx-left', body);
      drawScene(u, left);
      body.appendChild(_c.right);
      Object.assign(_c, { left, body });
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.header });
      const note = _c.header.querySelector('.ref-panel-text');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
      drawProperties(_c.util, _c.right);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.left);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('irx-note');
        const text = note.querySelector('.ref-note-text');
        text.classList.add('instruction', 'instruction-toast');
        text.dataset.display = _c.display;
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('irx-foot');
      _c.shell.appendChild(foot);
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('ready');
      ready.textContent = 'Ready.';
      _c.util.el('span', 'irx-sgi', foot, 'sgi');
      styleControls(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.foot.insertBefore(dock, _c.foot.querySelector('.irx-sgi'));
        styleControls(dock);
      }
    },
  };

  env.site({
    name: 'design-click-control-pie-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['sites/base/site.css', 'templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'site.css', 'irix.css'],
    design: {
      THEMES: { irix: palette },
      LOW_THEME: palette,
      ACCENTS: ['#9d9bd6'],
      LOW_ACCENTS: ['#9d9bd6'],
      parts,
    },
  });
})();

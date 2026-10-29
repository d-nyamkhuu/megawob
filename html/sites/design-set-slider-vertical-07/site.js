/* VectorDraft 2014: CAD drafting window, work surface above a bottom tool dock, seeded task banner. */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const ICONS = {
    Line: '<path d="M6 26L26 6"/>',
    Circle: '<circle cx="16" cy="16" r="10"/>',
    Arc: '<path d="M7 27C7 15 14 8 27 8"/>',
    Rectangle: '<rect x="6" y="8" width="20" height="16"/>',
    Polyline: '<path d="M3 22H10L17 9 23 20"/>',
    Text: '<text x="16" y="26" font-size="30" text-anchor="middle" fill="#101e28" stroke="none" font-family="Georgia,serif">A</text>',
    Move: '<path d="M16 4V28M4 16H28M12 8l4-4 4 4M12 24l4 4 4-4M8 12l-4 4 4 4M24 12l4 4-4 4"/>',
    Copy: '<path d="M5 22V9l5-4h11v6M5 9h5V5"/><rect x="11" y="11" width="16" height="16"/>',
    Rotate: '<path d="M25 17a9 9 0 1 1-3-7.5M22 4v6h-6"/>',
    Trim: '<path d="M16 5v8M16 20v8M4 16h8M19 16l7-2h5M19 18h12"/><path d="M16 14v4M13 16h5" stroke-dasharray="2 2"/>',
    Extend: '<path d="M3 16h5M13 16h6M24 16h5"/>',
    Fillet: '<path d="M8 28V15a9 9 0 0 1 9-9h11"/>',
    Zoom: '<circle cx="14" cy="14" r="9"/><path d="M21 21l7 7"/>',
    Pan: '<path d="M10 16V7q0-3 3-1v10V5q2-3 3 0v11V6q2-3 3 0v11V9q3-2 3 1v10c0 6-3 9-7 9-5 0-8-5-11-10q-2-4 1-4l5 5"/>',
    Grid: '<path d="M4 7h24M4 14h24M4 21h24M4 28h24M7 4v26M14 4v26M21 4v26M28 4v26"/>',
    Snap: '<path d="M7 27V15a9 9 0 0 1 18 0V27h-5V15a4 4 0 0 0-8 0v12Z M7 23h5M20 23h5"/>',
  };
  const GROUPS = [
    ['Draw', 6, ['Line', 'Circle', 'Arc', 'Rectangle', 'Polyline', 'Text']],
    ['Modify', 6.3, ['Move', 'Copy', 'Rotate', 'Trim', 'Extend', 'Fillet']],
    ['View', 4, ['Zoom', 'Pan', 'Grid', 'Snap']],
  ];

  function svgEl(parent, tag, attrs, text) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (text !== undefined) e.textContent = text;
    parent.appendChild(e);
    return e;
  }

  function drawing(parent) {
    const svg = svgEl(parent, 'svg', {viewBox: '0 0 1672 693', preserveAspectRatio: 'none', class: 'cad-drawing'});
    const defs = svgEl(parent.ownerDocument.createElementNS(NS, 'g'), 'defs', {});
    svg.appendChild(defs);
    const g = svgEl(svg, 'g', {transform: 'translate(0,-62)', fill: 'none', stroke: '#c0eeff', 'stroke-width': 3, 'stroke-linejoin': 'round'});
    const dash = {'stroke-dasharray': '14 6', 'stroke-width': 1.5};
    const P = (d, a) => svgEl(g, 'path', Object.assign({d}, a || {}));
    const T = (x, y, s, size, anchor) => svgEl(g, 'text', {x, y, 'font-size': size || 24, fill: '#bceaff', stroke: 'none', 'text-anchor': anchor || 'middle', 'font-family': '"Segoe UI",Arial,sans-serif'}, s);
    const arrow = (x, y, ang) => {
      const a = ang * Math.PI / 180, l = 15, w = 5;
      const bx = x - Math.cos(a) * l, by = y - Math.sin(a) * l;
      const nx = x - Math.cos(a) * 9, ny = y - Math.sin(a) * 9;
      svgEl(g, 'path', {d: `M${x} ${y}L${bx - Math.sin(a) * w} ${by + Math.cos(a) * w}L${nx} ${ny}L${bx + Math.sin(a) * w} ${by - Math.cos(a) * w}Z`, fill: '#c0eeff', stroke: 'none'});
    };
    svgEl(g, 'circle', {cx: 655, cy: 411, r: 140});
    svgEl(g, 'circle', {cx: 655, cy: 411, r: 70});
    P('M522 368H492L382 468V580H922V468L818 368H788');
    P('M655 236V599M489 411H822', dash);
    for (const x of [437, 868]) {
      svgEl(g, 'circle', {cx: x, cy: 522, r: 27});
      P(`M${x} ${480}V${565}M${x - 40} 522H${x + 40}`, dash);
    }
    P('M292 368H476M292 580H382M302 368V580', {'stroke-width': 1.6});
    arrow(302, 368, -90); arrow(302, 580, 90);
    T(283, 484, '50', 22);
    P('M382 580V660M922 580V660M382 646H922', {'stroke-width': 1.6});
    arrow(382, 646, 180); arrow(922, 646, 0);
    T(655, 636, '120', 22);
    P('M735 290L765 258H833', {'stroke-width': 1.6}); arrow(735, 290, 135);
    T(802, 248, 'Ø 60');
    P('M655 411L812 345H880', {'stroke-width': 1.6}); arrow(725, 383, 156);
    T(848, 335, 'Ø 30');
    P('M894 506L972 461H1092', {'stroke-width': 1.6}); arrow(894, 506, 150);
    T(1034, 451, '2 × Ø 10');
    P('M45 710V664M45 710H92', {'stroke-width': 1.6}); arrow(45, 662, -90); arrow(94, 710, 0);
    T(45, 654, 'Y', 18); T(114, 718, 'X', 18);
    return svg;
  }

  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'cad-dialog overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const title = {chat: 'Feedback', cookie: 'Privacy', toast: 'Drawing notice', promo: 'VectorDraft Pro', banner: 'Service notice'}[ctx.kind];
    const bar = u.el('div', 'cad-dialog-bar', el);
    u.el('span', '', bar, title);
    const x = u.el('button', 'cad-x', bar, '×');
    x.setAttribute('aria-label', 'Close notice');
    x.onclick = () => ctx.dismiss('close');
    const body = u.el('div', 'cad-dialog-body', el);
    u.el('p', '', body, {chat: 'Help us improve VectorDraft.', cookie: 'VectorDraft can remember your workspace preferences.', toast: 'The drawing was autosaved.', promo: 'Try VectorDraft Pro for 30 days.', banner: 'Updates are available for VectorDraft 2014.'}[ctx.kind]);
    const dismiss = u.el('button', 'cad-btn', body, ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('dismiss');
    return {el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0};
  }

  // Apply CAD typography to instruction elements produced by the shared frame parts.
  function instructionStyle(node) {
    node.classList.add('instruction');
    const text = node.textContent;
    node.textContent = '';
    text.split(/(-?\d[\d.,]*(?:\s*\(±[\d.]+\))?)/).forEach((part, i) => {
      if (!part) return;
      if (i % 2) env.util.el('span', 'hl', node, part);
      else node.appendChild(document.createTextNode(part));
    });
  }

  const palette = { bg: '#072748', panel: '#0b3157', line: '#44566a',
    muted: '#c3dcee', fg: '#f2f8ff' };

  env.site({
    name: 'design-set-slider-vertical-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['site.css', 'templates/site/css/base-hooks.css'],
    design: {
      THEMES: { cad: palette },
      LOW_THEME: palette,
      ACCENTS: ['#2f8cf5'],
      LOW_ACCENTS: ['#2f8cf5'],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          // The CAD note fits in all three positions, including at the smallest viewport.
          _c.display = _c.ctx.display;
          document.body.className = `cad instruction-${_c.display}`;
        },
        'frame.header': () => (_c) => {
          const u = _c.util;
          const win = u.el('div', 'cad-window', document.body);
          const title = u.el('header', 'cad-title', win);
          const logo = u.el('span', 'cad-logo', title);
          logo.innerHTML = '<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="#2b6b91" stroke="#dae9f2"/><path d="M5 12V7l3 2 2-4 2 4 3-2v7M8 9v5M12 9v5" stroke="#faf5c8" stroke-width="1.3" fill="none"/></svg>';
          u.el('span', 'cad-title-text', title, 'VectorDraft  2014  -  [gear_bracket.dwg]');
          const wc = u.el('span', 'cad-wc', title);
          wc.innerHTML = '<svg viewBox="0 0 120 20"><path d="M10 14h12" stroke="#fff" stroke-width="1.6"/><rect x="52" y="4" width="11" height="11" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M96 4l11 11M107 4L96 15" stroke="#fff" stroke-width="1.6"/></svg>';
          const menu = u.el('nav', 'cad-menu', win);
          for (const m of ['File', 'Edit', 'View', 'Draw', 'Modify', 'Dimension', 'Tools', 'Window', 'Help']) u.el('span', '', menu, m);
          const surface = u.el('div', 'cad-surface ref-body', win);
          const backdrop = u.el('div', 'cad-backdrop', surface);
          drawing(backdrop);
          u.el('div', 'cad-scale', backdrop, 'SCALE  1:1');
          Object.assign(_c, { win, menu, surface, header: surface });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base(_c);
          const instruction = _c.header.querySelector('.ref-instruction');
          if (instruction) {
            const note = _c.util.el('div', 'cad-note', _c.surface);
            note.appendChild(instruction);
            instructionStyle(instruction);
          }
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          _c.menu.appendChild(_c.headerTools);
        },
        'frame.body': () => (_c) => { _c.body = _c.surface; },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) {
            panel.classList.add('cad-note');
            instructionStyle(panel.querySelector('.ref-panel-text'));
          }
        },
        'frame.stage': () => (_c) => {
          const stage = _c.util.el('main', 'cad-stage', _c.surface);
          stage.dataset.role = 'stage';
          _c.stage = stage;
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.body.querySelector('.ref-note');
          if (note) {
            _c.surface.appendChild(note);
            note.classList.add('cad-note');
            instructionStyle(note.querySelector('.ref-note-text'));
            note.querySelector('.ref-note-x').classList.add('instruction-close');
          }
        },
        'frame.footer': (base) => (_c) => {
          const { util: u, win } = _c;
          const dock = u.el('footer', 'cad-dock', win);
          for (const [name, weight, tools] of GROUPS) {
            const grp = u.el('section', 'cad-group', dock);
            grp.style.flexGrow = weight;
            u.el('div', 'cad-group-title', grp, name);
            const row = u.el('div', 'cad-tools', grp);
            for (const t of tools) {
              const b = u.el('button', 'cad-tool', row);
              b.type = 'button';
              b.tabIndex = -1;
              const ic = u.el('span', 'cad-icon', b);
              ic.innerHTML = `<svg viewBox="0 0 32 32" fill="none" stroke="#101e28" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[t]}</svg>`;
              u.el('span', '', b, t);
              b.onclick = () => env.log('decoy', {label: t});
            }
          }
          const task = u.el('section', 'cad-group cad-task', dock);
          u.el('div', 'cad-group-title', task, 'Task');
          const actions = u.el('div', 'cad-actions', task);
          // The depicted Reset is an inert decoy, using the template's event handling.
          _c.decoyBtn(actions, 'Reset');
          const reset = actions.lastElementChild;
          reset.classList.add('cad-btn', 'reset');
          reset.dataset.action = 'reset';
          const status = u.el('div', 'cad-status', win);
          u.el('span', '', status, 'Ready');
          u.el('span', 'cad-coords', status, 'X: 148.3     Y: 27.6     mm');
          Object.assign(_c, { task, actions, status });
          // Reuse the template's footer controls; the CAD dock replaces its filler text.
          base(_c);
          const foot = document.body.querySelector('.ref-foot');
          if (foot) {
            for (const b of foot.querySelectorAll('[data-role="xtra"]')) _c.headerTools.appendChild(b);
            if (_c.placement === 'footer') actions.appendChild(_c.submit);
            if (_c.placement === 'link') status.appendChild(_c.submit);
            foot.remove();
          }
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.body.querySelector('.ref-float-dock');
          if (dock) _c.actions.appendChild(dock);
        },
        'frame.end': (base) => (_c) => {
          const { submit, placement, task, headerTools } = _c;
          for (const b of headerTools.querySelectorAll('.ref-xtra')) b.classList.add('cad-menu-action');
          if (submit) {
            if (placement === 'header' || placement === 'icon') submit.classList.add('cad-menu-action', 'cad-end');
            else if (placement === 'link') submit.classList.add('cad-end-link');
            else submit.classList.add('cad-btn', 'primary');
          }
          if (!submit || !['footer', 'floating'].includes(placement)) task.classList.add('cad-task-passive');
          return base(_c);
        },
        overlay: () => drawOverlay,
      },
    },
  });
})();

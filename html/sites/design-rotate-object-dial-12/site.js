/* Amiga Workbench reference frame. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  let workspace;
  function drawOverlay(ctx) {
    if (ctx.initial) {
      const { panel, prefsTab, taskTab, frame } = workspace;
      const prefs = preferences(frame, panel);
      prefsTab.classList.add('active'); taskTab.classList.remove('active');
      taskTab.onclick = () => {
        prefsTab.classList.remove('active'); taskTab.classList.add('active');
        taskTab.onclick = null;
        ctx.dismiss('task-tab');
      };
      return { el: prefs, dismiss: taskTab };
    }
    const u = ctx.util;
    const el = u.el('section', 'req-window overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const content = {
      chat: ['Instrument Trainer', 'Take a quick tour to learn the controls and features.', 'Start tour', 'Skip tour'],
      cookie: ['Your privacy', 'Allow optional cookies for this practice workspace?', 'Accept optional', 'Reject optional'],
      toast: ['Practice saved', 'Your current workspace is ready to continue.', null, 'Dismiss'],
      promo: ['Discover more practice', 'Explore more exercises after completing this task.', 'Show details', 'Not now'],
      banner: ['Workspace notice', 'This practice session works offline.', null, 'Dismiss'],
    }[ctx.kind];
    const bar = u.el('div', 'req-title', el);
    u.el('span', '', bar, content[0]);
    const close = u.el('button', 'bubble-close', bar);
    close.type = 'button'; close.setAttribute('aria-label', 'Close notice');
    close.onclick = () => ctx.dismiss('close');
    const message = u.el('p', '', el, content[1]);
    const actions = u.el('div', 'tour-actions', el);
    if (content[2]) {
      const primary = u.el('button', 'tour-primary', actions, content[2]); primary.type = 'button';
      primary.onclick = () => {
        if (ctx.kind === 'cookie') ctx.dismiss('accept');
        else { message.textContent = 'Drag the dial with the mouse and follow the task instruction.'; primary.hidden = true; }
      };
    }
    const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('skip');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }

  function decoyDial(u, parent) {
    const svg = u.svg('svg', { viewBox: '-150 -150 300 300', class: 'xtra-dial', 'aria-hidden': 'true' }, parent);
    const defs = u.svg('defs', {}, svg);
    const bevel = u.svg('linearGradient', { id: 'preview-bevel', x1: '0%', y1: '0%', x2: '100%', y2: '100%' }, defs);
    [['0%', '#e0e2e2'], ['30%', '#999ea1'], ['60%', '#52575a'], ['100%', '#282d30']].forEach(([offset, color]) => u.svg('stop', { offset, 'stop-color': color }, bevel));
    const face = u.svg('linearGradient', { id: 'preview-face', x1: '0%', y1: '0%', x2: '100%', y2: '100%' }, defs);
    [['0%', '#696f73'], ['100%', '#555b5e']].forEach(([offset, color]) => u.svg('stop', { offset, 'stop-color': color }, face));
    u.svg('circle', { r: 115, fill: '#777d83', opacity: .24 }, svg);
    for (let a = 0; a < 360; a += 6) {
      const major = a % 30 === 0;
      const r = a * Math.PI / 180;
      const r0 = major ? 96 : 112, r1 = major ? 128 : 118;
      u.svg('line', { x1: Math.sin(r) * r0, y1: -Math.cos(r) * r0, x2: Math.sin(r) * r1, y2: -Math.cos(r) * r1,
        stroke: '#222', 'stroke-width': major ? 2.5 : 1 }, svg);
      if (major) {
        const t = u.svg('text', { x: Math.sin(r) * 140, y: -Math.cos(r) * 140 + 4, 'text-anchor': 'middle',
          'font-size': 15, fill: '#10121b', 'font-family': 'monospace', 'font-weight': 600 }, svg);
        t.textContent = a === 0 ? '0°' : String(a);
      }
    }
    u.svg('circle', { r: 84, fill: 'url(#preview-bevel)', stroke: '#111', 'stroke-width': 2 }, svg);
    u.svg('circle', { r: 77, fill: 'url(#preview-face)', stroke: '#85898b', 'stroke-width': .7 }, svg);
    u.svg('line', { x1: -21, y1: -21, x2: -44, y2: -47, stroke: '#252729', 'stroke-width': 7, 'stroke-linecap': 'round' }, svg);
    u.svg('line', { x1: -21, y1: -21, x2: -44, y2: -47, stroke: '#e4e4e3', 'stroke-width': 6, 'stroke-linecap': 'round' }, svg);
  }

  function preferences(ctx, panel) {
      const u = ctx.util;
      const prefs = u.el('div', 'prefs', panel);
      const left = u.el('div', 'prefs-left', prefs);
      const g1 = u.el('fieldset', 'grp', left); u.el('legend', '', g1, 'Display');
      [['Panel theme:', 'Standard'], ['Units:', 'Degrees (°)'], ['Dial style:', 'Classic']].forEach(([l, v]) => {
        const r = u.el('div', 'prow', g1); u.el('span', '', r, l);
        const s = u.el('span', 'fake-select', r); u.el('span', '', s, v); u.el('i', '', s);
      });
      [['Show tick marks', 1], ['Animate knob', 0], ['Play sounds', 0]].forEach(([l, c]) => {
        const r = u.el('div', 'prow chk', g1); u.el('span', 'fake-check', r, c ? 'X' : ''); u.el('span', '', r, l);
      });
      const g2 = u.el('fieldset', 'grp', left); u.el('legend', '', g2, 'Training');
      const r2 = u.el('div', 'prow', g2);
      const positionLabel = u.el('span', '', r2, 'Starting ');
      u.el('span', 'underlined dotted', positionLabel, 'position:');
      const s2 = u.el('span', 'fake-select', r2); u.el('span', '', s2, 'Random'); u.el('i', '', s2);
      [['Show value readout', 1], ['Auto-advance', 0]].forEach(([l, c]) => {
        const r = u.el('div', 'prow chk', g2); u.el('span', 'fake-check', r, c ? 'X' : '');
        const label = u.el('span', '', r);
        if (c) { u.el('span', 'underlined', label, 'Show'); label.append(document.createTextNode(' value readout')); }
        else label.textContent = l;
      });
      u.el('div', 'fake-btn', left, 'Restore Defaults');
      const pv = u.el('fieldset', 'grp preview', prefs); u.el('legend', '', pv, 'Preview');
      decoyDial(u, pv);
      u.el('div', 'pv-label', pv, 'Current Heading:');
      u.el('div', 'pv-read', pv, '312°');
      u.el('div', 'pv-note', pv, '(Preview only - adjust on Task tab)');
      const pointer = u.svg('svg', { viewBox: '0 0 24 38', class: 'preview-pointer', 'aria-hidden': 'true' }, pv);
      u.svg('path', { d: 'M2 2L21 23L14 23L19 34L13 37L8 25L2 31Z', fill: '#070707', stroke: '#fff', 'stroke-width': 2 }, pointer);
      u.svg('path', { d: 'M4 5L18 21L11 21L17 33L14 34L8 22L4 27Z', fill: '#e42012' }, pointer);
      return prefs;
  }

  function styleInstruction(heading, ctx) {
    if (!heading) return;
    const u = ctx.util;
    heading.classList.add('instruction');
    if (ctx.instruction.length > 85) heading.classList.add('long-instruction');
    heading.textContent = '';
      const m = /\d/.exec(ctx.instruction);
      if (m) {
        if (ctx.instruction.slice(m.index).length > 18) heading.classList.add('long-value');
        heading.append(document.createTextNode(ctx.instruction.slice(0, m.index)));
        u.el('span', 'hot', heading, ctx.instruction.slice(m.index));
      } else heading.textContent = ctx.instruction;
  }

  function styleControls(host) {
    if (!host) return;
    host.querySelectorAll('button, a').forEach((control) => control.classList.add('wb-action'));
  }

  const parts = {
    'frame.layout': (base) => function (_c) {
      base(_c);
      _c.display = _c.ctx.display;
      document.body.className = `amiga instruction-${_c.display}`;
    },
    'frame.header': () => function (_c) {
      const { util: u } = _c;
      // Top screen bar.
      const top = u.el('header', 'wb-top', document.body);
      const logo = u.svg('svg', { viewBox: '0 0 42 30', width: 42, height: 30, class: 'wb-logo', 'aria-hidden': 'true' }, top);
      ['#e62f21', '#fa7224', '#ffcf31', '#9bce25', '#2daaa3', '#3265e5'].forEach((color, i) => {
        const y = 2 + i * 4;
        const x = 28 - i * 2.6;
        u.svg('path', { d: `M${x} ${y}h13l-3 4H${x - 3}Z`, fill: color }, logo);
        u.svg('path', { d: `M${x + 5} ${y}h2l-3 4h-2Z`, fill: '#fff', opacity: .35 }, logo);
      });
      u.svg('path', { d: 'M1 17H9L17 25H27L23 29H10Z', fill: '#274cdd' }, logo);
      u.svg('path', { d: 'M6 20H13L19 26H27L23 29H14Z', fill: '#64c145' }, logo);
      u.el('span', 'wb-name', top, 'Workbench');
      u.el('span', 'wb-clock', top, 'Mon 24 Apr 1995  10:18');
      u.el('span', 'wb-depth', top);

      // Workbench window.
      const win = u.el('section', 'wb-window', document.body);
      const tb = u.el('div', 'wb-titlebar', win);
      u.el('span', 'wb-close', tb);
      u.el('span', 'wb-title', tb, 'Instrument Trainer');
      u.el('span', 'wb-gadget', tb); u.el('span', 'wb-gadget', tb);
      const tabs = u.el('nav', 'wb-tabs', win);
      const prefsTab = u.el('button', 'wb-tab', tabs, 'Preferences'); prefsTab.type = 'button';
      const taskTab = u.el('button', 'wb-tab active', tabs, 'Task'); taskTab.type = 'button';
      taskTab.dataset.action = 'task';
      const toolbar = u.el('div', 'wb-end-tools', tabs);
      const margin = u.el('aside', 'margin', document.body);
      Object.assign(_c, { header: margin, margin, win, prefsTab, taskTab, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => function (_c) {
      base(_c);
      styleInstruction(_c.header.querySelector('.ref-instruction'), _c.ctx);
      _c.header.querySelector('.ref-spacer')?.remove();
    },
    'frame.tools': (base) => function (_c) {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('wb-end-tools');
      styleControls(_c.headerTools);
    },
    'frame.body': () => function (_c) {
      const { util, win, margin, prefsTab, taskTab, ctx } = _c;
      const panel = util.el('div', 'wb-panel', win);
      workspace = { panel, prefsTab, taskTab, frame: ctx };
      Object.assign(_c, { panel, body: margin });
    },
    'frame.panel': (base) => function (_c) {
      base(_c);
      _c.body.querySelector('.ref-panel-title')?.remove();
      styleInstruction(_c.body.querySelector('.ref-panel-text'), _c.ctx);
    },
    'frame.stage': () => function (_c) {
      const { util: u, panel, margin } = _c;
      const stage = u.el('main', 'cube-stage', panel);
      stage.dataset.role = 'stage';
      u.el('hr', '', margin);
      const prev = u.el('div', 'prev', margin);
      u.el('h2', '', prev, 'Task preview:');
      u.el('p', '', prev, 'Drag the handle to adjust the dial. The scale shows the available values.');
      u.el('hr', '', margin);
      const notes = u.el('div', 'notes', margin);
      u.el('h2', '', notes, 'Notes:');
      const ul = u.el('ul', '', notes);
      u.el('li', '', ul, 'Click the Task tab to access the controls.');
      u.el('li', '', ul, 'Drag the dial with the mouse to set the heading.');
      u.el('li', '', ul, 'The current value is shown below the dial.');
      Object.assign(_c, { stage, notesList: ul });
    },
    'frame.toast': (base) => function (_c) {
      base(_c);
      if (_c.display !== 'toast') return;
      const note = document.querySelector('.ref-note');
      const heading = note.querySelector('.ref-note-text');
      styleInstruction(heading, _c.ctx);
      const close = note.querySelector('.ref-note-x');
      close.classList.add('instruction-dismiss');
      close.textContent = _c.closeLabel;
      heading.append(close);
      _c.margin.prepend(note);
    },
    'frame.footer': (base) => function (_c) {
      const { util: u } = _c;
      // Dock.
      const dock = u.el('footer', 'wb-dock', document.body);
      [['Workbench', '#2a5bd0'], ['Files', '#8890b0'], ['Instrument Trainer', '#c9ccd2'], ['Trash', '#2a4a90']].forEach(([l, c], i) => {
        const it = u.el('div', 'dock-item' + (i === 2 ? ' sel' : ''), dock);
        const ic = u.el('span', 'dock-icon', it);
        const sv = u.svg('svg', { viewBox: '0 0 32 32', width: '100%', height: '100%', 'aria-hidden': 'true' }, ic);
        const defs = u.svg('defs', {}, sv);
        const grad = u.svg('linearGradient', { id: 'dock-shade-' + i, x1: '0%', y1: '0%', x2: '100%', y2: '70%' }, defs);
        [['0%', '#fafafa'], ['15%', c], ['65%', c], ['100%', '#161c28']].forEach(([offset, color]) => u.svg('stop', { offset, 'stop-color': color }, grad));
        u.svg('path', { d: i === 3 ? 'M8 5H25V30H8Z' : 'M4 3H26L30 8V31H4Z', fill: '#323740', stroke: '#101018', 'stroke-width': 1 }, sv);
        if (i === 0) { // floppy disk
          u.svg('path', { d: 'M3 3H26L29 6V29H3Z', fill: 'url(#dock-shade-0)', stroke: '#111', 'stroke-width': 1.5 }, sv);
          u.svg('rect', { x: 8, y: 3, width: 14, height: 9, fill: '#ddd', stroke: '#111' }, sv);
          u.svg('rect', { x: 7, y: 18, width: 18, height: 11, fill: '#eee', stroke: '#111' }, sv);
          u.svg('rect', { x: 17, y: 4, width: 4, height: 7, fill: '#273758' }, sv);
          for (const y of [21, 24, 27]) u.svg('line', { x1: 9, y1: y, x2: 23, y2: y, stroke: '#8d91a0' }, sv);
        } else if (i === 1) { // document
          u.svg('path', { d: 'M5 7L9 2H24L28 8V29H5Z', fill: 'url(#dock-shade-1)', stroke: '#111', 'stroke-width': 1.5 }, sv);
          u.svg('rect', { x: 9, y: 10, width: 15, height: 17, fill: '#eeeeec', stroke: '#616774' }, sv);
          u.svg('path', { d: 'M6 7H27L23 3H10Z', fill: '#dedfe9', stroke: '#7a8090', 'stroke-width': .7 }, sv);
          u.svg('rect', { x: 10, y: 11, width: 12, height: 2, fill: '#aaa6d4' }, sv);
          for (const y of [15, 18, 21, 24]) u.svg('line', { x1: 11, y1: y, x2: 22, y2: y, stroke: '#657292', 'stroke-width': .8 }, sv);
        } else if (i === 2) { // trainer pad with pencil
          u.svg('path', { d: 'M4 7L8 3H25L28 7V29H4Z', fill: 'url(#dock-shade-2)', stroke: '#111', 'stroke-width': 1.5 }, sv);
          u.svg('rect', { x: 8, y: 8, width: 14, height: 16, fill: '#eeeeec', stroke: '#626771' }, sv);
          u.svg('path', { d: 'M8 25L10 17L24 6L27 10L13 21Z', fill: '#f2a000', stroke: '#111', 'stroke-width': 1.5 }, sv);
          u.svg('path', { d: 'M11 18L23 7L25 9L13 20Z', fill: '#ffdf6e' }, sv);
          u.svg('path', { d: 'M23 6L25 4L28 7L26 9Z', fill: '#d77281', stroke: '#505563', 'stroke-width': .6 }, sv);
          u.svg('path', { d: 'M8 25L10 18L13 21Z', fill: '#d8c7a0', stroke: '#111', 'stroke-width': .5 }, sv);
          u.svg('path', { d: 'M8 25L9 21L11 23Z', fill: '#222' }, sv);
        } else { // trash can
          u.svg('path', { d: 'M7 8H25L24 29Q16 33 8 29Z', fill: 'url(#dock-shade-3)', stroke: '#111', 'stroke-width': 1.5 }, sv);
          for (const x of [10, 14, 18, 22]) u.svg('line', { x1: x, y1: 9, x2: x, y2: 28, stroke: '#93a8d9', 'stroke-width': .8 }, sv);
          u.svg('ellipse', { cx: 16, cy: 6, rx: 12, ry: 3, fill: '#678cbb', stroke: '#111', 'stroke-width': 1.5 }, sv);
          u.svg('ellipse', { cx: 16, cy: 5, rx: 8, ry: 1.2, fill: '#aebdcc', stroke: '#263957', 'stroke-width': .6 }, sv);
        }
        u.el('span', '', it, l);
      });

      base(_c);
      const foot = document.querySelector('.ref-foot');
      if (foot) {
        foot.querySelector('.ref-foot-text').remove();
        foot.classList.add('wb-end-tools', 'end-dock');
        styleControls(foot);
        dock.append(foot);
      }
    },
    'frame.floating': (base) => function (_c) {
      base(_c);
      if (_c.placement !== 'floating') return;
      const host = _c.util.el('li', 'finish-note', _c.notesList);
      host.append(document.createTextNode('Click '));
      _c.submit.className = 'submit-button';
      host.append(_c.submit, document.createTextNode(' when you are done.'));
      document.querySelector('.ref-float-dock').remove();
    },
    overlay: () => drawOverlay,
  };

  env.site({
    name: 'design-rotate-object-dial-12',
    template: 'site/base',
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'chat' },
    design: {
      LANGS: ['en'],
      THEMES: { workbench: { bg: '#aaabad', panel: '#bfc0c1', line: '#222', fg: '#111', muted: '#444' } },
      LOW_THEME: { bg: '#aaabad', panel: '#bfc0c1', line: '#222', fg: '#111', muted: '#444' },
      ACCENTS: ['#f26a00'],
      LOW_ACCENTS: ['#f26a00'],
      parts,
    },
  });
})();

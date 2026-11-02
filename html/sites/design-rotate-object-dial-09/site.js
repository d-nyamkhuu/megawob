/* HarborView magazine-serif reference frame. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'palette overlay-notice overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const content = {
      chat: ['Welcome', 'Take a quick tour to learn the controls and features.', 'Start tour', 'Skip tour'],
      cookie: ['Your privacy', 'Allow optional cookies for this workspace?', 'Accept optional', 'Reject optional'],
      toast: ['Saved', 'Your current workspace is ready to continue.', null, 'Dismiss'],
      promo: ['More exercises', 'Explore more exercises after completing this task.', 'Show details', 'Not now'],
      banner: ['Notice', 'This session works offline.', null, 'Dismiss'],
    }[ctx.kind];
    u.el('h2', '', el, content[0]);
    const close = u.el('button', 'palette-close', el, '×');
    close.type = 'button'; close.setAttribute('aria-label', 'Close notice');
    close.onclick = () => ctx.dismiss('close');
    const message = u.el('p', '', el, content[1]);
    const actions = u.el('div', 'notice-actions', el);
    if (content[2]) {
      const primary = u.el('button', 'notice-primary', actions, content[2]); primary.type = 'button';
      primary.onclick = () => {
        if (ctx.kind === 'cookie') ctx.dismiss('accept');
        else { message.textContent = 'Turn the dial with the pointer until the heading matches the instruction.'; primary.hidden = true; }
      };
    }
    const dismiss = u.el('button', 'notice-dismiss', actions, content[3]); dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('skip');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  // Format the instruction already created by the template in HarborView's serif hierarchy.
  function styleInstruction(u, heading, cls) {
    if (!heading) return;
    heading.classList.add('instruction', cls);
    const text = heading.textContent;
    const match = /^(.*?\bto\s)(.+)$/.exec(text) || /^(.*?)([-+]?\d.*)$/.exec(text);
    if (match) {
      heading.textContent = match[1];
      heading.classList.toggle('long-instruction', match[1].length > 30);
      u.el('span', 'instruction-value' + (match[2].length > 20 ? ' long-value' : ''), heading, match[2]);
    }
  }

  function drawReference(u) {
    const pal = u.el('aside', 'palette ref-palette', document.body);
    u.el('h2', '', pal, 'Reference');
    const close = u.el('button', 'palette-close', pal, '×');
    close.type = 'button'; close.setAttribute('aria-label', 'Close palette');
    close.onclick = () => { pal.hidden = true; };
    u.el('h3', '', pal, 'Heading Scale (°)');
    const ul = u.el('ul', '', pal);
    ['0° = North', '90° = East', '180° = South', '270° = West'].forEach((t) => u.el('li', '', ul, t));
    u.el('h3', 'tip', pal, 'Tip');
    u.el('p', '', pal, 'Rotate the dial to align the pointer with the target heading.');
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The dedicated instruction pane fits even at the smallest training viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.className = `harbor instruction-${_c.display}`;
    },
    'frame.header': () => (_c) => {
      const { util: u } = _c;
      const win = u.el('div', 'hv-window', document.body);
      const header = u.el('header', 'hv-head', win);
      u.el('span', 'hv-logo', header, 'HarborView');
      u.el('span', 'hv-sub', header, 'Vessel Operations');
      const top = u.el('nav', 'hv-top', header);
      ['Charts', 'Equipment', 'Logs', 'Settings', 'Help'].forEach((t) => u.el('span', 'hv-top-item', top, t));
      Object.assign(_c, { win, header, top });
    },
    'frame.nav': () => (_c) => {
      const { util: u, win } = _c;
      const shell = u.el('div', 'hv-body ref-body', win);
      const nav = u.el('nav', 'hv-nav', shell);
      u.el('h2', '', nav, 'Navigation');
      ['Steering Control', 'Route Plan', 'Waypoints', 'Tides & Currents', 'Vessel Status', 'Maintenance'].forEach((t, i) => {
        u.el('span', 'hv-nav-item' + (i === 0 ? ' active' : ''), nav, t);
      });
      const main = u.el('section', 'hv-main', shell);
      u.el('div', 'hv-date', main, 'Mon, Apr 14, 2008');
      u.el('h1', 'hv-title', main, 'Steering Control');
      u.el('p', 'task-helper', main, 'Adjust the heading to the specified value.');
      Object.assign(_c, { main });
    },
    'frame.instruction': (base) => (_c) => {
      base({ ..._c, header: _c.main });
      styleInstruction(_c.util, _c.main.querySelector('.ref-instruction'), 'instruction-header');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('hv-end-nav');
      _c.top.append(_c.headerTools);
      for (const decoy of _c.headerTools.querySelectorAll('.ref-xtra')) decoy.classList.add('header-xtra');
      if (_c.submit) _c.submit.classList.add('header-end');
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'hv-cols', _c.main);
      const side = _c.util.el('aside', 'hv-side', body);
      Object.assign(_c, { body, side });
    },
    'frame.panel': (base) => (_c) => {
      const { util: u, side } = _c;
      base({ ..._c, body: side });
      styleInstruction(u, side.querySelector('.ref-panel-text'), 'instruction-panel');
      const cur = u.el('div', 'cur-box', side);
      u.el('div', 'cur-label', cur, 'Current Heading');
      u.el('div', 'cur-slot', cur).dataset.slot = 'current';
      const help = u.el('div', 'dial-help', side);
      u.el('div', 'dial-help-label', help, 'Dial Control');
      u.el('div', 'dial-help-value', help, 'Drag to adjust');
      const row = u.el('div', 'btn-row', side);
      const reset = u.el('button', 'reset-button', row, 'Reset'); reset.type = 'button';
      reset.onclick = () => reset.blur();
      Object.assign(_c, { row });
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('main', 'dial-stage', _c.body);
      _c.body.insertBefore(stage, _c.side);
      stage.dataset.role = 'stage';
      _c.stage = stage;
      drawReference(_c.util);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction-toast-card');
        styleInstruction(_c.util, note.querySelector('.ref-note-text'), 'instruction-toast-text');
        note.querySelector('.ref-note-x').classList.add('instruction-dismiss');
        _c.main.append(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.querySelector('.ref-foot');
      if (foot) {
        for (const decoy of foot.querySelectorAll('.ref-xtra')) {
          decoy.classList.add('header-xtra');
          _c.headerTools.append(decoy);
        }
        _c.row.prepend(foot);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.row.prepend(dock);
      if (_c.submit && ['footer', 'link', 'floating'].includes(_c.placement)) {
        _c.submit.classList.add('submit-button');
      }
    },
    // Retain the design's own floating-palette overlays.
    overlay: () => drawOverlay,
  };

  const theme = { bg: '#faf9f6', panel: '#fbfaf7', fg: '#16140f', muted: '#555', line: '#d6d3cb' };
  env.site({
    name: 'design-rotate-object-dial-09',
    template: 'site/base',
    design: {
      THEMES: { harbor: theme },
      LOW_THEME: theme,
      ACCENTS: ['#b32428'],
      LOW_ACCENTS: ['#b32428'],
      LANGS: ['en'],
      parts,
    },
  });
})();

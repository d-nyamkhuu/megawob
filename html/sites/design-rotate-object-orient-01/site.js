/* GEM-style 1987 desktop reference frame. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const content = {
      chat: ['Welcome', 'Drag the handle to rotate the arrow.', 'Start', 'Skip'],
      cookie: ['Your privacy', 'Allow optional cookies for this workspace?', 'Accept', 'Reject'],
      toast: ['Saved', 'Your current workspace is ready to continue.', null, 'Dismiss'],
      promo: ['More programs', 'Explore more exercises after this task.', 'Details', 'Not now'],
      banner: ['Notice', 'This session works offline.', null, 'Dismiss'],
    }[ctx.kind];
    const bar = u.el('div', 'tb-title', el);
    u.el('span', 'tb-box', bar);
    u.el('span', '', bar, content[0]);
    const close = u.el('button', 'bubble-close', bar, 'x');
    close.type = 'button'; close.setAttribute('aria-label', 'Close notice');
    close.onclick = () => ctx.dismiss('close');
    const message = u.el('p', '', el, content[1]);
    const actions = u.el('div', 'tour-actions', el);
    if (content[2]) {
      const primary = u.el('button', 'tour-primary', actions, content[2]); primary.type = 'button';
      primary.onclick = () => {
        if (ctx.kind === 'cookie') ctx.dismiss('accept');
        else { message.textContent = 'Drag the round handle until the arrow points at the target.'; primary.hidden = true; }
      };
    }
    const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('skip');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  function winTitle(u, parent, text, withButtons) {
    const t = u.el('div', 'g-title', parent);
    u.el('span', 'g-box', t);
    u.el('span', 'g-name', t, text);
    if (withButtons) {
      u.el('span', 'g-btn g-min', t, '–');
      u.el('span', 'g-btn g-x', t, '✕');
    }
    return t;
  }
  function deskIcon(u, parent, cls, label, glyph) {
    const d = u.el('div', 'g-icon ' + cls, parent);
    const svg = u.svg('svg', {class: 'g-glyph', viewBox: '0 0 60 60', 'aria-hidden': 'true'}, d);
    const paths = {
      'ic-disk': 'M7 3H51L55 8V57H5V7Z M14 4V23H46V4 M13 32H48V55H13Z M35 6H41V18H35Z',
      'ic-prog': 'M3 17H23L28 22H56V56H3Z M3 22H56',
      'ic-waste': 'M12 17L17 53Q30 60 43 53L48 17 M9 14Q30 2 51 14Q30 23 9 14Z M22 10Q22 0 37 6L39 11 M20 22L23 51 M28 23V54 M36 23L34 53 M44 21L40 51',
      'ic-panel': 'M8 14H52V57H8Z M14 22H46V49H14Z M18 12V6H42V12 M21 37L29 31L37 36',
    };
    u.svg('path', {d: paths[cls], fill: '#f7f7f7', stroke: '#000', 'stroke-width': 3, 'stroke-linejoin': 'round'}, svg);
    u.el('span', 'g-label', d, label);
  }
  const palette = { bg: '#999999', panel: '#f4f4f4', fg: '#000000', muted: '#222222', line: '#000000' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All note modes use the original window's dedicated instruction box.
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
      document.body.classList.add('gem-desktop', `instruction-${_c.display}`);
      const menu = u.el('header', 'g-menu', document.body);
      u.el('span', 'g-apple', menu);
      ['Desk', 'File', 'Edit', 'Options', 'Window', 'Help'].forEach((m) => u.el('span', 'g-mi', menu, m));
      u.el('span', 'g-clock', menu, 'Mon Apr 6 1987  10:24 AM');
      deskIcon(u, document.body, 'ic-disk', 'Disk', '▤');
      deskIcon(u, document.body, 'ic-prog', 'Programs', '▭');
      deskIcon(u, document.body, 'ic-waste', 'Wastebasket', '▥');
      deskIcon(u, document.body, 'ic-panel', 'Control Panel', '▣');
      const win = u.el('section', 'g-window g-main', document.body);
      const title = winTitle(u, win, 'Rotate to Match', true);
      const body = u.el('div', 'g-body', win);
      Object.assign(_c, { win, title, body, header: body });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = header;
      _c.title.insertBefore(_c.headerTools, _c.title.querySelector('.g-min'));
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) note.classList.add('instruction');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const stage = u.el('main', 'cube-stage', _c.body);
      stage.dataset.role = 'stage';
      const side = u.el('aside', 'g-side', _c.body);
      u.el('div', 'g-side-head', side, 'Current Angle');
      u.el('div', 'g-angle', side, '').id = 'g-angle';
      u.el('p', 'g-side-text', side, 'Drag the handle\nto rotate the arrow.\nMatch the arrow’s\ndirection with\nthe star.');
      u.el('hr', 'g-rule', side);
      const reset = u.el('button', 'g-button g-reset', _c.body, 'Reset');
      reset.type = 'button';
      const guide = u.el('section', 'g-window g-guide', document.body);
      winTitle(u, guide, 'Angle Guide', true);
      const gb = u.el('div', 'g-guide-body', guide);
      u.el('p', '', gb, 'Use the rotation handle to set the angle.');
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction');
        note.querySelector('.ref-note-x').textContent = 'Close';
        _c.body.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.body.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.body.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-rotate-object-orient-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-rotate-object-orient-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000000'],
      LOW_ACCENTS: ['#000000'],
      parts,
    },
  });
})();

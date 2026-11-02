/* Image Adjuster: a pastel desktop design on the shared site frame. */
(function () {
  'use strict';
  function scene(parent) {
    const u = env.util;
    const image = u.el('img', 'landscape-photo', parent);
    image.src = 'sites/design-set-slider-log-02/assets/mountain-lake-reference.webp';
    image.alt = 'Alpine mountains and evergreen forest reflected in a lake';
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'note-dlg overlay-' + ctx.kind, document.body); el.setAttribute('role', 'dialog');
    const title = {chat:'Feedback', cookie:'Privacy', toast:'Notice', promo:'Tip', banner:'Notice'}[ctx.kind];
    u.el('h2', '', el, title);
    u.el('p', '', el, {chat:'Tell us how Image Adjuster is working for you.', cookie:'This app can remember your display preferences.', toast:'Settings are ready for editing.', promo:'Try the new adjustment presets.', banner:'Image Adjuster is available offline.'}[ctx.kind]);
    const dismiss = u.el('button', 'pill', el, ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
    dismiss.type = 'button'; dismiss.onclick = () => ctx.dismiss('dismiss');
    return {el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0};
  }
  const palette = {bg:'#f6f7fb', panel:'#fff', fg:'#141729', muted:'#47506c', line:'#d2d4dc'};
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = `adjuster instruction-${_c.display}`;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const win = u.el('div', 'win', document.body);
      const title = u.el('div', 'titlebar', win);
      const logo = u.svg('svg', {viewBox:'0 0 24 24', class:'logo'}, title);
      u.svg('path', {d:'M2 21Q0 21 1 18L7 9Q8 7 10 10L12 13L16 4Q17 2 18 5L24 18Q25 21 22 21Z', fill:'#2175f8'}, logo);
      u.el('span', 'apptitle', title, 'Image Adjuster');
      const wc = u.el('div', 'wincontrols', title);
      u.el('span', 'wc-min', wc); u.el('span', 'wc-max', wc); u.el('span', 'wc-close', wc);
      const menu = u.el('div', 'menubar', win);
      for (const m of ['File', 'Edit', 'View', 'Window', 'Help']) u.el('span', '', menu, m);
      u.el('span', 'spacer', menu);
      const menutools = u.el('span', 'menu-tools', menu);
      for (const m of ['Help', 'Settings']) u.el('span', 'right', menu, m);
      // Build the original note pane now, so the instruction section can fill it.
      const main = u.el('div', 'panes', win);
      const left = u.el('section', 'pane-left', main);
      const actions = u.el('div', 'actions');
      const reset = u.el('button', 'pill reset', actions, 'Reset');
      reset.type = 'button'; reset.dataset.action = 'reset';
      Object.assign(_c, {win, main, left, actions, menutools, header:left});
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.actions;
      base(_c);
      _c.header = header;
      // Inert toolbar actions retain the original menu's compact styling.
      for (const button of _c.headerTools.querySelectorAll('.ref-xtra')) _c.menutools.appendChild(button);
    },
    'frame.body': () => (_c) => {
      Object.assign(_c, {body:_c.main});
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.left;
      base(_c);
      _c.body = body;
      const panel = _c.left.querySelector('.ref-panel');
      if (panel) panel.classList.add('instruction', 'instruction-panel');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const photo = u.el('div', 'photo-frame', _c.left);
      scene(photo);
      u.el('div', 'divider', _c.main);
      const right = u.el('section', 'pane-right', _c.main);
      u.el('h2', '', right, 'Adjustments');
      const stage = u.el('main', 'record-stage', right); stage.dataset.role = 'stage';
      right.appendChild(_c.actions);
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        const close = note.querySelector('.ref-note-x');
        close.classList.add('instruction-close', 'pill');
        close.textContent = _c.closeLabel;
        _c.left.insertBefore(note, _c.left.firstChild);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('statusbar');
      _c.win.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.util.el('span', 'spacer', foot);
      _c.util.el('span', '', foot, '1920 × 1080');
      _c.util.el('span', 'sep', foot);
      _c.util.el('span', '', foot, '100%');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.left.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name:'design-set-slider-log-02',
    template:'site/base',
    langs:['en'],
    styles:['templates/site/css/base-hooks.css', 'site.css'],
    design:{THEMES:{'design-set-slider-log-02':palette}, LOW_THEME:palette,
      ACCENTS:['#4b7cff'], LOW_ACCENTS:['#4b7cff'], parts},
  });
})();

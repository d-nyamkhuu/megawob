/* NeXTSTEP photo editor design on the shared site frame. */
(function () {
  'use strict';
  function icon(parent, name, size = 24) {
    const paths = {
      windows: 'M2 4L11 3V12H2ZM13 3L23 1V12H13ZM2 14H11V23L2 22ZM13 14H23V25L13 23Z',
      close: 'M5 5L21 21M21 5L5 21', minimize: 'M5 20H21', maximize: 'M6 6H21V21H6Z',
      search: 'M17 17L24 24M20 11A9 9 0 1 1 2 11A9 9 0 1 1 20 11',
      wifi: 'M2 9Q13 -1 24 9M6 14Q13 7 20 14M10 19Q13 16 16 19M13 23H13.1',
      sound: 'M3 10H8L14 5V23L8 18H3ZM18 9Q25 14 18 19M21 5Q33 14 21 23',
      up: 'M5 17L13 9L21 17',
    };
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, parent);
    env.util.svg('path', { d: paths[name], fill: name === 'windows' ? 'currentColor' : 'none',
      stroke: name === 'windows' ? 'none' : 'currentColor', 'stroke-width': 1.7 }, svg);
    return svg;
  }
  function drawOverlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
      if (ctx.initial) el.classList.add('reference-initial');
      el.setAttribute('role', 'dialog');
      const content = {
        chat: ['Photo Rotator', 'A photo is ready for adjustment.', 'Open inspector', 'Dismiss'],
        cookie: ['Your privacy', 'Allow optional cookies for this practice workspace?', 'Accept optional', 'Reject optional'],
        toast: ['Practice saved', 'Your current workspace is ready to continue.', null, 'Dismiss'],
        promo: ['Discover more practice', 'Explore more exercises after completing this task.', 'Show details', 'Not now'],
        banner: ['Workspace notice', 'This practice session works offline.', null, 'Dismiss'],
      }[ctx.kind];
      u.el('h2', '', el, content[0]);
      const close = u.el('button', 'bubble-close', el);
      close.type = 'button'; close.setAttribute('aria-label', 'Close notice'); icon(close, 'close', 25);
      close.onclick = () => ctx.dismiss('close');
      const message = u.el('p', '', el, content[1]);
      const actions = u.el('div', 'tour-actions', el);
      if (content[2]) {
        const primary = u.el('button', 'tour-primary', actions, content[2]); primary.type = 'button';
        primary.onclick = () => {
          if (ctx.kind === 'cookie') ctx.dismiss('accept');
          else { message.textContent = 'Click and drag the cube. Use the task instruction to choose which face should point toward you.'; primary.hidden = true; }
        };
      }
      const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('skip');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  const palette = { bg: '#b9b9b9', panel: '#c6c6c6', fg: '#111111', muted: '#555555', line: '#777777' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The editor has room for its compact note even at the smallest viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = `next-photo instruction-${_c.display}`;
      const titlebar = u.el('header', 'titlebar', document.body);
      const windowActions = u.el('div', 'window-actions', titlebar);
      for (const action of ['close', 'minimize', 'maximize']) {
        const b = u.el('button', 'window-action ' + action, windowActions);
        b.type = 'button'; b.setAttribute('aria-label', action); icon(b, action, 30);
      }
      u.el('span', 'app-title', titlebar, 'Photo Rotator');
      const page = u.el('section', 'notebook-page', document.body);
      const info = u.el('aside', 'info-panel', page);
      u.el('h2', 'info-heading', info, 'Image Info');
      u.el('div', 'image-summary', info);
      const preview = u.el('div', 'photo-thumb', info);
      u.el('div', 'file-meta', preview.parentElement, 'IMG_0024.tiff\nTIFF Image\n1536 × 1024\n24-bit RGB\n2.9 MB');
      u.el('div', 'rule', info);
      const details = u.el('div', 'metadata', info);
      [['Date:', 'Oct 14, 1993  4:27 PM'], ['Camera:', 'Nikon F90'], ['Focal Length:', '50 mm'], ['Exposure:', '1/250 sec  f/8'], ['Dimensions:', '1536 × 1024']].forEach(([a,b])=>{u.el('span','',details,a);u.el('span','',details,b);});
      u.el('div', 'rule', info);
      u.el('h2', 'info-subhead', info, 'Rotation');
      const stats = u.el('div', 'rotation-summary', info);
      [['Current Angle:', '−12.0°'], ['Image Size:', '1536 × 1024'], ['Orientation:', 'Landscape']].forEach(([a,b],i)=>{u.el('span','',stats,a);u.el('span',i===0?'summary-angle':'',stats,b);});
      u.el('div', 'rule', info);
      u.el('h2', 'info-subhead', info, 'Histogram');
      const hist = u.el('div','histogram',info);
      const bars = [6,16,32,23,38,52,47,62,42,55,34,48,29,38,24,32,19,26,15,22,12,17,9,14,7,10,5,7,3,5,2];
      bars.forEach((n)=>{const b=u.el('i','',hist);b.style.height=n+'%';});
      const work = u.el('main', 'work-area', page);
      Object.assign(_c, { header: titlebar, work });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.work;
      base(_c);
      _c.header = header;
      const note = _c.work.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => { base(_c); },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => { base(_c); },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'cube-stage', _c.work);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') _c.work.appendChild(document.body.querySelector('.ref-note'));
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('taskbar');
      const text = foot.querySelector('.ref-foot-text');
      text.classList.add('status-text');
      text.textContent = 'Ready';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-rotate-object-photo-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-rotate-object-photo-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#777777'],
      LOW_ACCENTS: ['#777777'],
      parts,
    },
  });
})();

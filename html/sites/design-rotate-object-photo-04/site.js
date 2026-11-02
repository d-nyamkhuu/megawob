/* Metro notebook reference frame. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  function icon(parent, name, size = 24) {
    const paths = {
      windows: 'M2 4L11 3V12H2ZM13 3L23 1V12H13ZM2 14H11V23L2 22ZM13 14H23V25L13 23Z',
      close: 'M5 5L21 21M21 5L5 21',
      minimize: 'M5 20H21',
      maximize: 'M6 6H21V21H6Z',
      search: 'M17 17L24 24M20 11A9 9 0 1 1 2 11A9 9 0 1 1 20 11',
      wifi: 'M2 9Q13 -1 24 9M6 14Q13 7 20 14M10 19Q13 16 16 19M13 23H13.1',
      sound: 'M3 10H8L14 5V23L8 18H3ZM18 9Q25 14 18 19M21 5Q33 14 21 23',
      up: 'M5 17L13 9L21 17',
    };
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, parent);
    env.util.svg(
      'path',
      {
        d: paths[name],
        fill: name === 'windows' ? 'currentColor' : 'none',
        stroke: name === 'windows' ? 'none' : 'currentColor',
        'stroke-width': 1.7,
      },
      svg,
    );
    return svg;
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
    if (ctx.initial) el.classList.add('reference-initial');
    el.setAttribute('role', 'dialog');
    const content = {
      chat: ['Photo library', 'Your photos and albums are ready to browse.', 'Open library', 'Dismiss'],
      cookie: [
        'Your privacy',
        'Allow optional cookies for this practice workspace?',
        'Accept optional',
        'Reject optional',
      ],
      toast: ['Practice saved', 'Your current workspace is ready to continue.', null, 'Dismiss'],
      promo: [
        'Discover more practice',
        'Explore more exercises after completing this task.',
        'Show details',
        'Not now',
      ],
      banner: ['Workspace notice', 'This practice session works offline.', null, 'Dismiss'],
    }[ctx.kind];
    u.el('h2', '', el, content[0]);
    const close = u.el('button', 'bubble-close', el);
    close.type = 'button';
    close.setAttribute('aria-label', 'Close notice');
    icon(close, 'close', 25);
    close.onclick = () => ctx.dismiss('close');
    const message = u.el('p', '', el, content[1]);
    const actions = u.el('div', 'tour-actions', el);
    if (content[2]) {
      const primary = u.el('button', 'tour-primary', actions, content[2]);
      primary.type = 'button';
      primary.onclick = () => {
        if (ctx.kind === 'cookie') ctx.dismiss('accept');
        else {
          message.textContent =
            'Click and drag the cube. Use the task instruction to choose which face should point toward you.';
          primary.hidden = true;
        }
      };
    }
    const dismiss = u.el('button', 'tour-dismiss', actions, content[3]);
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('skip');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  const palette = { bg: '#d6d3ce', panel: '#f0eeea', fg: '#302c28', muted: '#77716b', line: '#c5c0b8' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('shotwell', `instruction-${_c.display}`);
      const titlebar = u.el('header', 'titlebar', document.body);
      u.el('span', 'app-title', titlebar, 'Shotwell');
      const windowActions = u.el('div', 'window-actions', titlebar);
      for (const action of ['minimize', 'maximize', 'close']) {
        const b = u.el('button', 'window-action ' + action, windowActions);
        b.type = 'button';
        b.setAttribute('aria-label', action);
        icon(b, action);
      }
      const tabs = u.el('nav', 'app-toolbar', document.body);
      tabs.setAttribute('aria-label', 'Photo library navigation');
      [['▧', 'Photos'], ['▦', 'Events'], ['◇', 'Tags'], ['✎', 'Edit']].forEach(([glyph, label], i) => {
        const tab = u.el('button', 'toolbar-tab ' + (i === 0 ? 'active' : ''), tabs);
        tab.type = 'button';
        u.el('span', 'nav-glyph', tab, glyph);
        u.el('span', '', tab, label);
      });
      const endActions = u.el('div', 'end-actions', tabs);
      const search = u.el('div', 'search-photos', tabs);
      u.el('span', 'search-icon', search, '⌕');
      u.el('span', '', search, 'Search Photos');
      const layout = u.el('div', 'app-layout', document.body);
      const editor = u.el('section', 'photo-editor', layout);
      const editorHeading = u.el('header', 'editor-heading', editor);
      u.el('span', '', editorHeading, 'Rotate and Straighten');
      Object.assign(_c, { header: editorHeading, layout, editor, endActions });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.endActions;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const sidebar = u.el('aside', 'library-sidebar', _c.layout);
      u.el('h2', '', sidebar, 'Library');
      [['▧', 'Photos'], ['◷', 'Last Import'], ['▦', 'Events'], ['◇', 'Tags'], ['▤', 'Trash']].forEach(([g, t], i) => {
        const r = u.el('div', 'side-row ' + (!i ? 'selected' : ''), sidebar);
        u.el('span', 'side-glyph', r, g);
        u.el('span', '', r, t);
      });
      u.el('h2', 'folder-heading', sidebar, 'Folders');
      [['▾ ▰', 'Pictures'], ['　▱', 'Holiday'], ['　▱', 'Family'], ['　▱', 'Friends'], ['　▱', 'Scenery'], ['▱', 'Other Photos']].forEach(([g, t], i) => {
        const r = u.el('div', 'side-row folder-row ' + (i === 1 ? 'folder-selected' : ''), sidebar);
        u.el('span', 'side-glyph', r, g);
        u.el('span', '', r, t);
      });
      _c.inspector = u.el('aside', 'photo-inspector', _c.layout);
      _c.body = _c.layout;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.inspector;
      base(_c);
      _c.body = body;
      const u = _c.util;
      const inspector = _c.inspector;
      u.el('h2', '', inspector, 'Photo Properties');
      [['Name:', 'Beach.jpg'], ['Date:', 'Jul 23, 2006  7:12 PM'], ['Size:', '3.1 MB'], ['Dimensions:', '3072 × 2304'], ['Camera:', 'Canon PowerShot A620'], ['Exposure:', '1/500 sec   f/4.0'], ['Focal Length:', '7.3 mm'], ['ISO:', '80']].forEach(([a, b]) => {
        const r = u.el('div', 'property-row', inspector);
        u.el('span', '', r, a);
        u.el('span', '', r, b);
      });
      u.el('h2', 'inspector-section', inspector, 'Tags');
      u.el('div', 'tag-box', inspector, 'Beach　×　 Sunset　×');
      u.el('h2', 'inspector-section', inspector, 'Location');
      const map = u.el('div', 'map-box', inspector);
      map.setAttribute('aria-label', 'Coastal location map');
      u.el('span', 'map-road road-one', map);
      u.el('span', 'map-road road-two', map);
      u.el('span', 'map-coast-road', map);
      u.el('span', 'map-pin', map, '●');
      const zoom = u.el('div', 'map-zoom', map);
      u.el('span', '', zoom, '+');
      u.el('span', '', zoom, '−');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'cube-stage', _c.editor);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        _c.photoFooter = _c.util.el('footer', 'photo-footer', document.body);
        _c.photoFooter.appendChild(document.body.querySelector('.ref-note'));
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.querySelector('.ref-foot-text').remove();
        if (_c.photoFooter) {
          _c.photoFooter.appendChild(foot);
        } else {
          foot.classList.add('photo-footer');
        }
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.endActions.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-rotate-object-photo-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-rotate-object-photo-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#d96625'],
      LOW_ACCENTS: ['#d96625'],
      parts,
    },
  });
})();

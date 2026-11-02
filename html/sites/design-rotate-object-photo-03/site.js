/* Academic hypertext photo editor design on the shared site frame. */
(function () {
  'use strict';
  function icon(parent, symbol) {
    const e = env.util.el('span', 'dock-icon', parent, symbol);
    e.setAttribute('aria-hidden', 'true');
    return e;
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const box = u.el('section', 'notice overlay-' + ctx.kind, document.body);
    box.setAttribute('role', 'dialog');
    const c = u.el('button', 'notice-close', box, '×');
    c.type = 'button'; c.setAttribute('aria-label', 'Dismiss');
    c.onclick = () => ctx.dismiss('close');
    const titles = { cookie: 'Privacy notice', chat: 'Photo help', toast: 'Saved', promo: 'Photo tips', banner: 'Notice' };
    u.el('strong', '', box, titles[ctx.kind] || 'Notice');
    u.el('p', '', box, ctx.kind === 'chat' ? 'Need help rotating your photo? Drag the handle or use the controls.' : 'This photo editor works in your browser.');
    const dismiss = u.el('button', 'notice-dismiss', box, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
    dismiss.type = 'button'; dismiss.onclick = () => ctx.dismiss('dismiss');
    return { el: box, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  const palette = { bg: '#fff', panel: '#fff', fg: '#111', muted: '#666', line: '#888' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('academic-photo');
      const frame = u.el('div', 'app-frame', document.body);
      const content = u.el('div', 'content-area', frame);
      const editor = u.el('main', 'editor', content);
      const header = u.el('div', 'editor-toolbar', editor);
      Object.assign(_c, { frame, contentArea: content, editor, header });
    },
    'frame.nav': () => () => {},
    'frame.body': () => (_c) => {
      _c.body = _c.contentArea;
      const u = _c.util;
      const help = u.el('aside', 'help-panel', _c.body);
      u.el('h2', '', help, 'Help');
      u.el('p', '', help, 'Drag the photo to rotate it to the desired orientation, or use the controls:');
      const list = u.el('ul', '', help);
      ['Drag the photo with the mouse.', 'Use the left and right arrow keys on your keyboard.', 'Click the 90° buttons to turn the photo quickly.', 'Use the Straighten slider for fine adjustments (−45° to 45°).'].forEach(t => u.el('li', '', list, t));
      u.el('h2', 'ruled-heading', help, 'Tips');
      const tips = u.el('ul', '', help);
      ['The angle readout shows the current rotation.', 'A level horizon looks natural in most photos.', 'You can also use the arrow keys for small changes (1° at a time).'].forEach(t => u.el('li', '', tips, t));
      u.el('h2', 'ruled-heading', help, 'Keyboard Shortcuts');
      const table = u.el('div', 'shortcut-table', help);
      [['Left arrow','Rotate left 1°'],['Right arrow','Rotate right 1°'],['Shift + Left arrow','Rotate left 5°'],['Shift + Right arrow','Rotate right 5°']].forEach(row => {
        const r = u.el('div', '', table); u.el('span', '', r, row[0]); u.el('span', '', r, row[1]);
      });
      _c.help = help;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.help;
      base(_c);
      _c.body = body;
      const panel = _c.help.querySelector('.ref-panel');
      if (panel) _c.help.prepend(panel);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'photo-stage', _c.editor);
      _c.stage.dataset.role = 'stage';
      _c.util.el('section', 'below-controls', _c.editor);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.frame.append(note);
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const dock = u.el('nav', 'bottom-dock', _c.frame);
      dock.setAttribute('aria-label', 'Application navigation');
      [['⌂','Home'],['▰','Photos'],['🖉','Edit'],['▤','Print'],['◫','Help']].forEach((item, i) => {
        if (i) u.el('span', 'dock-divider', dock);
        const a = u.el('a', '', dock); a.href = '#'; a.onclick = e => e.preventDefault();
        icon(a, item[0]); u.el('span', '', a, item[1]);
      });
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      dock.append(foot);
      _c.dock = dock;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.help.prepend(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-rotate-object-photo-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-rotate-object-photo-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#222'],
      LOW_ACCENTS: ['#222'],
      parts,
    },
  });
})();

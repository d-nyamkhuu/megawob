(function () {
  'use strict';
  const palette = { bg: '#cfcfcd', panel: '#e8e8e6', fg: '#222', muted: '#555', line: '#a8a6a4' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'lnx');
      document.body.classList.toggle('has-instruction-toast', _c.display === 'toast');
      document.documentElement.style.setProperty('--font', "'DejaVu Sans Mono','Liberation Mono','Courier New',monospace");
      const shell = u.el('div', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const tb = u.el('div', 'tbar', head);
      const ic = u.svg('svg', {
        width: 28, height: 28, viewBox: '0 0 28 28', fill: '#d8d4d0',
        stroke: '#222', 'stroke-width': 1.4, class: 'tmenu',
      }, tb);
      u.svg('path', { d: 'M1 1H27V27H1Z M5 5H23V23H5Z M7 9H21 M7 13H21 M7 17H21 M7 21H21' }, ic);
      u.el('b', 'tname', tb, 'Text Calibration Utility');
      u.el('span', 'tver', tb, 'v1.3.2');
      const wc = u.el('div', 'wctl', tb);
      for (const l of ['_', '□', '×']) {
        const bt = u.el('button', '', wc, l);
        bt.type = 'button';
        bt.onclick = () => env.log('window-control', { label: l });
      }
      const menu = u.el('nav', 'menu', head);
      for (const t of ['File', 'Tools', 'Options', 'Help']) {
        const a = u.el('a', '', menu, t);
        a.href = '#';
        a.onclick = (e) => e.preventDefault();
      }
      u.el('span', 'status', menu, 'Mode: Annotation   |   User: calibrator   |   2004-11-08 14:27');
      const frame = u.el('div', 'frame', shell);
      const content = u.el('div', 'content' + (_c.display === 'panel' ? ' instr-panel' : ''), frame);
      const header = u.el('section', 'task-note', content);
      header.hidden = _c.display !== 'header';
      Object.assign(_c, { shell, menu, frame, content, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.content; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.content.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note', 'instruction-panel');
        panel.querySelector('.ref-panel-text').classList.add('instruction');
      }
    },
    'frame.stage': () => (_c) => {
      const board = _c.util.el('div', 'board', _c.content);
      _c.stage = _c.util.el('main', 'stage', board);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note', 'instruction-toast');
        note.querySelector('.ref-note-text').classList.add('instruction');
        note.querySelector('.ref-note-x').classList.add('note-close');
        _c.content.appendChild(note);
        // Reserve the toolbar's right corner even when a fault shifts the frame.
        if (_c.headerTools.children.length) {
          note.style.right = `calc(2.5vw + ${_c.headerTools.getBoundingClientRect().width}px)`;
        }
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('footer');
      _c.frame.appendChild(footer);
      const sel = u.el('div', 'selinfo');
      u.el('span', '', sel, 'Selection:');
      u.el('span', 'val', sel, 'None');
      footer.prepend(sel);
      const copy = footer.querySelector('.ref-foot-text');
      copy.classList.add('footer-copy');
      copy.textContent = '';
      if (_c.ctx.finish) {
        const done = u.el('span', 'finish-status', footer, 'Ready');
        done.setAttribute('aria-hidden', 'true');
      }
      const clr = u.el('button', 'clear', footer, 'Clear');
      clr.type = 'button';
      clr.onclick = () => { env.widgetDef.clear?.(); };
      const cn = u.el('button', 'cancel', footer, 'Quit');
      cn.type = 'button';
      cn.onclick = () => env.log('cancel', {});
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      // Keep the floating placement separate from the right-hand footer tools.
      if (dock) _c.footer.insertBefore(dock, _c.footer.querySelector('.footer-copy'));
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title = {
        cookie: 'Your privacy',
        toast: 'Changes saved',
        chat: 'Support',
        promo: 'Workspace update',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This application stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with this workspace?',
        promo: 'Explore the latest workspace features.',
        banner: 'You are viewing a shared workspace.',
      }[kind];
      const label = kind === 'cookie' ? 'Reject optional' : 'Close';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, label);
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-select-text-sentence-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-select-text-sentence-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#6a0020'],
      LOW_ACCENTS: ['#6a0020'],
      parts,
    },
  });
})();

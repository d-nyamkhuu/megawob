// WorkBench frame: visual sections on the shared site's behavior.
(function () {
  'use strict';

  const palette = { bg: '#c7ccd3', panel: '#eef1f5', fg: '#111820', muted: '#657080', line: '#c9cfd5' };

  function properties(u, content, ctx) {
    const aside = u.el('aside', 'aside', content);
    u.el('h3', '', aside, 'Properties');
    const row = (label, value, cls = '') => {
      const r = u.el('div', 'qt-row ' + cls, aside);
      u.el('label', '', r, label);
      return u.el('div', 'qt-field', r, value);
    };
    u.el('div', 'qt-sec', aside, 'Panel');
    row('Name:', ctx.spec?.title || 'Comments');
    const visible = row('Visible:', '✔', 'vis');
    visible.className = 'qt-chk';
    u.el('span', '', visible.parentNode, 'Yes');
    row('Background:', '', 'bgc');
    u.el('div', 'qt-sec', aside, 'Layout');
    row('X:', '120 px');
    row('Y:', '100 px');
    row('Width:', '— px');
    row('Height:', '— px');
    u.el('div', 'qt-sec', aside, 'Info');
    u.el('p', 'qt-info', aside, 'Drag a handle to resize the panel.\nStay within the workspace.');
    return aside;
  }

  // Keep the design's newsletter; other popup kinds use the shared site renderer.
  function newsletter(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'obstruction obstruction-promo', document.body);
    el.dataset.role = 'overlay';
    const box = u.el('div', 'obstruction-box', el);
    const title = u.el('div', 'ob-title', box);
    u.el('span', '', title, 'Team Newsletter');
    const close = (parent, cls, label) => {
      const button = u.el('button', cls, parent, label);
      button.type = 'button';
      button.setAttribute('aria-label', 'Close');
      button.addEventListener('click', () => ctx.dismiss('close'));
      return button;
    };
    close(title, 'ob-x', '×');
    u.el('h3', '', box, 'Stay in the loop');
    u.el('p', '', box, 'Get monthly product updates,\nteam stories, and more.');
    const subscribe = u.el('button', 'dismiss subscribe', box, 'Subscribe');
    subscribe.type = 'button';
    subscribe.addEventListener('click', () => env.log('subscribe-click', {}));
    const dismiss = close(box, 'dismiss', 'Close');
    const icon = u.svg('svg', {
      class: 'ob-icon', width: 64, height: 64, viewBox: '0 0 64 64',
      fill: 'none', stroke: '#457abf', 'stroke-width': 3,
    }, box);
    u.svg('path', { d: 'M8 14H56V50H8ZM8 14L32 36L56 14M8 50L25 30M39 30L56 50' }, icon);
    return { el, dismiss };
  }

  const parts = {
    'frame.theme': (base) => (_c) => {
      base(_c);
      document.body.className = 'design qt layout-perimeter';
      _c.root.style.setProperty('--font', 'Arial, sans-serif');
    },
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The desktop has a dedicated properties pane even at its smallest size.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('has-instruction-toast', _c.display === 'toast');
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'shell', document.body),
        head = u.el('header', 'head', shell);
      {
        const controls = u.el('div', 'window-controls', head);
        for (const label of ['−', '□', '×']) {
          const bt = u.el('button', '', controls, label);
          bt.type = 'button';
          bt.onclick = () => env.log('window-control', { label });
        }
      }
      {
        const title = u.el('div', 'title', head, 'WorkBench - Project Notes');
        const icon = u.svg(
          'svg',
          { class: 'app-icon', viewBox: '0 0 20 20', fill: 'none', stroke: '#16425d', 'stroke-width': 1.4 },
          title,
        );
        u.svg('path', { d: 'M1 1H19V16H1ZM4 4H16V12H4ZM7 16V19M13 16V19M5 19H15M4 10L7 7L11 11L14 6L16 9' }, icon);
      }
      u.el('nav', 'menu', head, 'File    Edit    View    Tools    Help');
      let qtbar;
      {
        const bar = (qtbar = u.el('div', 'qtbar', head));
        const btn = (label, p, dis) => {
          const b = u.el('span', 'qtb' + (dis ? ' dis' : ''), bar);
          const s = u.svg(
            'svg',
            {
              width: 24,
              height: 24,
              viewBox: '0 0 24 24',
              fill: label === 'Open' ? '#ffeba5' : label === 'New' || label === 'Save' ? '#eef5fc' : 'none',
              stroke: dis ? '#92979e' : '#1f3f7a',
              'stroke-width': label === 'Undo' || label === 'Redo' ? 2.8 : 1.8,
            },
            b,
          );
          u.svg('path', { d: p }, s);
          u.el('span', '', b, label);
        };
        btn('New', 'M4 3H17L20 6V21H4ZM8 3V9H15V3');
        btn('Open', 'M2 20V6H9L11 8H20V11H6L2 20H18L22 11');
        btn('Save', 'M4 3H18L21 6V21H4ZM8 3V9H16V3M8 21V14H17V21');
        u.el('span', 'qtsep', bar);
        btn('Undo', 'M9 5L4 10L9 15M4 10H15A5 5 0 0 1 15 20H11');
        btn('Redo', 'M15 5L20 10L15 15M20 10H9A5 5 0 0 0 9 20H13', true);
        u.el('span', 'qtsep', bar);
        const sr = u.el('div', 'qtsearch', bar);
        const ss = u.svg(
          'svg',
          { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: '#111', 'stroke-width': 3 },
          sr,
        );
        u.svg('path', { d: 'M10 3A7 7 0 1 1 10 17A7 7 0 1 1 10 3M15 15L22 22' }, ss);
        u.el('span', '', sr, 'Search notes...');
      }
      const content = u.el('div', 'content ref-body', shell);
      const note = u.el('section', 'task-note', content);
      u.el('div', 'note-label', content, 'Task: Adjust Panel Size');
      Object.assign(_c, { shell, header: head, qtbar, body: content, note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base({ ..._c, header: _c.note });
      const instruction = _c.note.querySelector('.ref-instruction');
      if (instruction) {
        instruction.className = 'instruction';
        _c.util.el('div', 'note-help', _c.note,
          'Drag a handle to resize the panel.\nThe current size is shown below.');
      } else _c.note.hidden = true;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.qtbar.append(_c.headerTools);
      for (const button of _c.headerTools.children) {
        button.classList.add(button.dataset.role === 'submit' ? 'qt-end-button' : 'qt-xtra');
      }
    },
    'frame.body': () => (_c) => {
      const u = _c.util, content = _c.body;
      {
        const tl = u.el('div', 'qt-tools', content);
        const th = u.el('div', 'qt-hd', tl);
        u.el('span', '', th, 'Tools');
        u.el('span', '', th, '×');
        let k = 0;
        for (const [name, p] of [
          ['Select', 'M5 2V22L10 17L14 25L17 24L13 16H20Z'],
          ['Pan', 'M8 22L4 13Q4 10 7 12L9 14V5Q11 2 12 5V12V4Q14 2 15 5V12V6Q18 4 18 7V14L20 10Q22 11 21 14L18 22Z'],
          ['Note', 'M5 4H19V23H5ZM9 2H15V6H9ZM8 10H16M8 14H16M8 18H14'],
          ['Rectangle', 'M4 4H22V22H4Z'],
          ['Arrow', 'M3 23L17 8L14 6L24 2L21 12L19 10L5 25Z'],
          ['Text', 'M4 4H22M13 4V22M9 22H17'],
          ['Crop', 'M7 2V19H24M2 7H19V24M3 23L23 3'],
        ]) {
          const r = u.el('div', 'qt-tool' + (k++ === 0 ? ' sel' : ''), tl);
          const s = u.svg(
            'svg',
            {
              width: 30,
              height: 30,
              viewBox: '0 0 26 26',
              fill: name === 'Select' || name === 'Pan' ? '#fff' : name === 'Arrow' ? '#183e63' : 'none',
              stroke: name === 'Select' || name === 'Pan' ? '#111820' : '#183e63',
              'stroke-width': 1.7,
            },
            r,
          );
          if (name === 'Text') {
            u.svg(
              'text',
              {
                x: 3,
                y: 24,
                fill: '#183e63',
                stroke: 'none',
                'font-family': 'Georgia',
                'font-size': 27,
                'font-weight': 'bold',
              },
              s,
            ).textContent = 'T';
          } else u.svg('path', { d: p }, s);
          u.el('span', '', r, name);
        }
      }
      _c.aside = properties(u, content, _c.ctx);
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.aside });
      const panel = _c.aside.querySelector('.ref-panel');
      if (panel) {
        panel.className = 'qt-instruction-card';
        panel.querySelector('.ref-panel-title').className = 'qt-sec';
        panel.querySelector('.ref-panel-text').className = 'instruction qt-panel-instruction';
        _c.aside.prepend(panel);
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display !== 'toast') return;
      const toast = document.querySelector('.ref-note');
      toast.className = 'task-note instruction-toast';
      toast.querySelector('.ref-note-text').className = 'instruction';
      toast.querySelector('.ref-note-x').className = 'note-close';
      _c.note.replaceWith(toast);
      _c.note = toast;
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const { util: u, shell } = _c;
      const footer = document.querySelector('.ref-foot') || u.el('footer', '', shell);
      footer.classList.add('footer');
      shell.append(footer);
      const copy = footer.querySelector('.ref-foot-text');
      if (copy) copy.classList.add('footer-copy');
      for (const button of footer.querySelectorAll('button, a')) {
        button.classList.add(button.dataset.role === 'submit'
          ? (button.tagName === 'A' ? 'qt-end-link' : 'submit') : 'qt-xtra');
      }
      const status = u.el('div', 'qt-status', shell);
      u.el('span', '', status, 'Ready');
      u.el('span', 'sp', status, '');
      u.el('span', '', status, 'Zoom: 100%');
      u.el('span', '', status, 'Tue Apr 23, 2002   10:14 AM');
      if (_c.placement === 'link') status.append(_c.submit);
      Object.assign(_c, { footer });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) {
        _c.footer.append(dock);
        _c.submit.classList.add('submit');
      }
    },
    overlay: (base) => (ctx) => ctx.kind === 'promo' ? newsletter(ctx) : base(ctx),
  };

  env.site({
    name: 'design-resize-element-numeric-11',
    template: 'site/base',
    langs: ['en'],
    design: {
      THEMES: { qt: palette }, LOW_THEME: palette,
      ACCENTS: ['#457abf'], LOW_ACCENTS: ['#457abf'],
      parts,
    },
  });
})();

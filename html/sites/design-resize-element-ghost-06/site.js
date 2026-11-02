(function () {
  'use strict';
  const C = {
    title: 'Document Viewer', accent: '#e0701c', bg: '#efe8dc', surface: '#e9e2d6',
    font: "Arial,'Trebuchet MS',sans-serif",
  };
  const palette = { bg: C.bg, panel: C.surface, fg: '#2b231c', muted: '#6d6154', line: '#b8ab98' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This desktop has a dedicated note area for every display mode.
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
      const body = document.body;
      body.classList.add('design', 'gnome-human');
      body.classList.toggle('has-instruction-toast', _c.display === 'toast');
      document.documentElement.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', body);
      const head = u.el('header', 'head', shell);
      const tb = u.el('div', 'titlebar', head);
      const docIcon = u.svg(
        'svg',
        {
          class: 'tb-icon',
          width: 20,
          height: 22,
          viewBox: '0 0 20 22',
          fill: '#efede7',
          stroke: '#aaa59b',
          'stroke-width': 1,
        },
        tb,
      );
      u.svg('path', { d: 'M3 1.5H12L17 6.5V20.5H3ZM12 1.5V6.5H17' }, docIcon);
      u.svg('path', { d: 'M6 10H14M6 13H14M6 16H11', stroke: '#827c70' }, docIcon);
      u.el('div', 'title', tb, C.title);
      const controls = u.el('div', 'window-controls', tb);
      for (const [cls, label] of [
        ['min', '−'],
        ['max', '□'],
        ['close', '×'],
      ]) {
        const bt = u.el('button', cls, controls, label);
        bt.type = 'button';
        bt.onclick = () => env.log('window-control', { label });
      }
      const nav = u.el('nav', 'menu', head);
      for (const label of ['File', 'Edit', 'View', 'Go', 'Help']) u.el('span', '', nav, label);
      const over = u.el('section', 'overview', shell);
      const meta = u.el('div', 'ov-meta', over);
      const big = u.svg(
        'svg',
        {
          class: 'ov-icon',
          width: 60,
          height: 76,
          viewBox: '0 0 60 76',
          fill: '#f4f0e8',
          stroke: '#7b7064',
          'stroke-width': 2,
        },
        meta,
      );
      u.svg('path', { d: 'M3 3H38L57 22V73H3ZM38 3V22H57' }, big);
      for (const [y, w] of [
        [30, 34],
        [39, 34],
        [48, 34],
        [57, 21],
      ])
        u.svg('path', { d: `M13 ${y}H${13 + w}`, stroke: '#b5b1a9', 'stroke-width': 4 }, big);
      const mt = u.el('div', 'ov-text', meta);
      u.el('div', 'ov-name', mt, 'Project Plan');
      for (const t of ['Last modified: Apr 24, 2006', 'Size: 420 KB', 'Pages: 3']) u.el('div', 'ov-line', mt, t);
      u.el('div', 'ov-sep', over);
      const thumbs = u.el('div', 'ov-thumbs', over);
      for (let i = 1; i <= 3; i++) {
        const th = u.el('div', 'ov-th' + (i === 1 ? ' sel' : ''), thumbs);
        const pg = u.el('div', 'ov-page', th);
        if (i === 1) {
          u.el('b', '', pg, 'Project Plan');
          for (let k = 0; k < 6; k++) u.el('i', '', pg);
        } else if (i === 2) {
          for (let k = 0; k < 5; k++) u.el('i', '', pg);
          const ch = u.el('div', 'ov-chart', pg);
          for (let k = 0; k < 4; k++) u.el('em', '', ch);
        } else {
          for (let k = 0; k < 4; k++) u.el('i', '', pg);
          const table = u.el('div', 'ov-table', pg);
          for (let k = 0; k < 12; k++) u.el('span', '', table);
        }
        u.el('span', '', th, String(i));
      }
      u.el('div', 'splitter', shell);
      const content = u.el('div', 'content');
      const note = u.el('section', 'task-note', content);
      note.hidden = _c.display === 'hidden';
      if (_c.display !== 'hidden') u.el('span', 'note-icon', note, 'i');
      note.classList.toggle('instruction-panel', _c.display === 'panel');
      note.classList.toggle('instruction-toast', _c.display === 'toast');
      Object.assign(_c, { shell, toolbar: nav, body: content, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) text.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('chrome-tools');
    },
    'frame.body': () => (_c) => {
      _c.shell.appendChild(_c.body);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const text = _c.header.querySelector('.ref-panel-text');
      if (text) text.classList.add('instruction');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.header.appendChild(note);
        note.querySelector('.ref-note-text').classList.add('instruction');
        note.querySelector('.ref-note-x').classList.add('note-close');
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('footer');
      _c.shell.appendChild(footer);
      footer.querySelector('.ref-foot-text').hidden = true;
      const tools = footer.querySelector('.ref-tools');
      const reset = u.el('button', 'clear', footer, 'Reset');
      reset.type = 'button';
      const rs = u.svg(
        'svg',
        { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2.2 },
        reset,
      );
      u.svg('path', { d: 'M20 12A8 8 0 1 1 16.5 5.4M20 3V9H14' }, rs);
      reset.prepend(rs);
      reset.onclick = () => {
        env.widgetDef.clear?.();
      };
      u.el('div', 'footer-gap', footer);
      const cancel = u.el('button', 'cancel', footer, 'Cancel');
      cancel.type = 'button';
      cancel.onclick = () => {
        env.widgetDef.clear?.();
      };
      footer.appendChild(tools);
      _c.foot = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-resize-element-ghost-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-resize-element-ghost-06': palette },
      LOW_THEME: palette,
      ACCENTS: [C.accent],
      LOW_ACCENTS: [C.accent],
      parts,
    },
  });
})();

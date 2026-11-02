(function () {
  'use strict';
  const palette = { bg: '#33373e', panel: '#3b4049', fg: '#e8eaee', muted: '#9aa1ab', line: '#2a2d33' };
  const ICONS = {
    drag: 'M16 2V30M2 16H30M16 2L11 7M16 2L21 7M16 30L11 25M16 30L21 25M2 16L7 11M2 16L7 21M30 16L25 11M30 16L25 21',
    clear: 'M4 8H28M11 8V3H21V8M7 11L8 29H24L25 11M12 12V25M16 12V25M20 12V25',
    reset: 'M27 9A12 12 0 1 0 28 20M28 2V10H20',
  };
  function drawTools(u, tools) {
    for (const [k, label] of [['drag', 'Drag'], ['clear', 'Clear'], ['reset', 'Reset']]) {
      const bt = u.el('button', 'cw-tool', tools);
      bt.type = 'button';
      const s = u.svg('svg', {
        width: 34, height: 34, viewBox: '0 0 32 32', fill: 'none', stroke: '#e6e9ee',
        'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      }, bt);
      u.svg('path', { d: ICONS[k] }, s);
      if (k === 'drag') u.svg('path', {
        d: 'M16 1L11 7H21Z M16 31L11 25H21Z M1 16L7 11V21Z M31 16L25 11V21Z',
        fill: '#e6e9ee', stroke: 'none',
      }, s);
      if (k === 'reset') u.svg('path', { d: 'M28 2L28 11L19 10Z', fill: '#e6e9ee', stroke: 'none' }, s);
      u.el('span', '', bt, label);
      bt.onclick = k === 'clear' || k === 'reset'
        ? () => env.widgetDef.clear?.()
        : () => env.log('tool', { label });
    }
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This design reserves its own left instruction column at every size.
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
      document.body.classList.add('design', 'pc');
      document.body.classList.toggle('has-instruction-toast', _c.display === 'toast');
      document.documentElement.style.setProperty('--font', "'Segoe UI',Arial,sans-serif");
      const win = u.el('div', 'cw-win', document.body);
      const tb = u.el('div', 'cw-title', win);
      const ic = u.el('span', 'cw-appicon', tb);
      ic.innerHTML = '<svg viewBox="0 0 20 20"><rect x="3" y="4" width="5" height="11" rx="1" fill="#477b97"/><rect x="9" y="2" width="5" height="11" rx="1" fill="#80a0b3"/><path d="M4 7h3M10 5h3M10 9h3" stroke="#edf4f7"/><path d="M12 14l3-2 2 4-3 2z" fill="#4a7e9a"/></svg>';
      u.el('span', 'cw-appname', tb, 'Tile Sorter');
      const wc = u.el('div', 'cw-wc', tb);
      for (const [cls, label] of [['min', '−'], ['max', '□'], ['close', '×']]) {
        const b = u.el('button', 'cw-wb ' + cls, wc, label);
        b.type = 'button';
        b.onclick = () => env.log('window-control', { label });
      }
      const mb = u.el('nav', 'cw-menu', win);
      for (const t of ['File', 'Edit', 'View', 'Help']) u.el('span', '', mb, t);
      const content = u.el('div', 'cw-content', win);
      const note = u.el('section', 'task-note cw-note', content);
      note.hidden = _c.display === 'hidden';
      if (_c.display === 'panel') note.classList.add('instruction-panel');
      const tools = u.el('aside', 'cw-tools');
      drawTools(u, tools);
      Object.assign(_c, { win, content, note, tools, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.note.querySelector('.ref-instruction');
      if (text) text.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tools;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const right = u.el('div', 'cw-right', _c.content);
      const panel = u.el('section', 'cw-panel', right);
      u.el('div', 'cw-phead', panel, 'Tiles');
      right.appendChild(_c.tools);
      Object.assign(_c, { body: _c.content, right, panel });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.note;
      base(_c);
      _c.body = body;
      const text = _c.note.querySelector('.ref-panel-text');
      if (text) text.classList.add('instruction');
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('main', 'stage cw-stage', _c.panel);
      stage.dataset.role = 'stage';
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('task-note', 'cw-note', 'instruction-toast');
        note.querySelector('.ref-note-text').classList.add('instruction');
        note.querySelector('.ref-note-x').classList.add('note-close');
        _c.note.replaceWith(note);
        _c.note = note;
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('cw-foot');
      _c.panel.appendChild(foot);
      const count = foot.querySelector('.ref-foot-text');
      count.classList.add('cw-count');
      const ctx = _c.ctx;
      const n = ctx.spec && ctx.spec.items ? ctx.spec.items.length
        : ctx.model && ctx.model.order ? ctx.model.order.length : null;
      count.textContent = n ? n + ' tiles' : 'Tiles';
      _c.foot = foot;
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
    name: 'design-reorder-items-grid-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-reorder-items-grid-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#3d5f93'],
      LOW_ACCENTS: ['#3d5f93'],
      parts,
    },
  });
})();

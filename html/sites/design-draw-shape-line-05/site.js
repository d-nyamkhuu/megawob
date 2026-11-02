(function () {
  'use strict';
  const palette = { bg: '#f6f7f9', panel: '#fff', fg: '#111820', muted: '#6c7380', line: '#e1e4e9' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
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
      document.body.className = 'design gnome' + (_c.display === 'toast' ? ' has-instruction-toast' : '');
      document.documentElement.style.setProperty('--font', '"Lato","Cantarell","Inter","Segoe UI","Helvetica Neue",Arial,sans-serif');
      const shell = u.el('div', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const ic = u.svg('svg', { class: 'app-icon', width: 28, height: 28, viewBox: '0 0 28 28' }, head);
      u.svg('rect', { x: 0, y: 0, width: 28, height: 28, rx: 7, fill: '#2879ed' }, ic);
      u.svg('path', { d: 'M8 19L9 11L14 7L19 10L20 18L16 21L8 20ZM10 17L15 10L17 12L13 18Z', fill: 'none', stroke: '#fff', 'stroke-width': 1.1, 'stroke-linejoin': 'round' }, ic);
      u.el('div', 'title', head, 'Sketch Task');
      const actions = u.el('div', 'head-actions', head);
      const controls = u.el('div', 'window-controls', head);
      const paths = { min: 'M2 8H12', max: 'M2.5 2.5H11.5V11.5H2.5Z', close: 'M2 2L12 12M12 2L2 12' };
      for (const k of ['min', 'max', 'close']) {
        const bt = u.el('button', 'wc', controls);
        bt.type = 'button';
        const s = u.svg('svg', { width: 18, height: 18, viewBox: '0 0 14 14', fill: 'none', stroke: '#222', 'stroke-width': 1.4 }, bt);
        u.svg('path', { d: paths[k] }, s);
        bt.onclick = () => env.log('window-control', { label: k });
      }
      const content = u.el('div', 'content', shell);
      const note = u.el('section', 'task-note', content);
      note.hidden = _c.display === 'hidden';
      if (_c.display === 'toast') note.classList.add('instruction-toast');
      if (_c.display === 'panel') note.classList.add('instruction-panel');
      Object.assign(_c, { shell, actions, content, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) text.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.actions;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.content;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const text = _c.header.querySelector('.ref-panel-text');
      if (text) text.classList.add('instruction');
      if (_c.display === 'header' || _c.display === 'panel') {
        const parent = _c.header.querySelector('.ref-panel') || _c.header;
        _c.util.el('p', 'note-sub', parent, 'Press and hold to draw a single, continuous line with the pencil tool.');
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const work = u.el('section', 'work', _c.content);
      const stage = u.el('main', 'stage', work);
      stage.dataset.role = 'stage';
      const aside = u.el('aside', 'tools', work);
      const pen = u.el('button', 'tool pencil', aside);
      pen.type = 'button';
      const ps = u.svg('svg', { width: 34, height: 34, viewBox: '0 0 24 24' }, pen);
      u.svg('path', { d: 'M3 21L4.8 14.5L15 4.3L19.7 9L9.5 19.2ZM16.3 3L17.1 2.2Q18.3 1 19.5 2.2L21.8 4.5Q23 5.7 21.8 6.9L21 7.7Z', fill: '#252d35' }, ps);
      const clr = u.el('button', 'tool clear', aside);
      clr.type = 'button';
      const cs = u.svg('svg', { width: 36, height: 36, viewBox: '0 0 24 24', fill: 'none', stroke: '#555d6a', 'stroke-width': 1.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, clr);
      u.svg('path', { d: 'M4 6H20M9 6V3.5H15V6M6 6V19.5Q6 21 7.5 21H16.5Q18 21 18 19.5V6M10 10V17M14 10V17' }, cs);
      u.el('span', '', clr, 'Clear');
      clr.onclick = () => { env.widgetDef.clear?.(); };
      Object.assign(_c, { work, stage });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.querySelector('.ref-note-text').classList.add('instruction');
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.work.appendChild(foot);
      foot.querySelector('.ref-foot-text').hidden = true;
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
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Reject optional' : 'Close');
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
    name: 'design-draw-shape-line-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-draw-shape-line-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2a6fe0'],
      LOW_ACCENTS: ['#2a6fe0'],
      parts,
    },
  });
})();

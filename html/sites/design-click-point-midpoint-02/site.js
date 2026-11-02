(function () {
  'use strict';
  const palette = { bg: '#251834', panel: '#251834', fg: '#f1ecf7', muted: '#a89bbb', line: '#3a2a52' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'precision-dark');
      document.body.classList.toggle('has-instruction-toast', _c.display === 'toast');
      document.body.classList.toggle('instruction-hidden', _c.display === 'hidden');
      document.documentElement.style.setProperty('--font', '"Segoe UI",Arial,sans-serif');
      const shell = u.el('div', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const logo = u.svg('svg', { class: 'app-icon', width: 18, height: 18, viewBox: '0 0 18 18' }, head);
      u.svg('rect', { x: 0, y: 0, width: 18, height: 18, rx: 2, fill: '#a88cd9' }, logo);
      u.svg('path', {
        d: 'M3 14L6 4H10L13 14M6 14L9 4H12L15 14M6 4V11Q6 14 9 14Q12 14 12 11V4',
        fill: 'none', stroke: '#f7f0ff', 'stroke-width': 1,
      }, logo);
      u.el('div', 'title', head, 'Point Practice');
      const controls = u.el('div', 'window-controls', head);
      const glyph = { min: 'M0 5H10', max: 'M0.5 0.5H9.5V9.5H0.5Z', close: 'M0 0L10 10M10 0L0 10' };
      for (const k of ['min', 'max', 'close']) {
        const bt = u.el('button', '', controls);
        bt.type = 'button';
        bt.setAttribute('aria-label', k);
        const s = u.svg('svg', { width: 10, height: 10, viewBox: '0 0 10 10', fill: 'none', stroke: 'currentColor', 'stroke-width': 1 }, bt);
        u.svg('path', { d: glyph[k] }, s);
        bt.onclick = () => env.log('window-control', { label: k });
      }
      const content = u.el('div', 'content', shell);
      const note = u.el('section', 'task-note', content);
      note.hidden = _c.display === 'hidden';
      if (_c.display === 'panel') note.classList.add('instruction-panel');
      Object.assign(_c, { shell, head, content, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.content; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const text = _c.header.querySelector('.ref-panel-text');
      if (text) text.classList.add('instruction');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.content);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction-toast');
        note.querySelector('.ref-note-text').classList.add('instruction');
        note.querySelector('.ref-note-x').classList.add('note-close');
        _c.content.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('footer');
      _c.shell.appendChild(footer);
      footer.querySelector('.ref-foot-text').remove();
      const ic = u.svg('svg', { class: 'foot-icon', width: 36, height: 36, viewBox: '0 0 36 36', fill: 'none', stroke: '#b9aed0', 'stroke-width': 2 }, footer);
      u.svg('circle', { cx: 18, cy: 18, r: 16 }, ic);
      u.svg('circle', { cx: 18, cy: 18, r: 6 }, ic);
      u.el('div', 'footer-copy', footer, 'Click on the canvas to choose a point.');
      const clear = u.el('button', 'clear', footer, 'Clear');
      clear.type = 'button';
      clear.onclick = () => { env.widgetDef.clear?.(); };
      footer.appendChild(footer.querySelector('.ref-tools'));
      _c.foot = footer;
    },
    'frame.floating': (base) => (_c) => { base(_c); },
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
    name: 'design-click-point-midpoint-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-point-midpoint-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ff7373'],
      LOW_ACCENTS: ['#ff7373'],
      parts,
    },
  });
})();

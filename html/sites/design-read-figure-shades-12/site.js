(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#f8f9fa', fg: '#1f2937', muted: '#77808a', line: '#e3e6e8' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.classList.add('r12');
      for (const mode of ['header', 'panel', 'toast', 'hidden']) {
        document.body.classList.toggle('instruction-' + mode, _c.display === mode);
      }
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'r-app', document.body);
      const top = u.el('header', 'r-top', app);
      u.el('span', 'r-name', top, 'Color Match');
      const status = u.el('div', 'r-status', top);
      u.el('span', '', status, 'Task 1 of 1');
      u.el('i', 'r-sep', status);
      const ps = u.el('span', 'r-paused', status);
      u.el('b', '', ps);
      u.el('b', '', ps);
      ps.appendChild(document.createTextNode('Paused'));
      const panes = u.el('div', 'r-panes', app);
      const left = u.el('section', 'r-left', panes);
      const right = u.el('aside', 'r-right', panes);
      Object.assign(_c, { app, status, panes, left, right, header: left });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.status;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.panes; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.right;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const stage = u.el('div', 'r-stage', _c.left);
      _c.stage = stage;
      const right = _c.right;
      const disc = u.el('div', 'r-disc', right);
      const svg = u.svg('svg', { width: 298, height: 296, viewBox: '0 0 298 296' }, disc);
      u.svg('path', {
        d: 'M105 111C104 102 112 100 149 100S194 102 193 111L191 135C188 169 179 190 158 200C156 212 159 221 167 223C178 226 181 228 181 237L182 244C182 252 117 252 117 244L118 237C118 228 121 226 132 223C140 221 142 212 140 200C118 189 111 167 107 135Z',
        fill: '#5bc8a7',
      }, svg);
      u.svg('path', {
        d: 'M107 123H83C84 154 98 180 125 180M191 123H215C214 154 200 180 173 180',
        fill: 'none', stroke: '#5bc8a7', 'stroke-width': 13, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      }, svg);
      u.svg('path', {
        d: 'M149 34v35M65 66l25 25M234 66l-25 25M38 172h32M229 172h32',
        fill: 'none', stroke: '#5bc8a7', 'stroke-width': 4.5, 'stroke-linecap': 'round',
      }, svg);
      u.el('h2', '', right, "You're doing great!");
      u.el('p', 'r-sub', right, 'Take a moment and look carefully at the tiles.');
      const toolWrap = u.el('div', 'r-tool-wrap', right);
      const ex = u.el('button', 'r-expand', toolWrap, '▼  Expand tools');
      ex.type = 'button';
      ex.setAttribute('aria-expanded', 'false');
      const tools = u.el('div', 'r-tools', toolWrap);
      tools.hidden = true;
      u.el('span', 'r-selection-count', tools, '0 selected');
      const clear = u.el('button', '', tools, 'Clear selection');
      clear.type = 'button';
      clear.addEventListener('click', () => stage.dispatchEvent(new Event('clear-selection')));
      ex.addEventListener('click', () => {
        tools.hidden = !tools.hidden;
        ex.textContent = tools.hidden ? '▼  Expand tools' : '▲  Collapse tools';
        ex.setAttribute('aria-expanded', String(!tools.hidden));
      });
      const toolNote = u.el('p', 'r-note', right,
        'Tools are hidden for a cleaner view. Click to show selection controls.');
      ex.addEventListener('click', () => {
        toolNote.style.visibility = tools.hidden ? 'visible' : 'hidden';
      });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) _c.right.prepend(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.querySelector('.ref-foot');
      foot.classList.add('r-foot');
      _c.app.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'Select all matching tiles.';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      if (ctx.initial) {
        const original = document.querySelector('.r-expand');
        const r = original.getBoundingClientRect();
        const el = u.el('div', 'r-initial-fold', document.body);
        el.style.left = r.left + 'px';
        el.style.top = r.top + 'px';
        const dismiss = u.el('button', 'r-expand', el, '▼  Expand tools');
        dismiss.type = 'button';
        dismiss.addEventListener('click', () => {
          if (original.getAttribute('aria-expanded') === 'false') original.click();
          ctx.dismiss();
        });
        return { el, dismiss };
      }
      const el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-read-figure-shades-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'banner' },
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#5fc9a5'], LOW_ACCENTS: ['#5fc9a5'], parts,
    },
  });
})();

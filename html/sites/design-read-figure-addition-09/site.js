(function () {
  'use strict';
  const palette = { bg: '#bfc2c7', panel: '#fff', fg: '#111318', muted: '#666a70', line: '#666a70' };
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
      // reset() reuses the body between episodes. Instruction layout classes
      // must describe only this episode, or panel/hidden grid rules accumulate.
      document.body.classList.remove('instruction-header', 'instruction-panel', 'instruction-toast', 'instruction-hidden');
      document.body.classList.add('electron', 'stagger', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg('rect', { x: 3, y: 2, width: 20, height: 22, rx: 3, fill: '#ee8520', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.svg('path', { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
      u.el('span', '', top, 'Math Notebook');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg('path', { d: kind === 'min' ? 'M3 12h14' : kind === 'max' ? 'M4 4h12v12H4z' : 'M4 4l12 12M16 4L4 16', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, svg);
      }
      u.el('nav', 'menu', top, 'Notebook    Problems    Draw    Highlight    Erase');
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, top, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.center.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
      const spacer = _c.center.querySelector('.ref-spacer');
      if (spacer) spacer.remove();
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.center.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('aside', 'episode-panel');
        panel.querySelector('.ref-panel-title').textContent = 'Notes';
        panel.querySelector('.ref-panel-text').classList.add('aside-copy');
      }
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('section', 'stage', _c.center); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief', 'instruction-toast');
        note.setAttribute('role', 'status');
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'bottom', _c.app);
      const docktools = u.el('div', 'dock-tools', footer);
      [ ['eraser', 'Eraser'], ['pencil', 'Pencil'], ['undo', 'Undo'], ['redo', 'Redo'] ].forEach(([kind, label]) => {
        const item = u.el('div', 'dock-tool ' + kind, docktools);
        const svg = u.svg('svg', { viewBox: '0 0 64 64', width: 64, height: 64 }, item);
        if (kind === 'eraser') {
          u.svg('polygon', { points: '10,43 39,13 56,18 56,34 29,53 12,53', fill: '#f8f8f8', stroke: '#333', 'stroke-width': 2 }, svg);
        } else if (kind === 'pencil') {
          u.svg('polygon', { points: '8,51 17,48 49,10 43,5 12,43', fill: '#e9b843', stroke: '#222', 'stroke-width': 2 }, svg);
          u.svg('polygon', { points: '8,51 12,43 17,48', fill: '#222' }, svg);
          u.svg('polygon', { points: '43,5 49,10 54,4 48,0', fill: '#e76f62', stroke: '#222', 'stroke-width': 1 }, svg);
        } else {
          u.svg('path', { d: kind === 'undo' ? 'M26 16L9 31l17 15V35c17 0 23 7 29 20-1-24-10-35-29-35z' : 'M38 16l17 15-17 15V35c-17 0-23 7-29 20 1-24 10-35 29-35z', fill: '#aeb1b5', stroke: '#62666b', 'stroke-width': 2 }, svg);
        }
        u.el('span', 'dock-tool-label', item, label);
      });
      const clear = u.el('button', 'clear-all', footer, 'Clear All');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const input = document.querySelector('.addition-content input');
        if (input) {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      // Keep auxiliary actions on the Tools strip, leaving the title area's
      // end control clear of the panel and corner instruction cards.
      const tools = foot.querySelector('.ref-tools');
      for (const button of _c.headerTools.querySelectorAll('.ref-xtra')) tools.prepend(button);
      Object.assign(_c, { footer, foot });
    },
    'frame.floating': (base) => (_c) => { base(_c); },
    'frame.end': (base) => (_c) => {
      const result = base(_c);
      // The addition widget moves its submit reference into the scene.
      // Give it a positioning wrapper, preserving the template button and
      // its chrome coordinates without observing or changing widget DOM.
      if (_c.submit) {
        const button = _c.submit;
        const rect = button.getBoundingClientRect();
        const kind = _c.placement === 'footer' || _c.placement === 'link' ? ' ref-foot' :
          _c.placement === 'floating' ? ' ref-float-dock' : '';
        const anchor = _c.util.el('div', 'site-end-anchor' + kind);
        button.parentNode.insertBefore(anchor, button);
        anchor.appendChild(button);
        anchor.style.setProperty('--end-left', rect.left + 'px');
        anchor.style.setProperty('--end-top', rect.top + 'px');
        anchor.style.setProperty('--end-width', rect.width + 'px');
        anchor.style.setProperty('--end-height', rect.height + 'px');
        return { ...result, submit: anchor };
      }
      return result;
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
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
    name: 'design-read-figure-addition-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-addition-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#3977d5'],
      LOW_ACCENTS: ['#3977d5'],
      parts,
    },
  });
})();

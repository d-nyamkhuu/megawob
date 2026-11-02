(function () {
  'use strict';
  const palette = { bg: '#dfdcf7', panel: '#f4f8f7', fg: '#111a2e', muted: '#5d6676', line: '#d7e4de' };
  const parts = {
    'frame.theme': (base) => (_c) => {
      base(_c);
      _c.root.style.setProperty('--font', "Arial, 'Segoe UI', sans-serif");
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'design pastel';
      const shell = u.el('div', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const logo = u.svg('svg', {
        class: 'logo', width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none',
        stroke: '#cf72b3', 'stroke-width': 2, 'stroke-linejoin': 'round',
      }, head);
      u.svg('path', { d: 'M12 3L22 20H2Z' }, logo);
      u.svg('path', { d: 'M12 9L17 18H7Z', stroke: '#b398d6', 'stroke-width': 1.3 }, logo);
      u.el('div', 'title', head, 'GeoPractice');
      u.el('div', 'subtitle', head, 'Simple geometry exercises');
      const controls = u.el('div', 'window-controls', head);
      for (const [label, d] of [
        ['minimize', 'M3 12H17'], ['maximize', 'M4 4H16V16H4Z'], ['close', 'M3 3L17 17M17 3L3 17'],
      ]) {
        const bt = u.el('button', '', controls);
        bt.type = 'button';
        bt.setAttribute('aria-label', label);
        const s = u.svg('svg', {
          width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none', stroke: '#1b2236',
          'stroke-width': 1.7, 'stroke-linejoin': 'round',
        }, bt);
        u.svg('path', { d }, s);
        bt.onclick = () => env.log('window-control', { label });
      }
      const toolbar = u.el('div', 'end-toolbar', head);
      const content = u.el('div', 'content', shell);
      const main = u.el('div', 'main', content);
      Object.assign(_c, { shell, head, toolbar, body: content, main, header: main });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') _c.util.el('div', 'note-placeholder', _c.main);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const aside = u.el('aside', 'aside', _c.body);
      const view = u.el('section', 'card view', aside);
      u.el('h3', '', view, 'View Options');
      for (const [text, on] of [['Show grid', true], ['Show coordinates', false], ['Snap to grid', false]]) {
        const l = u.el('label', 'opt', view);
        const input = u.el('input', '', l);
        input.type = 'checkbox';
        input.checked = on;
        input.dataset.option = text;
        input.onchange = () => {
          if (text === 'Show grid') _c.stage.classList.toggle('grid-hidden', !input.checked);
          if (text === 'Show coordinates') _c.stage.classList.toggle('coordinates-shown', input.checked);
        };
        u.el('span', '', l, text);
      }
      const save = u.el('button', 'save', view, 'Save view');
      save.type = 'button';
      save.onclick = () => env.log('save-view', {});
      u.el('div', 'save-note', view, 'Saves only presentation preferences.');
      const task = u.el('section', 'card task', aside);
      Object.assign(_c, { aside, task });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.task;
      base(_c);
      _c.body = body;
      const u = _c.util;
      if (_c.display !== 'panel') {
        u.el('h3', '', _c.task, 'Your Task');
        u.el('p', 'workspace-copy', _c.task, 'A workspace for your geometry exercises.');
      }
      const tip = u.el('div', 'tip', _c.task);
      const cur = u.svg('svg', {
        width: 34, height: 40, viewBox: '0 0 32 38', fill: 'none', stroke: '#1b2236',
        'stroke-width': 2, 'stroke-linejoin': 'round',
      }, tip);
      u.svg('path', { d: 'M5 3V29L12 23L17 34L22 32L17 21H26Z' }, cur);
      u.el('span', '', tip, 'Use your mouse to click on the correct point.');
      const clear = u.el('button', 'clear', _c.task, 'Clear');
      clear.type = 'button';
      clear.onclick = () => env.widgetDef.clear?.();
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.main);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.shell.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.task.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.shell.appendChild(dock);
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
    name: 'design-click-point-midpoint-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-point-midpoint-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#7c5cdb'],
      LOW_ACCENTS: ['#7c5cdb'],
      parts,
    },
  });
})();

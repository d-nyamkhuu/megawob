(function () {
  'use strict';
  const palette = {
    bg: '#f6f7f9', panel: '#ffffff', fg: '#1b1f27', muted: '#6a707b', line: '#e1e4ea',
  };
  const parts = {
    'frame.theme': (base) => (_c) => {
      base(_c);
      _c.root.style.setProperty('--font', "'Segoe UI Variable','Segoe UI',Arial,sans-serif");
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'design fluent' + (_c.display === 'toast' ? ' has-instruction-toast' : '');
      const shell = u.el('div', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const logo = u.svg('svg', { class: 'logo', width: 28, height: 28, viewBox: '0 0 28 28' }, head);
      u.svg('circle', { cx: 14, cy: 14, r: 13, fill: '#0875f5' }, logo);
      u.svg('path', {
        d: 'M8.5 22L14 8L19.5 22M10.5 16.5Q14 18 17.5 16.5M14 5V8',
        fill: 'none', stroke: '#fff', 'stroke-width': 1.5, 'stroke-linejoin': 'round',
      }, logo);
      u.svg('circle', { cx: 14, cy: 8, r: 1.7, fill: '#fff' }, logo);
      u.el('div', 'title', head, 'Geometry Practice');
      const controls = u.el('div', 'window-controls', head);
      for (const [name, d] of [
        ['min', 'M3 10H17'], ['max', 'M4 4H16V16H4Z'], ['close', 'M3 3L17 17M17 3L3 17'],
      ]) {
        const bt = u.el('button', '', controls);
        bt.type = 'button';
        bt.onclick = () => env.log('window-control', { label: name });
        const s = u.svg('svg', {
          width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none', stroke: '#1b1f27', 'stroke-width': 1.4,
        }, bt);
        u.svg('path', { d }, s);
      }
      // Build the existing bottom toolbar early so frame.tools can use it.
      const footer = u.el('footer', 'footer', shell);
      const tools = u.el('div', 'tools', footer);
      const mk = (label, d, sel) => {
        const bt = u.el('button', 'tool' + (sel ? ' selected' : ''), tools);
        bt.type = 'button';
        const s = u.svg('svg', {
          width: 30, height: 30, viewBox: '0 0 32 32', fill: 'none', stroke: '#1b1f27',
          'stroke-width': 1.7, 'stroke-linejoin': 'round',
        }, bt);
        u.svg('path', { d }, s);
        u.el('span', '', bt, label);
        return bt;
      };
      const ptr = mk('Pointer', 'M7 2L7 27L13 21L17 30L21 28L17 19L26 19Z', true);
      const pan = mk('Pan', 'M11 17V7Q11 3 14 5V15V4Q14 1 17 3V15V5Q17 2 20 5V16V8Q20 5 23 8V19L24 13Q27 10 27 14V22Q26 30 18 30Q12 30 9 25L4 18Q2 14 5 14Q7 14 11 19');
      const clr = mk('Clear', 'M4 19L17 5Q18 4 19 5L29 14Q30 15 29 16L17 29Q16 30 15 29L4 21Z M10 13L23 25');
      for (const bt of [ptr, pan]) bt.onclick = () => {
        ptr.classList.toggle('selected', bt === ptr);
        pan.classList.toggle('selected', bt === pan);
      };
      clr.onclick = () => { env.widgetDef.clear?.(); };
      u.el('span', 'divider', footer);
      u.el('span', 'spacer', footer);
      const hints = u.el('label', 'hints', footer);
      const cb = u.el('input', '', hints);
      cb.type = 'checkbox';
      u.el('span', '', hints, 'Show hints');
      Object.assign(_c, { shell, footer, header: head });
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.footer;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'content', _c.shell);
      _c.shell.insertBefore(body, _c.footer);
      Object.assign(_c, { body });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note');
        panel.querySelector('.ref-panel-title').textContent = 'Task 1 of 1';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) note.classList.add('instruction-toast');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.footer.insertBefore(foot, _c.footer.querySelector('.hints'));
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.prepend(dock);
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
    name: 'design-click-point-center-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-point-center-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0064ed'],
      LOW_ACCENTS: ['#0064ed'],
      parts,
    },
  });
})();

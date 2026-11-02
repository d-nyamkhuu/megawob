// GEM terminal design: custom title gadgets, GEM prompt, and unfiltered workspace file catalog.
(function () {
  'use strict';

  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-terminal-10',
    name: 'design',
    split: 'train',
    scenarios: ['terminal'],
    traits: { meta: true },
    template: 'use-desktop-tools/workspace',
    design: {
      host: 'user@gem',
      placeholder: ' ',
      parts: {
        frame: () => (ctx) => {
          const u = ctx.util;
          const win = u.el('section', 'at-win', ctx.stage);
          const title = u.el('div', 'at-title', win);
          u.el('b', '', title, 'Terminal');
          const gadgets = u.el('div', 'gem-window-gadgets', title);
          u.el('span', '', gadgets, 'T');
          u.el('span', '', gadgets, '✳');
          const body = u.el('div', 'at-body', win);
          const main = u.el('div', 'at-main', body);
          const gear = u.el('button', '', title);
          gear.hidden = true;
          return { win, title, main, gear, appMenu: null };
        },
        termTabs: (base) => (X) => {
          base(X);
          X.tabs.lastChild.textContent = 'user@workspace';
        },
        termWelcome: () => (X) => {
          const { spec } = X;
          X.line('', 'Workspace file catalog');
          X.line('out', 'total ' + spec.files.length);
          for (const f of spec.files)
            X.line('out', '-rw-r--r--   1 user  staff  ' + String(f.length * 160).padStart(5) + ' Apr 14 10:12  ' + f);
        },
        termPaintStart: () => (X, m) => {
          const folder = document.querySelector('[data-info="folder"]');
          if (folder) folder.textContent = m.cwd ? '~/' + m.cwd : '~';
          const status = document.querySelector('[data-info="status"]');
          if (status) status.textContent = m.history.length ? 'Active' : 'Ready';
        },
      },
    },
  });
})();

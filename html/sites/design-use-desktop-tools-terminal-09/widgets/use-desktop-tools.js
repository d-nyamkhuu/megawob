// Terminal design with the site's custom shell title bar and seeded file listing.
(function () {
  'use strict';

  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-terminal-09',
    name: 'design',
    split: 'train',
    scenarios: ['terminal'],
    traits: { meta: true },
    template: 'use-desktop-tools/workspace',
    design: {
      psClass: 'tm-prompt-text',
      parts: {
        frame: (base, S) => (ctx) => {
          const { util } = ctx;
          const win = util.el('section', 'at-win', ctx.stage);
          const title = util.el('div', 'at-title', win);
          util.el('span', 'tm-terminal-icon', title, '›_');
          util.el('b', '', title, 'Terminal');
          const controls = util.el('div', 'tm-terminal-controls', title);
          util.el('span', 'tm-shell-label', controls, 'bash');
          util.el('span', 'tm-chevron', controls);
          ['min', 'max', 'close'].forEach((t) => util.el('span', `tm-wb tm-${t}`, controls));
          const body = util.el('div', 'at-body', win);
          const main = util.el('div', 'at-main', body);
          const gear = util.el('button', '', title);
          gear.hidden = true;
          return { win, title, main, gear, appMenu: null };
        },
        termWelcome: () => (X, m) => {
          if (X.ctx.model.history.some((h) => /^ls\s+-l/.test(h.cmd))) return;
          const pwd = X.line('', '');
          pwd.innerHTML = X.psHtml('') + ' pwd';
          X.line('out', '/home/user');
          const ls = X.line('tm-session-gap', '');
          ls.innerHTML = X.psHtml('') + ' ls -la';
          if (X.spec.meta) {
            const listing = X.fam.run({ ...m, cwd: '' }, X.spec, 'ls -la');
            for (const text of listing.history[listing.history.length - 1].out) X.line('out', text);
          } else {
            for (const f of X.spec.files) X.line('out', '-rw-r--r--  1 user user  ~/' + f);
          }
        },
        termPaintEnd: (base) => (X, m) => {
          base(X, m);
          X.prompt.classList.toggle('has-command', Boolean(m.line));
          const directory = document.querySelector('.tm-directory');
          if (directory) directory.textContent = '/home/user' + (m.cwd ? '/' + m.cwd : '');
        },
      },
    },
  });
})();

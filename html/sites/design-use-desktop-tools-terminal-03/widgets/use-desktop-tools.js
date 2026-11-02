// Terminal workspace design: a KDE prompt, seeded ls-style welcome listing, and directory/reset footer hooks.
(function () {
  'use strict';

  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-terminal-03',
    name: 'design',
    split: 'train',
    scenarios: ['terminal'],
    template: 'use-desktop-tools/workspace',
    design: {
      host: 'user@kde',
      placeholder: ' ',
      parts: {
        termTabs: (base) => (X) => {
          base(X);
          X.tabs.children[1].textContent = 'user@workspace';
        },
        termPs: () => (X, cwd) => `<span class="at-ps">user@kde:${cwd ? '~/' + cwd : '~'}$</span>`,
        termWelcome: () => (X) => {
          const { spec, util } = X;
          // Always show the workspace root, independently of the requested file.
          const command = X.line('', '');
          command.innerHTML = X.psHtml('') + ' ls -la';
          const entries = new Map();
          for (const path of spec.files) {
            const parts = path.split('/');
            const name = parts[0];
            if (!entries.has(name)) entries.set(name, []);
            if (parts.length > 1) entries.get(name).push(path);
          }
          X.line('out', 'total ' + entries.size * 4);
          for (const name of ['.', '..']) {
            const row = X.line('out', 'drwxr-xr-x  3 user user 4096 Apr 25 10:14 ');
            util.el('span', 'at-directory', row, name);
          }
          let index = 0;
          for (const [name, children] of entries) {
            const dir = children.length > 0;
            const metadata = `${dir ? 'drwxr-xr-x' : '-rw-r--r--'}  ${dir ? '2' : '1'} user user ${String(dir ? 4096 : [523, 2048, 1520][index++ % 3]).padStart(4)} Apr 24 16:03 `;
            if (!dir) {
              X.line('out', metadata + name);
              continue;
            }
            const group = util.el('details', 'at-directory-group', X.lines);
            const row = util.el('summary', 'at-tl out', group, metadata);
            util.el('span', 'at-directory', row, name);
            row.title = 'Show files in ' + name;
            for (const path of children) util.el('div', 'at-tl out at-child', group, '-rw-r--r--  1 user user  523 Apr 24 16:03 ' + path);
          }
        },
        termInput: () => (X) => {
          const reset = document.querySelector('.kb-reset');
          if (!reset) return;
          reset.title = 'Reset command line';
          reset.addEventListener('click', () => {
            X.ctx.update({ ...X.ctx.model, line: '' });
            X.field.set('');
            for (const group of X.lines.querySelectorAll('details')) group.open = false;
            X.input.focus({ preventScroll: true });
          });
        },
        termPaintEnd: (base) => (X, m) => {
          base(X, m);
          const directory = document.querySelector('.kb-cd2');
          if (directory) directory.textContent = '/home/user' + (m.cwd ? '/' + m.cwd : '');
        },
      },
    },
  });
})();

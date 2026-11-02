// NetGuide design with its seeded directory snapshot and classic terminal prompt.
(function () {
  'use strict';

  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-terminal-06',
    name: 'design',
    split: 'train',
    scenarios: ['terminal'],
    traits: { meta: true },
    template: 'use-desktop-tools/workspace',
    design: {
      host: 'user@netguide',
      placeholder: ' ',
      focusLine: true,
      parts: {
        termTabs: () => (X) => {
          X.util.el('span', 'on', X.tabs, 'bash');
          X.util.el('span', '', X.tabs, 'user@workspace');
        },

        termReady: () => (X) => {
          X.initialCwd = X.ctx.model.cwd || '';
          X.fitted = false;
        },

        termWelcome: () => (X) => {
          const { ctx, spec, line, psHtml, util, sc } = X;
          // Show the initial directory's contents independently of the requested file.
          const prefix = X.initialCwd ? X.initialCwd + '/' : '';
          const child = (path) => path.startsWith(prefix) && !path.slice(prefix.length).includes('/');
          const entries = [
            ...spec.files.filter(child).map((path) => ({ path, name: path.slice(prefix.length), directory: false })),
            ...spec.dirs.filter(child).map((path) => ({ path, name: path.slice(prefix.length), directory: true })),
          ].sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);

          if (!X.fitted) {
            sc.style.setProperty('--fit-font', `${Math.max(12, (ctx.size.height - 65) / ((entries.length + 7.25) * 1.25))}px`);
            X.fitted = true;
          }

          const pwd = line('', '');
          pwd.innerHTML = psHtml(X.initialCwd) + ' pwd';
          line('out', '/home/user' + (X.initialCwd ? '/' + X.initialCwd : ''));
          line('', '');
          const ls = line('', '');
          ls.innerHTML = psHtml(X.initialCwd) + ' ls -l';
          line('out', 'total ' + entries.length);

          for (const f of entries) {
            const row = line('out at-listing', '');
            const meta = spec.meta && spec.meta[f.path] || {};
            const size = meta.size == null ? '-' : String(meta.size).padStart(7);
            const mtime = meta.mtime == null ? '-- -- --:--' : meta.mtime;
            row.append((f.directory ? 'drwxr-xr-x' : '-rw-r--r--') + '  1 user  user  ' + size + ' ' + mtime + '  ');
            util.el('span', 'at-file-name', row, f.name);
          }
        },

        termPaintEnd: () => (X) => {
          X.prompt.style.setProperty('--prompt-width', `${X.ps.textContent.length + .6}ch`);
        },
      },
    },
  });
})();

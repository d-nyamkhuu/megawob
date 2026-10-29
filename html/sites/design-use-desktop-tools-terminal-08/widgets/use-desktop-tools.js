// Terminal design with a goal-independent workspace listing and hint and reset controls.
(function () {
  'use strict';

  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-terminal-08',
    name: 'design',
    split: 'train',
    scenarios: ['terminal'],
    template: 'use-desktop-tools/workspace',
    design: {
      parts: {
        termTabs: (base) => (X) => {
          base(X);
          X.tabs.children[0].innerHTML = '<svg viewBox="0 0 24 24"><path d="m3 5 6 7-6 7m10 0h9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>Terminal';
        },
        termInput: () => (X) => {
          const reset = document.querySelector('.mp-btn.reset');
          const hint = document.querySelector('.mp-btn.hint');
          if (reset) {
            reset.title = 'Reset command line';
            reset.addEventListener('click', () => {
              const m = X.fam.run(X.ctx.model, X.spec, 'clear');
              X.ctx.update(m);
              X.paint(m);
              X.input.focus({ preventScroll: true });
            });
          }
          if (hint) {
            X.designHint = false;
            hint.addEventListener('click', () => {
              X.designHint = !X.designHint;
              X.shown = null;
              X.paint(X.ctx.model);
            });
          }
          const previewFile = X.spec.files.find((path) => path.endsWith('.html'));
          if (previewFile) {
            const preview = document.querySelector('.mp-pf');
            if (preview) preview.textContent = previewFile.split('/').pop();
          }
        },
        termWelcome: () => (X) => {
          const { spec } = X;
          X.line('dim', `Last login: ${spec.login}`);
          X.line('dim', 'Files in this workspace:');
          X.line('out', 'total ' + spec.files.length);
          for (const path of spec.files) X.line('out', '-rw-r--r--  1 user user  ~/' + path);
          if (X.designHint) {
            X.line('dim', 'Commands: pwd, ls, cd, rm, mv, help, clear');
            X.line('dim', 'Workspace paths:');
            for (const path of spec.files) X.line('out', '~/' + path);
          }
        },
        termPaintEnd: (base) => (X, m) => {
          base(X, m);
          X.prompt.classList.toggle('empty', !m.line);
        },
      },
    },
  });
})();

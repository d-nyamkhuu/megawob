// Terminal design: BeOS-style shell with a seeded file listing and Clear/Reset controls.
(function () {
  'use strict';

  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-terminal-04',
    name: 'design',
    split: 'train',
    scenarios: ['terminal'],
    template: 'use-desktop-tools/workspace',
    design: {
      placeholder: ' ',
      parts: {
        termPs: (base, S) => (X, cwd) =>
          `<span class="at-ps">${S.D.host}</span><span class="at-colon">:</span><span class="at-pc">${cwd ? '~/' + cwd : '~'}</span>$`,

        termReady: () => (X) => {
          const { ctx, util, spec, sc } = X;
          const footer = document.querySelector('.design-footer');
          X.startupVisible = ctx.model.cleared === 0;
          X.startupKey = null;

          const clear = util.el('button', 'terminal-clear terminal-control', footer, 'Clear');
          const reset = util.el('button', 'terminal-reset terminal-control', footer, 'Reset');
          clear.type = reset.type = 'button';
          clear.addEventListener('click', () => {
            X.startupVisible = false;
            const m = { ...ctx.model, line: '', cleared: ctx.model.history.length };
            ctx.update(m);
            X.paint(m);
          });
          reset.addEventListener('click', () => {
            // Reset the shell session, keeping file operations intact.
            const m = { ...ctx.model, line: '', cwd: '', cleared: ctx.model.history.length };
            X.startupVisible = true;
            X.shown = null;
            ctx.update(m);
            X.paint(m);
          });

          // Fit the complete seeded startup listing without losing its first rows.
          sc.style.fontSize = `min(clamp(16px,1.67vw,28px), ${(sc.clientHeight - 38) / ((spec.files.length + 3) * 1.24)}px)`;

          const cursor = util.el('span', 'at-block-cursor', X.prompt);
          cursor.setAttribute('aria-hidden', 'true');
        },

        termWelcome: () => (X) => {
          const { spec, line } = X;
          if (!X.startupVisible) return;
          const heading = line('', '');
          heading.innerHTML = X.psHtml('') + ' ls -R';
          for (const f of spec.files) {
            const row = line('out', '');
            X.util.el('span', 'at-permissions', row, '-rw-r--r--  1 user user   ');
            row.append('~/' + f);
          }
        },

        termEnter: () => (X) => {
          if (X.input.value.trim() === 'clear') X.startupVisible = false;
        },

        termPaintStart: () => (X, m) => {
          const key = `${m.history.length}/${m.cleared}/${X.startupVisible}`;
          X.pendingWelcome = key !== X.startupKey && X.startupVisible && m.cleared !== 0;
          if (key !== X.startupKey) {
            X.startupKey = key;
            X.shown = null;
          }
        },

        termPaintEnd: () => (X, m) => {
          if (!X.pendingWelcome) return;
          X.pendingWelcome = false;
          const fragment = document.createDocumentFragment();
          const heading = X.line('', '');
          // Move the heading into a fragment while preserving the template's line builder.
          fragment.append(heading);
          heading.innerHTML = X.psHtml('') + ' ls -R';
          for (const f of X.spec.files) {
            const row = X.util.el('div', 'at-tl out', fragment);
            X.util.el('span', 'at-permissions', row, '-rw-r--r--  1 user user   ');
            row.append('~/' + f);
          }
          X.lines.prepend(fragment);
        },
      },
    },
  });
})();

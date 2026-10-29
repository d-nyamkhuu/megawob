// Design of this site on the use-desktop-tools/workspace template: a terminal with a toolbar, a task-controls strip and a
// preferences panel around it; the controls are folded behind a button until it is pressed.
(function () {
  'use strict';
  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-terminal-12',
    name: 'design',
    split: 'train',
    scenarios: ['terminal'],
    template: 'use-desktop-tools/workspace',
    design: {
      focusLine: true,
      linesClass: 'at-history',
      reveal: 'terminal',
      parts: {
        frameEnd: () => (F) => {
          const u = F.ctx.util, win = F.win, title = F.title;
          u.el('span', 'tc-cwd', title, '~/projects');
          const wb = u.el('div', 'tc-wbtns', title);
          u.el('i', '', wb, '–');
          u.el('i', '', wb, '□');
          u.el('i', 'x', wb, '✕');
          const tools = u.el('div', 'tc-tools', win);
          for (const [k, n] of [['new', 'New'], ['open', 'Open'], ['gear', 'Settings'], ['help', 'Help']]) {
            const t = u.el('div', 'tc-tool', tools);
            u.el('span', 'tc-ico ' + k, t, k === 'help' ? '?' : k === 'gear' ? '⚙' : '');
            u.el('em', '', t, n);
          }
          const tcp = u.el('div', 'tc-panel', win);
          u.el('span', 'tc-tri', tcp, '▶');
          const tt = u.el('div', 'tc-ttl', tcp);
          u.el('b', '', tt, 'Task controls');
          u.el('span', '', tt, ' (hidden)');
          u.el('div', 'tc-sub', tcp, 'Show the controls to complete the task (timer, hints, etc.).');
          const pf = u.el('div', 'pf-panel', win);
          const ph = u.el('div', 'pf-head', pf);
          u.el('span', 'tc-tri', ph, '▼');
          u.el('b', '', ph, 'Preferences');
          const pl = u.el('div', 'pf-left', pf);
          const r1 = u.el('div', 'pf-row', pl);
          u.el('label', '', r1, 'Theme:');
          u.el('div', 'pf-sel', r1, 'Sky Blue');
          const r2 = u.el('div', 'pf-row', pl);
          u.el('label', '', r2, 'Font size:');
          u.el('div', 'pf-sel', r2, '14 px');
          const pr = u.el('div', 'pf-right', pf);
          for (const [n, c] of [['Show line numbers', false], ['Enable sound', true], ['Wrap long lines', false]]) {
            const l = u.el('label', 'pf-chk', pr);
            const cb = u.el('input', '', l);
            cb.type = 'checkbox';
            cb.checked = c;
            l.append(' ' + n);
          }
        },
        termWelcome: () => (X) => {
          const { util, lines, spec } = X;
          const listingPrompt = X.line('', '');
          listingPrompt.innerHTML = X.psHtml('') + ' ls -R';
          const listing = util.el('div', 'at-workspace-list', lines);
          for (const f of spec.files) util.el('div', 'at-tl out', listing, '~/' + f);
        },
        termPaintEnd: () => (X, m) => {
          const cwdLabel = X.ctx.stage.querySelector('.tc-cwd');
          if (cwdLabel) cwdLabel.textContent = m.cwd ? '~/' + m.cwd : '~';
          const controlsLabel = X.ctx.stage.querySelector('.tc-ttl span');
          if (controlsLabel) controlsLabel.textContent = m.designOpen ? ' (shown)' : ' (hidden)';
        },
        termScroll: () => (X, m) => { X.sc.scrollTop = m.history.length || m.designOpen ? X.sc.scrollHeight : 0; },
      },
    },
  });
})();

// Design on templates/site/form-text-login-01.js: only what this site changed.
(function () {
  'use strict';
  const icon = (kind) => {
    const shapes = {
      file: '<path d="M5 2h13l6 6v22H5z" fill="#fff" stroke="#6483a5"/><path d="M18 2v7h6" fill="#e3effa" stroke="#6483a5"/>',
      edit: '<path d="M4 25 21 3l6 5L10 29l-7 2z" fill="url(#gold)" stroke="#7e795b"/><path d="m21 3 3-2 6 5-3 3" fill="#efb5a4" stroke="#9b7770"/><path d="m4 25 6 4-7 2z" fill="#ecdfbf"/><path d="m3 31 2-5 3 4z" fill="#3d474d"/>',
      delete: '<path d="m5 5 22 22m0-22L5 27" stroke="#8d2820" stroke-width="6"/><path d="m5 4 22 22m0-22L5 26" stroke="#f44933" stroke-width="4"/>',
      check: '<path d="m3 16 8 8L28 4" fill="none" stroke="#508a24" stroke-width="7" stroke-linejoin="round"/><path d="m3 15 8 8L28 3" fill="none" stroke="url(#green)" stroke-width="5" stroke-linejoin="round"/>',
      up: '<path d="M16 2 3 16h8v15h10V16h8z" fill="url(#blue)" stroke="#2b65ad"/>',
      down: '<path d="M11 1h10v15h8L16 30 3 16h8z" fill="url(#blue)" stroke="#2b65ad"/>',
      categories: '<path d="M2 2h11v11H2z" fill="#32b9f4" stroke="#1483bd"/><path d="M19 2h11v11H19z" fill="#ffe94a" stroke="#ba9a12"/><path d="M2 19h11v11H2z" fill="#3676f5" stroke="#2056b5"/><path d="M19 19h11v11H19z" fill="#ff6b28" stroke="#be4a12"/><path d="M4 4h7M21 4h7M4 21h7M21 21h7" stroke="#fff"/>',
    };
    return '<svg viewBox="0 0 32 33" aria-hidden="true"><defs><linearGradient id="gold" x2="1" y2="1"><stop stop-color="#ffffc2"/><stop offset=".5" stop-color="#f5cf55"/><stop offset="1" stop-color="#d49b28"/></linearGradient><linearGradient id="blue" x2="1" y2="1"><stop stop-color="#d4f6ff"/><stop offset=".5" stop-color="#65b8ff"/><stop offset="1" stop-color="#2471db"/></linearGradient><linearGradient id="green" x2="0" y2="1"><stop stop-color="#d4ee83"/><stop offset="1" stop-color="#70b533"/></linearGradient></defs>' + shapes[kind] + '</svg>';
  };
  env.site({
    name: 'design-set-date-segmented-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/type-text-login-01',
    design: {
      C: {
        'site': 'design-set-date-segmented-05',
        'brand': 'Personal Tasks',
        'title': 'Project Task',
        'instruction': 'left',
        'rail': '',
        'menu': 'Project Task',
        'briefTitle': 'Instructions',
      },
      parts: {
        overlay: (base) => function (ctx) {
          const result = base(ctx);
          if (ctx.kind === 'banner' && result && result.el) {
            result.el.classList.add('vista-announcement');
            document.body.style.setProperty('--banner-extra', 'calc(48 * var(--u))');
            if (result.dismiss) {
              result.dismiss.classList.add('vista-announcement-close');
              result.dismiss.setAttribute('aria-label', result.dismiss.textContent || 'Close');
              result.dismiss.textContent = '×';
              result.dismiss.addEventListener('click', () => document.body.style.setProperty('--banner-extra', '0px'));
            }
          }
          return result;
        },
        'frame.5': (base, S) =>
          function (_c) {
            const { ctx, u } = _c;
            const endRng = ctx.rng.fork('chrome/end');
            const collideRng = ctx.rng.fork('chrome/collide');
            const labels =
              ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                ? ctx.content.END_LABELS
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
            const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
            const label = labelOf(endRng.pick(labels));
            const placement = endRng.pick(['footer', 'footer', 'header', 'link']);
            const collide = collideRng.bool(0.3)
              ? labelOf(
                  collideRng.pick(labels.filter((x) => labelOf(x).trim().toLowerCase() !== label.trim().toLowerCase())),
                )
              : null;
            const top = u.el('header', 'ds-top', document.body);
            Object.assign(_c, { collide, collideRng, endRng, label, labelOf, labels, placement, top });
          },
        'frame.23': (base, S) =>
          function (_c) {
            const { collide, ctx, foot, label, placement, top, u } = _c;
            const endButton = (parent, cls, text) => {
              const b = u.el(cls === 'ds-submit-link' ? 'a' : 'button', cls, parent, text);
              if (b.tagName === 'BUTTON') b.type = 'button';
              else b.href = '#';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', label);
              b.title = label;
              b.addEventListener('click', (e) => {
                e.preventDefault();
                ctx.submit();
              });
              return b;
            };
            if (collide) {
              const d = u.el('button', 'ds-pq', foot, collide);
              d.type = 'button';
              d.dataset.role = 'xtra';
              d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
            }
            if (!ctx.finish) {
              if (placement === 'header') {
                _c.submit = endButton(top, 'ds-submit ds-submit-header', label);
              } else if (placement === 'link') {
                _c.submit = endButton(foot, 'ds-submit-link', label + ' ›');
              } else {
                _c.submit = endButton(foot, 'ds-submit', label);
              }
            }
            Object.assign(_c, { endButton });
            document.body.classList.add('vista-window');
            document.body.dataset.instruction = ctx.display;
            const stage = document.querySelector('.ds-stage');
            if (stage) document.body.append(stage);
            const brief = document.querySelector('.ds-brief');
            if (brief) document.body.append(brief);
            // Keep the template's episode note, presenting it in this window's native style.
            const mode = ctx.display || 'header';
            for (const el of document.body.querySelectorAll('*')) {
              if (el.children.length === 0 && el.textContent.trim() === ctx.instruction) {
                const shell = el.closest('.ds-brief, .ds-toast, .ds-note');
                (shell || el).style.setProperty('display', 'none', 'important');
              }
            }
            if (brief) brief.style.setProperty('display', 'none', 'important');
            if (mode !== 'hidden') {
              const note = u.el('aside', 'vista-note vista-note-' + mode, document.body);
              if (mode !== 'header') {
                const heading = u.el('div', 'vista-note-title', note);
                u.el('span', 'vista-note-icon', heading, 'i');
                u.el('strong', '', heading, 'Note');
              }
              u.el('div', 'vista-note-text', note, ctx.instruction);
              if (mode === 'header') {
                const scale = parseFloat(getComputedStyle(note).fontSize) / 17;
                document.body.style.setProperty('--head-extra', Math.max(0, note.offsetHeight - 34 * scale) + 'px');
              } else {
                document.body.style.setProperty('--note-height', note.offsetHeight + 'px');
              }
            }
            const toolbar = u.el('div', 'vista-toolbar', document.body);
            for (const [kind, text] of [['file', 'New Task'], ['edit', 'Edit'], ['delete', 'Delete'], ['check', 'Mark Complete'], ['up', 'Move Up'], ['down', 'Move Down'], ['categories', 'Categories']]) {
              const b = u.el('button', 'vista-tool tool-' + kind, toolbar);
              b.type = 'button';
              b.innerHTML = icon(kind);
              u.el('span', '', b, text);
              if (kind === 'categories') u.el('span', 'vista-chevron', b, '');
            }
            const list = u.el('aside', 'vista-list', document.body);
            u.el('div', 'vista-pane-title', list, 'My Tasks');
            const groups = [
              ['Today', [['Prepare presentation', '1/18/2008'], ['Call travel agent', '1/18/2008'], ['Review budget', '1/18/2008']]],
              ['This Week', [['Plan spring campaign', '1/19/2008'], ['Update project plan', '1/21/2008'], ['Schedule team meeting', '1/22/2008'], ['Order equipment', '1/24/2008']]],
              ['Later', [['Research vendors', '1/28/2008'], ['Draft proposal', '1/30/2008']]],
            ];
            for (const [title, rows] of groups) {
              const group = u.el('section', 'vista-group', list);
              const heading = u.el('div', 'vista-group-title', group);
              u.el('i', '', heading);
              u.el('span', '', heading, title + ' (' + rows.length + ')');
              for (const [name, date] of rows) {
                const row = u.el('div', 'vista-task' + (name === 'Update project plan' ? ' selected' : ''), group);
                u.el('span', 'vista-checkbox', row);
                u.el('span', 'vista-task-name', row, name);
                u.el('span', 'vista-task-date', row, date);
              }
            }
            const help = u.el('aside', 'vista-help', document.body);
            const helpTitle = u.el('div', 'vista-help-title', help);
            u.el('span', 'vista-help-icon', helpTitle, '?');
            u.el('span', '', helpTitle, 'Task Help');
            u.el('h3', '', help, 'Due date');
            u.el('p', '', help, 'Enter a date in the format month / day / year. Use the up and down arrows to change the value in the selected part.');
            u.el('h3', '', help, 'Examples');
            const examples = u.el('p', 'vista-examples', help);
            for (const line of ['1/21/2031', '12/5/2008', '7/14/2010']) u.el('div', '', examples, line);
            u.el('h3', '', help, 'Tips');
            const tips = u.el('ul', '', help);
            for (const line of ['Click in a part (month, day or year) and type a number.', 'Use the up and down arrows to increase or decrease the value.', 'A due date helps you keep track of when the task should be completed.']) u.el('li', '', tips, line);
            const controls = u.el('div', 'vista-window-controls', top);
            for (const glyph of ['―', '▣', '×']) u.el('span', '', controls, glyph);
            const menu = document.querySelector('.ds-menu');
            if (menu) {
              const items = u.el('div', 'vista-menu-items', menu);
              for (const label of ['File', 'Edit', 'View', 'Task', 'Tools', 'Help']) {
                const item = u.el('span', '', items);
                u.el('u', '', item, label[0]);
                u.el('span', '', item, label.slice(1));
              }
            }
          },
        'frame.24': () => () => {},
        'frame.25': () => () => {},
        'frame.26': () => () => {},
      },
    },
  });
})();

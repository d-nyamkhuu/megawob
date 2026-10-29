// Design on the choose-option/widgets template.
(function () {
  'use strict';
  const glyph = (path) =>
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="' +
    path +
    '"/></svg>';
  const bug =
    'M8 8h8v10a4 4 0 0 1-8 0V8ZM9 8V5h6v3M6 3l3 3M18 3l-3 3M3 10h5M16 10h5M3 16h5M16 16h5M5 22l4-4M19 22l-4-4M12 9v9';

  env.widget({
    task: 'choose-option',
    site: 'design-choose-option-dropdown-10',
    name: 'design',
    split: 'train',
    scenarios: ['dropdown'],
    template: 'choose-option/widgets',
    design: {
      scale: false,
      motifTitle: 'Title',
      motifValue: 'Fix mobile navigation bug',
      parts: {
        details: () => (ctx) => {
          const { util } = ctx;
          const details = util.el('aside', 'ds-task-description', ctx.stage);
          util.el('label', '', details, 'Description');
          util.el(
            'div',
            'ds-staticarea',
            details,
            'On small screens, the hamburger menu does not open.\nReproduce on iOS and Android.',
          );
          const editorbar = util.el('div', 'ds-editorbar', details);
          [
            'B',
            'I',
            'M8 5 2 12l6 7M16 5l6 7-6 7M14 3l-4 18',
            'M10 14l4-4M8 16l-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0M16 8l2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0',
            'M8 5h14M8 12h14M8 19h14M2 5h1M2 12h1M2 19h1',
            'M9 5h13M9 12h13M9 19h13M2 4h2v3M2 11h2v3M2 18h2v3',
            '@',
            'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM8 9h.01M16 9h.01M7 14q5 6 10 0',
          ].forEach((v, i) => {
            const item = util.el('span', '', editorbar);
            if (v.startsWith('M')) item.innerHTML = glyph(v);
            else item.textContent = v;
            if (i === 1) item.style.fontStyle = 'italic';
          });
          util.el('label', '', details, 'Attachments:');
          util.el('div', 'ds-staticarea', details, 'user_guide_draft.txt\nqa_notes.txt');
        },
        motifFields: () => (ctx, card) => {
          const { util } = ctx;
          const decoys = util.el('div', 'ds-motif-xtras', card);
          [
            ['Priority', 'High'],
            ['Labels', 'Select labels...'],
            ['Due date', 'Apr 25, 2024'],
            ['Status', 'To Do'],
          ].forEach(([k, v]) => {
            const label = util.el('label', 'ds-motif-field', decoys, k);
            label.classList.add('ds-' + k.toLowerCase().replace(' ', '-'));
            const control = util.el('div', 'ds-decoycontrol', label);
            const input = util.el('input', '', control);
            input.type = 'text';
            input.value = v;
            const symbol = util.el('span', 'ds-fieldicon', control);
            const shapes = {
              Priority: 'M12 22V2M4 10l8-8 8 8',
              'Due date': 'M4 5h16v16H4V5ZM4 10h16M8 2v6M16 2v6',
              Status: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
            };
            if (shapes[k])
              symbol.innerHTML =
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="' +
                shapes[k] +
                '"/></svg>';
            util.el('span', 'ds-controlchev', control, k === 'Due date' ? '×' : '⌄');
          });
          const tf = util.el('label', 'ds-motif-field ds-type', card, 'Type');
          const tin = util.el('input', '', tf);
          tin.type = 'text';
          tin.value = 'Bug';
          util.el('span', 'ds-typebug', tf).innerHTML = glyph(bug);
          util.el('span', 'ds-controlchev', tf, '⌄');
        },
        option: () => (ctx, r, x, index) => {
          const { util } = ctx;
          const avatar = util.el(
            'b',
            'fp-avatar',
            r,
            x
              .split(/\s+/)
              .slice(0, 2)
              .map((w) => w[0])
              .join(''),
          );
          avatar.style.background = ['#399d95', '#69ee83', '#b36bf2', '#438efe'][index % 4];
          util.el('span', '', r, x);
        },
      },
    },
  });
})();

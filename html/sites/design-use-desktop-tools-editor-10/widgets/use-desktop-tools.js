// Editor toolbar labels, icons, and page font sizing match this site's original design.
(function () {
  'use strict';
  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-editor-10',
    name: 'design',
    split: 'train',
    scenarios: ['editor'],
    template: 'use-desktop-tools/workspace',
    design: {
      caret: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M1 4h14L8 12z" fill="currentColor" stroke="none"/></svg>',
      fontName: 'Arial',
      sizeInitial: '12',
      sizeCur: (key) => ({ small: '10', normal: '12', large: '16', huge: '20' })[key],
      sizeOption: (key, label) => `${{ small: '10', normal: '12', large: '16', huge: '20' }[key]} — ${label}`,
      barColor: '#ed080b',
      toolHtml: {
        'align-left': (base, S) => S.svg('<path d="M2 3h12M2 6h8M2 9h12M2 12h8M2 15h12"/>', 18),
        'align-center': (base, S) => S.svg('<path d="M2 3h12M4 6h8M2 9h12M4 12h8M2 15h12"/>', 18),
        'align-right': (base, S) => S.svg('<path d="M2 3h12M6 6h8M2 9h12M6 12h8M2 15h12"/>', 18),
        'align-justify': (base, S) => S.svg('<path d="M2 3h12M2 6h12M2 9h12M2 12h12M2 15h12"/>', 18),
        bullet: (base, S) => S.svg('<path d="M2 2h2v2H2zM2 8h2v2H2zM2 14h2v2H2z" fill="currentColor" stroke="none"/><path d="M8 3h8M8 9h8M8 15h8"/>', 18),
        number: (base, S) => S.svg('<path d="M2 1h1v4M2 7h2l-2 4h2M2 13h2l-1 2 1 2H2M8 3h8M8 9h8M8 15h8"/>', 18),
      },
      parts: {
        docFontStart: (base) => (E) => Math.min(29, Math.max(17, Math.round(E.area.getBoundingClientRect().width / 48))),
      },
    },
  });
})();

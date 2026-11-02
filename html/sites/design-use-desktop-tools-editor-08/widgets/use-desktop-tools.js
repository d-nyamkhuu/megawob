// This design adds a classic font label, menu actions, and the site's editor scroll rail and caret.
(function () {
  'use strict';

  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-editor-08',
    name: 'design',
    split: 'train',
    scenarios: ['editor'],
    template: 'use-desktop-tools/workspace',
    design: {
      fontName: 'Times New Roman',
      toolbar: [
        'font', 'size', '|', 'bold', 'italic', 'underline', '|', 'color', '|',
        'align-left', 'align-center', 'align-right', 'align-justify', '|', 'bullet', 'number', '|', 'undo', 'redo',
      ],
      toolIcons: {
        bullet: '<circle cx="3" cy="4" r=".6"/><circle cx="3" cy="8" r=".6"/><circle cx="3" cy="12" r=".6"/><path d="M6 4h7M6 8h7M6 12h7"/>',
        number: '<path d="M2 2h1v3M2 7h2l-2 2h2M2 11h2l-1 1 1 1H2M6 4h7M6 8h7M6 12h7"/>',
      },
      toolHtml: {},
      sizeOption: (key, label) => `${{ small: '18', normal: '24', large: '32', huge: '42' }[key]} · ${label}`,
      sizeCur: (key) => ({ small: '18', normal: '24', large: '32', huge: '42' }[key]),
      parts: {
        fontTool: (base) => (E) => {
          base(E);
          if (E.wide) E.sep();
        },
        toolbarBuilt: () => (E) => {
          const auxiliary = E.util.el('div', 'editor-auxiliary', document.querySelector('.design-menu'));
          for (const key of ['align-justify', 'undo', 'redo']) auxiliary.append(E.tools[key]);
          E.tb.lastElementChild.remove();
        },
        edAreaBuilt: () => (E) => {
          const rail = E.util.el('div', 'editor-scrollrail', E.ed);
          for (const [label, direction] of [['up', -1], ['down', 1]]) {
            const arrow = E.util.el('button', 'scroll-' + label, rail);
            arrow.type = 'button';
            arrow.setAttribute('aria-label', 'Scroll ' + label);
            arrow.addEventListener('click', () => E.area.scrollBy(0, direction * 100));
          }
        },
        charClass: (base) => (E, style, i, model) => {
          const cls = base(E, style, i, model);
          return model.sel.start === model.sel.end && i === model.sel.start ? `${cls} editor-caret`.trim() : cls;
        },
      },
    },
  });
})();

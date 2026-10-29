// Editor design: customize the title, rail, document sizing, and grouped alignment controls.
(function () {
  'use strict';

  env.widget({
    task: 'use-desktop-tools',
    site: 'design-use-desktop-tools-editor-07',
    name: 'design',
    split: 'train',
    scenarios: ['editor'],
    template: 'use-desktop-tools/workspace',
    design: {
      toolbarTask: true,
      toolIcons: {
        bullet: '<circle cx="2.5" cy="3" r=".5"/><circle cx="2.5" cy="8" r=".5"/><circle cx="2.5" cy="13" r=".5"/><path d="M6 3h8M6 8h8M6 13h8"/>',
      },
      toolHtml: {
        number: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 1.5h1v3M1.5 6.5h2l-2 3h2M1.5 11.5h2l-1 1.5 1 1.5h-2M6 3h8M6 8h8M6 13h8"/></svg>',
      },
      barColor: 'var(--accent)',
      parts: {
        titleText: (base, S) => (F) => {
          F.ctx.rng.pick(['Workspace', 'Workbench', 'Desk']);
          F.ctx.util.el('b', '', F.title, 'A Curious Bird');
        },
        railIcon: (base, S) => (ctx, key) => ({
          home: S.ICONS.editor,
          files: '<rect x="3" y="4" width="18" height="16" rx="1"/><circle cx="8" cy="9" r="1.3"/><path d="M4 18l5-5 3 3 4-6 4 7"/>',
          terminal: '<path d="M10 14l4-4M8 15l-1 1a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0M16 9l1-1a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0" transform="translate(1 -1) scale(.9)"/>',
        }[key] || base(ctx, key)),
        docFontStart: (base, S) => (E) => Math.round(E.main.getBoundingClientRect().width * 0.0296),
        toolbarBuilt: (base, S) => (E) => {
          base(E);
          const alignment = E.util.el('div', 'at-alignment', E.tb);
          const more = E.util.el('button', 'at-tool at-align-more', alignment);
          more.type = 'button';
          more.title = 'Paragraph alignment';
          more.innerHTML = S.svg('<path d="M7 4h6M3 7h10M7 10h6M3 13h10M3 3l-2 2 2 2"/>', 16);
          const menu = E.util.el('div', 'at-pop at-align-menu', alignment);
          menu.hidden = true;
          for (const key of ['left', 'center', 'right', 'justify']) menu.append(E.tools[`align-${key}`]);
          more.addEventListener('click', () => { menu.hidden = !menu.hidden; });
          if (E.spec.task === 'align') {
            alignment.classList.add('task-align');
            menu.hidden = false;
          }
          E.alignment = alignment;
          E.alignmentMenu = menu;
        },
        edOnDown: (base, S) => (E, event) => {
          if (E.spec.task !== 'align' && !E.alignment.contains(event.target)) E.alignmentMenu.hidden = true;
          base(E, event);
        },
      },
    },
  });
})();

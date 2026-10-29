// Design on templates/site/ui-click-hover-menu-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-control-tooltip-inspect-04',
    styles: ['site.css'],
    template: 'site/click-control-hover-menu-01',
    design: {
      cfg: {
        'title': 'TechDraw Pro',
        'theme': 'blueprint',
        'layout': 'dock',
        'tools': 'Home Parts Drawings BOM Projects Reports',
        'overview':
          'Angle Bracket|Category                     Brackets|Material                     Aluminum 6061|Finish                         Anodized|Weight                         0.24 kg|Dimensions                   80 × 50 × 60 mm|Description                 L-shaped bracket with mounting holes for structural support.',
        'foot': 'Actions',
      },
      parts: {
        'frame.16': (base, S) =>
          function (_c) {
            const { center, ctx, head, note, u } = _c;
            if (ctx.display === 'header') {
              head.appendChild(note);
            }
            const stage = u.el('div', 'stage', center);
            Object.assign(_c, { stage });
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { ctx, foot, note, shell } = _c;
            if (ctx.display === 'panel') {
              const notes = foot.querySelector('.dock-section:nth-child(3)') || shell.querySelector('.overview');
              const oldNote = notes.querySelector('.dock-note');
              if (oldNote) oldNote.remove();
              note.style.cssText =
                'display:block;position:static;width:auto;max-width:none;margin:4px 2px;padding:8px 10px;text-align:left;font:16px Arial,sans-serif;font-weight:400;line-height:1.25;white-space:normal;overflow-wrap:anywhere;background:#fafbfd;border:2px inset #e0e5eb;box-shadow:none;transform:none;z-index:auto;';
              notes.appendChild(note);
            }
          },
      },
    },
  });
})();

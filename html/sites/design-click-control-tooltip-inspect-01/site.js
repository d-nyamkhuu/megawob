// Design on templates/site/ui-click-hover-menu-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-control-tooltip-inspect-01',
    styles: ['site.css'],
    template: 'site/click-control-hover-menu-01',
    design: {
      cfg: {
        'title': 'Contacts Manager - Personal Address Book',
        'theme': 'os2',
        'layout': 'os2',
        'tools': 'File Edit View Contact Tools Help',
        'side':
          'Contacts Manager|Keep track of your personal and business contacts. Use the toolbar to work with the selected item(s).',
        'foot': 'Actions',
      },
      parts: {
        'frame.22': (base, S) =>
          function (_c) {
            const { center, ctx, foot, note } = _c;
            if (ctx.display === 'panel') {
              const notes = foot.querySelector('.dock-section:nth-child(3)');
              const oldNote = notes && notes.querySelector('.dock-note');
              if (oldNote) oldNote.remove();
              note.style.cssText =
                'display:block;position:static;width:auto;max-width:none;margin:4px 2px;padding:8px 10px;text-align:left;font:16px Arial,sans-serif;font-weight:400;line-height:1.25;white-space:normal;overflow-wrap:anywhere;background:#fafbfd;border:2px inset #e0e5eb;box-shadow:none;transform:none;z-index:auto;';
              (notes || _c.aside || center).appendChild(note);
            }
          },
      },
    },
  });
})();

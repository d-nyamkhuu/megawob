// Design on templates/site/ui-click-hover-menu-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-control-open-03',
    styles: ['site.css'],
    template: 'site/click-control-hover-menu-01',
    design: {
      cfg: {
        'title': 'Documents',
        'theme': 'organizer',
        'layout': 'filedesk',
        'tools': '',
        'side':
          'File Details|No file selected|Type:　–|Size:　–|Location:　–|Date modified:　–|Date created:　–|Tags:　–|Comments:　–',
        'foot': 'Task List|Status|Notes|Actions',
      },
      parts: {
        'frame.7': (base, S) =>
          function (_c) {
            base(_c);
            // End-control and decoy placements still need a toolbar when its menu is empty.
            if (!S.cfg.tools) _c.u.el('div', 'tools', _c.head);
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { ctx, note } = _c;
            if (ctx.display === 'panel') {
              const notes = _c.aside;
              note.style.cssText =
                'display:block;position:static;width:auto;max-width:none;margin:4px 2px;padding:8px 10px;text-align:left;font:16px Georgia,serif;font-weight:400;line-height:1.3;white-space:normal;overflow-wrap:anywhere;background:#fff8e7;border:1px solid #cbb990;box-shadow:0 2px 5px #0001;transform:none;z-index:auto;';
              notes.insertBefore(note, notes.children[1] || null);
            }
          },
      },
    },
  });
})();

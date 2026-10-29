// Design on templates/site/ui-click-hover-menu-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-control-flyout-03',
    styles: ['site.css'],
    template: 'site/click-control-hover-menu-01',
    design: {
      cfg: {
        'title': 'Shop Catalog',
        'theme': 'beos',
        'layout': 'dock',
        'tools': 'Home Shop Orders Favorites Account',
        'side':
          'Shop Catalog|Browse our catalog by department and category to find office products, supplies and equipment.|Tips|Choose a department from the menu to see available categories.|Click a category to view its items.|Use the tabs above to manage your orders and account.|Featured|Office Basics Notepad|$2.49',
        'foot': 'Task List|Status|Notes|Actions',
      },
      parts: {
        'frame.6': (base, S) =>
          function (_c) {
            const { cfg } = S;
            const { title, u } = _c;
            if (
              ['qt', 'openlook', 'win92', 'clearlooks', 'industrial', 'electron', 'yosemite', 'beos'].includes(
                cfg.theme,
              )
            ) {
              const controls = u.el('span', 'window-controls', title);
              controls.innerHTML =
                '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
            }
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { ctx, foot, note } = _c;
            if (ctx.display === 'panel') {
              const notes = foot.querySelector('.dock-section:nth-child(3)');
              const oldNote = notes.querySelector('.dock-note');
              if (oldNote) oldNote.remove();
              note.style.cssText =
                'display:block;position:static;width:auto;max-width:none;margin:4px 2px;padding:8px 10px;text-align:left;font:16px Arial,sans-serif;font-weight:400;line-height:1.25;white-space:normal;overflow-wrap:anywhere;background:#fafbfd;border:2px inset #e0e5eb;box-shadow:none;transform:none;z-index:auto;';
              _c.aside.insertBefore(note, _c.aside.children[1] || null);
            }
          },
        'frame.37': (base) =>
          function (_c) {
            // This design uses the footer instead of the template's separate status bar.
            if (_c.submit && _c.submit.parentElement === _c.statusbar) {
              _c.submit.classList.add('status-submit');
              _c.foot.appendChild(_c.submit);
            }
            return base(_c);
          },
      },
    },
  });
})();

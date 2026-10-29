// Design on templates/site/ui-click-hover-menu-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-control-tooltip-inspect-02',
    styles: ['site.css'],
    template: 'site/click-control-hover-menu-01',
    design: {
      cfg: {
        'title': 'Customer Manager',
        'theme': 'qt',
        'layout': 'dock',
        'tools': 'File Edit View Go Tools Help',
        'foot': 'Actions',
        'side': 'Customer Details|Name|Customer #|Company|City|Country|Phone|Email|Notes',
        'tabs': 'Customers|Orders|Products|Reports|Communications',
      },
      parts: {
        'frame.8': (base, S) =>
          function (_c) {
            const { cfg } = S;
            const { shell, u } = _c;
            if (cfg.tabs) {
              const tabs = u.el('nav', 'app-tabs', shell);
              cfg.tabs.split('|').forEach((label, i) => u.el('div', i === 0 ? 'selected' : '', tabs, label));
            }
            if (cfg.overview) {
              const ov = u.el('section', 'overview', shell);
              cfg.overview.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', ov, s));
            }
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { ctx, foot, note } = _c;
            if (ctx.display === 'panel' && foot.querySelector('.dock-section:nth-child(3)')) {
              const notes = foot.querySelector('.dock-section:nth-child(3)');
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

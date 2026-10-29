// Design on templates/site/ui-click-hover-menu-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-control-rows-03',
    styles: ['site.css'],
    template: 'site/click-control-hover-menu-01',
    design: {
      cfg: {
        'title': 'Atlas',
        'theme': 'atlas',
        'layout': 'dock',
        'tools': 'Home    Documents    Teams    Reports    Admin',
        'side':
          'Recent Activity|Atlas_ProjectTimeline.xlsx|Daniel Kim updated · Apr 4, 2013 5:02 PM|Atlas_Meetingnotes_FY24.rtf|Jessica Carter uploaded · Apr 4, 2013 3:29 PM|Atlas_BrandGuidelines.docx|Miguel Santos commented · Apr 4, 2013 11:06 AM|Atlas_ProductOverview.pdf|Priya Desai viewed · Apr 3, 2013 4:21 PM|Atlas_ExpensePolicy.pdf|Daniel Kim updated · Apr 2, 2013 2:14 PM|Atlas_Roadmap.rtf|Jessica Carter viewed · Apr 1, 2013 1:03 PM|Atlas_MarketingPlan.docx|Miguel Santos updated · Mar 29, 2013 5:18 PM|Atlas_Financials_Q1.xlsx|Priya Desai commented · Mar 28, 2013 3:47 PM',
        'foot': 'Actions',
      },
      parts: {
        'frame.7': (base, S) =>
          function (_c) {
            const { cfg } = S;
            const { head, u } = _c;
            if (cfg.tools) {
              const tools = u.el('div', 'tools', head);
              cfg.tools
                .trim()
                .split(/\s+/)
                .forEach((label) => {
                  const item = u.el('span', 'menu-label', tools);
                  u.el('u', '', item, label[0]);
                  u.el('span', '', item, label.slice(1));
                });
              const search = u.el('div', 'global-search', head);
              u.el('span', 'search-glass', search, '⌕');
              u.el('span', 'search-label', search, 'Search documents…');
              const account = u.el('div', 'account', head, 'Jessica Carter  ▾');
            }
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { center, ctx, foot, note } = _c;
            if (ctx.display === 'panel') {
              const notes = foot.querySelector('.dock-section:nth-child(3)') || center;
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

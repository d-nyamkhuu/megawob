// Design on templates/site/ui-text-find-01.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-handle-text-find-02',
    styles: ['site.css'],
    template: 'site/handle-text-find-01',
    design: {
      cfg: {
        'title': '▲  Riverton Supply',
        'theme': 'extranet',
        'layout': 'reader',
        'tools': 'P A R T N E R S     I N     P R O G R E S S',
        'rail': '♟  Customers|▤  Documents|▥  Reports|▰  Shipments|⬟  Products|♙  My Profile',
        'side':
          'Documents|View:  All Documents|Date     Title                         Type|Mar 8, 1999   Finance Report      PDF|Feb 1, 1999   Account Summary   PDF|Jan 15, 1999 Credit Notice       PDF|Dec 20, 1998 Statement             PDF|Nov 2, 1998 Payment Receipt    PDF|Oct 10, 1998 Finance Report      PDF|Document Details|Title:       Finance Report|Date:        Mar 8, 1999|Type:        PDF Document|Size:        245 KB|Customer: Acme Manufacturing|Account #: ACM-00421|Status:     Final|Description: Quarterly finance report including account activity, credit information and payment terms.',
      },
      parts: {
        'frame.7': (base, St) =>
          function (_c) {
            const { cfg } = St;
            const { head, u } = _c;
            if (cfg.tools) u.el('div', 'tools', head, cfg.tools);
          },
        'frame.15': (base, St) =>
          function (_c) {
            const { cfg } = St;
            const { u, work } = _c;
            if (cfg.rail) {
              const rail = u.el('nav', 'rail', work);
              cfg.rail.split('|').forEach((s, i) => u.el('div', i === 1 ? 'active' : '', rail, s));
            }
          },
        'frame.25': (base, St) =>
          function (_c) {
            const { cfg } = St;
            const { ctx, note } = _c;
            if (
              (cfg.layout === 'console' || (cfg.layout === 'reader' && ctx.display === 'panel')) &&
              _c.aside &&
              ctx.display !== 'toast'
            ) {
              _c.aside.insertBefore(note, _c.aside.children[1] || null);
            }
          },
        'frame.26': () => () => {},
        'frame.27': () => () => {},
        'frame.28': () => () => {},
        'frame.29': () => () => {},
        'frame.30': () => () => {},
        'frame.31': () => () => {},
        'frame.32': () => () => {},
        'frame.33': () => () => {},
        'frame.34': () => () => {},
        'frame.35': () => () => {},
        'frame.36': () => () => {},
        'frame.37': () => () => {},
        'frame.38': () => () => {},
        'frame.39': () => () => {},
        'frame.40': () => () => {},
        'frame.41': () => () => {},
        'frame.42': () => () => {},
        'frame.43': () => () => {},
        'frame.44': () => () => {},
      },
    },
  });
})();

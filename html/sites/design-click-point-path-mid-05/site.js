// Intranet notebook (2000): dark green top tab bar, left summary panels, route map board on the right.
(function () {
  'use strict';
  const TABS = ['Projects', 'Map', 'Assets', 'Routes', 'Reports', 'Administration'];
  const ROWS = [
    ['Route Overview', [['Route ID', 'R-4187'], ['Start Point', 'A'], ['End Point', 'B'], ['Total Length', '24 units'], ['Segments', '6'], ['Status', 'Planned']]],
    ['Segment Lengths', null],
    ['Map Totals', [['Routes', '12'], ['Markers', '2'], ['Obstacles', '5'], ['Areas', '3']]],
  ];
  env.site({
    name: 'design-click-point-path-mid-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/base',
    design: {
      parts: {
        'frame.placement': (base, S) =>
          function (_c) {
            base(_c);
            _c.origNav = _c.nav;
            _c.origSidebar = _c.sidebar;
            _c.nav = true;
          },
        'frame.header': (base, S) =>
          function (_c) {
            base(_c);
            const b = _c.header.querySelector('.ref-brand');
            if (b) b.remove();
          },
        'frame.nav': (base, S) =>
          function (_c) {
            const { header, rng, util, content } = _c;
            if (_c.origNav) {
              rng.sample(content.NAV_ITEMS, rng.int(3, 5));
            }
            const n = util.el('nav', 'ref-nav', header);
            TABS.forEach((t, i) => {
              const a = util.el('a', 'ref-navlink' + (i === 0 ? ' on' : ''), n, t);
              a.dataset.role = 'nav';
              a.href = '#';
              a.addEventListener('click', (e) => {
                e.preventDefault();
                env.log('decoy', { what: 'nav', label: t });
              });
            });
          },
        'frame.body': (base, S) =>
          function (_c) {
            base(_c);
            const { body, util } = _c;
            const side = body.querySelector('.ref-side');
            if (side) side.remove();
            const col = util.el('aside', 'nb-col', body);
            body.insertBefore(col, body.firstChild);
            for (const [title, rows] of ROWS) {
              const box = util.el('section', 'nb-box', col);
              util.el('div', 'nb-bar', box, title);
              if (rows) {
                const t = util.el('table', 'nb-kv', box);
                for (const [k, v] of rows) {
                  const tr = util.el('tr', '', t);
                  util.el('td', 'k', tr, k);
                  util.el('td', 'v', tr, v);
                }
              } else {
                const t = util.el('table', 'nb-seg', box);
                const h = util.el('tr', '', t);
                util.el('th', '', h, '#');
                util.el('th', '', h, 'Length (units)');
                [4, 6, 4, 3, 4, 3].forEach((n, i) => {
                  const tr = util.el('tr', '', t);
                  util.el('td', '', tr, String(i + 1));
                  util.el('td', '', tr, String(n));
                });
              }
              util.el('div', 'nb-pad', box);
            }
          },
        'frame.stage': (base, S) =>
          function (_c) {
            base(_c);
            const { stage, body, util } = _c;            // wrap the stage in a framed board with a dark green title bar
            const frame = util.el('section', 'nb-frame', body);
            const bar = util.el('div', 'nb-bar', frame);
            util.el('span', '', bar, 'Route Map');
            const sc = util.el('span', 'nb-scale', bar, 'Scale: 1 unit');
            util.el('i', '', sc);
            frame.appendChild(stage);
          },
      },
    },
  });
})();

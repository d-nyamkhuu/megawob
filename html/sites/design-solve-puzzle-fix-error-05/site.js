(function () {
  'use strict';
  const NAV = [
    ['Home', '#c0392b', 'M2 11 L12 3 L22 11 L19 11 L19 21 L5 21 L5 11 Z'],
    ['About Me', '#8a7a4a', 'M5 2h11l3 3v17H5z M8 9h8M8 13h8M8 17h8'],
    ['Photos', '#333', 'M2 7h5l2-3h6l2 3h5v14H2z M12 9a4.5 4.5 0 1 0 .1 0z'],
    ['Guestbook', '#8a7a4a', 'M5 3h14v19H5z M8 8h8M8 12h8M8 16h8'],
    ['Links', '#2b7bd1', 'M12 2a10 10 0 1 0 .1 0z M2 12h20M12 2c4 4 4 16 0 20M12 2c-4 4-4 16 0 20'],
    ['My Garden', '#c0392b', 'M6 12h12l-2 9H8z M12 12V6 M12 6c-3-3-6 0-4 2 M12 6c3-3 6 0 4 2'],
  ];
  const ENTRIES = [
    ['Apr 18, 1996', 'Emily Carter', 'Portland, OR'], ['Apr 12, 1996', 'Jason Miller', 'Seattle, WA'],
    ['Apr 3, 1996', 'Laura Bennett', 'San Diego, CA'], ['Mar 28, 1996', 'Kevin Park', 'Denver, CO'],
    ['Mar 20, 1996', 'Nicole Ramirez', 'Austin, TX'], ['Mar 14, 1996', 'David Kim', 'Boston, MA'],
    ['Mar 8, 1996', 'Amanda Cole', 'Chicago, IL'], ['Feb 28, 1996', 'Mark Stevens', 'Phoenix, AZ'],
    ['Feb 18, 1996', 'Rachel Green', 'Miami, FL'], ['Feb 10, 1996', 'Brian Walsh', 'New York, NY'],
    ['Feb 2, 1996', 'Stephanie Liu', 'San Jose, CA'], ['Jan 26, 1996', 'Daniel Moore', 'Raleigh, NC'],
    ['Jan 18, 1996', 'Melissa Grant', 'Atlanta, GA'], ['Jan 10, 1996', 'Chris Taylor', 'Columbus, OH'],
  ];
  const tree = (u, parent) => {
    const s = u.svg('svg', { width: 90, height: 104, viewBox: '0 0 90 104', class: 'ref-tree', 'shape-rendering': 'crispEdges', 'aria-hidden': 'true' }, parent);
    const pine = (x, y, scale) => {
      const g = u.svg('g', { transform: `translate(${x} ${y}) scale(${scale})` }, s);
      u.svg('path', { d: 'M-2 8H2V94H-2ZM-5 94H5V96H-5Z', fill: '#785129', stroke: '#352f20', 'stroke-width': 1 }, g);
      u.svg('path', { d: 'M-1 18H0V93H-1Z', fill: '#c39c52' }, g);
      u.svg('path', { d: 'M0 0 -4 11 -2 11 -8 21 -4 21 -12 33 -7 32 -17 48 -10 46 -22 63 -15 60 -27 80 -7 78 -5 85 5 85 8 79 26 82 15 62 22 65 10 47 18 50 6 32 13 34 3 18 8 21 1 8 4 10Z', fill: '#215b32', stroke: '#173c25', 'stroke-width': .7 }, g);
      [[5, 4], [13, 7], [23, 11], [34, 14], [46, 18], [59, 22], [73, 25]].forEach(([yy, w], i) => {
        u.svg('path', { d: `M0 ${yy - 5} -3 ${yy+2} H-5 V${yy+5} H${-w+3} V${yy+8} H${-w} V${yy+11} H${-w+6} V${yy+9} H-4 V${yy+13} H3 V${yy+9} H${w-5} V${yy+12} H${w} V${yy+8} H${w-3} V${yy+5} H5 V${yy+2} H2Z`, fill: i % 2 ? '#164c2b' : '#205d32', stroke: '#173d25', 'stroke-width': 1 }, g);
        u.svg('path', { d: `M-3 ${yy+3} H${-w+5} V${yy+5} H-3ZM4 ${yy+5} H${w-4} V${yy+7} H4Z`, fill: '#689861' }, g);
        u.svg('path', { d: `M${-w+2} ${yy+8} H${-w+7} V${yy+10} H${-w+2}ZM8 ${yy+7} H12 V${yy+9} H8Z`, fill: '#3d8049' }, g);
        u.svg('path', { d: `M-2 ${yy+1} H1 V${yy+3} H-2ZM${w-7} ${yy+5} H${w-3} V${yy+6} H${w-7}Z`, fill: '#c6d4b2' }, g);
      });
    };
    pine(59, 1, 1);
    pine(23, 36, .68);
  };
  const icon = (u, parent, i, cls = '') => {
    const s = u.svg('svg', { width: 34, height: 34, viewBox: '0 0 32 32', class: cls, 'shape-rendering': 'crispEdges', 'aria-hidden': 'true' }, parent);
    const p = (d, fill, stroke = '#171d24') => u.svg('path', { d, fill, stroke, 'stroke-width': 1.2, 'stroke-linejoin': 'miter' }, s);
    const r = (x, y, width, height, fill) => u.svg('rect', { x, y, width, height, fill }, s);
    if (i === 0) {
      p('M6 14H26V30H6Z', '#f4f2e8'); p('M2 14 15 2 29 14 26 17 15 7 5 17Z', '#bb302a');
      p('M21 2H25V9L21 6Z', '#bdbbb2'); p('M13 20H20V30H13Z', '#377b3d'); r(8,19,4,5,'#87b4e2'); r(22,19,3,5,'#87b4e2'); r(17,24,1,2,'#f1cf52'); r(8,29,18,2,'#376b2b');
    } else if (i === 1) {
      p('M6 2H21L27 8V30H6Z', '#fffdec'); p('M21 2V8H27', '#dbd8c4');
      for (const y of [12,17,22,26]) { r(10,y,3,2,'#293252'); r(15,y,8,1,'#293252'); }
    } else if (i === 2) {
      p('M2 9H8L11 5H19L22 9H30V28H2Z', '#4e5155'); r(4,11,24,14,'#92958e'); p('M5 6H10V10H5Z','#cecbb1');
      u.svg('circle', {cx:17,cy:18,r:8,fill:'#d9d7c7',stroke:'#151923','stroke-width':2},s); u.svg('circle', {cx:17,cy:18,r:5,fill:'#172131',stroke:'#656e7a'},s);r(15,14,3,3,'#8fa1b9'); r(25,12,3,3,'#e9dfb0');
    } else if (i === 3) {
      p('M5 4H27V31H5Z', '#dcc45d'); p('M8 7H24V28H8Z', '#fffde8');
      for (const x of [10,16,22]) p(`M${x} 1V8`, 'none');
      for (const y of [12,17,22]) {r(10,y,3,2,'#374b91');r(15,y,7,1,'#43516c');}
    } else if (i === 4) {
      u.svg('circle', {cx:16,cy:16,r:14,fill:'#327cda',stroke:'#101e30','stroke-width':2},s);
      p('M9 4 15 3 19 6 16 9 19 12 15 15 12 13 9 16 5 13 4 8Z','#49a744'); p('M17 16 22 14 26 17 24 22 20 24 19 29 16 27 16 21 13 19Z','#4eab45'); r(7,5,3,2,'#b8e6db');
    } else if (i === 5) {
      p('M8 20H25L23 31H10Z','#ca7726');p('M6 18H27V22H6Z','#ecaa42');p('M16 19V7M16 14 9 9M17 12 24 6','none','#285f2a');
      p('M14 14 7 12 5 7 11 8Z','#3f9239');p('M18 15 25 10 29 10 26 15Z','#3f9239');
      for(const [x,y] of [[15,4],[23,4]]) {p(`M${x-3} ${y-1}H${x+3}V${y+5}H${x-3}Z`,'#c62e2e');r(x-1,y+1,2,2,'#f2dc5c');}
    } else {
      p('M3 8 14 6 16 9 19 6 29 8V29L18 27 16 30 14 27 3 29Z','#fffdec');p('M16 9V28M6 12 12 10M6 16 12 14M20 11 26 13M20 16 26 18M6 21 12 19M20 21 26 23','none','#8c9296');p('M2 28 13 26 16 29 19 26 30 28V31H2Z','#34733c');
    }
    return s;
  };
  env.site({
    name: 'design-solve-puzzle-fix-error-05',
    template: 'site/base',
    styles: ['site.css'],
    design: {
      THEMES: {
        paper: { bg: '#efebe2', panel: '#f4f1ea', fg: '#10124a', muted: '#3b3f7a', line: '#5b6ea8' },
      },
      LOW_THEME: { bg: '#efebe2', panel: '#f4f1ea', fg: '#10124a', muted: '#3b3f7a', line: '#5b6ea8' },
      ACCENTS: ['#2f5fb5'],
      LOW_ACCENTS: ['#2f5fb5'],
      TITLES: ['Sunnybrook Springs'],
      parts: {
        endLabel: (base) => (rng, content) => {
          const label = base(rng, content);
          return rng.fork('guestbook/end-label').bool(.5) ? 'Apply' : label;
        },
        'frame.header': (base) => (_c) => {
          base(_c);
          const { header, util: u } = _c;
          while (header.firstChild) header.removeChild(header.firstChild);
          const nav = u.el('nav', 'ref-nav', header);
          NAV.forEach(([name], i) => {
            const a = u.el('a', 'ref-navlink' + (i === 3 ? ' on' : ''), nav);
            a.href = '#';
            a.dataset.role = 'nav';
            icon(u, a, i);
            u.el('span', '', a, name);
            a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: name }); });
          });
          const mast = u.el('div', 'ref-mast', header);
          tree(u, mast);
          const mid = u.el('div', 'ref-mast-mid', mast);
          u.el('div', 'ref-brand', mid, 'Sunnybrook Springs').dataset.role = 'brand';
          u.el('div', 'ref-vine', mid);
          u.el('div', 'ref-tag', mid, 'A Little Place on the Web');
          tree(u, mast);
          Object.assign(_c, { header });
        },
        'frame.nav': (base) => (_c) => {
          base(_c);
          const bars = _c.header.querySelectorAll('.ref-nav');
          if (bars.length > 1) bars[bars.length - 1].remove();
        },
        'frame.instruction': () => (_c) => {
          const { ctx, display, header, util } = _c;
          if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
          else util.el('div', 'ref-spacer', header);
        },
        'frame.stage': (base) => (_c) => {
          base(_c);
          const { body, util: u } = _c;
          const list = u.el('aside', 'ref-list', body);
          const head = u.el('div', 'ref-list-head', list);
          icon(u, head, 1, 'ref-list-ico');
          u.el('span', '', head, 'Recent Guestbook Entries');
          const wrap = u.el('div', 'ref-list-scroll', list);
          const t = u.el('table', 'ref-table', wrap);
          const hr = u.el('tr', '', u.el('thead', '', t));
          for (const h of ['Date', 'Name', 'Location']) u.el('th', '', hr, h);
          const tb = u.el('tbody', '', t);
          ENTRIES.forEach((row, i) => {
            const tr = u.el('tr', i === 0 ? 'sel' : '', tb);
            row.forEach((c) => u.el('td', '', tr, c));
          });
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          if (!document.querySelector('.ref-foot')) {
            const foot = _c.util.el('footer', 'ref-foot', document.body);
            _c.util.el('div', 'ref-tools', foot);
          }
        },
        'frame.end': (base) => (_c) => {
          const { ctx, submit, headerTools, label } = _c;
          if (submit) {
            const r = ctx.rng.fork('guestbook/end-position');
            const placement = r.pick(['footer', 'footer', 'footer', 'header', 'header', 'icon']);
            const tools = placement === 'footer' ? document.querySelector('.ref-foot .ref-tools') : headerTools;
            tools.appendChild(submit);
            submit.className = 'ref-submit' + (placement === 'icon' ? ' ref-icon' : '');
            submit.textContent = placement === 'icon' ? '✓' : label;
          }
          for (const dock of document.querySelectorAll('.ref-float-dock')) if (!dock.children.length) dock.remove();
          return base(_c);
        },
      },
    },
  });
})();

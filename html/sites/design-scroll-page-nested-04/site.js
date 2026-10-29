// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      // Keep the reference's white help article palette while consuming the clone's original theme draws.
      for (const [k, v] of Object.entries({ bg: '#ffffff', panel: '#f3f8fc', fg: '#17345a', muted: '#60758c', line: '#c6d8e8' })) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#075fc5');
      root.dataset.theme = 'light';
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const windowbar = util.el('div', 'vista-windowbar', document.body);
      util.el('span', 'vista-ie-icon', windowbar, 'e');
      util.el('span', 'vista-window-title', windowbar, 'Help Centre');
      const winControls = util.el('div', 'vista-window-controls', windowbar);
      for (const glyph of ['−', '□', '×']) util.el('span', 'vista-window-control', winControls, glyph);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter, winControls, windowbar });
    },
    'frame.header': (base, S) => function (_c) {
      const { rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, '▣');
        brand.dataset.role = 'brand';
        util.el('span', 'vista-brand-divider', header);
        util.el('div', 'vista-section-title', header, 'Help Centre');
      }
      Object.assign(_c, { header });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const search = util.el('div', 'vista-search', header);
      util.el('span', 'vista-search-label', search, 'Search help articles...');
      util.el('span', 'vista-search-icon', search, '⌕');
      Object.assign(_c, { search });
    },
    'frame.tools': (base, S) => function (_c) {
      base(_c);
      // Keep toolbar controls in the window frame, clear of the page's scrollbars.
      _c.windowbar.insertBefore(_c.headerTools, _c.winControls);
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const tips = util.el('aside', 'help-tips', body);
      util.el('div', 'help-tips-title', tips, 'Help & tips');
      const tipData = [
        ['●', 'Find an article', 'Use the search box above or browse the list of help articles.'],
        ['▤', 'Open an article', 'Click Open to read the full article with step-by-step guidance.'],
        ['▥', 'Scroll for more', 'Use the scroll bar or mouse wheel to see more articles.'],
        ['⌨', 'Keyboard navigation', 'Use the arrow keys, Page Down or Page Up to move through the list.'],
      ];
      for (const [icon, title, text] of tipData) {
        const item = util.el('div', 'help-tip', tips);
        util.el('span', 'help-tip-icon', item, icon);
        const copy = util.el('div', 'help-tip-copy', item);
        util.el('strong', '', copy, title);
        util.el('span', '', copy, text);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, tipData, tips });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const sheet = util.el('div', 'help-sheet', body);
      util.el('div', 'help-sheet-title', sheet, 'Help Centre');
      util.el('div', 'help-sheet-breadcrumb', sheet, 'Home   ›   Help Centre');
      const stage = util.el('main', 'ref-stage', sheet);
      S.frameAlign(_c, stage);
      const pixelIcon = (parent, kind) => {
        const ns = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(ns, 'svg');
        svg.setAttribute('viewBox', '0 0 40 40');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('shape-rendering', 'crispEdges');
        svg.classList.add('pixel-icon');
        parent.appendChild(svg);
        const rect = (x, y, w, h, fill, stroke = '#111') => {
          const el = document.createElementNS(ns, 'rect');
          for (const [k, v] of Object.entries({ x, y, width: w, height: h, fill, stroke, 'stroke-width': 2 })) el.setAttribute(k, v);
          svg.appendChild(el);
        };
        const poly = (points, fill, stroke = '#111') => {
          const el = document.createElementNS(ns, 'polygon');
          el.setAttribute('points', points); el.setAttribute('fill', fill); el.setAttribute('stroke', stroke); el.setAttribute('stroke-width', 2);
          svg.appendChild(el);
        };
        if (kind === 'home') {
          poly('4,19 20,4 36,19 32,23 20,12 8,23', '#df3024'); rect(9,20,22,16,'#fafafa'); rect(17,25,7,11,'#9b552c'); rect(26,23,4,5,'#9cd7ef');
        } else if (kind === 'help') {
          rect(5,5,29,29,'#0875da'); rect(8,8,11,23,'#fff'); rect(20,8,11,23,'#fff'); rect(18,8,3,24,'#e5b900');
          rect(10,12,7,2,'#5589bd','none'); rect(22,12,7,2,'#5589bd','none');
        } else if (kind === 'trips') {
          const c = document.createElementNS(ns, 'circle'); c.setAttribute('cx',20); c.setAttribute('cy',20); c.setAttribute('r',15); c.setAttribute('fill','#1678d2'); c.setAttribute('stroke','#111'); c.setAttribute('stroke-width',2); svg.appendChild(c);
          poly('10,12 15,10 17,15 14,18 17,22 13,25 9,21 7,17','#34a853','none'); poly('24,7 30,10 29,15 25,15 23,12','#34a853','none'); poly('23,23 29,20 31,25 27,30 22,29','#34a853','none');
        } else if (kind === 'bookings') {
          rect(5,7,30,27,'#fff'); rect(5,7,30,7,'#e02020'); rect(10,4,4,8,'#777'); rect(26,4,4,8,'#777');
          for (const [x,y] of [[11,18],[19,18],[27,18],[11,25],[19,25],[27,25]]) rect(x,y,3,3,'#277bb5','none');
        } else if (kind === 'payments') {
          rect(5,11,29,22,'#ad7227'); rect(9,7,22,9,'#d99b30'); rect(22,18,12,9,'#f2c64c'); rect(25,21,4,3,'#513c1f');
        } else {
          poly('17,3 23,3 25,8 29,10 34,8 37,13 33,17 34,22 38,25 35,31 29,29 25,32 24,38 17,38 16,32 11,29 6,31 3,25 7,21 6,16 2,13 6,7 12,9 16,7','#bfc3ca');
          const c = document.createElementNS(ns, 'circle'); c.setAttribute('cx',20); c.setAttribute('cy',20); c.setAttribute('r',5); c.setAttribute('fill','#eee'); c.setAttribute('stroke','#222'); c.setAttribute('stroke-width',2); svg.appendChild(c);
        }
      };
      const dock = util.el('nav', 'help-dock', document.body);
      for (const label of ['Home', 'Help', 'Trips', 'Bookings', 'Payments', 'Account']) {
        const item = util.el('div', `help-dock-item${label === 'Help' ? ' selected' : ''}`, dock);
        const icon = util.el('span', `help-dock-icon icon-${label.toLowerCase()}`, item);
        pixelIcon(icon, label.toLowerCase());
        util.el('span', '', item, label);
      }
      Object.assign(_c, { dock, pixelIcon, stage });
    },
  };

  env.site({
    name: 'design-scroll-page-nested-04',
    template: 'site/base',
    design: { parts },
  });
})();

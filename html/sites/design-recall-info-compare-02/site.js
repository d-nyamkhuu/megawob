// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      root.dataset.theme = name;
      const appTitle = util.el('div', 'vista-titlebar', document.body);
      util.el('span', 'vista-lock', appTitle, '▣');
      util.el('span', 'vista-appname', appTitle, 'ShopMate');
      const winControls = util.el('div', 'vista-win-controls', appTitle);
      for (const [t, c] of [['−','min'], ['□','max'], ['×','close']]) util.el('span', `vista-win ${c}`, winControls, t);
      const menu = util.el('div', 'vista-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Tools', 'Help']) util.el('span', 'vista-menu-item', menu, item);
      Object.assign(_c, { accent, appTitle, content, menu, name, rng, root, tr, util, winControls });
    },
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      document.body.classList.remove('ref-display-header', 'ref-display-panel', 'ref-display-hidden');
      document.body.classList.add(`ref-display-${display}`);
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const brand = util.el('div', 'ref-brand', header, 'Riverton Public Library');
      brand.dataset.role = 'brand';
      util.el('span', 'ref-brand-sub', header, 'CATALOGUE');
      Object.assign(_c, { brand, header });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const drawIcon = (parent, kind) => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 40 40'); svg.setAttribute('aria-hidden', 'true'); svg.classList.add('vista-icon-art');
        const shapes = {
          box: [['path','M5 12 20 4 35 12 20 20Z','#f2c36a','#9b6c2f'],['path','M5 12v17l15 8V20Z','#d9a348','#9b6c2f'],['path','M35 12v17l-15 8V20Z','#edb957','#9b6c2f'],['path','m13 8 15 8','#fff0ba','none']],
          doc: [['path','M9 3h15l8 8v26H9Z','#f8fbff','#496f9d'],['path','M24 3v9h8','#bdd6ef','#496f9d'],['path','M14 18h13M14 23h13M14 28h13M14 33h9','none','#4c76a3']],
          people: [['circle','14 8 6','#4b91d2','#28629e'],['circle','27 9 5','#79b2e3','#28629e'],['path','M2 34v-6c0-7 5-11 12-11s12 4 12 11v6Z','#4387c7','#28629e'],['path','M24 19c8-2 14 2 14 9v6H28v-6c0-4-1-7-4-9Z','#79b2e3','#28629e']],
          bars: [['rect','5 24 7 13','#54aa70','#357a4b'],['rect','16 16 7 21','#65bd7b','#357a4b'],['rect','27 7 7 30','#79c486','#357a4b'],['path','M3 38h34','#fff',' #357a4b']],
          gear: [['path','M16 2h8l2 5 4 2 5-1 4 7-4 4v5l4 4-4 7-5-1-4 2-2 5h-8l-2-5-4-2-5 1-4-7 4-4v-5l-4-4 4-7 5 1 4-2Z','#dce8f4','#4a7095'],['circle','20 20 7','#8aa7c3','#4a7095']],
          home: [['path','M3 18 20 4l17 14h-5v18H8V18Z','#f7fbff','#3f73a5'],['path','M17 36V23h7v13','#78aee0','#3f73a5']],
        }[kind] || [];
        for (const [tag, d, fill, stroke] of shapes) {
          const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
          if (tag === 'circle') { const [cx,cy,r] = d.split(' ').map(Number); node.setAttribute('cx',cx); node.setAttribute('cy',cy); node.setAttribute('r',r); }
          else if (tag === 'rect') { const [x,y,w,h] = d.split(' ').map(Number); node.setAttribute('x',x); node.setAttribute('y',y); node.setAttribute('width',w); node.setAttribute('height',h); node.setAttribute('rx','1.5'); }
          else node.setAttribute('d',d);
          node.setAttribute('fill',fill); node.setAttribute('stroke',stroke.trim()); node.setAttribute('stroke-width', '1.2'); node.setAttribute('stroke-linejoin','round');
          svg.appendChild(node);
        }
        parent.appendChild(svg);
      };
      const library = util.el('aside', 'vista-library', body);
      util.el('div', 'vista-library-title', library, 'Library');
      for (const [icon, item, selected] of [['box','Products',true],['doc','Orders'],['people','Customers'],['bars','Reports'],['gear','Settings']]) {
        const row = util.el('div', `vista-library-row${selected ? ' selected' : ''}`, library);
        const art = util.el('span', `vista-nav-icon ${icon}`, row); drawIcon(art, icon); util.el('span', '', row, item);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, drawIcon, library });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, drawIcon, util } = _c;
      const catalogWindow = util.el('div', 'vista-catalog-window', body);
      const catalogTitle = util.el('div', 'vista-catalog-title', catalogWindow);
      const stage = util.el('main', 'ref-stage', catalogWindow);
      const catalogMark = util.el('span', 'vista-catalog-mark', catalogTitle);
      drawIcon(catalogMark, 'box');
      const subControls = util.el('div', 'vista-sub-controls', catalogTitle);
      for (const [label, kind] of [['−', 'min'], ['□', 'max'], ['×', 'close']]) {
        util.el('span', `vista-sub-win ${kind}`, subControls, label);
      }
      const inspector = util.el('aside', 'vista-inspector', body);
      util.el('div', 'vista-inspector-title', inspector, 'Product Details');
      const empty = util.el('div', 'vista-empty', inspector);
      util.el('div', 'vista-bag', empty, '▰');
      util.el('div', 'vista-empty-label', empty, 'No product selected');
      const fields = util.el('div', 'vista-fields', inspector);
      for (const item of ['Name:', 'Price:', 'Customer rating:', 'Delivery time:', 'Colour:']) {
        const row = util.el('div', 'vista-field', fields); util.el('span', '', row, item); util.el('span', 'vista-dash', row, '—');
      }
      const dock = util.el('div', 'vista-dock', document.body);
      for (const [icon, item, selected] of [['home','Home'],['box','Products',true],['doc','Orders'],['people','Customers'],['bars','Reports']]) {
        const row = util.el('div', `vista-dock-item${selected ? ' selected' : ''}`, dock);
        const art = util.el('span', 'vista-dock-icon', row); drawIcon(art, icon); util.el('span', '', row, item);
      }
      S.frameAlign(_c, stage);
      Object.assign(_c, { catalogMark, dock, empty, fields, inspector, stage, subControls });
    },
  };

  env.site({
    name: 'design-recall-info-compare-02',
    template: 'site/base',
    design: { parts },
  });
})();

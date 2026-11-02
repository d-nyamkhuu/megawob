(function () {
  'use strict';
  env.site({
    name: 'design-use-shop-variantpick-05',
    styles: ['site.css'],
    template: 'site/base',
    design: {
      THEMES: {
          light: { bg: '#f7f5ef', panel: '#fbfaf6', fg: '#191a17', muted: '#62635d', line: '#d9d5ca' },
          dark: { bg: '#f7f5ef', panel: '#fbfaf6', fg: '#191a17', muted: '#62635d', line: '#d9d5ca' },
          warm: { bg: '#f7f5ef', panel: '#fbfaf6', fg: '#191a17', muted: '#62635d', line: '#d9d5ca' },
        },
        ACCENTS: ['#414532', '#414532', '#414532', '#414532'],
        LOW_THEME: { bg: '#f7f5ef', panel: '#fbfaf6', fg: '#191a17', muted: '#62635d', line: '#d9d5ca' },
      LOW_ACCENTS: ['#414532'],
      parts: {
        overlay: (base) => function (ctx) {
          const result = base(ctx);
          if (ctx.kind === 'banner') {
            result.el.style.setProperty('top', document.querySelector('.lux-categories').getBoundingClientRect().bottom + 'px', 'important');
          }
          return result;
        },
        endLabel: (base) => function (rng, content) {
          const picked = base(rng, content);
          return rng.fork('riverdale/continue').bool(0.5) ? 'Continue' : picked;
        },
        'frame.placement': (base) => function (_c) {
          base(_c);
          _c.sidebar = false;
          if (!_c.ctx.finish && _c.ctx.rng.fork('riverdale/footer').bool(0.5)) {
            _c.placement = 'footer';
            _c.wantFooter = true;
          }
        },
        frameBrand: (_base, S) => function (_c, header) {
          const brand = _c.util.el('div', 'ref-brand', header);
          brand.dataset.role = 'brand';
          _c.util.el('div', 'brand-name', brand, 'RIVERDALE');
          _c.util.el('div', 'brand-tagline', brand, 'CLOTHING FOR A BRIGHTER TOMORROW');
          const nav = _c.util.el('nav', 'lux-primary', header);
          for (const label of ['Women', 'Men', 'Home', 'Lifestyle', 'Sale']) {
            const link = _c.util.el('a', label === 'Men' ? 'current' : '', nav, label);
            link.href = '#';
            link.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
          }
          const search = _c.util.el('div', 'lux-search', header);
          _c.util.el('span', 'search-glass', search);
          _c.util.el('span', '', search, 'Search products, brands, and more');
          _c.util.el('span', 'lux-user', header);
          const bag = _c.util.el('span', 'lux-bag', header);
          _c.util.el('i', '', bag, '0');
          return brand;
        },
        'frame.nav': (_base) => function (_c) {
          const nav = _c.util.el('nav', 'lux-categories', document.body);
          for (const [i, label] of ['New Arrivals', 'Tops', 'Bottoms', 'Outerwear', 'Activewear', 'Accessories'].entries()) {
            const a = _c.util.el('a', i === 1 ? 'current' : '', nav, label);
            a.href = '#';
            a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
          }
          _c.nav = nav;
        },
        'frame.instruction': (_base) => function (_c) {
          if (_c.display === 'header') {
            const n = _c.util.el('div', 'ref-instruction', _c.header);
            const icon = _c.util.el('span', 'lux-task-icon', n);
            icon.innerHTML = '<svg viewBox="0 0 24 26" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M7 4H3v20h18V4h-4M8 2h8v5H8zM7 12h10M7 16h10M7 20h6"/></svg>';
            _c.util.el('span', 'lux-task-copy', n, _c.ctx.instruction);
            n.dataset.role = 'instruction';
          }
        },
        'frame.body': (_base) => function (_c) {
          const body = _c.util.el('div', 'ref-body', document.body);
          _c.body = body;
        },
      },
    },
  });
})();

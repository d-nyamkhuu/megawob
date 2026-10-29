(function () {
  'use strict';
  env.site({
    name: 'design-find-fact-chart-05',
    template: 'site/base',
    design: {
      THEMES: {
        light: { bg: '#f8f5e9', panel: '#fffdf4', fg: '#101c58', muted: '#496178', line: '#8ca6ad' },
        dark: { bg: '#f8f5e9', panel: '#fffdf4', fg: '#101c58', muted: '#496178', line: '#8ca6ad' },
        warm: { bg: '#f8f5e9', panel: '#fffdf4', fg: '#101c58', muted: '#496178', line: '#8ca6ad' },
      },
      ACCENTS: ['#234d83'], LOW_ACCENTS: ['#234d83'],
      LOW_THEME: { bg: '#f8f5e9', panel: '#fffdf4', fg: '#101c58', muted: '#496178', line: '#8ca6ad' },
      TITLES: ['Maple Grove'],
      parts: {
        endLabel: function (base) { return function (rng, content) {
          const label = base(rng, content);
          return rng.fork('town/end').bool(0.5) ? 'Finish' : label;
        }; },
        'frame.layout': function (base) { return function (_c) {
          base(_c);
          const size = _c.ctx.size || {};
          const w = size.width || size.w || _c.W;
          const h = size.height || size.h || _c.H;
          document.documentElement.style.setProperty('--town-scale', Math.min(w / 1672, h / 941));
          document.body.classList.toggle('town-panel-mode', _c.display === 'panel');
          document.body.classList.toggle('town-header-mode', _c.display === 'header');
        }; },
        'frame.placement': function (base) { return function (_c) {
          base(_c);
          if (_c.placement === 'icon') _c.placement = 'header';
        }; },
        'frame.nav': function (base) { return function (_c) {
          base(_c);
          _c.header.querySelectorAll('.ref-nav').forEach((n) => n.remove());
        }; },
        'frame.header': function (base) { return function (_c) {
          base(_c);
          const { util } = _c;
          const header = _c.header;
          header.replaceChildren();
          const mast = util.el('div', 'town-mast', header);
          util.el('div', 'town-panorama', header);
          util.el('div', 'town-banner', mast, 'Maple Grove');
          util.el('div', 'town-tagline', mast, 'Our Town　~　Our Home');
          Object.assign(_c, { header });
        }; },
        'frame.instruction': function (base) { return function (_c) {
          const { ctx, display, header, util } = _c;
          if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        }; },
        'frame.body': function (base) { return function (_c) {
          base(_c);
          _c.body.classList.add('town-body');
          _c.body.querySelectorAll('.ref-side').forEach((n) => n.remove());
        }; },
        'frame.stage': function (base) { return function (_c) {
          base(_c);
          const stage = _c.stage;
          stage.style.justifyContent = 'stretch';
          stage.style.alignItems = 'stretch';
          const side = _c.util.el('aside', 'town-summary', _c.body);
          _c.util.el('h2', '', side, 'Maple Grove at a Glance');
          const items = [['Population','12,480'],['Households','4,930'],['Parks','8'],['Library Items','56,200'],['Recycling Drop-offs','5'],['Town Employees','112']];
          const list = _c.util.el('div', 'town-stats', side);
          items.forEach(([k,v]) => { const row = _c.util.el('div','',list); _c.util.el('span','',row,k); _c.util.el('b','',row,v); });
          const gazebo = _c.util.el('div','town-gazebo',side);
          gazebo.setAttribute('aria-hidden','true');
          _c.util.el('div','town-motto',side,'A cleaner, greener\nMaple Grove\nfor tomorrow');
          _c.util.el('div','town-leaf-rule',side);
          Object.assign(_c, { stage });
        }; },
      },
    },
  });
})();

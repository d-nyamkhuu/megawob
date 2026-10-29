(function () {
  'use strict';
  const TABS = ['Play', 'Practice', 'Stats', 'Library'];
  const SETS = [
    ['Shapes & Numbers', 12, 'grid', '#ff7b72'],
    ['Color Match', 8, 'tri', '#ffcf33'],
    ['Pattern Grid', 15, 'star', '#8564d8'],
    ['Spatial Logic', 10, 'sq', '#55c9a8'],
    ['Visual Scan', 12, 'circ', '#ff7b72'],
    ['Icon Recall', 9, 'dia', '#2f7df0'],
    ['Shape Sequence', 14, 'plus', '#8564d8'],
    ['Matrix Mix', 11, 'hex', '#ffcf33'],
    ['Quick Find', 8, 'down', '#55c9a8'],
  ];
  const glyph = (kind, c) => {
    const p = {
      grid: '<circle cx="12" cy="12" r="12" fill="' + c + '"/><g fill="#fff">' +
        [7, 12, 17].map((x) => [7, 12, 17].map((y) => '<circle cx="' + x + '" cy="' + y + '" r="1.6"/>').join('')).join('') + '</g>',
      tri: '<path d="M12 2L23 21H1z" fill="' + c + '"/>',
      star: '<path d="M12 1l3.3 7 7.7.9-5.7 5.2 1.6 7.6L12 17.8 5.1 21.7l1.6-7.6L1 8.9 8.7 8z" fill="' + c + '"/>',
      sq: '<rect x="2" y="2" width="20" height="20" fill="' + c + '"/>',
      circ: '<circle cx="12" cy="12" r="11" fill="' + c + '"/>',
      dia: '<path d="M12 0l12 12-12 12L0 12z" fill="' + c + '"/>',
      plus: '<path d="M8 2h8v6h6v8h-6v6H8v-6H2V8h6z" fill="' + c + '"/>',
      hex: '<path d="M7 3h10l6 9-6 9H7l-6-9z" fill="' + c + '"/>',
      down: '<path d="M1 3h22L12 22z" fill="' + c + '"/>',
    }[kind];
    return '<svg viewBox="0 0 24 24" width="30" height="30">' + p + '</svg>';
  };
  const svgIcon = (parent, util, d, extra) => {
    const s = util.svg('svg', { width: 28, height: 28, viewBox: '0 0 24 24', class: 'mp-ico' }, parent);
    util.svg('path', Object.assign({ d, fill: 'none', stroke: '#16163a', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, extra || {}), s);
    return s;
  };

  env.site({
    name: 'design-read-figure-spatial-05',
    template: 'site/base',
    design: {
      parts: {
        overlay: (base) => (ctx) => {
          const result = base(ctx);
          if (['cookie', 'promo', 'banner', 'chat', 'toast'].includes(ctx.kind)) {
            result.el.style.setProperty('position', 'fixed', 'important');
            result.el.style.setProperty('top', 'auto', 'important');
            result.el.style.setProperty('left', 'auto', 'important');
            result.el.style.setProperty('right', '16px', 'important');
            result.el.style.setProperty('bottom', '76px', 'important');
            result.el.style.setProperty('width', 'min(360px, calc(100vw - 32px))', 'important');
            result.el.style.setProperty('height', 'auto', 'important');
            result.el.style.setProperty('max-height', '140px', 'important');
            result.el.style.setProperty('box-sizing', 'border-box', 'important');
            result.el.style.setProperty('padding', '10px', 'important');
            result.el.style.setProperty('background', '#fcf9f3', 'important');
            result.el.style.setProperty('border', '3px solid #16163a', 'important');
            result.el.style.setProperty('pointer-events', 'auto', 'important');
            result.el.style.setProperty('display', 'block', 'important');
            const box = result.el.querySelector('.ref-ov-box');
            if (box) {
              box.style.setProperty('width', '100%', 'important');
              box.style.setProperty('max-width', '100%', 'important');
              box.style.setProperty('max-height', 'none', 'important');
              box.style.setProperty('padding', '0', 'important');
              box.style.setProperty('background', 'transparent', 'important');
              box.style.setProperty('box-shadow', 'none', 'important');
            }
          }
          return result;
        },
        'frame.header': () => function (_c) {
          const { util } = _c;
          const header = util.el('header', 'ref-task', document.body);
          const brand = util.el('div', 'ref-brand mp-brand', header);
          brand.dataset.role = 'brand';
          brand.innerHTML =
            '<svg viewBox="0 0 56 44" width="56" height="44"><circle cx="17" cy="14" r="14" fill="#8564d8"/><path d="M52 4v38H18z" fill="#ff7b72"/></svg><span>Brightly</span>';
          Object.assign(_c, { header });
        },
        'frame.nav': () => function (_c) {
          const { header, util } = _c;
          const n = util.el('nav', 'ref-nav mp-tabs', header);
          TABS.forEach((t, i) => {
            const a = util.el('a', 'ref-navlink' + (i === 0 ? ' on' : ''), n, t);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: t }); });
          });
        },
        'frame.tools': () => function (_c) {
          const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
          let submit = null;
          const headerTools = util.el('div', 'ref-tools', header);
          for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
          if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
          if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
          if (placement === 'icon') submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
          const ic = util.el('div', 'mp-icons', headerTools);
          svgIcon(ic, util, 'M10.5 4a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM15.5 15.5L21 21');
          svgIcon(ic, util, 'M6 16.5V11a6 6 0 0112 0v5.5l1.8 1.8H4.2zM10 20.5a2 2 0 004 0');
          const av = util.el('span', 'mp-avatar', ic);
          av.innerHTML = '<svg viewBox="0 0 24 24" width="48" height="48"><circle cx="12" cy="12" r="12" fill="#c9bdf7"/><circle cx="12" cy="9.5" r="4" fill="#4a4a68"/><path d="M4.5 20a7.5 6 0 0115 0z" fill="#4a4a68"/></svg>';
          Object.assign(_c, { headerTools, submit });
        },
        'frame.body': () => function (_c) {
          const { util } = _c;
          const body = util.el('div', 'ref-body', document.body);
          const side = util.el('aside', 'ref-side mp-side', body);
          util.el('div', 'mp-side-title', side, 'Puzzle Set');
          const list = util.el('div', 'mp-list', side);
          SETS.forEach(([name, n, kind, c], i) => {
            const row = util.el('a', 'mp-row' + (i === 0 ? ' on' : ''), list);
            row.dataset.role = 'nav';
            row.innerHTML = '<i>' + glyph(kind, c) + '</i><b>' + name.replace('&', '&amp;') + '</b><em>' + n + '</em>';
            row.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: name }); });
          });
          Object.assign(_c, { body });
        },
        'frame.panel': () => function (_c) {
          const { body, ctx, display, util } = _c;
          if (display === 'panel') {
            const panel = util.el('aside', 'ref-panel', body);
            util.el('div', 'ref-panel-title', panel, 'Your task');
            util.el('div', 'ref-panel-text', panel, ctx.instruction);
          }
        },
        'frame.stage': () => function (_c) {
          const { body, util } = _c;
          const deco = util.el('div', 'mp-deco', body);
          deco.innerHTML =
            '<svg class="mp-d1" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#c9bdf7"/></svg>' +
            '<svg class="mp-d2" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#ff7b72"/></svg>' +
            '<svg class="mp-d3" viewBox="0 0 60 40">' +
            [0, 1, 2].map((r) => [0, 1, 2].map((c) => '<circle cx="' + (6 + c * 24) + '" cy="' + (6 + r * 14) + '" r="4" fill="#ff7b72"/>').join('')).join('') + '</svg>' +
            '<svg class="mp-d4" viewBox="0 0 100 100"><path d="M0 70L60 0h20L0 90zM0 100L100 0v20L20 100z" fill="#c9bdf7"/></svg>';
          const stage = util.el('main', 'ref-stage', body);
          stage.style.justifyContent = 'flex-start';
          stage.style.alignItems = 'center';
          Object.assign(_c, { stage });
        },
        'frame.footer': (base) => base,
      },
    },
  });
})();

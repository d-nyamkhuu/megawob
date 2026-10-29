// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebarDraw = roomy && rng.bool(0.35);
      const navDraw = W >= 1180 && rng.bool(0.5);
      const sidebar = false;
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, sidebarDraw, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const menu = util.el('div', 'mac-menu', header, '　 File　 Edit　 View　 Records　 Window　 Help');
      menu.setAttribute('aria-hidden', 'true');
      menu.firstChild.textContent = menu.firstChild.textContent.replace(/^[^A-Za-z]+/, '  ');
      const apple = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      apple.setAttribute('viewBox', '0 0 20 22'); apple.setAttribute('width', '19'); apple.setAttribute('height', '21');
      apple.innerHTML = '<path d="M10 6c-3-2-8-1-8 5 0 5 3 10 6 10 1 0 1-1 2-1s1 1 2 1c3 0 6-5 6-8-3-1-3-5 0-6-2-3-6-2-8-1zM11 5c0-2 1-4 4-4 0 2-1 4-4 4z" fill="#000"/>';
      menu.insertBefore(apple, menu.firstChild);
      const mr = util.el('span', 'mac-menu-r', menu);
      util.el('b', '', mr, '?'); util.el('span', '', mr, 'Mon Apr 14  9:27 AM');
      const bar = util.el('div', 'ref-brand', header, 'Device Registration');
      bar.dataset.role = 'brand';
      const info = util.el('div', 'device-summary', header);
      util.el('div', 'computer-drawing', info, '▣');
      const machine = util.el('section', 'machine-data', info);
      util.el('h1', '', machine, 'Macintosh II');
      for (const [k, v] of [['Serial Number:', 'F4201ZX93'], ['Model:', 'Macintosh II'], ['Memory:', '8 MB'], ['System Software:', '6.0.8']]) {
        const row = util.el('div', 'summary-row', machine); util.el('span', '', row, k); util.el('span', '', row, v);
      }
      const owner = util.el('section', 'owner-data', info);
      for (const [k, v] of [['Owner:', 'Taylor, Morgan'], ['Organization:', 'Riverton Research'], ['Department:', 'Engineering'], ['Location:', 'Bldg. 3, Room 210'], ['Phone:', '(415) 555-0139']]) {
        const row = util.el('div', 'summary-row', owner); util.el('span', '', row, k); util.el('span', '', row, v);
      }
      const doc = util.el('div', 'registration-doc', info);
      util.el('div', 'paper-icon', doc, '▤'); util.el('div', '', doc, 'Registration\nfor this Device');
      Object.assign(_c, { header, brand: bar, title: 'Device Registration' });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      Object.assign(_c, {});
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-recall-info-code-05',
    template: 'site/base',
    design: { parts },
  });
})();

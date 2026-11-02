// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = ctx.size ? ctx.size.width : document.documentElement.clientWidth;
      const H = ctx.size ? ctx.size.height : document.documentElement.clientHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      document.body.classList.toggle('ref-display-header', display === 'header');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebarDraw = roomy && rng.bool(0.35);
      const navDraw = W >= 1180 && rng.bool(0.5);
      // This design is the Brightpage desktop app: its left rail and account tabs
      // are part of the application frame on every episode.
      const sidebar = false;
      const nav = false;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      const endRng = ctx.rng.fork('hearthbox/end');
      placement = ctx.finish ? null : endRng.pick(['footer', 'footer', 'footer', 'footer', 'icon', 'link']);
      if (!word && endRng.bool(0.55)) label = 'Confirm';
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, sidebarDraw, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      base(_c);
      const { util, header } = _c;
      const title = util.el('div', 'xp-titlebar');
      document.body.insertBefore(title, header);
      util.el('span', 'xp-app-icon', title, 'e');
      util.el('span', 'xp-caption', title, 'Hearthbox Meals - My Account - Microsoft Internet Explorer');
      const controls = util.el('div', 'xp-window-controls', title);
      for (const text of ['−', '□', '×']) util.el('span', '', controls, text);
      const brand = header.querySelector('.ref-brand');
      if (brand) brand.remove();
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        util.el('div', 'bp-logo', side, '◧');
        util.el('div', 'bp-brand', side, 'Brightpage Books');
        const sampledItems = local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        const appItems = ['Home', 'Browse', 'My Library', 'Account', 'Settings', 'Help'];
        for (const [i] of sampledItems.slice(0, 6).entries()) {
          const item = appItems[i % appItems.length];
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body });
    },
    'frame.panel': (base, S) => function (_c) {
      base(_c);
      // The task card belongs with the help notes, without narrowing the task pane.
      _c.panel = _c.body.querySelector('.ref-panel');
      _c.body.classList.remove('ref-panel-right');
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
    'frame.footer': (base, S) => function (_c) {
      base(_c);
      const { util, header, headerTools, display, placement, ctx, endBtn, label } = _c;
      const foot = document.querySelector('.ref-foot') || util.el('footer', 'ref-foot', document.body);
      const text = foot.querySelector('.ref-foot-text');
      if (text) text.remove();
      const tools = foot.querySelector('.ref-tools') || util.el('div', 'ref-tools', foot);
      for (const node of [...headerTools.children]) {
        if (node !== _c.submit || !['header', 'icon'].includes(placement)) tools.appendChild(node);
      }
      if (!ctx.finish && !_c.submit && placement === 'footer') _c.submit = endBtn(tools, 'ref-submit', label);
      if (!ctx.finish && !_c.submit && placement === 'link') _c.submit = endBtn(tools, 'ref-endlink', label);
      if (display !== 'header' && !['header', 'icon'].includes(placement)) header.style.display = 'none';
      util.el('span', 'xp-footer-status', foot, 'Hearthbox Meals');
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-roach-05',
    template: 'site/base',
    design: { parts },
  });
})();

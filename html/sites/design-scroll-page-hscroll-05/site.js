// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
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
      document.body.classList.add('gnome-help');
      const windowbar = util.el('div', 'gnome-windowbar', document.body);
      const lights = util.el('span', 'gnome-appmark', windowbar);
      for (const c of ['r', 'y', 'g']) util.el('i', 'tl tl-' + c, lights);
      util.el('strong', 'gnome-windowtitle', windowbar, 'Creative Suite Help Center');
      util.el('span', 'gnome-wincontrols', windowbar);
      const menubar = util.el('nav', 'gnome-menubar', document.body);
      const tabs = util.el('div', 'aq-tabs', menubar);
      ['Home', 'Guides', 'Help Articles', 'Video Tutorials', 'Community', 'Downloads'].forEach((t, i) => {
        util.el('span', 'aq-tab' + (i === 0 ? ' on' : ''), tabs, t);
      });
      util.el('span', 'aq-search', menubar, '⌕  Search Help Center');
      const toolbar = util.el('div', 'gnome-toolbar', document.body);
      Object.assign(_c, { collide, cr, decoys, label, menubar, nav, placement, sidebar, toolbar, wantFooter, windowbar });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, util, word } = _c;
      const { K } = S;
      const header = util.el('header', 'ref-task', document.body);
      document.body.dataset.instruction = display;
      if (display !== 'header' || nav) {
        const title = 'ubuntu';
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
    },
    'frame.tools': (base) => function (_c) {
      base(_c);
      _c.menubar.appendChild(_c.headerTools);
    },
    'frame.footer': (base) => function (_c) {
      base(_c);
      const foot = document.querySelector('.ref-foot');
      if (!foot) return;
      foot.querySelector('.ref-foot-text')?.remove();
      if (_c.placement !== 'footer' && _c.placement !== 'link') {
        for (const b of foot.querySelectorAll('button, a')) _c.headerTools.appendChild(b);
        foot.remove();
      }
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const side = util.el('div', 'aq-side-column', body);
      const panel = body.querySelector('.ref-panel');
      if (panel) side.appendChild(panel);
      const inspector = util.el('aside', 'gnome-inspector', side);
      const heading = util.el('div', 'gnome-inspector-heading', inspector);
      util.el('span', 'aq-bulb', heading);
      heading.appendChild(document.createTextNode('Tips'));
      const card = util.el('div', 'gnome-inspector-card', inspector);
      util.el('span', '', card, 'Browse the articles below to learn more about using Creative Suite. Click Save on any article to add it to your saved list for later.');
      util.el('hr', '', inspector);
      util.el('b', '', inspector, 'Related resources');
      for (const item of ['User guide (PDF)', 'Keyboard shortcuts', 'Community forums', 'Contact support']) util.el('a', 'gnome-related', inspector, item);
      S.frameAlign(_c, stage);
      Object.assign(_c, { card, inspector, stage });
    },
  };

  env.site({
    name: 'design-scroll-page-hscroll-05',
    template: 'site/base',
    design: { parts },
  });
})();

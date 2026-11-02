// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      document.body.classList.toggle('ref-has-header-note', display === 'header');
      document.body.classList.toggle('ref-has-panel-note', display === 'panel');
      Object.assign(_c, { H, W, display, roomy, tall });
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
      const titlebar = util.el('div', 'gtk-titlebar', document.body);
      util.el('span', 'gtk-appicon', titlebar, '▣');
      util.el('strong', '', titlebar, 'Job Applications');
      const win = util.el('div', 'gtk-window-controls', titlebar);
      for (const [c, t] of [['min','−'], ['max','□'], ['close','×']]) util.el('span', `gtk-win-${c}`, win, t);
      const menubar = util.el('nav', 'gtk-menubar', document.body);
      for (const t of ['File', 'Edit', 'View', 'Tools', 'Help']) util.el('span', '', menubar, t);
      Object.assign(_c, { collide, cr, decoys, label, menubar, nav, placement, sidebar, titlebar, wantFooter, win });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        if (word) _c.brandLabel = word(lr.pick(K.brand));
      }
      const brand = util.el('div', 'ref-brand', header, _c.brandLabel || 'QuillPost');
      brand.dataset.role = 'brand';
      Object.assign(_c, { header });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const account = util.el('div', 'ref-account', header);
      util.el('span', 'ref-bell', account, '♟');
      util.el('span', 'ref-help', account, '?');
      util.el('span', 'ref-avatar', account, 'NK');
      util.el('span', 'ref-account-name', account, 'Naomi Kobayashi⌄');
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { account, headerTools, submit });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const rail = util.el('nav', 'ref-rail', body);
      for (const [icon, text] of [['⌂','Home'], ['▣','Jobs'], ['♟','Candidates'], ['▤','Applications'], ['▦','Interviews'], ['▥','Reports'], ['⚙','Settings']]) {
        util.el('div', `ref-rail-item${text === 'Jobs' ? ' active' : ''}`, rail, `${icon}　 ${text}`);
      }
      const side = body.querySelector('.ref-side');
      if (side) rail.append(side);
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'gtk-inspector', body);
      const panel = body.querySelector('.ref-panel');
      if (panel) inspector.append(panel);
      const ih = util.el('div', 'gtk-inspector-head', inspector);
      util.el('strong', '', ih, 'Job Openings');
      util.el('a', 'openings-view', ih, 'View all');
      const info = util.el('div', 'gtk-inspector-content', inspector);
      const openings = [
        ['Chief Operating Officer','Zinnia Floral Design','On-site','Apr 14, 2026'],
        ['Marketing Manager','QuillPost','Hybrid','Apr 10, 2026'],
        ['Product Designer','QuillPost','Remote','Apr 8, 2026'],
        ['Sales Executive','BrightPath Solutions','On-site','Apr 5, 2026'],
        ['Customer Success Manager','QuillPost','Hybrid','Mar 28, 2026'],
        ['Operations Analyst','Zinnia Floral Design','On-site','Mar 20, 2026'],
      ];
      for (let i = 0; i < openings.length; i++) {
        const row = util.el('div', `opening-row${i === 0 ? ' opening-selected' : ''}`, info);
        util.el('strong', '', row, openings[i][0]);
        util.el('span', 'opening-company', row, openings[i][1]);
        util.el('span', 'opening-meta', row, `${openings[i][2]}  •  Full-time`);
        util.el('span', 'opening-date', row, openings[i][3]);
      }
      const appDock = util.el('nav', 'gtk-dock', document.body);
      for (const [icon, text] of [['▣','Applications'], ['🌐','Job Search'], ['★','Saved Jobs'], ['▤','My Profile']]) {
        const item = util.el('div', 'gtk-dock-item', appDock);
        util.el('span', 'gtk-dock-icon', item, icon); util.el('span', '', item, text);
      }
      Object.assign(_c, { appDock, ih, info, inspector, openings, stage });
    },
  };

  env.site({
    name: 'design-complete-wizard-application-02',
    template: 'site/base',
    design: { parts },
  });
})();

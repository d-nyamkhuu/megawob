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
    'frame.stage': (base, S) => function (_c) {
      const { body, rng, util } = _c;
      const workspace = util.el('section', 'gtk-workspace', body);
      util.el('div', 'gtk-workspace-title', workspace, 'Job Application');
      const stage = util.el('main', 'ref-stage', workspace);
      // Preserve the episode's draws; the desktop work area always fills its pane.
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      stage.style.justifyContent = 'center';
      stage.style.alignItems = 'flex-start';
      const inspector = util.el('aside', 'gtk-inspector', body);
      util.el('div', 'gtk-inspector-head', inspector, 'Details');
      const info = util.el('div', 'gtk-inspector-content', inspector);
      util.el('strong', '', info, 'Teaching Assistant');
      util.el('div', '', info, 'Riverside Primary School');
      util.el('div', '', info, 'Manchester, UK');
      util.el('div', '', info, 'Ref: TPS-2027-014');
      util.el('div', '', info, 'Posted: 12 Apr 2009');
      util.el('hr', '', info);
      util.el('p', '', info, 'We are seeking a dedicated Teaching Assistant to support our teaching staff and contribute to a positive learning environment for all pupils.');
      util.el('hr', '', info);
      for (const [a, b] of [['Employment type','Full-time'], ['Work arrangement','Remote (option available)'], ['Experience level','Mid-level'], ['Closing date','30 Apr 2009']]) {
        util.el('b', '', info, a); util.el('div', '', info, b);
      }
      const appDock = util.el('nav', 'gtk-dock', document.body);
      for (const [icon, text] of [['▣','Applications'], ['🌐','Job Search'], ['★','Saved Jobs'], ['▤','My Profile']]) {
        const item = util.el('div', 'gtk-dock-item', appDock);
        util.el('span', 'gtk-dock-icon', item, icon); util.el('span', '', item, text);
      }
      Object.assign(_c, { appDock, info, inspector, stage });
    },
    'frame.end': (base, S) => function (_c) {
      const { header, menubar, body, inspector, info, appDock, headerTools } = _c;
      // These are frame nodes only. Reserve their space before the widget renders.
      menubar.appendChild(headerTools);
      const nav = header.querySelector('.ref-nav');
      if (nav) inspector.insertBefore(nav, info);
      const side = body.querySelector('.ref-side');
      if (side) inspector.appendChild(side);
      const panel = body.querySelector('.ref-panel');
      if (panel) inspector.insertBefore(panel, info);
      const note = document.body.querySelector('.ref-note');
      if (note) inspector.insertBefore(note, info);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) appDock.appendChild(foot);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) appDock.appendChild(dock);
      return base(_c);
    },
  };

  env.site({
    name: 'design-complete-wizard-application-01',
    template: 'site/base',
    design: { parts },
  });
})();

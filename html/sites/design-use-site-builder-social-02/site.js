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

      // 2021 publishing workspace frame: dark application tabs.
      const winbar = util.el('div', 'cms-windowbar', document.body);
      util.el('span', 'cms-mark', winbar, 'Studio');
      util.el('span', 'cms-window-title', winbar, '');
      const wincontrols = util.el('div', 'cms-window-controls', winbar);
      const topIcon = (cls, path) => {
        const wrap = util.el('span', cls, wincontrols);
        const svg = util.svg('svg', { viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':1.8, 'stroke-linecap':'round', 'stroke-linejoin':'round' }, wrap);
        util.svg('path', { d:path }, svg);
      };
      topIcon('cms-search', 'M20 20l-5-5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0');
      topIcon('cms-bell', 'M6 8a6 6 0 0 1 12 0v7l3 3H3l3-3zM10 21h4M12 1v2');
      util.el('span', 'cms-user', wincontrols, 'JD');
      const cmsnav = util.el('nav', 'cms-navigation', document.body);
      for (const title of ['Pages', 'Campaigns', 'Social', 'Media', 'Analytics', 'Settings']) {
        const item = util.el('div', `cms-nav-item${title === 'Social' ? ' active' : ''}`, cmsnav);
        util.el('span', '', item, title);
      }
      cmsnav.appendChild(wincontrols);
      const campaign = util.el('section', 'cms-campaign-band', document.body);
      const landscape = util.el('div', 'cms-campaign-photo', campaign);
      landscape.setAttribute('aria-hidden', 'true');
      const summary = util.el('div', 'cms-campaign-summary', campaign);
      util.el('div', 'cms-campaign-title', summary, 'Spring Campaign');
      util.el('div', 'cms-campaign-subtitle', summary, 'Social Publishing');
      util.el('div', 'cms-campaign-copy', summary, 'Share seasonal updates, behind the scenes content and product news across your social channels.');
      const channels = util.el('div', 'cms-campaign-channels', summary);
      for (const [icon, label, cls] of [['f','Facebook','fb'], ['♥','Twitter','tw'], ['in','LinkedIn','li'], ['p','Pinterest','pin']]) {
        const badge = util.el('span', `cms-channel ${cls}`, channels);
        util.el('b', '', badge, icon);
        util.el('span', '', badge, label);
      }
      const stats = util.el('div', 'cms-campaign-stats', campaign);
      for (const [number, label] of [['4','Draft Posts'], ['0','Scheduled Posts'], ['0','Published Posts']]) {
        const stat = util.el('div', 'cms-campaign-stat', stats);
        util.el('b', '', stat, number);
        util.el('span', '', stat, label);
      }
      Object.assign(_c, { campaign, channels, cmsnav, collide, cr, decoys, label, landscape, nav, placement, sidebar, stats, summary, topIcon, wantFooter, winbar, wincontrols });
    },
    'frame.header': (base, S) => function (_c) {
      const { campaign, display, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      campaign.before(header);
      document.body.classList.toggle('cms-header-mode', display === 'header');
      S.frameBrand(_c, header);
      Object.assign(_c, { header });
    },
    'frame.floating': (base, S) => function (_c) {
      const { W, body, campaign, endBtn, header, label, placement, root, stage, util, winbar } = _c;
      let { submit } = _c;
      if (placement === 'floating') {
        // Reserve the control's space so it cannot intercept task clicks or drags.
        // On scrollable pages the dock follows the content, just like a form footer.
        const dock = util.el('div', 'ref-float-dock', document.body);
        submit = endBtn(dock, 'ref-submit ref-float', label);
      }
      // Consume the inherited frame's draws above, but omit its unrelated rails.
      body.querySelector('.ref-side')?.remove();
      header.querySelector('.ref-nav')?.remove();
      header.querySelector('.ref-brand')?.remove();
      const instructionPanel = body.querySelector('.ref-panel');
      if (instructionPanel && W >= 1400) {
        body.appendChild(instructionPanel);
        stage.classList.add('studio-panel-stage');
      }
      campaign.remove();
      winbar.remove();
      root.style.setProperty('--bg', '#faf9f6');
      root.style.setProperty('--panel', '#ffffff');
      root.style.setProperty('--fg', '#101923');
      root.style.setProperty('--muted', '#647080');
      root.style.setProperty('--line', '#d5d8dc');
      root.style.setProperty('--accent', '#a5f526');
      Object.assign(_c, { instructionPanel, submit });
    },
  };

  env.site({
    name: 'design-use-site-builder-social-02',
    template: 'site/base',
    design: { parts },
  });
})();

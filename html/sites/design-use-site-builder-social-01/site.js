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

      // 2011 desktop app frame: walnut title strip and fixed CMS navigation.
      const winbar = util.el('div', 'cms-windowbar', document.body);
      util.el('span', 'cms-mark', winbar, '❧');
      util.el('span', 'cms-window-title', winbar, 'Havenridge CMS');
      const wincontrols = util.el('div', 'cms-window-controls', winbar);
      for (const [cls, glyph] of [['min', '−'], ['max', '□'], ['close', '×']]) util.el('span', `cms-win-${cls}`, wincontrols, glyph);
      const cmsnav = util.el('nav', 'cms-navigation', document.body);
      for (const [icon, title] of [['◆','Dashboard'], ['▤','Content'], ['✉','Campaigns'], ['●','Social'], ['▮','SEO'], ['▧','Media'], ['◷','Reports'], ['⚙','Settings']]) {
        const item = util.el('div', `cms-nav-item${title === 'Content' ? ' active' : ''}`, cmsnav);
        util.el('span', 'cms-nav-icon', item, icon);
        util.el('span', '', item, title);
      }
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
      Object.assign(_c, { campaign, channels, cmsnav, collide, cr, decoys, label, landscape, nav, placement, sidebar, stats, summary, wantFooter, winbar, wincontrols });
    },
    'frame.header': (base, S) => function (_c) {
      const { campaign, display, util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      campaign.before(header);
      document.body.classList.toggle('cms-header-mode', display === 'header');
      S.frameBrand(_c, header);
      Object.assign(_c, { header });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-use-site-builder-social-01',
    template: 'site/base',
    design: { parts },
  });
})();

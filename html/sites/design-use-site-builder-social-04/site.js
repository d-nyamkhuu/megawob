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
      document.body.dataset.cmsDisplay = display;
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
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

      // 2011 desktop app frame: walnut title strip and fixed CMS navigation.
      const winbar = util.el('div', 'cms-windowbar', document.body);
      util.el('span', 'cms-mark', winbar, '▣');
      util.el('span', 'cms-window-title', winbar, 'Community Page Studio - Social Publisher');
      const wincontrols = util.el('div', 'cms-window-controls', winbar);
      for (const [cls, glyph] of [['min', '−'], ['max', '□'], ['close', '×']]) util.el('span', `cms-win-${cls}`, wincontrols, glyph);
      const menubar = util.el('nav', 'cms-menubar', document.body);
      for (const title of ['File', 'Edit', 'View', 'Insert', 'Tools', 'Publish', 'Help']) {
        const item = util.el('span', 'cms-menu-item', menubar, title);
        item.dataset.role = 'menu';
      }
      const cmsnav = util.el('nav', 'cms-navigation', document.body);
      const toolbarItems = [
        ['▣','New Post'], ['▰','Open'], ['▧','Preview'], ['▦','Schedule'], ['◉','Publish'], ['▥','Reports'],
        ['⌂','Home'], ['▤','Pages'], ['▧','Media'], ['♟','Social'], ['⚙','Settings'],
      ];
      for (const [icon, title] of toolbarItems) {
        const item = util.el('div', `cms-nav-item${title === 'Social' ? ' active' : ''}`, cmsnav);
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
      Object.assign(_c, { campaign, channels, cmsnav, collide, cr, decoys, label, landscape, menubar, nav, placement, sidebar, stats, summary, toolbarItems, wantFooter, winbar, wincontrols });
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
      const { body, display, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // The reference design includes a persistent post-properties inspector beside the task sheet.
      // Keep it decorative: all editable task state remains owned by the task widget.
      if (display !== 'panel') {
        const inspector = util.el('aside', 'cms-post-inspector', document.body);
        util.el('div', 'cms-inspector-heading', inspector, 'Post Details');
        const field = (label, cls) => {
          const row = util.el('div', `cms-inspector-row ${cls || ''}`, inspector);
          util.el('div', 'cms-inspector-label', row, label);
          util.el('div', 'cms-inspector-value', row);
        };
        field('Title:');
        field('Content:', 'content');
        const imageRow = util.el('div', 'cms-inspector-image-row', inspector);
        util.el('div', 'cms-inspector-label', imageRow, 'Image:');
        util.el('div', 'cms-inspector-image', imageRow, '▧');
        util.el('div', 'cms-inspector-change', imageRow, 'Change…');
        field('Tags:');
        const platforms = util.el('div', 'cms-inspector-platforms', inspector);
        util.el('div', 'cms-inspector-label', platforms, 'Platforms:');
        for (const [name, checked] of [['Community Page', true], ['Twitter', true], ['FriendSpace', false], ['PhotoShare', false]]) {
          const item = util.el('div', 'cms-inspector-platform', platforms);
          util.el('span', checked ? 'cms-check checked' : 'cms-check', item, checked ? '✓' : '');
          util.el('span', '', item, name);
        }
      }
      Object.assign(_c, { stage });
    },
  };

  env.site({
    name: 'design-use-site-builder-social-04',
    template: 'site/base',
    design: { parts },
  });
})();

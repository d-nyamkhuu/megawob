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
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.placement': (base, S) => function (_c) {
      const { content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const navDraw = rng.bool(0.5);
      const nav = true;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'DevWorkspace');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        const navLabels = ['Code', 'Builds', 'Pipelines', 'Logs', 'Database', 'Feature Flags', 'Environments'];
        for (const item of navLabels) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // Static related-events index (filler): fixed rows, independent of the log explorer.
      const related = util.el('aside', 'logs-related', body);
      util.el('div', 'logs-related-title', related, '☷  Related Events');
      const relatedTabs = util.el('div', 'logs-related-tabs', related);
      for (const tab of ['All Events', 'Errors', 'Warnings', 'Info']) util.el('span', 'logs-related-tab', relatedTabs, tab);
      const relatedList = util.el('div', 'logs-related-list', related);
      const FILLER = [['14:31:02', 'auth', 'INFO', 'token refresh ok'], ['14:31:15', 'scheduler', 'INFO', 'job queued nightly-sync'],
        ['14:31:40', 'db', 'WARN', 'slow query 820 ms'], ['14:32:08', 'worker', 'INFO', 'batch complete'],
        ['14:32:31', 'db', 'DEBUG', 'connection pool resized'], ['14:33:05', 'auth', 'WARN', 'rate limit near threshold'],
        ['14:33:47', 'scheduler', 'INFO', 'heartbeat'], ['14:34:12', 'worker', 'ERROR', 'retry limit reached']];
      for (const [time, service, level, message] of FILLER) {
        const row = util.el('div', 'logs-related-row', relatedList);
        util.el('span', 'logs-cell logs-time', row, time);
        util.el('span', 'logs-cell logs-service', row, service);
        util.el('span', `logs-cell logs-level logs-level-${level.toLowerCase()}`, row, level);
        util.el('span', 'logs-cell logs-message', row, message);
      }
      Object.assign(_c, { related, relatedList, relatedTabs, stage });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-dev-tools-logs-01',
    template: 'site/base',
    design: { parts },
  });
})();

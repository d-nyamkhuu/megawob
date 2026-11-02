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
      util.el('div', 'logs-window-caption', document.body, '▤  DevCenter');
      if (display !== 'header' || nav) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'DevWorkspace');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const sampledNav = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
      const navLabels = ['Code', 'Builds', 'Deployments', 'Logs', 'Database', 'Feature Flags'];
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
      const summary = util.el('section', 'logs-summary', body);
      const summaryIcon = util.el('div', 'logs-summary-icon', summary);
      summaryIcon.innerHTML = '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M9 11 41 5 57 11 57 49 25 59 9 52Z" fill="#aaa" stroke="#111" stroke-width="2"/><path d="M9 11 25 17 57 11M9 24 25 30 57 23M9 37 25 43 57 36M25 17V59" fill="none" stroke="#111" stroke-width="3"/><path d="M12 15 24 20 24 28 12 23ZM12 28 24 33 24 41 12 36ZM12 41 24 46 24 55 12 50Z" fill="#161616"/><path d="M28 19 54 14 54 22 28 27ZM28 32 54 27 54 35 28 40ZM28 45 54 40 54 48 28 55Z" fill="#eee" stroke="#111" stroke-width="1.5"/></svg>';
      const summaryHead = util.el('div', 'logs-summary-head', summary);
      util.el('div', 'logs-summary-title', summaryHead, 'Log Explorer');
      util.el('div', 'logs-summary-subtitle', summaryHead, 'Browse and analyze application logs from all environments.');
      const environment = util.el('div', 'logs-summary-control logs-summary-env', summary);
      util.el('div', '', environment, 'Environment');
      util.el('div', 'logs-summary-value', environment, 'production');
      const range = util.el('div', 'logs-summary-control logs-summary-range', summary);
      util.el('div', '', range, 'Time Range');
      util.el('div', 'logs-summary-value', range, 'Last 1 hour');
      const services = util.el('div', 'logs-summary-control logs-summary-services', summary);
      util.el('div', '', services, 'Services');
      util.el('div', 'logs-summary-value', services, 'All Services');
      const counts = util.el('div', 'logs-summary-counts', summary);
      util.el('b', '', counts, 'Events (last 1 hour)');
      for (const [level, count, color] of [['ERROR', '12', '#e33'], ['WARN', '38', '#f5ad19'], ['INFO', '421', '#3470cf'], ['DEBUG', '203', '#777']]) {
        const item = util.el('div', 'logs-summary-count', counts);
        util.el('i', '', item);
        item.lastChild.style.background = color;
        util.el('span', '', item, level);
        util.el('span', '', item, count);
      }
      const chart = util.el('div', 'logs-summary-chart', summary);
      const heights = [22,34,43,38,48,62,72,65,54,61,51,44,32,29,38,47,35,39,28,30,36,22,25,33,29,39,32,20];
      for (const height of heights) { const bar = util.el('i', '', chart); bar.style.height = height + 'px'; }
      util.el('div', 'logs-summary-times', chart, '14:00　　 14:10　　 14:20　　 14:30　　 14:40　　 14:50');
      const work = util.el('div', 'logs-main', body);
      const stage = util.el('main', 'ref-stage', work);
      S.frameAlign(_c, stage);
      stage.addEventListener('click', (event) => {
        if (event.target.closest('.dv-row')) stage.classList.add('logs-row-selected');
      });

      const related = util.el('aside', 'logs-related', work);
      util.el('div', 'logs-related-title', related, 'Help & Legend');
      const helpLevels = util.el('section', 'logs-help-section', related);
      util.el('b', '', helpLevels, 'Log Levels');
      for (const [level, color, text] of [['ERROR','#e33','Serious problem, requires attention.'],['WARN','#f5ad19','Unexpected behavior, review if needed.'],['INFO','#3470cf','General information about system behavior.'],['DEBUG','#777','Detailed diagnostic information.']]) {
        const row = util.el('div', 'logs-help-level', helpLevels);
        const swatch = util.el('i', '', row); swatch.style.background = color;
        util.el('strong', '', row, level); util.el('span', '', row, text);
      }
      const tips = util.el('section', 'logs-help-section', related);
      util.el('b', '', tips, 'Tips');
      const tipList = util.el('ul', '', tips);
      for (const tip of ['Use the search box to filter by keyword, service, or request ID.','Select a time range to narrow results.','Click a log entry to view full details, including stack traces and related events.','Use service and severity filters to focus on relevant logs.']) util.el('li', '', tipList, tip);
      const queries = util.el('section', 'logs-help-section', related);
      util.el('b', '', queries, 'Common Queries');
      const queryList = util.el('ul', '', queries);
      for (const [label, query] of [['Errors in the last hour','level:error'],['Logs from a specific service','service:session-cache'],['Find by request ID','request_id:12345'],['Search for a phrase','"example message"']]) {
        const li = util.el('li', '', queryList); util.el('span', '', li, label); util.el('code', '', li, query);
      }
      Object.assign(_c, { related, stage });
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-dev-tools-logs-05',
    template: 'site/base',
    design: { parts },
  });
})();

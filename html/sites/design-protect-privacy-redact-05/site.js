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
      const sidebar = false;
      const navDraw = W >= 1180 && rng.bool(0.5);
      const nav = W >= 1180;
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, navDraw, placement, sidebar, sidebarDraw, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      if (true) {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'CoreDocs');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        const navCount = rng.int(3, 5);
        const sampledNav = local(rng.sample(content.NAV_ITEMS, navCount), K.nav);
        for (const item of ['Documents', 'Requests', 'Shared', 'Reports', 'Settings']) {
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
      const help = util.el('aside', 'docs-help', body);
      util.el('h2', '', help, 'Customer Reports');
      util.el('div', 'dl-search', help, '⌕  Search reports...');
      const hd = util.el('div', 'dl-row dl-head', help);
      ['Date', 'Customer', 'Title'].forEach((t) => util.el('span', '', hd, t));
      const rows = [
        ['Apr 21, 2016', 'Taylor Kim', 'Account Review'], ['Apr 15, 2016', 'Jordan Mitchell', 'Dispute Report'],
        ['Apr 03, 2016', 'Casey Burns', 'Fraud Investigation'], ['Mar 28, 2016', 'Riley Patel', 'Account Summary'],
        ['Mar 12, 2016', 'Morgan Lee', 'Chargeback Details'], ['Feb 26, 2016', 'Avery Chen', 'Customer Statement'],
        ['Feb 10, 2016', 'Quinn Davis', 'Dispute Report'], ['Jan 31, 2016', 'Jamie Wilson', 'Account Review'],
        ['Jan 18, 2016', 'Cameron Brooks', 'Fraud Investigation'], ['Jan 05, 2016', 'Parker Scott', 'Chargeback Details'],
      ];
      rows.forEach((r, i) => {
        const row = util.el('div', 'dl-row' + (i === 1 ? ' sel' : ''), help);
        r.forEach((t) => util.el('span', '', row, t));
      });
      Object.assign(_c, { help, stage });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.footer': (base, S) => function (_c) {
      base(_c);
      const copy = document.querySelector('.ref-foot-text');
      if (copy) copy.remove();
      const foot = document.querySelector('.ref-foot');
      if (foot && !foot.querySelector('button, a')) foot.remove();
    },
  };

  env.site({
    name: 'design-protect-privacy-redact-05',
    template: 'site/base',
    design: { parts },
  });
})();

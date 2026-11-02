// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) => function (_c) {
      const { content, ctx, local, lr, rng, roomy, tall, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = true;
      rng.bool(0.5); // preserve the original frame draw
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'SparkFiles');
        brand.dataset.role = 'brand';
      }
      if (nav) {
        const n = util.el('nav', 'ref-nav', header);
        rng.sample(content.NAV_ITEMS, rng.int(3, 5));
        for (const item of ['Files', 'Photos', 'Shared', 'Favorites']) {
          const a = util.el('a', 'ref-navlink', n, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.stage': (base, S) => function (_c) {
      base(_c);
      const { body, util } = _c;
      const recent = util.el('aside', 'spark-recent', body);
      util.el('div', 'spark-recent-title', recent, 'Recent Files');
      for (const [name, date] of [
        ['♫  Research notes.mp3', 'Apr 17, 2017'],
        ['▤  Project outline.docx', 'Apr 16, 2017'],
        ['▦  Budget.xlsx', 'Apr 14, 2017'],
        ['♫  Podcast intro.mp3', 'Apr 15, 2017'],
        ['◆  Class photo.jpg', 'Apr 12, 2017'],
        ['▤  Notes.txt', 'Apr 11, 2017'],
        ['♫  Recording 4.mp3', 'Apr 10, 2017'],
      ]) {
        const item = util.el('div', 'spark-recent-item', recent, name);
        util.el('div', 'spark-recent-date', item, date);
      }
    },
  };

  env.site({
    name: 'design-use-file-manager-rename-02',
    template: 'site/base',
    design: { parts },
  });
})();

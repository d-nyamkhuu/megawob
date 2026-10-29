/*
 * click-control / link: mode 'text' (click-link.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('click-control');
  const { quote: q } = env.util;
  const C = env.content;
  const { firstLink, keepIdxOf, linkTexts, para, pickIn, T, wordCorrect, wordResult } = fam.lib;

  const HEADINGS = ['What changed this week', 'Release notes', 'Highlights', 'Before you upgrade', 'From the blog',
    'Customer update', 'Getting started', 'Project status', 'Travel advisory', 'Community news', 'Help article',
    'Product announcement', 'Weekly digest', 'Account notice', 'Latest from the team', 'A note for readers',
    'In case you missed it', 'What to know today', 'New this month', 'A closer look', 'Tips and tutorials',
    'Inside the project', 'On the horizon', 'The latest edition', 'A quick overview', 'Notes from the field',
    'Explore the collection', 'For your reference', 'This month in review', 'Ideas worth sharing', 'A look back',
    'Around the community', 'New and noteworthy', 'The essentials', 'Behind the scenes', 'Updates and insights',
    'Things to keep in mind', 'A little more context', 'The current picture', 'The latest roundup', 'Reader favorites',
    'More to explore', 'Fresh perspectives', 'The week at a glance', 'A few things to share', 'A few helpful links',
    'An update for everyone', 'A collection of ideas', 'A timely reminder', 'A look at the details',
    'Good things to know', 'From our community', 'A short update', 'The bigger picture', 'Thoughts for the week',
    'More about this topic', 'A selection for you', 'Ways to learn more', 'A view from the team',
    'Worth a closer read', 'Looking ahead together', 'Useful background', 'A roundup for readers',
    'A little inspiration', 'The story so far', 'A selection of updates', 'Ideas in progress', 'Recent additions',
    'Where things stand', 'Reading list', 'A few reader questions', 'What we are working on', 'A brief announcement',
    'Scenes from the week', 'A map of the subject', 'Observations and ideas', 'Across the collection',
    'The latest reading', 'Topics on our minds', 'Recent conversations', 'On the workbench', 'Questions and answers',
    'A reading break', 'Things we have noticed', 'Notes to keep nearby'];
  const LIST_HEADINGS = ['Related articles', 'Useful links', 'Resources', 'Quick links', 'More from us', 'See also',
    'Next steps', 'Popular pages', 'Topic index', 'Browse tags', 'Link guide', 'Other reading', 'More details',
    'Find more', 'On this topic', 'Further info'];

  function sampleLink(rng, ctx) {
    const { o, ood } = ctx;
    if (rng.bool(0.3)) {
      const pool = C.LINK_TEXTS.filter((l) => l.length <= 30);
      const n = ood ? rng.int(9, 12) : rng.int(5, 8);
      const texts = C.sample(rng, pool, n, o);
      const items = texts.map((text) => ({ text, link: true, look: rng.pick(['link', 'link', 'button', 'chip']) }));
      return { mode: 'list', heading: rng.pick(LIST_HEADINGS), blocks: [items], target: rng.pick(texts) };
    }
    for (;;) {
      const used = new Set();
      const nb = ood ? 3 : 2;
      const blocks = [];
      for (let b = 0; b < nb; b++) blocks.push(para(rng, rng.int(2, 3), rng.int(2, 3), o, used));
      const links = blocks.flat().filter((w) => w.link);
      if (links.length < 3) continue;
      return { mode: 'text', heading: rng.pick(HEADINGS), blocks, target: rng.pick(links).text };
    }
  }

  env.scenario('click-control', {
    name: 'link',
    sample: sampleLink,
    correct: wordCorrect,
    result: wordResult,
    wrongFinal(spec, rng, linkKeys) {
      const ks = linkKeys(spec.blocks); return ks.length ? { key: rng.pick(ks)[1] } : null;
    },
    planStep(model, spec) {
      for (let b = 0; b < spec.blocks.length; b++) {
        const i = firstLink(spec.blocks[b], spec.target);
        if (i >= 0) return { click: { link: `${b}.${i}` } };
      }
      return null;
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      if (spec.mode === 'list') {
        spec.blocks = [pickIn(r, spec.blocks[0], (w) => w.text === spec.target, k(3, 5))];
      } else {
        const at = spec.blocks.findIndex((b) => b.some((w) => w.link && w.text === spec.target));
        const keep = keepIdxOf(r, spec.blocks, (_, i) => i === at, k(0, 1));
        spec.blocks = keep.map((i) => spec.blocks[i]);
      }
    },
    phrase(spec, rng, P) {
      let core, terse, steps;
      core = P(spec.mode === 'list' ? T.linkList : T.link, { q: q(spec.target) });
      terse = q(spec.target);
      return { core, terse, steps };
    },
    phKind: () => 'link',
    retarget: (spec, model, rng, out, other) => other(linkTexts(spec.blocks), spec.target),
  });
})();

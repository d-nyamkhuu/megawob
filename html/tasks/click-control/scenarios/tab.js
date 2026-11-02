/*
 * click-control / tab: mode 'tab' (click-tab.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('click-control');
  const { quote: q } = env.util;
  const C = env.content;
  const { firstLink, hasTarget, keepIdxOf, linkTexts, para, partialPatch, T, wordCorrect, wordResult } = fam.lib;

  const TAB_NAMES = ['Overview', 'Details', 'Reviews', 'Specifications', 'Shipping', 'Returns', 'Support', 'History',
    'Pricing', 'Activity', 'Settings', 'Members', 'Billing', 'Files', 'Comments', 'Integrations', 'Security',
    'Notifications', 'FAQ', 'Downloads', 'Changelog', 'Usage', 'Permissions', 'Team', 'Description', 'Q&A',
    'Ingredients', 'Itinerary', 'Amenities', 'Location', 'Schedule', 'Resources', 'Overview & stats', 'API keys',
    'Tasks', 'Milestones', 'Roadmap', 'Reports', 'Insights', 'Notes', 'Gallery', 'Videos', 'Contacts', 'Roles',
    'Workspaces', 'Projects', 'Boards', 'Templates', 'Examples', 'Guides', 'Tutorials', 'Variants', 'Dimensions',
    'Materials', 'Care', 'Availability', 'Pickup', 'Map', 'Hours', 'Reservations', 'Policies', 'Warranty', 'Privacy',
    'Terms', 'Accessibility', 'Credits', 'License', 'Layout', 'Components', 'Fields', 'Events', 'Venues', 'Speakers',
    'Catalog', 'Account', 'Profile', 'Directory', 'Groups', 'Access log', 'Alerts', 'Messages', 'Attachments',
    'Documents', 'Images', 'Audio', 'Playlists', 'Chapters', 'Episodes', 'Tracklist', 'Cast', 'Crew', 'Seasons',
    'Menu', 'Room types', 'Floor plan', 'Directions', 'Transit', 'Parking', 'Delivery', 'Stock', 'Bundles', 'Offers',
    'Coupons', 'Prerequisites', 'Learning path', 'Assignments', 'Scores', 'Leaderboard', 'Badges', 'Appendix',
    'Approvals', 'Exports', 'Snapshots', 'Appearance', 'Localization', 'Connections', 'Webhooks', 'Rules', 'Branches',
    'Builds', 'Deployments', 'Environments', 'Variables', 'Secrets', 'Endpoints', 'Schemas', 'Queries', 'Mutations',
    'Subscribers', 'Mentions', 'Reactions', 'Followers', 'Following', 'Reading list', 'Recent', 'Pinned', 'Favorites',
    'Published', 'Highlights', 'Search', 'Filters', 'Sort order'];

  function tabLabels(rng, n, o) {
    const nav = C.NAV_ITEMS.map((x) => (typeof x === 'string' ? x : x.label)).filter((l) => l && l.length <= 16);
    const pool = [...new Set(TAB_NAMES.concat(nav))];
    return C.sample(rng, pool, n, o);
  }

  function sampleTab(rng, ctx) {
    const { o, ood } = ctx;
    if (rng.bool(0.35)) {
      const named = rng.bool(0.8);
      const n = ood ? rng.int(6, 8) : named ? rng.int(3, 5) : 3;
      const labels = named ? tabLabels(rng, n, o) : [...Array(n).keys()].map((i) => `Tab #${i + 1}`);
      const used = new Set();
      const tabs = labels.map((label) => ({ label, words: para(rng, 2, 0, o, used) }));
      const target = rng.int(0, n - 1);
      const start = rng.pick([...Array(n).keys()].filter((i) => i !== target));
      return { mode: 'tab', level: 'normal', tabs, start, target };
    }
    const level = rng.pick(['easy', 'medium', 'normal', 'normal', 'hard', 'hard']);
    const n = ood ? rng.int(6, 8) : { easy: 1, medium: 2, normal: 3 }[level] || rng.int(2, 7);
    const numbered = level === 'hard' || rng.bool(0.2);
    const labels = level === 'hard' ? [...Array(n).keys()].map((i) => String(i + 1))
      : numbered ? [...Array(n).keys()].map((i) => `Tab #${i + 1}`) : tabLabels(rng, n, o);
    for (;;) {
      const used = new Set();
      const tabs = labels.map((label) => ({ label, words: para(rng, 2, rng.int(1, 2), o, used) }));
      const links = [];
      tabs.forEach((t, ti) => t.words.forEach((w) => { if (w.link) links.push([ti, w.text]); }));
      if (!links.length) continue;
      const away = links.filter(([ti, text]) => ti !== 0 && !tabs[0].words.some((w) => w.link && w.text === text));
      const pool = n > 1 && away.length && rng.bool(0.8) ? away : links;
      return { mode: 'link', level, tabs, start: 0, target: rng.pick(pool)[1] };
    }
  }

  env.scenario('click-control', {
    name: 'tab',
    sample: sampleTab,
    baseModel(spec, c) {
      return { active: spec.start, ...c };
    },
    ownError(model, spec) {
      if (spec.mode === 'tab') return model.active === spec.target ? 0 : 1;
    },
    progress(model, spec) {
      return spec.tabs.length > 1 && hasTarget(spec.tabs[model.active].words, spec.target) ? 0.5 : 1;
    },
    correct: wordCorrect,
    result: wordResult,
    wrongFinal(spec, rng, linkKeys) {
      if (spec.mode !== 'link') return null;
      const ks = linkKeys(spec.tabs.map((t) => t.words));
      if (!ks.length) return null;
      const [b, key] = rng.pick(ks);
      return { key, patch: { active: b } };
    },
    wrongNav(spec, rng) {
      if (spec.mode !== 'link' || spec.tabs.length < 2) return null;
      const ks = spec.tabs.map((t, i) => (hasTarget(t.words, spec.target) ? -1 : i)).filter((i) => i >= 0);
      return ks.length ? { active: rng.pick(ks) } : null;
    },
    partial(spec) {
      if (spec.mode !== 'link' || spec.tabs.length < 2) return null;
      const i = spec.tabs.findIndex((t) => hasTarget(t.words, spec.target));
      return i >= 0 && i !== spec.start ? { active: i } : null;
    },
    scene: (spec) => partialPatch(spec),
    planStep(model, spec) {
      if (spec.mode === 'tab') return { click: { tab: spec.target } };
      const here = firstLink(spec.tabs[model.active].words, spec.target);
      if (here >= 0) return { click: { link: `${model.active}.${here}` } };
      return { click: { tab: spec.tabs.findIndex((t) => hasTarget(t.words, spec.target)) } };
    },
    solveDirect(m, spec) {
      if (spec.mode === 'tab') return { ...m, active: spec.target };
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      const has = (t) => t.words.some((w) => w.link && w.text === spec.target);
      const must = spec.mode === 'tab' ? (_, i) => i === spec.target || i === spec.start : (t, i) => i === 0 || has(t);
      const keep = keepIdxOf(r, spec.tabs, must, k(0, 1));
      if (keep.length < spec.tabs.length) {
        if (spec.mode === 'tab') { spec.start = keep.indexOf(spec.start); spec.target = keep.indexOf(spec.target); }
        spec.tabs = keep.map((i) => spec.tabs[i]);
      }
    },
    phrase(spec, rng, P) {
      let core, terse, steps;
      if (spec.mode === 'tab') {
        const l = spec.tabs[spec.target].label;
        core = l.startsWith('Tab #') ? P(T.tabNum, { t: l }) : P(T.tab, { q: q(l), t: l });
        terse = `${l} tab`;
      } else {
        core = P(spec.tabs.length === 1 ? T.tabLink1 : T.tabLink, { q: q(spec.target) });
        terse = q(spec.target);
      }
      return { core, terse, steps };
    },
    phKind: (spec) => spec.mode === 'tab' ? 'tab' : 'link',
    judgeError(model, spec) {
      if (spec.mode === 'tab') return model.active !== spec.start ? 1 : 0;
    },
    retarget(spec, model, rng, out, other) {
      return spec.mode === 'tab' ? other(spec.tabs.map((_, i) => i).filter((i) => i !== model.active), spec.target)
        : other(linkTexts(spec.tabs.map((x) => x.words)), spec.target);
    },
  });
})();

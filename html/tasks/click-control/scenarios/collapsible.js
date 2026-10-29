/*
 * click-control / collapsible: mode 'expand' (click-collapsible.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('click-control');
  const { quote: q } = env.util;
  const C = env.content;
  const { firstLink, hasTarget, keepIdxOf, linkTexts, para, T, wordCorrect, wordResult } = fam.lib;

  const FAQ = ['How do I reset my password?', 'Can I change my plan later?', 'Where is my order?', 'How do refunds work?',
    'Is my data encrypted?', 'Can I invite my team?', 'What payment methods do you accept?', 'How do I cancel my subscription?',
    'Do you ship internationally?', 'How do I export my data?', 'What happens when my trial ends?', 'Can I use my own domain?',
    'How do I contact support?', 'Is there a student discount?', 'How do I delete my account?', 'Which browsers are supported?',
    'Can I return a sale item?', 'How long does delivery take?', 'Why was my card declined?', 'How do I update my address?',
    'Getting started', 'Billing and invoices', 'Account and security', 'Shipping and delivery', 'Returns and exchanges',
    'Integrations', 'Troubleshooting', 'Privacy and cookies', 'Team management', 'Mobile app',
    'How do I verify my email?', 'Can I change my display name?', 'Why was I signed out?',
    'Can I browse without an account?', 'Which file types can I upload?', 'What is the upload size limit?',
    'Can I work offline?', 'Is my work saved automatically?', 'Can I restore a deleted file?',
    'Where are my archived items?', 'Can I share a saved list?', 'Why has my shared link expired?',
    'Can I edit a scheduled message?', 'How do I turn off sound alerts?', 'Can I change the language?',
    'Is there a dark mode?', 'When is this item back in stock?', 'Do you offer gift wrapping?',
    'How do I redeem a gift card?', 'Can I preorder an item?', 'What if parts are missing?',
    'How do I report content?', 'Can I undo my last action?', 'Can I connect a second device?',
    'How do I enable captions?', 'Keyboard shortcuts', 'Notification preferences', 'Storage usage', 'Search tips',
    'Version history', 'Workspace templates', 'Activity logs', 'Referral rewards', 'Service availability',
    'Community guidelines', 'Saved filters', 'Duplicate records', 'Feature requests', 'How do I leave a review?',
    'Can I hide my online status?', 'How do I block another user?', 'Can I transfer item ownership?',
    'How do I pin an item?', 'Can I sort items manually?', 'How do I add a custom field?', 'Can I merge two accounts?',
    'How do I set my time zone?', 'Why are images not loading?', 'Can I print a single page?',
    'How do I resize a column?', 'Can I pause a file transfer?', 'How do I add alt text?',
    'Can I preview an attachment?', 'How do I mention a teammate?', 'Can I limit who can comment?',
    'How do I check item dimensions?', 'How do I clear my recent views?', 'Can I set a recurring reminder?',
    'Where can I find release notes?', 'How do I choose a default view?', 'Can I add tags to an item?',
    'Can I request a product sample?', 'Can I order in bulk?', 'How do I book a demo?', 'Guest permissions',
    'Folder organization', 'File naming rules', 'Cart expiration', 'Warranty coverage', 'Delivery instructions',
    'Content formatting', 'Required fields', 'Resource downloads', 'Time estimates', 'Display settings',
    'Data retention', 'Connection settings', 'How do I track a support ticket?', 'Can I save a draft?',
    'How do I add a profile photo?', 'Can I split an order?', 'How do I apply a promo code?', 'Can I join a waitlist?',
    'Why is my cart empty?', 'Can I choose a delivery date?', 'Can I send a gift anonymously?',
    'How do I download a receipt?', 'Can I combine gift cards?', 'How do I start a group chat?',
    'How do I create a poll?', 'Can I assign a task to myself?', 'How do I link related items?',
    'Can I hide completed tasks?', 'How do I add a checklist?', 'Can I crop an uploaded image?',
    'Why does my video have no sound?', 'Can I adjust playback speed?', 'How do I scan a document?',
    'Can I attach more than one file?', 'How do I rotate a page?', 'Can I lock a finished document?',
    'How do I record a voice message?', 'Session limits', 'Calendar sync', 'Import error messages', 'Automation rules',
    'Approval workflows', 'Screen reader navigation', 'Measurement units', 'Appointment rescheduling',
    'Download quality', 'Product care guides', 'Newsletter subscriptions', 'Survey responses', 'Pickup locker access'];

  function sampleCollapsible(rng, ctx) {
    const { o, ood } = ctx;
    const titles = (n) => (rng.bool(0.15)
      ? rng.sample([...Array(50).keys()].map((i) => `Section #${i + 1}`), n)
      : C.sample(rng, FAQ.concat(C.TOPICS.filter((t) => t.length <= 34)), n, o));
    if (rng.bool(0.45)) {
      const n = ood ? rng.int(5, 6) : rng.pick([1, 2, 3, 3]);
      const used = new Set();
      const sections = titles(n).map((title) => ({ title, words: para(rng, 1, 0, o, used) }));
      return { mode: 'expand', sections, target: rng.int(0, n - 1) };
    }
    const n = ood ? rng.int(5, 6) : rng.pick([2, 3, 3, 4]);
    for (;;) {
      const used = new Set();
      const sections = titles(n).map((title) => ({ title, words: para(rng, rng.int(1, 2), 1, o, used) }));
      const links = sections.flatMap((s) => s.words.filter((w) => w.link));
      if (links.length < 2) continue;
      return { mode: 'link', sections, target: rng.pick(links).text };
    }
  }

  env.scenario('click-control', {
    name: 'collapsible',
    sample: sampleCollapsible,
    baseModel(spec, c) {
      return { open: [], ...c };
    },
    ownError(model, spec) {
      if (spec.mode === 'expand') return model.open.includes(spec.target) ? 0 : 1;
    },
    progress: (model, spec) => model.open.some((i) => hasTarget(spec.sections[i].words, spec.target)) ? 0.5 : 1,
    correct: wordCorrect,
    result: wordResult,
    wrongFinal(spec, rng, linkKeys) {
      if (spec.mode !== 'link') return null;
      const ks = linkKeys(spec.sections.map((s) => s.words));
      if (!ks.length) return null;
      const [b, key] = rng.pick(ks);
      return { key, patch: { open: [b] } };
    },
    wrongNav(spec, rng) {
      const ks = spec.sections.map((s, i) => i).filter((i) => (spec.mode === 'expand' ? i !== spec.target : !hasTarget(spec.sections[i].words, spec.target)));
      return ks.length ? { open: [rng.pick(ks)] } : null;
    },
    partial(spec) {
      if (spec.mode !== 'link') return null;
      return { open: [spec.sections.findIndex((s) => hasTarget(s.words, spec.target))] };
    },
    scene(spec, rng) {
      if (spec.mode === 'link') return { open: [spec.sections.findIndex((s) => hasTarget(s.words, spec.target))] };
      const ks = spec.sections.map((_, i) => i).filter((i) => i !== spec.target);
      return ks.length ? { open: [rng.pick(ks)] } : null;
    },
    planStep(model, spec) {
      if (spec.mode === 'expand') return { click: { section: spec.target } };
      for (const s of model.open) {
        const i = firstLink(spec.sections[s].words, spec.target);
        if (i >= 0) return { click: { link: `${s}.${i}` } };
      }
      return { click: { section: spec.sections.findIndex((s) => hasTarget(s.words, spec.target)) } };
    },
    solveDirect(m, spec) {
      if (spec.mode === 'expand') return { ...m, open: [spec.target] };
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      const keep = spec.mode === 'expand'
        ? keepIdxOf(r, spec.sections, (_, i) => i === spec.target, k(0, 1))
        : keepIdxOf(r, spec.sections, (s, i) => i === spec.sections.findIndex((x) => x.words.some((w) => w.link && w.text === spec.target)), k(1, 2));
      if (spec.mode === 'expand') spec.target = keep.indexOf(spec.target);
      spec.sections = keep.map((i) => spec.sections[i]);
    },
    phrase(spec, rng, P) {
      let core, terse, steps;
      if (spec.mode === 'expand') {
        core = spec.sections.length === 1 ? P(T.expand1, {}) : P(T.expand, { q: q(spec.sections[spec.target].title) });
        terse = spec.sections.length === 1 ? undefined : `expand ${q(spec.sections[spec.target].title)}`;
      } else {
        core = P(T.collLink, { q: q(spec.target) });
        terse = q(spec.target);
      }
      return { core, terse, steps };
    },
    phKind: (spec) => spec.mode === 'expand' ? 'section' : 'link',
    judgeError(model, spec) {
      if (spec.mode === 'expand') return model.open.length ? 1 : 0;
    },
    retarget(spec, model, rng, out, other) {
      return spec.mode === 'expand' ? other(spec.sections.map((_, i) => i).filter((i) => !model.open.includes(i)), spec.target)
        : other(linkTexts(spec.sections.map((x) => x.words)), spec.target);
    },
  });
})();

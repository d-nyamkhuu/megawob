/*
 * click-control / hover-menu: hover-only navigation.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('click-control');
  const { quote: q } = env.util;
  const C = env.content;
  const { pickIn, settledMenu, T, targetCorrect } = fam.lib;

  // Site navigation: top-level label -> groups of [title, links]. Link labels are unique across the whole bank,
  // so an instruction may name a link alone.
  const SITE_NAV = [
    { name: 'Products', groups: [['Platform', [
      'Overview', 'Integrations', 'Security', 'Mobile apps', "What's new", "Search", "Sharing", "Desktop app",
      "Workspaces", "File storage", "Versioning", "Offline mode", "Guest access", "Audit log", "Data import",
      "Extensions", "Performance", "Languages", "Themes", "Device sync"
    ]],
      ['Tools', [
        'Planner', 'Forms', 'Automations', 'Dashboards', 'Whiteboards', 'Calendar', 'Notebook', 'Timesheets',
        'Bookmarks', 'Checklists', 'Documents', 'Objectives', 'Surveys', 'Approvals', 'Contacts', 'Timer',
        'Flowcharts'
      ]]] },
    { name: 'Solutions', groups: [['By team', [
      'Marketing', 'Engineering', 'Sales', 'Operations', 'People teams', 'Design team', 'Finance', 'Legal team',
      'Procurement', 'Research', 'Data teams', 'IT services', 'Editorial', 'Education', 'Facilities', 'Recruiting',
      'Logistics', 'Quality', 'Client care', 'Strategy'
    ]],
      ['By size', [
        'Startups', 'Small business', 'Enterprise', 'Nonprofits', 'Freelancers', 'Agencies', 'Cooperatives',
        'Franchises', 'Colleges', 'Societies', 'Public sector', 'Midsize firms', 'Family firms', 'Foundations',
        'Museums', 'Sports clubs'
      ]]] },
    { name: 'Resources', groups: [['Learn', [
      'Guides', 'Webinars', 'Tutorials', 'Glossary', 'Articles', 'Podcasts', 'Ebooks', 'Videos', 'Puzzles',
      'Exercises', 'Quizzes', 'Textbooks', 'Diagrams', 'Lectures', 'Journals', 'Workbooks'
    ]],
      ['Community', [
        'Forum', 'Events', 'Meetups', 'Champions', 'Chapters', 'Contests', 'Clubs', 'Mentoring', 'Jams', 'Lounges',
        'Showcase', 'Kudos', 'Projects', 'Polls', 'Badges', 'Outreach'
      ]]] },
    { name: 'Company', groups: [['About', [
      'Our story', 'Leadership', 'Careers', 'Press kit', 'Our values', 'Mission', 'Culture', 'Ownership',
      'Milestones', 'Accolades', 'Governance', 'Newsroom', 'Our impact', 'Inclusion', 'Founders', 'Policies'
    ]],
      ['Contact', [
        'Talk to sales', 'Partners', 'Offices', 'Inquiries', 'Suppliers', 'Resellers', 'Sponsors', 'Affiliates',
        'Book a demo', 'Mailroom', 'Hotline', 'Media contact'
      ]]] },
    { name: 'Support', groups: [['Help', [
      'Help center', 'System status', 'Contact support', 'Release notes', 'Known issues', 'Repair tools',
      'Service alerts', 'Setup checks', 'Incident log', 'Feature ideas', 'Device issues', 'Network checks',
      'Bug reporting', 'Service hours'
    ]],
      ['Account', [
        'Billing help', 'Data export', 'Privacy requests', 'Password reset', 'Profile help', 'Account closure',
        'Linked devices', 'Data consent', 'Invite help', 'Email changes', 'Identity check'
      ]]] },
    { name: 'Shop', groups: [['Browse', [
      'New arrivals', 'Best sellers', 'Gift cards', 'Clearance', 'Collections', 'Gift ideas', 'Essentials',
      'Home decor', 'Accessories', 'Outdoor gear', 'Stationery', 'Pet supplies', 'Kitchenware', 'Travel gear',
      'Craft kits', 'Electronics'
    ]],
      ['Services', [
        'Order tracking', 'Returns', 'Store finder', 'Warranty', 'Shipping', 'Exchanges', 'Gift wrap', 'Repairs',
        'Size charts', 'Care advice', 'Assembly', 'Order changes', 'Receipts', 'Pickup options', 'Delivery slots',
        'Spare parts'
      ]]] },
    { name: 'Developers', groups: [['Build', [
      'API reference', 'SDKs', 'Sandbox', 'Webhooks', 'Quickstart', 'Code snippets', 'CLI', 'API keys', 'Schemas',
      'Debugging', 'API explorer', 'Auth', 'Compilers', 'Parsers', 'Mocks', 'Test data'
    ]],
      ['Ship', [
        'Changelog', 'Rate limits', 'Sample apps', 'Deployments', 'Error logs', 'Rollbacks', 'Monitoring',
        'Usage stats', 'Migrations', 'Job runners', 'Build queue'
      ]]] },
    { name: 'Learn', groups: [['Courses', [
      'Beginner track', 'Certification', 'Workshops', 'Live classes', 'Team training', 'Practice labs',
      'Skill drills', 'Study groups', 'Office hours', 'Peer learning', 'Masterclasses', 'Seminars'
    ]],
      ['Library', [
        'Case studies', 'Templates', 'Reports', 'Worksheets', 'Audiobooks', 'Fact sheets', 'White papers',
        'Checklists', 'Slide decks', 'Data tables', 'Diagrams', 'Transcripts'
      ]]] },
  ];

  function sampleHoverMenu(rng, ctx) {
    const { o, ood } = ctx;
    const tops = C.sample(rng, SITE_NAV, ood ? 6 : rng.int(3, 5), o).map((t) => {
      const groups = rng.sample(t.groups, t.groups.length === 1 ? 1 : rng.int(1, 2)).map(([title, links]) => ({
        title, items: rng.sample(links, Math.min(links.length, ood ? rng.int(4, 5) : rng.int(3, 4))).map((label) => ({ key: `${t.name}>${label}`, label })),
      }));
      return { key: t.name, label: t.name, groups };
    });
    // Keep the bank order of the tops (a real navigation bar has a fixed order).
    tops.sort((a, b) => SITE_NAV.findIndex((x) => x.name === a.key) - SITE_NAV.findIndex((x) => x.name === b.key));
    const leaves = tops.flatMap((t) => t.groups.flatMap((g) => g.items));
    const target = rng.pick(leaves).key;
    return { tops, target, grace: rng.pick([250, 400, 600]), by: rng.bool(0.6) ? 'path' : 'label' };
  }

  // Lookups for the new scenarios.
  const hmLeaf = (spec, key) => {
    for (const t of spec.tops) for (const g of t.groups) for (const it of g.items) if (it.key === key) return { top: t, group: g, item: it };
    return null;
  };
  const hmTop = (key) => String(key).split('>')[0];

  env.scenario('click-control', {
    name: 'hover-menu',
    sample: sampleHoverMenu,
    baseModel(spec, c) {
      return { open: null, out: false, outMs: 0, ...c };
    },
    progress: (model, spec) => model.open === hmTop(spec.target) ? 0.5 : 1,
    correct: targetCorrect,
    result(spec, key) {
      const h = hmLeaf(spec, key); return h ? `${h.top.label} › ${h.item.label}` : 'Page';
    },
    wrongFinal(spec, rng) {
      const ks = spec.tops.flatMap((t) => t.groups.flatMap((g) => g.items.map((it) => it.key))).filter((k) => k !== spec.target);
      return ks.length ? { key: rng.pick(ks), patch: { open: null } } : null;
    },
    wrongNav(spec, rng) {
      const ks = spec.tops.map((t) => t.key).filter((k) => k !== hmTop(spec.target));
      return ks.length ? { open: rng.pick(ks) } : null;
    },
    partial(spec) {
      return { open: hmTop(spec.target) };
    },
    scene(spec) {
      return { open: hmTop(spec.target) };
    },
    planStep(model, spec) {
      // The dropdown opens only while the pointer is over its top-level entry (or the dropdown itself).
      const top = hmTop(spec.target);
      return model.open === top ? { click: { nav: spec.target } } : { move: { top } };
    },
    settled: settledMenu,
    tick(model, spec, dt) {
      // The dropdown closes spec.grace ms (kit clock) after the pointer left its entry and the dropdown.
      if (!model.out || model.open === null) return model.outMs ? { ...model, outMs: 0 } : model;
      const outMs = model.outMs + dt;
      if (outMs + 1e-9 < spec.grace) return { ...model, outMs };
      return { ...model, outMs: 0, out: false, open: null };
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      const tt = hmTop(spec.target);
      spec.tops = pickIn(r, spec.tops, (t) => t.key === tt, k(1, 2)).map((t) => (t.key !== tt ? t : {
        ...t, groups: t.groups.map((g) => ({ ...g, items: pickIn(r, g.items, (it) => it.key === spec.target, k(1, 2)) }))
          .filter((g) => g.items.some((it) => it.key === spec.target) || !easy),
      }));
      spec.grace = Math.max(spec.grace, 400);
    },
    phrase(spec, rng, P) {
      let core, terse, steps;
      const h = hmLeaf(spec, spec.target);
      const vars = { arrow: q(`${h.top.label} › ${h.item.label}`), top: h.top.label, topq: q(h.top.label), leaf: h.item.label, leafq: q(h.item.label) };
      core = P(spec.by === 'label' ? T.navLabel : T.navPath, vars);
      terse = `${h.top.label} › ${h.item.label}`;
      steps = [`hover over ${q(h.top.label)}`, `click ${q(h.item.label)}`];
      return { core, terse, steps };
    },
    phKind: () => 'menu',
    retarget(spec, model, rng, out, other) {
      return other(spec.tops.flatMap((x) => x.groups.flatMap((g) => g.items.map((i) => i.key))), spec.target);
    },
  });
})();

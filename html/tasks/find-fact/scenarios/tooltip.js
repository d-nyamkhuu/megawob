/*
 * find-fact / tooltip: the fact is only in a hover tooltip.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('find-fact');
  const { keepIdx, pad2, quote: q } = env.util;
  const { CARRIERS, errorLookup, lowLabel, say, textErr, wrongOf } = fam.lib;

  // Facts that only a tooltip shows. mode 'icon': a list whose rows carry an info icon; hovering it shows 2-3
  // extra fields (label: value) that are not columns of the list. mode 'abbr': meeting notes with fictional
  // internal abbreviations (dotted underline); hovering one shows its full name.
  const TIP_SETS = {
    shipments: { title: 'Shipments', columns: ['Order', 'Carrier', 'Status'], tips: ['Tracking code', 'Weight', 'Delivery window'] },
    servers: { title: 'Servers', columns: ['Host', 'Region', 'Status'], tips: ['IP address', 'Uptime', 'Last backup'] },
    inventory: { title: 'Inventory', columns: ['Product', 'Price', 'Stock'], tips: ['SKU', 'Bin', 'Supplier'] },
  };
  const TIP_PRODUCTS = ['Trail lantern', 'Desk organizer', 'Cotton throw', 'Travel mug', 'Ceramic bowl', 'Garden gloves', 'Yoga block',
    'Linen napkins', 'Pocket notebook', 'Wool beanie', 'Bamboo cutting board', 'Glass carafe', 'Canvas tote', 'Reading lamp',
    'Copper kettle', 'Maple rolling pin', 'Felt storage basket', 'Stoneware pitcher', 'Leather key case',
    'Wicker picnic hamper', 'Oak coat rack', 'Silicone baking mat', 'Brass bookend', 'Fleece sleep mask',
    'Cork desk pad', 'Enamel lunch box', 'Rattan plant stand', 'Microfiber duster', 'Woven bath mat',
    'Stainless colander', 'Pine spice rack', 'Velvet cushion cover', 'Rubber doorstop', 'Porcelain soap dish',
    'Jute market bag', 'Aluminum step stool', 'Ceramic plant pot', 'Cotton tea towel', 'Ashwood serving tray',
    'Nylon travel pouch', 'Hemp laundry hamper', 'Slate cheese board', 'Wool dryer balls', 'Birch wall shelf',
    'Linen table runner', 'Acrylic pencil cup', 'Terracotta vase', 'Foam kneeling pad', 'Bamboo bath caddy',
    'Glass storage jar', 'Leather luggage tag', 'Terry hand towels', 'Wool felt coaster', 'Marble pastry board',
    'Linen apron', 'Leather journal', 'Tin pencil box', 'Ceramic spoon rest', 'Reed storage bin', 'Wooden salad bowl',
    'Brass candle holder', 'Folding camp chair', 'Linen storage cube', 'Hemp rope basket', 'Bamboo serving spoon',
    'Wool oven mitt', 'Canvas tool roll', 'Stone mortar bowl', 'Cork yoga mat', 'Pine picture ledge',
    'Velvet jewelry pouch', 'Rubber garden hose', 'Maple shoehorn', 'Acrylic desk tray', 'Jute plant hanger',
    'Nylon shower caddy', 'Terracotta herb pot', 'Enamel camping plate', 'Wicker bread basket', 'Acacia cheese slicer',
    'Poplin pillowcase', 'Steel garden trowel', 'Muslin bread bag', 'Chrome towel hook', 'Willow log holder',
    'Canvas camera strap', 'Granite book stand', 'Flannel tablecloth', 'Resin bird feeder', 'Olivewood spatula',
    'Acorn door wreath', 'Carbon steel wok', 'Jersey knit pillow', 'Sisal stair runner', 'Folding luggage cart',
    'Brass curtain rod', 'Maple dough scraper', 'Enamel roasting pan', 'Birch bath stool', 'Velour eyeglass case',
    'Leather dog leash', 'Rubber sink mat', 'Wooden puzzle tray', 'Silicone ice mold', 'Jute door mat',
    'Metal book clip', 'Felt laptop sleeve', 'Paper flower press', 'Clay butter dish', 'Brass plant mister',
    'Glass bud vase', 'Stone garden edging'];
  const TIP_SUPPLIERS = [
    'Harbor Supply Co.', 'Northgate Wholesale', 'Pinecrest Trading', 'Bluefield Goods', 'Oakmont Imports',
    'Cedarbank Goods', 'Willowbend Goods', 'Eastmere Trading', 'Merriton Partners', 'Larkspur Wholesale'
  ];
  const TIP_REGIONS = ['eu-west', 'eu-north', 'us-east', 'us-central', 'ap-south', 'sa-east'];
  const ABBR_A = ['Kestrel', 'Harbor', 'Lumen', 'Granite', 'Juniper', 'Copper', 'Meridian', 'Orchid', 'Summit', 'Tidal', 'Bramble', 'Falcon'];
  const ABBR_B = ['Transit', 'Review', 'Data', 'Field', 'Supply', 'Billing', 'Partner', 'Access', 'Quality', 'Vendor', 'Pricing', 'Logistics'];
  const ABBR_C = [
    'Exchange', 'Board', 'Program', 'Initiative', 'Gateway', 'Council', 'Pipeline', 'Network', 'Desk', 'Platform',
    'Archive', 'Register', 'Directory', 'Lab', 'Studio', 'Academy', 'Workshop', 'Office', 'Service', 'Department',
    'Foundation', 'Consortium', 'Forum', 'Hub', 'System', 'Framework', 'Charter', 'Center', 'Suite', 'Operations'
  ];
  const ABBR_LINES = ['The {A} rollout moves to the next sprint.', 'Budget for {A} was approved on Tuesday.',
    'Ask the {A} team before changing the schedule.', 'Weekly {A} updates now go to the shared channel.',
    'Migration to {A} is about 60% done.', 'The {A} review is postponed until further notice.',
    '{A} owners should file their reports by Friday.', 'Two new hires join {A} next month.',
    'Access requests for {A} go through the help desk.', 'The {A} dashboard was down for an hour on Monday.',
    'Training for {A} is scheduled for Thursday.', 'The {A} handbook now includes a glossary.',
    'The {A} pilot finished without any issues.', 'A new contact list for {A} is now available.',
    'The {A} workshop drew people from six teams.', 'An open question about {A} needs more research.',
    'The {A} checklist has three items remaining.', 'No changes to {A} are expected this quarter.',
    'A room has been reserved for the {A} briefing.', 'The {A} draft is ready for an initial reading.',
    'Some teams offered to help with {A}.', 'The {A} handover took place this morning.',
    'A naming guide for {A} is being prepared.', 'The {A} trial revealed a gap in documentation.',
    'A summary of {A} is due in the newsletter.', 'The {A} team is testing a new meeting format.',
    'The first {A} milestone was reached yesterday.', 'The {A} inbox has been quiet since Wednesday.',
    'A retired template caused confusion for {A}.', 'The {A} demo used examples from two teams.',
    'Feedback on {A} was more mixed than expected.', 'The {A} workspace has moved to the east wing.',
    'A guest will attend the next {A} session.', 'The {A} queue grew during the holiday break.',
    'Several {A} tasks depend on the same resource.', 'The {A} folder contains an outdated diagram.',
    'The {A} room now has a larger wall calendar.', 'A scheduling conflict split the {A} discussion.',
    'The {A} prototype uses sample records only.'];

  function tipRow(rng, set, i, used) {
    let name;
    let cells;
    let tip;
    for (let k = 0; k < 40; k++) {
      if (set === 'shipments') {
        name = `Order #${rng.int(20000, 89999)}`;
        cells = [name, rng.pick(CARRIERS), rng.pick(['In transit', 'Delivered', 'Out for delivery', 'Label created', 'Delayed'])];
        const w = (rng.int(2, 240) / 10).toFixed(1);
        tip = [['Tracking code', `${rng.pick(['PX', 'NL', 'SW', 'CB'])}-${rng.int(1000, 9999)}-${rng.int(10, 99)}`], ['Weight', `${w} kg`],
          ['Delivery window', `${rng.pick(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])} ${pad2(rng.int(8, 14))}:00-${pad2(rng.int(15, 20))}:00`]];
      } else if (set === 'servers') {
        name = `${rng.pick(['api', 'web', 'db', 'cache', 'worker', 'auth'])}-${rng.pick(['eu', 'us', 'ap'])}-${pad2(rng.int(1, 24))}`;
        cells = [name, rng.pick(TIP_REGIONS), rng.pick(['Healthy', 'Degraded', 'Healthy', 'Maintenance'])];
        tip = [['IP address', `10.${rng.int(0, 40)}.${rng.int(0, 255)}.${rng.int(2, 254)}`], ['Uptime', `${rng.int(2, 180)} days`],
          ['Last backup', `${pad2(rng.int(0, 23))}:${pad2(rng.int(0, 59))}`]];
      } else {
        name = rng.pick(TIP_PRODUCTS);
        cells = [name, `$${rng.int(4, 120)}.${rng.pick(['00', '50', '99', '25'])}`, String(rng.int(0, 240))];
        tip = [['SKU', `${name.split(' ')[0].slice(0, 3).toUpperCase()}-${rng.int(100, 999)}${rng.pick(['A', 'B', 'K', 'X'])}`],
          ['Bin', `${rng.pick(['A', 'B', 'C', 'D'])}-${pad2(rng.int(1, 40))}`], ['Supplier', rng.pick(TIP_SUPPLIERS)]];
      }
      if (!used.has(name)) break;
    }
    used.add(name);
    return { key: `t${i}`, cells, tip };
  }

  function sampleTooltip(rng, spec) {
    const mode = rng.pick(['icon', 'icon', 'abbr']);
    if (mode === 'icon') {
      const dataset = rng.pick(Object.keys(TIP_SETS));
      const set = TIP_SETS[dataset];
      const n = spec.ood ? rng.int(9, 12) : rng.int(4, 7);
      const used = new Set();
      const rows = [];
      for (let i = 0; i < n; i++) rows.push(tipRow(rng, dataset, i, used));
      const target = rng.int(0, n - 1);
      const field = rng.int(0, rows[0].tip.length - 1);
      return { mode, dataset, title: set.title, columns: set.columns, rows, target, field, label: rows[target].tip[field][0],
        answer: rows[target].tip[field][1] };
    }
    const n = spec.ood ? rng.int(6, 8) : rng.int(3, 5);
    const abbrs = [];
    const seen = new Set();
    for (let k = 0; abbrs.length < n && k < 200; k++) {
      const full = `${rng.pick(ABBR_A)} ${rng.pick(ABBR_B)} ${rng.pick(ABBR_C)}`;
      const abbr = full.split(' ').map((w) => w[0]).join('');
      if (seen.has(abbr)) continue;
      seen.add(abbr);
      abbrs.push({ abbr, full });
    }
    const lines = rng.sample(ABBR_LINES, abbrs.length);
    const notes = abbrs.map((a, i) => lines[i].split('{A}').flatMap((t, j) => (j ? [{ abbr: i }, { text: t }] : [{ text: t }])).filter((x) => x.abbr !== undefined || x.text));
    const target = rng.int(0, abbrs.length - 1);
    return { mode, title: rng.pick([
      'Meeting notes', 'Weekly sync', 'Team update', 'Planning notes', 'Project brief', 'Work session',
      'Sprint review', 'Group notes'
    ]), abbrs, notes, target,
      answer: abbrs[target].full };
  }

  const PH_SERVERS = ['mail-eu-31', 'queue-us-27', 'search-ap-33', 'files-eu-29'];

  env.scenario('find-fact', {
    name: 'tooltip',
    sample: sampleTooltip,
    baseModel() {
      return { answers: [''], hover: null };
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      if (spec.mode === 'icon') {
        const keep = keepIdx(r, spec.rows.length, [spec.target], k(2, 3));
        spec.rows = keep.map((i) => spec.rows[i]);
        spec.target = keep.indexOf(spec.target);
      }
    },
    wrongAnswers(spec, rng) {
      return [wrongOf(rng, spec.answer, spec.mode === 'icon' ? spec.rows.map((r) => r.tip[spec.field][1]) : spec.abbrs.map((a) => a.full))];
    },
    error: errorLookup,
    plan(model, spec) {
      if (model.hover !== spec.target && textErr(model.answers[0], spec.answer) > 0) return { move: { tip: spec.target } };
      return { type: [{ field: 0 }, spec.answer] };
    },
    answers(spec, one) {
      return spec.mode === 'abbr' ? one('full name', spec.answer, ['meaning', 'full form'])
      : one(lowLabel(spec.label), spec.answer, [spec.label]);
    },
    instruction(spec, rng) {
      if (spec.mode === 'abbr') {
        const abbr = spec.abbrs[spec.target].abbr;
        return say(rng, spec, [
          'What does "{abbr}" stand for in the {title}? Type the full name.',
          'Type the full name behind the abbreviation "{abbr}".',
          'Find out what {abbr} means and enter its full form.',
          'In the {title}, "{abbr}" is an abbreviation. Enter what it stands for.',
          'Hover over "{abbr}" in the notes and type the full name it stands for.',
          'Use the tooltip for "{abbr}" to find and enter its full name.',
          'Which full name appears when you hover over {abbr}? Type it.',
          'Expand "{abbr}" using its tooltip in the {title}. Type the name.',
          'The tooltip expands {abbr} into a full name. Enter that name.',
          'With the pointer over {abbr}, read its full name and type it.',
        ], { abbr, title: spec.title.toLowerCase() }, { terse: `${abbr} = ?` });
      }
      const name = spec.rows[spec.target].cells[0];
      return say(rng, spec, [
        'What is the {label} of {name}? Type it in the answer box.',
        'Find the {label} for {name} and enter it.',
        'Type the {label} of {name} into the answer field.',
        'The {label} of {name} is shown when you point at its info icon. Enter it.',
        'Look up the {lower} of {name} and type it.',
        'Enter the {lower} listed for {name}.',
        'Read and enter the {lower} for {name}.',
      ], { label: lowLabel(spec.label), lower: lowLabel(spec.label), name: q(name) }, { terse: `${spec.label} of ${q(name)}?` });
    },
    replyInstruction(spec, rng) {
      if (spec.mode === 'abbr') {
        const abbr = spec.abbrs[spec.target].abbr;
        return say(rng, spec, [
          'What does "{abbr}" stand for in the {title}?',
          'Find out what {abbr} means.',
          'In the {title}, "{abbr}" is an abbreviation. What does it stand for?',
          'Hover over "{abbr}" in the notes and read the full name.',
          'Look up the full name behind the abbreviation "{abbr}".',
          'Which complete name does the tooltip give for {abbr}?',
          'Read the expansion of "{abbr}" in its hover text.',
          'Consult the {title} for the full name of "{abbr}".',
          'The notes use {abbr}. What is its complete name?',
        ], { abbr, title: spec.title.toLowerCase() }, { terse: `${abbr} = ?` });
      }
      const name = spec.rows[spec.target].cells[0];
      return say(rng, spec, [
        'What is the {label} of {name}?',
        'Find the {label} for {name}.',
        'The {label} of {name} is shown when you point at its info icon. What is it?',
        'Look up the {label} of {name}.',
        'Check the {label} listed for {name}.',
        'Which {label} belongs to {name}?',
      ], { label: lowLabel(spec.label), name: q(name) }, { terse: `${spec.label} of ${q(name)}?` });
    },
    judgeAsk(jr, spec, page, pick) {
      let x = null, templates, vars = {}, message;
      if (spec.mode === 'icon') {
        if (spec.dataset === 'shipments') {
          for (let k = 0; k < 40 && !x; k++) { const c = `Order #${jr.int(20000, 89999)}`; if (!page.includes(c.toLowerCase())) x = c; }
        } else x = pick(spec.dataset === 'servers' ? PH_SERVERS : TIP_PRODUCTS);
        if (!x) return null;
        templates = [
          'What is the {label} of "{x}"? Type it in the answer box.', 'Find the {label} for "{x}" and enter it.',
          'Type the {label} of "{x}" into the answer field.', 'Fill the answer box with the {label} for "{x}".',
          'Locate "{x}" and enter its {label} in the answer box.'
        ];
        vars = { x, label: lowLabel(spec.label) };
        message = `I can't do that: there is no "${x}" in the ${spec.title.toLowerCase()} list.`;
      } else {
        const L = 'ABCDEFGHJKLMNPRSTW';
        for (let k = 0; k < 60 && !x; k++) {
          const c = L[jr.int(0, L.length - 1)] + L[jr.int(0, L.length - 1)] + L[jr.int(0, L.length - 1)];
          if (!spec.abbrs.some((a) => a.abbr === c)) x = c;
        }
        templates = [
          'Type the full name behind the abbreviation "{x}".',
          'What does "{x}" stand for in the notes? Type the full name.',
          'Find out what "{x}" means and enter its full form.', 'Which full name is shortened to "{x}"? Enter it.',
          'Read the tooltip for "{x}" and enter its full name.'
        ];
        vars = { x };
        message = `I can't do that: there is no "${x}" in the notes.`;
      }
      return { x, templates, vars, message };
    },
    factRows(model, spec, out) {
      if (spec.mode === 'icon') {
        const r = spec.rows[spec.target];
        spec.columns.forEach((c, i) => { if (i > 0) out.push({ label: `${c} of ${r.cells[0]}`, value: String(r.cells[i]), labels: [c.toLowerCase()] }); });
      }
    },
    retargetTries(spec, model, rng, tries) {
      if (spec.mode === 'icon') {
        spec.rows.forEach((r, i) => { if (i !== spec.target) tries.push({ ...spec, target: i, answer: r.tip[spec.field][1] }); });
      } else {
        spec.abbrs.forEach((a, i) => { if (i !== spec.target) tries.push({ ...spec, target: i, answer: a.full }); });
      }
    },
  });
})();

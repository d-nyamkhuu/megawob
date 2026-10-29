/*
 * click-control / flyout: nested flyout submenus.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('click-control');
  const { quote: q } = env.util;
  const C = env.content;
  const { keepIdxOf, leafKeysOf, menuAncestors, menuNode, menuProgressError, menuResult, menuWrongFinal, norm,
    settledMenu, T, targetCorrect, walk } = fam.lib;

  // Product categories: department -> category -> sub-categories (flyout menus).
  const CATEGORIES = [
    { name: 'Electronics', kids: [['Audio', [
      'Headphones', 'Speakers', 'Turntables', 'Microphones', 'Amplifiers', 'Receivers', 'Equalizers', 'Crossovers',
      'Megaphones', 'Recorders', 'Tuners'
    ]],
      ['Computers', [
        'Laptops', 'Monitors', 'Keyboards', 'Webcams', 'Desktops', 'Printers', 'Scanners', 'Routers', 'Modems',
        'Trackpads', 'Joysticks', 'Heatsinks'
      ]], ['Cameras', ['Instant cameras', 'Lenses', 'Tripods', 'Drones']]] },
    { name: 'Home & Kitchen', kids: [['Cookware', [
      'Frying pans', 'Stock pots', 'Baking sheets', 'Dutch ovens', 'Pasta cookers', 'Roasting pans', 'Muffin tins',
      'Pudding molds', 'Pie dishes', 'Braising pans', 'Pizza stones', 'Grill presses', 'Steamer racks',
      'Broiler pans'
    ]],
      ['Lighting', [
        'Desk lamps', 'Floor lamps', 'String lights', 'Ceiling fans', 'Wall sconces', 'Night lights', 'Track lights',
        'Pendant lamps', 'Light strips', 'Flush mounts', 'Mirror lights', 'Porch lights', 'Ceiling roses',
        'Light meters'
      ]], ['Bedding', ['Duvets', 'Pillows', 'Sheet sets', 'Blankets']]] },
    { name: 'Sports & Outdoors', kids: [['Camping', [
      'Tents', 'Sleeping bags', 'Lanterns', 'Camp stoves', 'Camp chairs', 'Coolers', 'Groundsheets', 'Compasses',
      'Fire starters', 'Flasks', 'Hatchets', 'Mess kits', 'Guy ropes', 'Dry sacks', 'Backpacks', 'Camp cots'
    ]],
      ['Cycling', [
        'Helmets', 'Bike lights', 'Bike locks', 'Saddles', 'Pedals', 'Panniers', 'Tire pumps', 'Handlebars',
        'Mudguards', 'Bike bells', 'Inner tubes', 'Chains', 'Derailleurs', 'Grips', 'Chainrings', 'Seatposts'
      ]], ['Fitness', ['Yoga mats', 'Dumbbells', 'Jump ropes', 'Resistance bands']]] },
    { name: 'Garden', kids: [['Plants', [
      'Seeds', 'Bulbs', 'Houseplants', 'Herbs', 'Shrubs', 'Trees', 'Vines', 'Ferns', 'Cacti', 'Grasses', 'Tubers',
      'Corms', 'Cuttings', 'Seedlings', 'Bamboos'
    ]], ['Garden tools', ['Pruners', 'Trowels', 'Rakes', 'Watering cans']],
      ['Outdoor furniture', [
        'Benches', 'Hammocks', 'Parasols', 'Planters', 'Loungers', 'Ottomans', 'Cushions', 'Rockers'
      ]]] },
    { name: 'Toys & Games', kids: [['Board games', [
      'Strategy games', 'Party games', 'Puzzles', 'Card games', 'Stacking games', 'Checkers', 'Backgammon',
      'Dominoes', 'Mancala', 'Dice games', 'Trivia games', 'Word games', 'Memory games', 'Tile games', 'Escape games',
      'Trading games'
    ]],
      ['Building', [
        'Blocks', 'Marble runs', 'Model kits', 'Magnetic tiles', 'Gear sets', 'Straw builders', 'Robot kits',
        'Wheels', 'Linking rings', 'Pegboards', 'Domino runs', 'Connectors', 'Foam shapes', 'Toy hinges',
        'Toy rivets', 'Toy panels'
      ]], ['Outdoor play', ['Kites', 'Scooters', 'Sandbox toys', 'Water toys']]] },
    { name: 'Office', kids: [['Paper', [
      'Notebooks', 'Sticky notes', 'Printer paper', 'Envelopes', 'Index cards', 'Cardstock', 'Graph paper',
      'Tracing paper', 'Memo pads', 'Receipt rolls', 'File folders', 'Carbon paper', 'Tissue paper', 'Bookmarks',
      'Certificates'
    ]],
      ['Desk', [
        'Organizers', 'Staplers', 'Desk mats', 'Monitor stands', 'Bookends', 'Pen cups', 'Paper clips',
        'Tape holders', 'Letter trays', 'Ink wells', 'Book rests', 'Paperweights', 'Coasters', 'Card holders',
        'Foot rests', 'Stamp racks'
      ]], ['Writing', ['Fountain pens', 'Markers', 'Pencils', 'Highlighters']]] },
    { name: 'Books', kids: [['Fiction', [
      'Mystery', 'Science fiction', 'Romance', 'Historical', 'Fantasy', 'Adventure', 'Thrillers', 'Classics',
      'Literary', 'Short stories', 'Westerns', 'Satire', 'Fairy tales', 'Ghost stories', 'Family sagas'
    ]],
      ['Nonfiction', [
        'Biography', 'Cooking', 'Travel', 'Self-help', 'Nature', 'Science', 'Culture', 'Crafts', 'Education',
        'Astronomy', 'Theater', 'Design', 'Geography', 'Reference', 'Languages'
      ]], ['Kids', ['Picture books', 'Early readers', 'Activity books', 'Comics']]] },
    { name: 'Pets', kids: [['Dogs', [
      'Leashes', 'Dog beds', 'Chew toys', 'Bowls', 'Collars', 'Harnesses', 'Kennels', 'Muzzles', 'Brushes', 'Shampoo',
      'ID tags', 'Paw wax', 'Dog food', 'Combs', 'Carriers', 'Dog pens'
    ]], ['Cats', ['Scratching posts', 'Litter boxes', 'Cat trees', 'Cat toys']],
      ['Aquarium', [
        'Filters', 'Heaters', 'Fish food', 'Gravel', 'Air pumps', 'Airstones', 'Fish nets', 'Tank lids', 'Tubing',
        'Driftwood', 'Sand', 'Salt mix', 'Scrapers', 'Valves', 'Timers'
      ]]] },
    { name: 'Clothing', kids: [['Footwear', ['Sandals', 'House slippers', 'Loafers', 'Ankle boots']], ['Outerwear', ['Cardigans', 'Trench coats', 'Waistcoats', 'Windbreakers']], ['Accessories', ['Sashes', 'Scarves', 'Mittens', 'Wallets']]] },
    { name: 'Arts & Crafts', kids: [['Painting', ['Oil paints', 'Watercolors', 'Canvases', 'Palettes']], ['Sewing', ['Needles', 'Thread', 'Thimbles', 'Bobbins']], ['Beading', ['Glass beads', 'Clasps', 'Earring hooks', 'Jewelry wire']]] },
    { name: 'Tools & hardware', kids: [['Hand tools', ['Claw hammers', 'Socket wrenches', 'Handsaws', 'Chisels']], ['Fasteners', ['Screws', 'Brad nails', 'Washers', 'Rivets']], ['Workshop', ['Vises', 'Toolboxes', 'Workbenches', 'Clamps']]] },
    { name: 'Musical gear', kids: [['Woodwinds', ['Flutes', 'Clarinets', 'Oboes', 'Bassoons']], ['String instruments', ['Violins', 'Harps', 'Ukuleles', 'Mandolins']], ['Percussion', ['Snare drums', 'Tambourines', 'Bongos', 'Xylophones']]] },
  ];
  const FLY_DEEP = [
    'Best sellers', 'New arrivals', 'On sale', 'Under $25', 'Refurbished', 'Staff picks', 'Gift ideas', 'Seasonal',
    'Value packs', 'Local finds', 'Essentials', 'Top rated', 'Online only', 'Exclusives', 'Eco choices', 'Restocked',
    'Limited runs', 'Trending', 'Full range'
  ];
  const FLY_TRIGGERS = [
    'All categories', 'Shop by department', 'Browse categories', 'Departments', 'Product directory', 'Store sections',
    'Shopping index'
  ];
  // Look-alike decoys for flyout searches (by 'label' / 'clue'): sub-category -> an accessory-style name that fits
  // anywhere in the same department. No decoy equals a CATEGORIES label.
  const FLY_LOOKALIKE = {
    Headphones: 'Headphone stands', Speakers: 'Speaker cables', Turntables: 'Turntable belts', Microphones: 'Microphone arms',
    Laptops: 'Laptop sleeves', Monitors: 'Monitor arms', Keyboards: 'Keyboard covers', Webcams: 'Webcam covers',
    'Instant cameras': 'Instant film', Lenses: 'Lens caps', Tripods: 'Tripod heads', Drones: 'Drone batteries',
    'Frying pans': 'Frying pan lids', 'Stock pots': 'Stock pot lids', 'Baking sheets': 'Baking mats', 'Dutch ovens': 'Dutch oven liners',
    'Desk lamps': 'Desk lamp bulbs', 'Floor lamps': 'Floor lamp shades', 'String lights': 'String light clips', 'Ceiling fans': 'Ceiling fan remotes',
    Duvets: 'Duvet covers', Pillows: 'Pillowcases', 'Sheet sets': 'Fitted sheets', Blankets: 'Blanket ladders',
    Tents: 'Tent pegs', 'Sleeping bags': 'Sleeping bag liners', Lanterns: 'Lantern mantles', 'Camp stoves': 'Stove fuel',
    Helmets: 'Helmet mounts', 'Bike lights': 'Bike light mounts', 'Bike locks': 'Lock holders', Saddles: 'Saddle bags',
    'Yoga mats': 'Yoga mat straps', Dumbbells: 'Dumbbell racks', 'Jump ropes': 'Jump rope handles', 'Resistance bands': 'Band anchors',
    Seeds: 'Seed trays', Bulbs: 'Bulb planters', Houseplants: 'Houseplant food', Herbs: 'Herb keepers',
    Pruners: 'Pruner holsters', Trowels: 'Trowel sets', Rakes: 'Rake heads', 'Watering cans': 'Watering wands',
    Benches: 'Bench cushions', Hammocks: 'Hammock stands', Parasols: 'Parasol bases', Planters: 'Planter liners',
    'Strategy games': 'Strategy guides', 'Party games': 'Party favors', Puzzles: 'Puzzle mats', 'Card games': 'Card sleeves',
    Blocks: 'Block tables', 'Marble runs': 'Marble packs', 'Model kits': 'Model paints', 'Magnetic tiles': 'Magnetic boards',
    Kites: 'Kite string', Scooters: 'Scooter helmets', 'Sandbox toys': 'Sandbox covers', 'Water toys': 'Water tables',
    Notebooks: 'Notebook covers', 'Sticky notes': 'Sticky tabs', 'Printer paper': 'Printer ink', Envelopes: 'Envelope seals',
    Organizers: 'Drawer organizers', Staplers: 'Staples', 'Desk mats': 'Desk pads', 'Monitor stands': 'Monitor risers',
    'Fountain pens': 'Fountain pen ink', Markers: 'Marker refills', Pencils: 'Pencil cases', Highlighters: 'Highlighter refills',
    Mystery: 'Mystery box sets', 'Science fiction': 'Science fiction anthologies', Romance: 'Romance novellas', Historical: 'Historical atlases',
    Biography: 'Biography box sets', Cooking: 'Cooking magazines', Travel: 'Travel guides', 'Self-help': 'Self-help journals',
    'Picture books': 'Picture dictionaries', 'Early readers': 'Early reader sets', 'Activity books': 'Activity pads', Comics: 'Comic box sets',
    Leashes: 'Leash hooks', 'Dog beds': 'Dog bed covers', 'Chew toys': 'Chew treats', Bowls: 'Bowl mats',
    'Scratching posts': 'Scratching pads', 'Litter boxes': 'Litter box liners', 'Cat trees': 'Cat tree perches', 'Cat toys': 'Cat toy sets',
    Filters: 'Filter cartridges', Heaters: 'Heater guards', 'Fish food': 'Fish feeders', Gravel: 'Gravel cleaners',
  };

  function sampleFlyout(rng, ctx) {
    const { o, ood } = ctx;
    const deps = C.sample(rng, CATEGORIES, ood ? rng.int(7, 8) : rng.int(4, 6), o);
    const tree = deps.map((d) => ({ key: d.name, label: d.name,
      children: rng.sample(d.kids, rng.int(2, 3)).map(([cat, subs]) => {
        const ck = `${d.name}>${cat}`;
        return { key: ck, label: cat, children: rng.sample(subs, rng.int(3, 4)).map((s) => ({ key: `${ck}>${s}`, label: s })) };
      }) }));
    const leaves = [];
    walk(tree, (n) => { if (!n.children) leaves.push(n); });
    let target = rng.pick(leaves).key;
    if (ood) {
      // One more level under the target and one other sub-category.
      const others = rng.sample(leaves.filter((n) => n.key !== target), 1);
      for (const n of [leaves.find((x) => x.key === target)].concat(others)) {
        n.children = rng.sample(FLY_DEEP, 3).map((s) => ({ key: `${n.key}>${s}`, label: s }));
      }
      target = rng.pick(leaves.find((x) => x.key === target).children).key;
    }
    const delay = rng.pick([200, 300, 400]);
    const spec = { mode: 'flyout', openBy: 'hover', aim: true, aimDelay: rng.pick([300, 450, 600]), hoverDelay: delay,
      trigger: rng.pick(FLY_TRIGGERS), tree, target, by: 'path' };
    flySearch(spec, rng.fork('search'));
    return spec;
  }

  // How the flyout instruction names its target, drawn from fork 'search' so the tree and target of every seed
  // stay as they were: 'path' (40%) names the whole path; 'label' (40%) names only the sub-category (a 4th-level
  // ood target names it with its sub-category: "Best sellers" under "Headphones"); 'clue' (20%) moves the target
  // up to the category (2nd level) and names one sub-category listed in it (spec.clue). Label and clue episodes
  // add look-alike decoys (FLY_LOOKALIKE) to a sibling category of the same department: 70% for the named
  // sub-category and 1-2 for other sub-categories, so a decoy does not give the target away.
  function flySearch(spec, r) {
    const by = r.pick(['path', 'path', 'label', 'label', 'clue']);
    if (by === 'path') return;
    const parts = spec.target.split('>');
    const named = parts.slice(0, 3).join('>');
    const all = [];
    walk(spec.tree, (n) => all.push(n));
    const labels = new Set(all.map((n) => norm(n.label)));
    const subs = all.filter((n) => n.key.split('>').length === 3 && FLY_LOOKALIKE[n.label] && n.key !== named);
    const decoy = (n) => {
      const look = FLY_LOOKALIKE[n.label];
      if (!look || labels.has(norm(look))) return;
      const dept = spec.tree.find((d) => n.key.startsWith(d.key + '>'));
      const cats = dept.children.filter((c) => !n.key.startsWith(c.key + '>'));
      if (!cats.length) return;
      const cat = r.pick(cats);
      cat.children.splice(r.int(0, cat.children.length), 0, { key: `${cat.key}>${look}`, label: look });
      labels.add(norm(look));
    };
    if (r.bool(0.7)) decoy(menuNode(spec, named));
    for (const n of r.sample(subs, r.int(1, 2))) decoy(n);
    spec.by = by;
    if (by === 'clue') {
      spec.clue = named;
      spec.target = parts.slice(0, 2).join('>');
    }
  }

  env.scenario('click-control', {
    name: 'flyout',
    sample: sampleFlyout,
    baseModel(spec, c) {
      return { path: null, out: false, outMs: 0, ...c };
    },
    progress: menuProgressError,
    correct: targetCorrect,
    result: menuResult,
    wrongFinal: menuWrongFinal,
    wrongNav(spec, rng) {
      const anc = menuAncestors(spec.target);
      const parents = [];
      // Not the target itself (by 'clue' the target category is a parent too).
      walk(spec.tree, (n) => { if (n.children && !anc.includes(n.key) && n.key !== spec.target && !n.key.startsWith(spec.target + '>')) parents.push(n.key); });
      if (!parents.length) return null;
      const p = rng.pick(parents);
      return { path: menuAncestors(p).concat([p]) };
    },
    partial(spec) {
      const anc = menuAncestors(spec.target);
      return { path: anc.slice(0, Math.max(0, anc.length - 1)) };
    },
    scene(spec) {
      return { path: menuAncestors(spec.target) };
    },
    planStep(model, spec) {
      if (model.path === null) return { move: { trigger: 'menu' } };
      const anc = menuAncestors(spec.target);
      for (let i = 0; i < anc.length; i++) if (model.path[i] !== anc[i]) return { move: { item: anc[i] } };
      return { click: { item: spec.target } };
    },
    settled: settledMenu,
    tick(model, spec, dt) {
      // The whole flyout closes spec.aimDelay ms after the pointer left the trigger and every open panel.
      if (!model.out || model.path === null) return model.outMs ? { ...model, outMs: 0 } : model;
      const outMs = model.outMs + dt;
      if (outMs + 1e-9 < spec.aimDelay) return { ...model, outMs };
      return { ...model, outMs: 0, out: false, path: null };
    },
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      // Keep the target path and, by 'clue', the sub-category the instruction names.
      const path = (key) => [spec.target, spec.clue].some((t) => t && (key === t || t.startsWith(key + '>')));
      const prune = (nodes) => {
        const keep = new Set(keepIdxOf(r, nodes, (n) => path(n.key), k(1, 2)));
        return nodes.filter((_, i) => keep.has(i)).map((n) => (n.children && path(n.key) ? { ...n, children: prune(n.children) } : n));
      };
      spec.tree = prune(spec.tree);
      spec.aimDelay = Math.max(spec.aimDelay, 600);
    },
    phrase(spec, rng, P) {
      let core, terse, steps;
      // by 'label' / 'clue': never the path (no department or category label in the text).
      const lab = (k) => menuNode(spec, k).label;
      const vars = { trig: spec.trigger, trigq: q(spec.trigger) };
      if (spec.by === 'label') {
        const parts = spec.target.split('>');
        const name = parts.length > 3 ? `${q(lab(spec.target))} under ${q(lab(parts.slice(0, 3).join('>')))}` : q(lab(spec.target));
        core = P(T.flyLabel, { ...vars, name });
        terse = name;
        steps = [`hover over ${q(spec.trigger)}`, `find ${name}`, 'click it'];
        return { core, terse, steps };
      }
      if (spec.by === 'clue') {
        const clue = q(lab(spec.clue));
        core = P(T.flyClue, { ...vars, clue });
        terse = `category with ${clue}`;
        steps = [`hover over ${q(spec.trigger)}`, `find the category that lists ${clue}`, 'click the category name'];
        return { core, terse, steps };
      }
      const labels = menuAncestors(spec.target).concat([spec.target]).map((k) => menuNode(spec, k).label);
      const leaf = labels[labels.length - 1];
      core = P(T.flyout, { arrow: q(labels.join(' › ')), trig: spec.trigger, trigq: q(spec.trigger), leafq: q(leaf),
        words: labels.slice(0, -1).join(' › ') });
      terse = labels.join(' › ');
      steps = [`hover over ${q(spec.trigger)}`].concat(labels.slice(0, -1).map((l) => `hover over ${l}`), [`click ${leaf}`]);
      return { core, terse, steps };
    },
    phKind: () => 'menu',
    retarget(spec, model, rng, out, other) {
      let t = null;
      t = other(leafKeysOf(spec.tree), spec.target);
      if (t !== null) { out.by = 'path'; delete out.clue; }
      return t;
    },
  });
})();

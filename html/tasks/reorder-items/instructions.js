/* reorder-items/instructions.js: rule wording and instruction templates; loaded through the task's files list. */
(function () {
  'use strict';
  const I = env.instruct;
  const lib = env.taskOf('reorder-items').lib;
  const ORD = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth'];

  // ---------------------------------------------------------------- instructions

  const THINGS = {
    number: ['numbers', 'values', 'cards'], month: ['months', 'cards'], alpha: ['names', 'entries', 'items'],
    price: ['products', 'items', 'listings'], date: { invoice: ['invoices'], event: ['events', 'entries'], order: ['orders'] },
    size: ['files', 'attachments', 'downloads'], priority: ['tickets', 'issues', 'requests'], legend: ['cards', 'items', 'entries'],
  };

  function things(rng, spec) {
    const t = THINGS[spec.rule.kind];
    if (spec.rule.kind === 'date') return rng.pick(t[spec.dateWhat] || ['entries']);
    if (spec.rule.kind === 'alpha' && spec.alphaSrc === 'city') return rng.pick(['cities', 'destinations']);
    return rng.pick(t);
  }

  function orderPhrase(rng, spec) {
    const { kind, dir } = spec.rule;
    const up = dir === 'asc';
    const P = {
      number: up ? [
        'in ascending order', 'from smallest to largest', 'smallest first', 'in increasing order', 'in numeric order'
      ]
        : [
          'in descending order', 'from largest to smallest', 'largest first', 'in decreasing order',
          'in reverse numeric order', 'high to low'
        ],
      month: up ? ['in calendar order', 'from January to December', 'earliest month first', 'in the order the months come in the year']
        : [
          'in reverse calendar order', 'latest month first', 'from December back to January',
          'from year end backward'
        ],
      alpha: up ? [
        'alphabetically', 'in alphabetical order', 'from A to Z', 'A first', 'as in a dictionary', 'in ABC sequence'
      ]
        : ['in reverse alphabetical order', 'from Z to A', 'Z first'],
      price: up ? [
        'by price, cheapest first', 'from cheapest to most expensive', 'by price, lowest first',
        'in order of increasing price', 'in ascending price order'
      ]
        : [
          'by price, most expensive first', 'from most to least expensive', 'by price, highest first',
          'in order of decreasing price', 'in descending price order'
        ],
      date: up ? [
        'by date, earliest first', 'chronologically', 'from oldest to newest', 'by date, oldest at the top',
        'by date, early to late', 'in forward date order'
      ]
        : [
          'by date, newest first', 'in reverse chronological order', 'from newest to oldest', 'by date, latest first',
          'by date, moving backward', 'in reversed time sequence'
        ],
      size: up ? [
        'by size, smallest first', 'from smallest to largest file', 'by file size, ascending',
        'from fewest to most bytes'
      ]
        : [
          'by size, largest first', 'from largest to smallest file', 'by file size, descending',
          'from most to fewest bytes'
        ],
      priority: up ? ['by priority, most urgent first', 'by priority, Critical at the top', 'from highest to lowest priority']
        : ['by priority, lowest first', 'from lowest to highest priority', 'with Low priority at the top and Critical at the bottom'],
      legend: ['in the order shown in the key', 'following the order given by the legend', `by tag, in the order listed under "${spec.legendTitle}"`,
        'in the tag order shown on the page'],
    }[kind];
    return rng.pick(P);
  }

  const LIST_T = [
    'Sort the {things} {order}.', 'Reorder the {things} {order}.', 'Arrange the {things} {order}{dirn}.',
    'Use drag and drop to sort the {things} {order}.', 'Fix the order so the {things} are listed {order}.',
    'Rearrange the {things} {order}.', 'Get the {things} sorted {order}.', 'Drag the {things} around until they are {order}.',
    'The {things} need sorting {order}.', 'Set the {things} out {order}{dirn}.',
    'The goal is to list the {things} {order}.', 'Bring the {things} into order {order}.',
    'Let the {things} appear {order}{dirn}.', 'The {things} should be shown {order}.',
    'Drag to place the {things} {order}.',
  ];
  const PIN_T = [' Pinned items stay where they are.', ' Leave the locked rows in place.', ' The pinned entries cannot move; sort the rest around them.',
    ' Items with a lock keep their position.'];
  const MOVE_T = {
    top: [
      'Move "{x}" to the top of the list.', 'Drag "{x}" up so it comes first.', 'Put "{x}" first.',
      'Make "{x}" the first item.', 'Start the list with "{x}".', '"{x}" belongs at the head.',
      'Lift "{x}" ahead of the rest.'
    ],
    bottom: [
      'Move "{x}" to the bottom of the list.', 'Drag "{x}" to the end of the list.', 'Make "{x}" the last item.',
      'Put "{x}" last.', 'End the list with "{x}".', '"{x}" belongs at the tail.', 'Let the others precede "{x}".',
      'Leave "{x}" trailing the others.'
    ],
    position: [
      'Move "{x}" to position {k1}.', 'Make "{x}" the {kth} item in the list.',
      'Drag "{x}" so that it is {kth} from the top.', 'The {kth} spot must hold "{x}".',
      'Insert "{x}" at list position {k1}.', 'Move "{x}" into the {kth} slot from the top.'
    ],
    after: [
      'Put "{x}" right after "{y}".', 'Move "{x}" so it comes directly after "{y}".',
      'Drag "{x}" to just below "{y}".', 'Use the slot after "{y}" for "{x}".', '"{x}" belongs directly below "{y}".',
      'Have "{x}" directly follow "{y}".'
    ],
    before: [
      'Put "{x}" right before "{y}".', 'Move "{x}" so it sits directly above "{y}".',
      'Drag "{x}" to just above "{y}".', 'Take "{x}" to the slot above "{y}".', '"{x}" must directly precede "{y}".',
      'Let "{x}" sit just ahead of "{y}".'
    ],
    swap: [
      'Swap the {ith} and {jth} items.', 'Switch the positions of the {ith} and {jth} entries.',
      'Exchange items {i1} and {j1} in the list.', 'Let the {ith} and {jth} items trade places.',
      'Put item {i1} where {j1} is and vice versa.', 'Only the {ith} and {jth} items switch.'
    ],
    swapName: [
      'Swap "{x}" and "{y}".', 'Switch the places of "{x}" and "{y}".',
      'Exchange "{x}" with "{y}", leaving everything else as it is.', '"{x}" goes where "{y}" is, and vice versa.',
      'Let "{x}" and "{y}" trade places.'
    ],
  };
  const KANBAN_T = [
    'Drag each card into the column it belongs to.', 'Sort the cards into the {cols} columns.',
    'Move every card to the column that matches its category.', 'File each card under the right column: {cols}.',
    'Organize the board so every card sits in its category column.', 'Put each card in the matching column ({cols}).',
    'Triage the board: each card goes in the column for its category.',
    'Match every card to a category by placing it in that column.',
    'Give every card a home in its category column.',
    'All cards belong in their category columns: {cols}.',
    'Fill {cols} with the cards that belong there.',
    'Each column should contain all cards of its category.',
  ];
  const KORDER = {
    'price-asc': [
      'cheapest first', 'by price, lowest at the top', 'from least to most expensive', 'in ascending price order'
    ],
    'price-desc': [
      'most expensive first', 'by price, highest at the top', 'from most to least expensive',
      'in decreasing order of price'
    ],
    alpha: [
      'alphabetically', 'in A-Z order', 'by name, A first', 'in abc sequence', 'a through z', 'by title, a to z'
    ],
  };
  const KORDER_T = [' Within each column, order the cards {order}.', ' Inside every column the cards must be {order}.',
    ' Keep each column sorted {order}.'];

  function instructionOf(spec, rng) {
    if (spec.judge) return lib.judgeInstruction(spec, rng);
    const isplit = spec.isplit;
    if (spec.scenario === 'kanban') {
      const cols = spec.columns.map((c) => `"${I.alias(rng, spec.colLabels[c], [spec.colLabels[c].split(/[ &,]/)[0]])}"`).join(', ');
      let core = I.fill(I.pick(rng, KANBAN_T, isplit), { cols });
      let terse = 'cards into their columns';
      if (spec.ordered) {
        const order = rng.pick(KORDER[spec.orderRule]);
        core += I.fill(I.pick(rng, KORDER_T, isplit), { order });
        terse += `, each column ${order}`;
      }
      return I.say(rng, core, { isplit, terse });
    }
    if (spec.scenario === 'move') {
      const mv = spec.move;
      const t = (id) => spec.labels[id].title;
      const k1 = (mv.k ?? 0) + 1;
      const vars = { x: t(mv.x), y: mv.y ? t(mv.y) : '', k1, kth: ORD[mv.k ?? 0], ith: ORD[mv.i ?? 0], jth: ORD[mv.j ?? 0],
        i1: (mv.i ?? 0) + 1, j1: (mv.j ?? 0) + 1 };
      const core = I.fill(I.pick(rng, MOVE_T[mv.kind], isplit), vars);
      const terse = { top: `"${vars.x}" to the top`, bottom: `"${vars.x}" to the bottom`, position: `"${vars.x}" to #${k1}`,
        after: `"${vars.x}" after "${vars.y}"`, before: `"${vars.x}" before "${vars.y}"`, swap: `swap #${vars.i1} and #${vars.j1}`,
        swapName: `swap "${vars.x}" and "${vars.y}"` }[mv.kind];
      return I.say(rng, core, { isplit, terse });
    }
    const order = orderPhrase(rng, spec);
    const th = things(rng, spec);
    const dirn = spec.scenario === 'grid' ? rng.pick([
      ', reading left to right, top to bottom', ' (row by row)', ', row by row from the top left',
      ', across each row from the top', ', in rows from the top left'
    ])
      : rng.pick([', top to bottom', '', ' from the top']);
    let core = I.fill(I.pick(rng, LIST_T, isplit), { things: th, order, dirn });
    if (spec.scenario === 'grid' && !/row|left to right/.test(core)) core = core.replace(/\.$/, ', row by row.');
    if (spec.locked) core += I.pick(rng, PIN_T, isplit);
    return I.say(rng, core, { isplit, terse: `${th}: ${order}` });
  }

  Object.assign(lib, { things, instructionOf });
})();

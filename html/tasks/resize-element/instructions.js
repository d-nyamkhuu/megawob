/* resize-element/instructions.js: instruction wording, kept in its original draw order. */
(function () {
  'use strict';
  const lib = env.taskOf('resize-element').lib;
  const { COL_ALIASES, judgeInstruction } = lib;

  function instruction(spec, rng) {
    if (spec.judge) return judgeInstruction(spec, rng);
    const I = env.instruct;
    const P = (ts) => I.pick(rng, ts, spec.isplit);
    const F = I.fill;
    const tol = I.tol(rng, ` (±${spec.tau} px)`, 0.5);
    let core;
    let terse;
    const v = spec.scenario;
    if (v === 'split') {
      const [a, b] = spec.panes;
      const g = spec.goal;
      const dimWord = spec.orient === 'v' ? 'wide' : 'tall';
      const pane = spec.panes[g.of];
      const span = spec.total - spec.div;
      if (g.kind === 'ratio') {
        const frac = { '1/2': 'half', '1/3': 'a third', '2/3': 'two thirds', '1/4': 'a quarter', '3/4': 'three quarters', '1/5': 'a fifth', '4/5': 'four fifths' }[`${g.num}/${g.den}`];
        if (g.num * 2 === g.den) {
          core = P(['Split the {a} and {b} panes evenly{tol}.', 'Drag the divider so both panes are the same size{tol}.',
            'Make the {a} and {b} panes equally {d}{tol}.', 'Center the divider between {a} and {b}{tol}.',
            'Give {a} and {b} half of the space each{tol}.', 'Even out the two panes{tol}.',
            'Each pane should occupy half of the split{tol}.', 'Resize the panes to equal shares{tol}.',
            'Adjust {a} to be as {d} as {b}{tol}.', 'Let {a} and {b} share the space equally{tol}.']);
          terse = `${a} | ${b} 50/50`;
        } else {
          core = P(['Drag the divider so {p} takes {f} of the space{tol}.', 'Give the {p} pane {f} of the room{tol}.',
            'Resize the panes: {p} should get {f} of the area{tol}.', 'Move the divider until {p} fills {f} of the split{tol}.',
            'Make {p} {f} of the total {dw}{tol}.', 'Set the split so {p} uses {f} of the space{tol}.',
            'Use {f} of the available space for {p}{tol}.', 'Adjust {p} to occupy {f} of the split{tol}.',
            'Divide the space with {f} reserved for {p}{tol}.',
            'The divider should leave {f} of the space to {p}{tol}.']);
          terse = `${pane} pane: ${frac} of the ${spec.orient === 'v' ? 'width' : 'height'}`;
        }
        core = F(core, { a, b, p: pane, f: frac, d: dimWord, dw: spec.orient === 'v' ? 'width' : 'height', tol });
      } else {
        const px = g.of === 0 ? spec.target : span - spec.target;
        core = F(P(['Make the {p} pane {n} px {d}{tol}.', 'Drag the divider so {p} is {n} px {d}{tol}.',
          'Resize {p} to {n} px{tol}.', 'Set the {p} pane to a {dim} of {n} px{tol}.',
          'Move the splitter until {p} measures {n} px{tol}.', 'Give {p} exactly {n} px{tol}.',
          'The {p} pane should measure {n} px{tol}.', 'Stop at {n} px when sizing {p}{tol}.']),
        { p: pane, n: px, d: dimWord, dim: spec.orient === 'v' ? 'width' : 'height', tol });
        terse = `${pane} pane ${px} px`;
      }
    } else if (v === 'column') {
      const c = spec.columns[spec.col];
      const cn = I.alias(rng, c.name, COL_ALIASES[c.name] || []);
      const q = cn === c.name ? `“${cn}”` : cn.replace(/ column$/, '');
      if (spec.goal.kind === 'equal') {
        const r = spec.columns[spec.ref];
        core = F(P(['Make the {c} column as wide as the “{r}” column{tol}.', 'Resize the {c} column to match the width of “{r}”{tol}.',
          'Drag the {c} column border until it is as wide as “{r}”{tol}.', 'Give the {c} column the same width as “{r}”{tol}.',
          'Widen or narrow the {c} column so it is exactly as wide as “{r}”{tol}.', 'Set the {c} column to the width of the “{r}” column{tol}.',
          'The {c} column needs a width equal to that of “{r}”{tol}.',
          'Copy the width of “{r}” onto the {c} column{tol}.']),
        { c: q, r: r.name, tol });
        terse = `${c.name} column as wide as ${r.name}`;
      } else {
        core = F(P(['Make the {c} column {n} px wide{tol}.', 'Resize the {c} column to {n} px{tol}.',
          'Drag the right edge of the {c} header so the column is {n} px wide{tol}.', 'Set the width of {c} to {n} px{tol}.',
          'Change the {c} column width to {n} px{tol}.', 'Adjust the {c} column so it is {n} px wide{tol}.',
          'Widen or narrow the {c} column to {n} px{tol}.',
          'The {c} column should measure {n} px across{tol}.',
          'The {c} column needs to be {n} px wide{tol}.',
          'Move the {c} border to reach {n} px in width{tol}.',
          'Stop at {n} px when resizing the {c} column{tol}.']), { c: q, n: spec.target, tol });
        terse = `${c.name} column: ${spec.target} px`;
      }
    } else {
      const g = spec.goal;
      const t = spec.target;
      const box = v === 'textarea' ? P([
        'text box', 'textarea', 'input box', 'field', 'editor', 'text pane'
      ]) : P(['panel', 'window', 'box']);
      const name = `“${I.alias(rng, spec.title, [])}” ${box}`;
      const vars = { p: name, w: t.w, h: t.h, tol };
      if (g.kind === 'scale') {
        const pct = `${Math.round(g.factor * 100)}%`;
        const word = { 2: 'twice as big', 0.5: 'half as big', 3: 'three times as big' }[g.factor];
        core = F(P(['Scale the {p} to {pct} of its current size, keeping its proportions{tol}.',
          'Resize the {p} to {pct} of its size without distorting it{tol}.',
          word ? 'Make the {p} {x}, keeping its aspect ratio{tol}.' : 'Make the {p} {pct} of its current size; keep the aspect ratio{tol}.',
          'Scale the {p} proportionally to {pct}{tol}.', 'Resize the {p} to {pct} of what it is now, width and height alike{tol}.',
          '{P} should be {pct} of its current size, same proportions{tol}.']), { ...vars, pct, x: word, P: name[0].toUpperCase() + name.slice(1) });
        terse = `${spec.title}: ${pct}, keep ratio`;
      } else if (g.kind === 'fit') {
        const n = t[g.dim];
        const d = g.dim === 'w' ? ['wide', 'width'] : ['tall', 'height'];
        core = F(P(['Make the {p} {n} px {d}, keeping its proportions{tol}.', 'Resize the {p} proportionally until it is {n} px {d}{tol}.',
          'Scale the {p} without changing its aspect ratio so its {dim} is {n} px{tol}.',
          'Set the {p}\'s {dim} to {n} px and let the other side follow its current proportions{tol}.',
          'Resize the {p} to {n} px {d} without distorting it{tol}.', 'Give the {p} a {dim} of {n} px, same aspect ratio as now{tol}.',
          'Keep the {p}\'s aspect ratio as you bring its {dim} to {n} px{tol}.',
          'The {p} should be {n} px {d}, with its current aspect ratio{tol}.',
          'For the {p}, aim for {n} px in {dim} and keep its proportions{tol}.',
          'Preserve the {p}\'s proportions while resizing it to {n} px {d}{tol}.',
          'Scale both sides in proportion until the {p} is {n} px {d}{tol}.']),
        { ...vars, n, d: d[0], dim: d[1] });
        terse = `${spec.title} ${d[1]} ${n} px, keep ratio`;
      } else if (v === 'ghost' || (v === 'textarea' && spec.outline)) {
        core = F(P(['Resize the {p} to match the dashed outline{tol}.', 'Drag the {p}\'s handle until it matches the dashed outline{tol}.',
          'Make the {p} the same size as the dashed rectangle{tol}.', 'Fit the {p} to the dashed outline{tol}.',
          'Resize the {p} so its edges line up with the dashed box{tol}.', 'Match the {p} to the outline shown{tol}.',
          'Use the dashed outline to size the {p}{tol}.', 'The {p} should fill the dashed outline{tol}.',
          'Bring the {p}\'s size into line with the dashed box{tol}.',
          'Keep resizing the {p} until it fits the dashed outline{tol}.',
          'The dashed rectangle shows the size for the {p}{tol}.']), vars);
        terse = `${spec.title}: match the outline`;
      } else if (g.kind === 'grow') {
        const d = g.dim === 'h' ? ['taller', 'height', 'tall'] : ['wider', 'width', 'wide'];
        core = F(P(['Make the {p} at least {a} px {more}.', 'Resize the {p} so it is {a} px {more} than now (or more).',
          'Drag the {p}\'s corner to make it {more} by at least {a} px.', 'Increase the {dim} of the {p} by {a} px or more.',
          'Enlarge the {p}: at least {a} px {more}.', 'Grow the {p} by at least {a} px in {dim}.',
          'Add {a} px or more to the {p}\'s {dim}.', 'The {p} needs to be at least {a} px {more} than now.',
          'Use a {dim} at least {a} px greater for the {p}.', 'Resize the {p}: {a} px {more} is the minimum.',
          'The {p}\'s {dim} should go up by at least {a} px.']),
        { ...vars, a: g.amount, more: d[0], dim: d[1] });
        terse = `${spec.title} ${d[1]} +${g.amount} px or more`;
      } else if (g.kind === 'ref') {
        const d = g.ref.dim === 'w' ? 'wide' : 'tall';
        core = F(P(['Make the {p} as {d} as the “{r}”{tol}.', 'Resize the {p} so its {dim} matches the “{r}”{tol}.',
          'Drag the {p}\'s edge until it is exactly as {d} as the “{r}”{tol}.', 'Give the {p} the same {dim} as the “{r}”{tol}.',
          'Match the {dim} of the {p} to the “{r}”{tol}.', 'Resize the {p} until it is as {d} as the “{r}”{tol}.',
          'Use “{r}” as the {dim} target for the {p}{tol}.', 'The {p} needs to be as {d} as the “{r}”{tol}.',
          'Bring the {p}\'s {dim} into line with the “{r}”{tol}.', 'The “{r}” shows how {d} the {p} should be{tol}.',
          'Set the {p}\'s {dim} equal to that of the “{r}”{tol}.']),
        { ...vars, d, r: g.ref.name, dim: g.ref.dim === 'w' ? 'width' : 'height' });
        terse = `${spec.title} as ${d} as ${g.ref.name}`;
      } else if (g.kind === 'factor') {
        const word = { 2: 'twice as', 0.5: 'half as', 1.5: 'one and a half times as', 3: 'three times as', [1 / 3]: 'a third as' }[g.factor];
        const d = g.dim === 'w' ? 'wide' : 'tall';
        core = F(P(['Make the {p} {x} {d} as it is now{tol}.', 'Resize the {p} to be {x} {d} as it currently is{tol}.',
          'Change the {dim} of the {p}: {x} {d} as now{tol}.', 'Drag the {p}\'s edge so it ends up {x} {d} as before{tol}.',
          'Scale the {p}\'s {dim} so it is {x} {d} as at the start{tol}.', 'Resize the {p} until it is {x} {d} as it is right now{tol}.',
          'Use the starting size: the {p} should be {x} {d}{tol}.',
          'The {p} needs to end up {x} {d} as it was at first{tol}.',
          'Take the {p} from its current size to {x} {d}{tol}.',
          'Set the {p}\'s {dim}: {x} {d} as originally shown{tol}.']),
        { ...vars, x: word, d, dim: g.dim === 'w' ? 'width' : 'height' });
        terse = `${spec.title}: ${word} ${d}`;
      } else if (g.kind === 'square') {
        core = F(P(['Make the {p} square.', 'Resize the {p} so it is as wide as it is tall{tol}.',
          'Drag the {p}\'s handle until its width equals its height{tol}.', 'Turn the {p} into a square{tol}.',
          'Give the {p} equal width and height{tol}.', 'Square up the {p}.', 'Match the {p}\'s width and height{tol}.',
          'A square is the goal for the {p}.', 'Resize the {p} until all four sides are equal{tol}.',
          'Pull the {p}\'s handle to form a square{tol}.', 'Aim for a square {p}.',
          'The {p} needs equal dimensions{tol}.']), vars);
        terse = `${spec.title}: square`;
      } else if (spec.axes === 'w' || spec.axes === 'h') {
        const n = spec.axes === 'w' ? t.w : t.h;
        const d = spec.axes === 'w' ? ['wide', 'width'] : ['tall', 'height'];
        core = F(P(['Make the {p} {n} px {d}{tol}.', 'Resize the {p} to a {dim} of {n} px{tol}.', 'Set the {p}\'s {dim} to {n} px{tol}.',
          'Drag the {p}\'s edge so it is {n} px {d}{tol}.', 'Change the {dim} of the {p} to {n} px; leave the other side as it is{tol}.',
          'Adjust the {p} so it is {n} px {d}{tol}.',
          'The {p} needs a {dim} of {n} px{tol}.',
          'Use {n} px for the {p}\'s {dim}{tol}.',
          'Give the {p} a {dim} of {n} px; keep the other side unchanged{tol}.',
          'The {p} should measure {n} px {d}{tol}.']), { ...vars, n, d: d[0], dim: d[1] });
        terse = `${spec.title} ${d[1]} ${n} px`;
      } else {
        core = F(P(['Resize the {p} to {w} × {h} px{tol}.', 'Make the {p} {w} px wide and {h} px tall{tol}.',
          'Drag the {p}\'s handle until it measures {w} × {h} px{tol}.', 'Set the {p} to {w} by {h} pixels{tol}.',
          'Change the size of the {p} to {w}×{h}{tol}.', 'Resize the {p} so it is {w} px wide and {h} px high{tol}.',
          'Resize the {p}: width {w}, height {h}{tol}.',
          'Use {w} px width and {h} px height for the {p}{tol}.',
          'The {p} should measure {w} × {h} px{tol}.',
          'Give the {p} these dimensions: {w} × {h} px{tol}.',
          'For the {p}, aim for {w} × {h} px{tol}.',
          'The {p}\'s final size is {w} by {h} pixels{tol}.',
          'Bring the {p} to {w} px wide by {h} px high{tol}.',
          'Size the {p}: {w} px wide, {h} px tall{tol}.']), vars);
        terse = `${spec.title} ${t.w}×${t.h}`;
      }
    }
    let out = I.say(rng, core, { isplit: spec.isplit, terse });
    if (spec.keys && rng.bool(0.25)) out += (/[.!?]$/.test(out) ? ' ' : '. ') + P([
      'Arrow keys work too.', 'You can also use the keyboard.', 'Keyboard nudging is allowed.',
      'The keyboard is an option.'
    ]);
    return out;
  }

  Object.assign(lib, { instruction });
})();

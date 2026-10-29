/* choose-option/instructions.js: instruction templates and wording. */
(function () {
  'use strict';
  const lib = env.taskOf('choose-option').lib;
  const { lc, listText, quote, judgeInstruction, I, matrixAsked } = lib;

  const T = {
    dropdown: ['Select {t} from the {label} dropdown.', 'Open the {label} menu and choose {t}.', 'Set {label} to {t}.',
      'Choose {t} as the {noun}.', 'Change the {label} to {t}.', 'Pick {t} in the {label} list.', 'Switch the {noun} to {t}.',
      'Make {t} the selected {noun}.',
      'Use {t} for the {noun}.',
      '{label} should be set to {t}.',
      'Your {noun} needs to be {t}.',
      'Find and select {t} in {label}.',
      'Have {label} show {t} as selected.',
      'Update {label} by choosing {t}.'],
    radio: ['Select the {t} option under {label}.', 'Choose {t} as the {noun}.', 'Set {label} to {t}.', 'Pick {t} for {label}.',
      'Mark {t} as the {noun}.', 'Go with {t} for the {noun}.', 'Switch the {noun} to {t}.',
      'Have {t} marked for {label}.', 'Make {t} your {noun}.', '{label} is to be {t}.', 'The {noun} must be {t}.',
      'Leave {t} as the marked {noun}.'],
    cheapest: ['Choose the cheapest {noun}.', 'Pick whichever option costs the least.', 'Select the {noun} with the lowest price.',
      'Go with the least expensive delivery option.',
      'Minimize the price of your {noun}.'],
    fastest: ['Choose the fastest {noun}.', 'Pick the option that arrives soonest.', 'Select the quickest delivery option.',
      'Go with whichever {noun} gets it here first.',
      'Minimize the wait for your {noun}.',
      'Make the soonest arrival your choice.',
      'Use the {noun} with the least wait.'],
    within: ['Choose the cheapest option that arrives within {days} days.', 'Pick the lowest-priced {noun} that takes at most {days} days.',
      'Among the options that arrive within {days} days, take the cheapest.', 'Select the least expensive delivery that needs no more than {days} days.',
      'Limit delivery to {days} days and choose the cheapest option.',
      'Keep arrival within {days} days while minimizing delivery price.',
      'Minimize the {noun} price with arrival in no more than {days} days.'],
    checkbox: ['Check {xs} and nothing else.', 'Select exactly {these} {nouns}: {xs}. Leave the rest unchecked.',
      'Make sure only {xs} {is} checked under {label}.', 'Under {label}, tick {xs} and untick everything else.',
      'Leave only {xs} checked among the {plural}.', 'Select {xs}; clear any other {plural}.', 'Tick {xs} and no other {plural}.',
      'The checked set must be {xs}, nothing else.', 'Clear other boxes and select {xs}.',
      'Only {these} {nouns} should be checked: {xs}.', 'The {plural} checked must be exactly {xs}.',
      '{xs} {is} to be checked in {label}; nothing else.', 'Check {xs}; all other {plural} must be clear.',
      'Under {label}, leave checkmarks only on {xs}.'],
    acFull: ['Type in the {label} field and pick {t} from the suggestions.', 'Enter {t} in the {label} field by selecting it from the suggestion list.',
      'Set {label} to {t} using the search field.', 'Search for {t} in {label} and select it.',
      'Find {t} in the {label} box and choose it from the dropdown.', 'Fill in {label} with {t}, choosing it from the suggestions.',
      'Use the suggestions for {label} to make {t} the selection.',
      'The {t} suggestion is the one to pick in {label}.',
      'Look up {t} in {label}, then choose the matching suggestion.',
      'For {label}, enter a search and select the {t} suggestion.',
      'Use {label} to bring up suggestions, then select {t}.'],
    acAffix: ['In the {label} field, pick the {noun} that starts with {p} and ends with {s} from the suggestions.',
      'Type in the {label} field and select the {noun} starting with {p} and ending with {s}.',
      'Choose the {noun} beginning with {p} and ending in {s} for {label}.', 'Find the {noun} whose name starts with {p} and ends with {s}, and select it.',
      'For {label}, select the suggestion that begins with {p} and ends with {s}.', 'Set {label} to the {noun} that starts with {p} and finishes with {s}.',
      'Use {label} to select the {noun} suggestion with prefix {p} and suffix {s}.',
      'The {label} suggestion to select must start with {p} and end with {s}.',
      'Match {p} at the start and {s} at the end of a {noun}, then select its suggestion.'],
    lbOne: ['Select {t} in the {label} list.', 'Scroll the {label} list and select {t}.', 'Find {t} in the {label} list and click it.',
      'Highlight {t} in {label}.', 'Choose {t} from the {label} list.', 'Pick {t} in the list of {plural}.',
      'Make {t} the choice in {label}.', 'The {label} selection should be {t}.', 'Use {t} for the list of {plural}.',
      'Use {label} to pick out {t}.', '{t} is your target in the {label} list.',
      'Mark the entry named {t} in {label}.'],
    lbMany: ['Select {xs} in the {label} list, and nothing else.', 'Scroll through the {label} list and select only {xs}.',
      'Make the {label} selection exactly {xs}.', 'Select {xs} in the list; nothing else should stay selected.',
      'Mark {xs} in the {label} list and deselect anything else.', 'Leave only {xs} selected in {label}.',
      'The {label} list should have just {xs} selected.', 'Set {label} so its selection is exactly {xs}.',
      'Use {xs} as the entire selection in the list.', 'In {label}, select all of {xs}; clear the rest.',
      'Finish with {xs} selected and all other entries cleared.'],
    grName: ['Select {t} from the {label} dropdown.', 'Open {label} and choose {t} (listed under {g}).', 'Set {label} to {t}.',
      'Pick {t} in the {label} menu; you may need to scroll.', 'Choose {t} as the {noun}.', 'Find {t} under {g} in the {label} list and select it.',
      'Make {t} the selected {noun}.', 'Look under {g} in {label}; the choice is {t}.',
      'The {g} group in {label} has {t}; choose it.'],
    grFirst: ['In {label}, pick the first available {noun} under {g}.', 'Choose the first {noun} listed under {g} that is not unavailable.',
      'Select the top option in the {g} group of {label} that can still be chosen.', 'Open {label} and select the first selectable {noun} in the {g} group.',
      "Under {g}, choose the first {noun} that isn't greyed out.", 'Pick the first {g} entry in the {label} list that is available.',
      'In {label}, use the earliest selectable entry in the {g} group.',
      'Work down the {g} group and choose the first enabled {noun}.',
      'The {label} choice should be the first enabled {noun} under {g}.',
      'For {label}, start at {g} and pick its first available entry.'],
    combobox: ['Select {t} in the {label} field.', 'Search the {label} list for {t} and select it.', 'Set {label} to {t}.',
      'Choose {t} as the {noun}; the list is searchable.', 'Find {t} in {label} and pick it.', 'Open {label}, filter for {t}, and select it.',
      'The search result to use for {noun} is {t}.', 'In {label}, choose the entry named {t}.'],
    chips: ['Make the {label} field contain exactly {xs}.', 'Make {label} list only {xs}.', 'Set {label} to {xs}; remove any other {plural}.',
      'Add {xs} to {label} and take out anything else.', 'Keep only {xs} in {label}.', 'Select {xs} in {label}, nothing else.',
      'Fill {label} with {xs}, excluding all others.', 'Replace everything in {label} with {xs}.',
      'Only {xs} belong in {label}.', 'Match {label} to {xs}, clearing extras.',
      'Use {xs} for {label}; no other {plural}.'],
    tags: ['Make the {label} field contain exactly {xs}.', 'Set {label} to {xs}; remove any other {plural}.',
      'Tag it with {xs} and nothing else.', 'Add {xs} to {label} and take out the rest.', 'Keep only {xs} in {label}.',
      'The {label} should be {xs}, no other tags.',
      'Choose tags so {label} has {xs} only.',
      'Replace the tags in {label} with {xs}.',
      'Fill {label} with {xs}; exclude other {plural}.',
      'In {label}, tags must be exactly {xs}.'],
    toggles: ['{clauses}.', 'In the settings, {clauses}.', 'Update the preferences: {clauses}.', 'Please make these changes: {clauses}.',
      'Adjust the switches so that you {clauses}.', '{Clauses}, and leave the other settings alone.',
      'Please {clauses}.', 'The required changes are: {clauses}.', 'Do the following: {clauses}.'],
    tree: ['{clauses}.', 'Update the checkboxes: {clauses}.', 'Set the options as follows: {clauses}.', 'Configure it so you {clauses}.',
      'Make these selections: {clauses}.', '{Clauses}; nothing else should change.',
      '{Clauses}. Keep the rest unchanged.', 'Use these group rules: {clauses}.'],
    matrix: ['{Clauses}.', 'In the survey, {clauses}.', 'Fill in the {title} form: {clauses}.', 'Answer the questions: {clauses}. Leave the other rows alone.',
      'Complete the form as follows: {clauses}.', 'Please {clauses}.', 'For the requested rows, {clauses}.',
      'To record my answers, {clauses}.', 'Use my answers: {clauses}.'],
    dependent: ['Set the location to {city}, {country}.', 'Choose {country} as the country and then {city} as the city.', 'Select {city} in {country}.',
      'Pick {country}, then {city}.', 'Change the {l2} to {city} in {country}.', 'Put the address in {city}, {country}.',
      'With {country} set, choose {city}.', 'I want {city} as my city in {country}.',
      'Use {country} and its city {city}.', 'After choosing {country}, use {city} for the {l2}.',
      'My location should be {city}, {country}.'],
  };

  function toggleClause(rng, item, effect) {
    const c = item.concept;
    if (item.kind === 'onoff') return effect ? rng.pick([`turn ${c} on`, `enable ${c}`, `switch on ${c}`]) : rng.pick([`turn ${c} off`, `disable ${c}`, `switch off ${c}`]);
    if (item.kind === 'visible') return effect ? rng.pick([`show ${c}`, `make ${c} visible`]) : rng.pick([`hide ${c}`, `keep ${c} hidden`, `stop showing ${c}`]);
    return effect ? rng.pick([`allow ${c}`, `permit ${c}`]) : rng.pick([`block ${c}`, `don't allow ${c}`, `disallow ${c}`]);
  }

  function treeClause(rng, g) {
    const { kind, list } = g.goal;
    const n = g.name;
    const nl = lc(n);
    const xs = listText(list, quote);
    if (kind === 'all') return rng.pick([`select every option under ${n}`, `check all ${nl}`, `turn on all of ${n}`]);
    if (kind === 'none') return rng.pick([`clear everything under ${n}`, `uncheck all ${nl}`, `turn off all of ${n}`]);
    if (kind === 'except') return rng.pick([`select all ${nl} except ${xs}`, `check everything under ${n} but ${xs}`, `turn on all of ${n} apart from ${xs}`]);
    return rng.pick([`under ${n}, check only ${xs}`, `select just ${xs} in ${n}`, `keep only ${xs} checked under ${n}`]);
  }

  function instructionOf(spec, rng) {
    if (spec.judge && spec.judge.mode !== 'confirm') return judgeInstruction(spec, rng);
    const v = spec.scenario;
    const isplit = spec.isplit;
    const label = I.alias(rng, spec.label, spec.labelAliases || []);
    const vars = { t: quote(spec.target), label, noun: spec.noun, plural: spec.plural };
    let core;
    let terse;
    let steps;
    const fill = (key, extra = {}) => I.fill(I.pick(rng, T[key], isplit), { ...vars, ...extra });
    switch (v) {
      case 'dropdown':
        core = fill('dropdown');
        terse = `${spec.label}: ${spec.target}`;
        steps = [`open the ${label} dropdown`, `choose ${quote(spec.target)}`];
        break;
      case 'radio':
        if (spec.criterion) {
          const k = spec.criterion.kind;
          core = fill(k, { days: spec.criterion.days });
        } else {
          core = fill('radio');
          terse = `${spec.label}: ${spec.target}`;
        }
        break;
      case 'checkbox': {
        const one = spec.targets.length === 1;
        core = fill('checkbox', { xs: listText(spec.targets, quote), these: one ? 'this' : 'these', nouns: one ? spec.noun : spec.plural, is: one ? 'is' : 'are' });
        terse = `${spec.label}: ${spec.targets.join(', ')} only`;
        break;
      }
      case 'autocomplete':
        if (spec.hint.kind === 'affix') core = fill('acAffix', { p: quote(spec.hint.prefix), s: quote(spec.hint.suffix) });
        else {
          core = fill('acFull');
          terse = `${spec.label}: ${spec.target}`;
          steps = [`type the first letters of ${quote(spec.target)} into ${label}`, `pick ${quote(spec.target)} from the suggestions`];
        }
        break;
      case 'listbox':
        if (spec.multi) core = fill('lbMany', { xs: listText(spec.targets, quote) });
        else { core = fill('lbOne'); terse = `${spec.label}: ${spec.target}`; }
        break;
      case 'grouped':
        if (spec.criterion === 'firstAvail') core = fill('grFirst', { g: quote(spec.group) });
        else { core = fill('grName', { g: spec.group }); terse = `${spec.label}: ${spec.target}`; }
        break;
      case 'combobox':
        core = fill('combobox');
        terse = `${spec.label}: ${spec.target}`;
        break;
      case 'chips':
        core = fill('chips', { xs: listText(spec.targets, quote) });
        terse = `${spec.label}: ${spec.targets.join(', ')}`;
        break;
      case 'tags':
        core = fill('tags', { xs: listText(spec.targets, quote) });
        terse = `${spec.label}: ${spec.targets.join(', ')}`;
        break;
      case 'toggles': {
        const cl = spec.said.map((i, j) => toggleClause(rng, spec.items[i], spec.effect[j]));
        const clauses = cl.length === 1 ? cl[0] : `${cl.slice(0, -1).join(', ')} and ${cl[cl.length - 1]}`;
        core = fill('toggles', { clauses, Clauses: I.ucFirst(clauses) });
        core = I.ucFirst(core);
        if (cl.length > 1) steps = cl;
        break;
      }
      case 'tree': {
        const cl = spec.groups.map((g) => treeClause(rng, g));
        const clauses = cl.length === 1 ? cl[0] : `${cl.slice(0, -1).join(', ')} and ${cl[cl.length - 1]}`;
        core = I.ucFirst(fill('tree', { clauses, Clauses: I.ucFirst(clauses) }));
        if (cl.length > 1) steps = cl;
        break;
      }
      case 'matrix': {
        const cl = matrixAsked(spec).map((i) => {
          const r = quote(spec.rows[i]);
          const c = quote(spec.goals[i]);
          return rng.pick([`choose ${c} for ${r}`, `answer ${c} on ${r}`, `mark ${r} as ${c}`, `select ${c} in the ${r} row`]);
        });
        const clauses = cl.length === 1 ? cl[0] : `${cl.slice(0, -1).join(', ')} and ${cl[cl.length - 1]}`;
        core = I.ucFirst(fill('matrix', { clauses, Clauses: I.ucFirst(clauses), title: lc(spec.title) }));
        terse = matrixAsked(spec).map((i) => `${spec.rows[i]}: ${spec.goals[i]}`).join(', ');
        if (cl.length > 1) steps = cl;
        break;
      }
      case 'dependent': {
        const { country, city } = spec.target;
        core = fill('dependent', { city: quote(city), country: quote(country), l2: lc(spec.label2) });
        terse = `${city}, ${country}`;
        steps = [`choose ${quote(country)} as the country`, `pick ${quote(city)} as the city`];
        break;
      }
      default:
        throw new Error(`choose-option: instruction for ${v}`);
    }
    if (spec.judge && spec.judge.mode === 'confirm') {
      core = `${core.replace(/[.!?\s]+$/, '')}, but check with me before you submit.`;
      if (steps) steps = [...steps, 'check with me before submitting'];
      if (terse) terse = `${terse}; ask me before submitting`;
    }
    return I.say(rng, core, { isplit, terse, steps });
  }

  Object.assign(lib, { instructionOf });
})();

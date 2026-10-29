/* scroll-page/instruct.js: the instruction wording (T), the instruction of a normal episode and of the judge modes. Attached to
 * the task's lib. */
(function () {
  'use strict';
  const lib = env.taskOf('scroll-page').lib;
  const { quote: q, isConfirm } = env.util;
  const I = env.instruct;
  const { CONTAINERS, FAQ, KIND_NAMES, actionById, isIdle, rowsOf } = lib;

  // ---------------------------------------------------------------- instructions

  const T = {
    linkHeading: [
      'In the {sec} section, click {label}.',
      'Scroll down to {sec} and click {label}.',
      'Find the {sec} section and click {label} there.',
      'Under {sec}, click {label}.',
      'Go to the part of the {page} headed {sec} and click {label}.',
      'Click {label} in the {sec} section further down the {page}.',
      'Open {label} from the {sec} section.',
      'Click {label}, the one under {sec}.',
      'Choose {label} within the section {sec}.',
      'On the {page}, reach {sec} and select its {label}.',
      'The {sec} heading marks where to click {label}.',
    ],
    linkAbout: [
      'Find the section about {about} and click {label} there.',
      'Further down there is a part on {about}; click its {label}.',
      'Scroll to the section that covers {about} and click {label}.',
      'Click {label} in the section about {about}.',
      'Look for where the {page} talks about {about}, then click {label} in that section.',
      'In the part of the {page} dealing with {about}, click {label}.',
      'Use the topic {about} to find a section; click its {label}.',
      'For {label}, go to the part about {about} and click it there.',
      'Read down the {page} for {about}; click {label} in that part.',
      'Once you reach the part about {about}, click {label} within it.',
      'The section to use for {label} concerns {about}; click it there.',
    ],
    linkNone: [
      'Click {label}. It is further down the {page}.',
      'Scroll down and click {label}.',
      'Find {label} somewhere below and click it.',
      'Click the {label} {kindword} lower on the {page}.',
      'Click the {label} {kindword} below the fold.',
      'Locate {label} on this {page} and open it.',
      'Move down to select {label}.',
    ],
    accordion: [
      'Open the question {qq} and click {label} in its answer.',
      'In the FAQ, expand {qq}, then click {label}.',
      'Scroll down to {qq}, expand it, and use the {label} link inside.',
      'Expand the FAQ entry {qq} and click {label}.',
      'Click {label} in the answer to {qq}.',
      'Open {qq} and click the {label} link in its answer.',
      'Find {qq} in the questions further down, open it and click {label}.',
      'Reveal the answer to {qq}, then select {label} inside.',
      'Select {label} after opening the answer to {qq}.',
      'Show the answer under {qq} and choose its {label}.',
      'Use {label} inside {qq}, opening the question first.',
    ],
    accordionAbout: [
      'Find the question about {about}, open it and click {label}.',
      'In the FAQ, open the entry on {about} and click {label} in the answer.',
      'Expand the question that deals with {about}, then click {label}.',
      'Open the FAQ answer that covers {about} and click {label}.',
      'Scroll down to the questions, find the one about {about} and click {label} inside it.',
      'Open the FAQ item about {about} and use its {label} link.',
      'To reach {label}, open the FAQ question on {about} and click its link.',
      'Show the FAQ answer on {about}, then follow {label} inside.',
    ],
    copyDown: [
      'Find the {vlabel} further down the {page} and enter it in the {field} field at the top.',
      'Copy the {vlabel} shown below into the {field} box.',
      'Type the {vlabel} from this {page} into {field}.',
      'Scroll down to find the {vlabel}, then fill it into {field}.',
      'Enter the {vlabel} (it is listed lower on the {page}) in the {field} field.',
      'Fill in {field} with the {vlabel} that appears in the {sec} section.',
      'Put the {vlabel} from the {sec} section into {field} at the top of the {page}.',
      'Use the {vlabel} farther down to complete {field} at the top.',
      'At the top of the {page}, set {field} to the {vlabel} found below.',
      'Read the {vlabel} below, then return to the top and fill {field}.',
      'For the {field} field, copy the {vlabel} from farther down on the {page}.',
      'Bring the {vlabel} from the {sec} section back up to {field} on the {page}.',
      'Take the {vlabel} in {sec} as the value to enter in {field}.',
    ],
    copyUp: [
      'Copy the {vlabel} from the top of the {page} into the {field} field near the bottom.',
      'Enter the {vlabel} shown at the top in the {field} box further down.',
      'Scroll down to the {field} field and type the {vlabel} from the top of the {page} into it.',
      'Fill {field}, lower on the {page}, with the {vlabel} printed at the top.',
      'Fill the {field} field in the {sec} section with the {vlabel} from the top.',
      'Type the {vlabel} into {field} (the field is further down).',
      'Read the {vlabel} at the top of the {page}, then carry it down to {field}.',
      'Use {field} near the end of the {page} to record the {vlabel} from the top.',
      'For {field} in the {sec} section, take the {vlabel} printed at the top.',
      'Go from the {vlabel} at the top of the {page} to {field} below and enter that value.',
      'Note the top {vlabel}, then go down to enter the same value in {field}.',
    ],
    top: [
      'Go back to the top of the {page} and click {label}.',
      'Head back up and click {label} at the top of the {page}.',
      'Click {label} at the top of the {page}, not the one at the bottom.',
      'Return to the start of the {page} and press {label}.',
      'Scroll all the way up and click {label} next to the title.',
      'Use the {label} button below the title of the {page}.',
      'From the end of the {page}, go back up and click {label} in the toolbar at the top.',
      'Go up the {page} to its title. Click {label} there.',
      'Back at the {page} title, click {label} in its toolbar.',
      'Use {label} by the title once you have scrolled up the {page}.',
      'To click {label}, return to the title area at the top of the {page}.',
    ],
    nested: [
      'In the {pane} box, find {row} and click its {label}.',
      'Scroll the {pane} list to {row} and click {label}.',
      'Click {label} for {row} in the {pane} panel further down.',
      'Find {row} inside the scrolling {pane} list and click {label} next to it.',
      'Click {label} on {row} in {pane}.',
      'Locate {row} in {pane} and press its {label} button.',
      'Scroll down to the {pane} list and click {label} for {row}.',
      'Use {pane} to locate {row}, then click its own {label}.',
      'Once you reach {row} within {pane}, click its {label}.',
      'Look through {pane} for {row}. Use {label} on that row.',
      'Match {row} inside {pane} with its {label} button and click it.',
    ],
  };

  T.hscroll = [
    'In the {pane} strip, scroll sideways to {row} and click its {label}.',
    'Scroll the {pane} row of cards to the right until you find {row}, then click {label}.',
    'Click {label} on the card for {row} in the {pane} strip.',
    'The {pane} cards scroll horizontally; find {row} and press {label}.',
    'Find {row} in the sideways-scrolling {pane} list and click {label} on it.',
    'Go to {pane}, scroll right to {row} and click {label}.',
    'Move sideways within {pane}; on reaching {row} click its {label}.',
    'Bring the card for {row} into view sideways in {pane}; click {label}.',
    'Use {label} for {row} after scrolling across the cards in {pane}.',
    'For {row}, use its {label} button in {pane} after scrolling sideways.',
  ];
  T.carousel = [
    'In the {pane} carousel, move to the slide for {row} and click {label}.',
    'Flip through the {pane} slides until you reach {row}, then click {label}.',
    'Click {label} on the {pane} slide for {row}.',
    'The {pane} carousel shows one slide at a time; find {row} and press {label}.',
    'Go to {pane}, switch to the slide for {row} and click {label}.',
    'Page through {pane} to {row} and click its {label}.',
    'Browse slides in {pane} for {row}; use {label} on that slide.',
    'Use {label} once the carousel in {pane} is showing {row}.',
    'To act on {row}, find its slide within {pane} and click {label}.',
    'Find the slide representing {row} within {pane}. Click its own {label}.',
    'After navigating the slides in {pane} to {row}, click {label}.',
  ];
  T.sticky = [
    'In the {pane} list, scroll to {row} and click its {label}.',
    'Scroll the {pane} panel until {row} is fully visible under the header, then click {label}.',
    'Find {row} in {pane} (the list has a pinned header) and click {label}.',
    'Click {label} for {row} in the {pane} table.',
    'Scroll down inside {pane} to {row} and press {label}.',
    'Use {label} in {pane} with all of {row} shown below its header.',
    'Before using {label} show all of {row} below the {pane} header.',
  ];
  T.lazy = [
    'In the {pane} list, scroll down until {row} appears (the list loads more as you go) and click its {label}.',
    'Keep scrolling the {pane} list; {row} loads further down. Click {label} on it.',
    'Find {row} in {pane} and click {label}. More rows load when you reach the end of the list.',
    'Scroll {pane} to the bottom as often as needed to reach {row}, then click {label}.',
    'Click {label} for {row} in the {pane} feed.',
    'As {pane} adds rows at its end, scroll on to {row} and click its own {label}.',
    'To reach {row}, scroll through new rows loading at the end of {pane}; click {label}.',
    'Scroll farther down the growing list in {pane} to {row}, then click its {label}.',
    'Use {label} on {row} in {pane}, scrolling to each current end to load more rows.',
  ];
  T.siblings = [
    'There are two lists side by side. In the {pane} list, find {row} and click {label}.',
    'In the {pane} panel (not the other one), scroll to {row} and click its {label}.',
    'Click {label} for {row} in {pane}; the other list is a different one.',
    'Scroll the {pane} list to {row} and press {label}.',
    'Of the two scrolling lists, use {pane}: find {row} and click {label}.',
    'Choose {pane} from the two lists; look there for {row} and click its {label}.',
    'Keep your search within {pane}: locate {row} and use its {label} button.',
    '{pane} is the list to scroll; for {row} there, click {label}.',
  ];

  function baseInstruction(spec, rng) {
    const In = I;
    const sp = spec.isplit;
    const pick = (ts) => (In ? In.pick(rng, ts, sp) : rng.pick(ts));
    const fill = (t, vars) => (In ? In.fill(t, vars) : t.replace(/\{(\w+)\}/g, (m, k) => vars[k]));
    const alias = (label, aliases = []) => (In ? In.alias(rng, label, aliases, 0.3) : label);
    const say = (core, opts) => (In ? In.say(rng, core, { isplit: sp, ...opts }) : core);
    const page = KIND_NAMES[spec.kind];
    const v = spec.scenario;
    if (v === 'copy') {
      const c = spec.copy;
      const sec = spec.sections.find((s) => s.id === c.section);
      const lc = (x) => x.split(' ').map((w, i) => (i === 0 && !/^[A-Z]{2,}/.test(w) ? w.toLowerCase() : w)).join(' ');
      const vars = { vlabel: lc(alias(c.vlabel, c.valiases)), field: q(c.field), page, sec: q(sec.heading) };
      const core = fill(pick(c.dir === 'down' ? T.copyDown : T.copyUp), vars);
      return say(core, { terse: `${c.field}: the ${c.vlabel.toLowerCase()} from the ${c.dir === 'down' ? 'section below' : 'top'}`,
        steps: c.dir === 'down' ? [`scroll down to the ${c.vlabel.toLowerCase()}`, `copy it into ${q(c.field)}`]
          : [`note the ${c.vlabel.toLowerCase()} at the top`, `scroll down to ${q(c.field)}`, 'type it in'] });
    }
    const a = actionById(spec, spec.target);
    const label = q(a.label);
    const kindword = a.kind === 'link' ? 'link' : 'button';
    if (v === 'link') {
      const s = spec.sections.find((x) => x.id === spec.targetSection);
      const vars = { label, sec: q(alias(s.heading)), about: s.about, page, kindword };
      const ts = spec.refBy === 'about' ? T.linkAbout : spec.refBy === 'none' ? T.linkNone : T.linkHeading;
      return say(fill(pick(ts), vars), { terse: spec.refBy === 'none' ? a.label : `${a.label} (${s.heading})`,
        steps: [spec.refBy === 'about' ? `scroll to the section about ${s.about}` : `scroll to ${q(s.heading)}`, `click ${label}`] });
    }
    if (v === 'accordion') {
      const it = spec.faq.items.find((x) => x.id === spec.item);
      const vars = { label, qq: q(it.q), about: it.about, page };
      const core = fill(pick(spec.refBy === 'about' ? T.accordionAbout : T.accordion), vars);
      return say(core, { terse: `${it.q} → ${a.label}`, steps: ['scroll down to the FAQ', `open ${q(it.q)}`, `click ${label}`] });
    }
    if (v === 'top') {
      return say(fill(pick(T.top), { label, page }), { terse: `${a.label} (top of the ${page})`,
        steps: ['scroll back to the top', `click ${label}`] });
    }
    if (CONTAINERS.includes(v)) {
      const row = spec.pane.rows.find((r) => r.id === spec.row);
      const vars = { pane: q(spec.pane.title), row: row.ref, label, page };
      const where = { hscroll: 'scroll right to', carousel: 'switch to the slide for', sticky: 'scroll to', lazy: 'scroll down until it loads:',
        siblings: 'scroll to' }[v];
      return say(fill(pick(T[v]), vars), { terse: `${spec.pane.title}: ${row.title} → ${a.label}`,
        steps: [`scroll down to ${q(spec.pane.title)}`, `${where} ${row.title}`, `click ${label}`] });
    }
    // nested
    const rowsOf = (p) => (p.groups ? p.groups.flatMap((g) => rowsOf(g.pane)) : p.rows);
    const row = rowsOf(spec.pane).find((r) => r.id === spec.row);
    let rowRef = row.ref;
    if (spec.pane.groups) rowRef += ` (under ${q(spec.pane.groups.find((g) => g.id === spec.group).title)})`;
    const vars = { pane: q(spec.pane.title), row: rowRef, label, page };
    return say(fill(pick(T.nested), vars), { terse: `${spec.pane.title}: ${row.title} → ${a.label}`,
      steps: [`scroll down to ${q(spec.pane.title)}`, `scroll the list to ${row.title}`, `click ${label}`] });
  }

  function judgeInstruction(spec, rng) {
    const j = spec.judge;
    const In = I;
    if (j.mode === 'ambiguous') return In.phrase(rng, j.templates, j.vars, spec.isplit);
    return In.phrase(rng, T[j.tkey], j.vars, spec.isplit);
  }

  function instruction(spec, rng) {
    if (isIdle(spec)) return judgeInstruction(spec, rng);
    const text = baseInstruction(spec, rng);
    if (!isConfirm(spec)) return text;
    return `${text}${/[.!?]$/.test(text) ? '' : '.'} ${I.phrase(rng, spec.judge.templates, spec.judge.vars, spec.isplit)}`;
  }

  Object.assign(lib, {
    instruction,
  });
})();

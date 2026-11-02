/* handle-text/instructions.js: shared instructions; private task lib. */
(function () {
  'use strict';
  const lib = env.taskOf('handle-text').lib;
  const I = env.instruct;
  const { quote: q } = env.util;

  const say = (rng, spec, templates, vars = {}, extra = {}) => {
    const core = I.fill(I.pick(rng, templates, spec.isplit), vars).replace(/\s+/g, ' ').trim();
    const question = /^(What|Which|How|Who|Where|When)\b/.test(core);
    return I.say(rng, core, { isplit: spec.isplit, ...(question ? { registers: { polite: 0 } } : {}), ...extra });
  };

  const TPL = {
    sentence: ['Copy the {ord} sentence of the {t} and paste it into the {fl} field.',
      'Paste the {ord} sentence from the {t} into {fl}.', 'Copy sentence number {n} of the {t} into the {fl} field.',
      'Put the {t}’s {ord} sentence into {fl}.', 'Take the {ord} sentence of the {t} and paste it in {fl}.',
      'Copy just the {ord} sentence of the {t} over to {fl}.',
      'The {fl} field needs the {ord} sentence from the {t}.',
      'Use sentence {n} of the {t} as the entry for {fl}.'],
    line: ['Copy {which} of the {t}{note} and paste it into the {fl} field.', 'Paste {which} of the {t}{note} into {fl}.',
      'Copy {which} from the {t}{note} into the {fl} field.', 'Put {which} of the {t}{note} into {fl}.',
      'Take {which} of the {t}{note} and paste it into {fl}.', 'Copy only {which} of the {t}{note} over to {fl}.',
      'The {fl} field needs {which} of the {t}{note}.', 'Use {which} of the {t}{note} to fill the {fl} field.'],
    utype: ['Type {a} into the {fl} field.', 'Enter the text {a} in the {fl} field.', 'Fill {fl} with {a}.',
      'Write {a} into {fl}, exactly as shown.', 'Put {a} in the {fl} box.', 'Enter {a} (with the same characters) into {fl}.',
      'Match the text in {fl} to {a}.', 'Use {a} as the contents of {fl}.'],
    sline: ['Type the {w} word of line {n} of the text into the {fl} field.', 'Enter the {w} word on line {n} into {fl}.',
      'What is the {w} word of line {n}? Type it in {fl}.', 'Find line {n} of the text and type its {w} word into {fl}.',
      'Put the {w} word of line {n} in the {fl} field.', 'Scroll to line {n} and enter its {w} word in {fl}.',
      'Use the {w} word from line {n} as the entry for {fl}.', 'Which word comes {w} on line {n}? Enter it into {fl}.',
      'The {fl} field needs the {w} word from line {n}.'],
    edge: ['Scroll the text box to the {g} of the text.', 'Scroll the text area all the way to the {g}.',
      'Move the text view to the very {g}.', 'Scroll until you reach the {g} of the text.', 'Bring the {g} of the text into view, all the way.',
      'Scroll the box to its {g}.',
      'The text pane must be scrolled to its {g}.',
      'Go to the very {g} within the text box.',
      'Stop scrolling at the {g} of this text.'],
    sign: ['Scroll to the bottom of the agreement, enter the name {n} and then press {b}.',
      'Read the whole agreement, sign it as {n} and click {b}.', 'Sign the agreement with the name {n}, then press {b}.',
      'Enter {n} as the name on the agreement and press {b}.', 'Fill in {n} in the name field of the agreement and click {b}.',
      'Scroll through the terms, type {n} and press {b}.'],
    spin: ['Set {l} to {val}.', 'Change {l} to {val}.', 'Adjust the {l} spinner until it reads {val}.',
      'Make {l} {val}.', 'Use the spinner to set {l} to {val}.', 'Update {l} so that it shows {val}.',
      'The final value of {l} is {val}.', '{l} should read {val} when done.', 'Match {l} to {val}.'],
    insert: ['Insert the word {w} before {a} in the {f} field.', 'Add {w} in front of {a} in {f}.',
      'In the {f} field, put the word {w} right before {a}.', 'Type {w} before {a} in {f}, leaving the rest of the text as it is.',
      'The word {w} is missing before {a} in {f}; add it.', 'Edit {f}: insert {w} just before {a}.',
      'Keep {a} in {f}; type {w} right before it.', 'In {f}, {a} should directly follow the new word {w}.'],
  };

  function instructionOf(spec, rng) {
    const v = spec.scenario;
    const fl = spec.field ? q(I.alias(rng, spec.field.label, [])) : '';
    if (v === 'copy-paste') {
      const which = spec.refBy === 'only' ? 'the box' : spec.refBy === 'title' ? `the box titled ${q(spec.boxes[spec.want.box].title)}` : `the ${lib.ORDN[spec.want.box]} text box`;
      return say(rng, spec, [
        'Copy the text from {which} and paste it into the {fl} field.',
        'Copy all of the text in {which} into the {fl} field.',
        'Paste the full text of {which} into {fl}.',
        'Put an exact copy of the text in {which} into the {fl} field.',
        'Duplicate the text of {which} in the {fl} field.',
        'Copy what {which} says over to {fl}.',
        'The {fl} field needs all the text from {which}.',
        'Use {which} to fill {fl} with its complete text.',
        'Transfer the contents of {which} unchanged to {fl}.',
      ], { which, fl }, { terse: `copy ${which} -> ${fl}`, steps: [`copy the text in ${which}`, `paste it into the ${fl} field`] });
    }
    if (v === 'copy-paste-2') {
      const box = spec.boxes[0];
      const t = box.title.toLowerCase();
      if (spec.mode === 'sentence') {
        return say(rng, spec, TPL.sentence, { ord: lib.ORD[spec.k], n: spec.k + 1, t, fl }, { terse: `${lib.ORD[spec.k]} sentence -> ${fl}` });
      }
      if (spec.mode === 'line') {
        const which = box.numbered ? `line ${spec.k + 1}` : `the ${lib.ORD[spec.k]} line`;
        const note = box.numbered ? ' (without the line number)' : '';
        return say(rng, spec, TPL.line, { which, t, note, fl }, { terse: `${which} -> ${fl}` });
      }
      return say(rng, spec, ['Copy the {label} from the {t} and paste it into the {fl} field.', 'Paste the {label} shown in the {t} into {fl}.',
        'Find the {label} in the {t} and copy it into {fl}.', 'Put the {label} from the {t} into the {fl} field.',
        'Copy just the {label} (not its label) from the {t} into {fl}.', 'Take the {label} from the {t} and paste it into {fl}.',
        'Fill {fl} with only the {t} value labeled {label}.', 'Use the value beside {label} in the {t} to fill {fl}.'],
      { label: spec.label, t, fl }, { terse: `${spec.label} -> ${fl}` });
    }
    if (v === 'unicode') {
      if (spec.mode === 'type') {
        return say(rng, spec, TPL.utype, { a: q(spec.answer), fl }, { terse: `${q(spec.answer)} -> ${fl}` });
      }
      if (spec.mode === 'copy') {
        return say(rng, spec, ['Copy the text from the {t} box into the {fl} field.', 'Paste the {t} text into {fl}.',
          'Copy the {t} exactly into the {fl} field.', 'Put a copy of the {t} into {fl}.', 'Take the {t} text and paste it into {fl}.',
          'Copy what the {t} says into {fl}.',
          'Fill {fl} with the text from the {t} box.',
          'The {t} text goes in {fl} unchanged.',
          'Transfer each character of the {t} to {fl}.',
          'Use the entire {t} text for {fl}.',
          'Match {fl} to the text of the {t}.'], { t: spec.boxes[0].title.toLowerCase(), fl }, { terse: `copy ${spec.boxes[0].title.toLowerCase()}` });
      }
      return say(rng, spec, ['Click on the {b} button.', 'Click the button labeled {b}.', 'Press {b}.', 'Find the {b} button and click it.',
        'Hit the button that says {b}.', 'Select the {b} button.', 'Give {b} a click here.'], { b: q(spec.target) }, { terse: q(spec.target) });
    }
    if (v === 'scroll-text') {
      if (spec.mode === 'last') {
        return say(rng, spec, ['Find the last word in the text box and enter it into the {fl} field.', 'Scroll to the end of the text and type its last word into {fl}.',
          'Type the final word of the text into the {fl} field.', 'What is the last word of the text? Enter it in {fl}.',
          'Enter the text’s last word into {fl}.', 'Read to the end of the text and put its last word into {fl}.',
          'Which word closes the text? Enter that word into {fl}.',
          'Fill {fl} with the last word you reach at the end of the text.'], { fl }, { terse: `last word -> ${fl}` });
      }
      if (spec.mode === 'line') {
        return say(rng, spec, TPL.sline, { w: spec.which, n: spec.line + 1, fl }, { terse: `line ${spec.line + 1}, ${spec.which} word` });
      }
      return say(rng, spec, TPL.edge, { g: spec.goal }, { terse: `scroll to ${spec.goal}` });
    }
    if (v === 'sign-agreement') {
      if (spec.mode === 'decline') {
        return say(rng, spec, ['Decline the agreement: press "Cancel".', 'Click the "Cancel" button of the agreement.',
          'Do not accept the terms; press Cancel instead.', 'Read to the end of the agreement, then cancel it.',
          'At the end of the text, use Cancel to decline.', 'Cancel is the button for declining the terms.',
          'To decline, scroll to the end and press Cancel.', 'Choose Cancel to reject the agreement.'], {}, { terse: 'decline the agreement' });
      }
      const btn = spec.btn || (spec.mode === 'agree' ? 'Agree' : 'Cancel');
      return say(rng, spec, TPL.sign,
      { n: q(spec.name), b: q(btn) }, { terse: `sign as ${q(spec.name)}, ${btn}`, steps: ['scroll to the end of the agreement', `type ${q(spec.name)} as the name`, `press ${q(btn)}`] });
    }
    if (v === 'spinner') {
      const val = lib.fmtSpin(spec, spec.target) + (spec.unit ? ` ${spec.unit}` : '');
      const label = I.alias(rng, spec.label, []);
      return say(rng, spec, TPL.spin,
      { l: q(label), val }, { terse: `${label}: ${val}` });
    }
    if (v === 'edit') {
      const f0 = q(spec.fields[0].label);
      if (spec.mode === 'insert') {
        return say(rng, spec, TPL.insert,
        { w: q(spec.word), a: q(spec.anchor), f: f0 }, { terse: `${f0}: add ${q(spec.word)} before ${q(spec.anchor)}` });
      }
      if (spec.mode === 'cut') {
        const f1 = q(spec.fields[1].label);
        return say(rng, spec, ['Move {p} from the {a} field to the {b} field.', 'Cut {p} out of {a} and paste it into {b}.',
          'Take {p} out of {a} and put it in {b}.', 'Move the words {p} from {a} into the empty {b} field.',
          'Remove {p} from {a} and paste it into {b}.', 'Relocate {p}: cut it from {a}, paste it into {b}.',
          'Transfer only {p} to {b}, taking it out of {a}.'],
        { p: q(spec.phrase.text), a: f0, b: f1 }, { terse: `move ${q(spec.phrase.text)} ${f0} -> ${f1}`, steps: [`cut ${q(spec.phrase.text)} from ${f0}`, `paste it into ${f1}`] });
      }
      if (spec.mode === 'undo') {
        return say(rng, spec, ['Someone changed the {f} field by mistake; undo the change.', 'Undo the last edit in the {f} field.',
          'Restore the {f} text to what it was before the last change.', 'Revert the accidental edit in {f}.',
          'The text in {f} was messed up; undo it to get the original back.', 'Use undo to bring back the original {f} text.',
          'The {f} field needs its original text; undo the error.',
          'An edit spoiled {f}. Undo it to restore the text.'],
        { f: f0 }, { terse: `undo ${f0}` });
      }
      return say(rng, spec, ['Paste the {k} from the {t} into the {f} field, right after {a}.', 'Copy the {k} from the {t} and insert it after {a} in {f}.',
        'In {f}, put the {k} from the {t} right after {a}.', 'Fill the gap after {a} in {f} with the {k} from the {t}.',
        'Insert the {k} shown in the {t} into {f}, just after {a}.', 'Complete {f}: paste the {k} from the {t} after {a}.'],
      { k: spec.key, t: spec.snippet.title.toLowerCase(), f: f0, a: q(spec.anchor) }, { terse: `${spec.key} after ${q(spec.anchor)}` });
    }
    // find
    return say(rng, spec, ['Find the phrase {p} in the document and select it.', 'Select the text {p} in the {t}.',
      'Locate {p} in the document and highlight it by selecting it.', 'Search the {t} for {p} and select exactly that phrase.',
      'Highlight the words {p} in the document.', 'Find where the {t} says {p} and select those words.',
      'Make {p} the selection in the document.', 'Mark {p} in the {t} by selecting the whole phrase.',
      'The selection in the document should cover just {p}.', 'Select from the start of {p} to its end in the {t}.'],
    { p: q(spec.phrase), t: /[A-Z]{2}/.test(spec.title) ? spec.title : spec.title.toLowerCase() }, { terse: `select ${q(spec.phrase)}` });
  }
  Object.assign(lib, { instructionOf, say, TPL });
})();

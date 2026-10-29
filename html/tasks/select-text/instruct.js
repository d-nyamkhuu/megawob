/* select-text/instruct.js: the instruction wording (templates T, unit-specific U) and instructionOf. Attached to the
 * task's lib. */
(function () {
  'use strict';
  const I = env.instruct;
  const lib = env.taskOf('select-text').lib;
  const { ORD, ROLES, TABLE_ROLES, words } = lib;


  const T = {
    pIndex: ['Select the entire {ord} paragraph.', 'Highlight all of the {ord} paragraph.', 'Select paragraph {n} of {of}, from its first word to its last.',
      'Select the whole {ord} paragraph of the text.', 'Highlight paragraph number {n} in full.',
      'Make a selection spanning paragraph {n}.', 'Select every sentence in the {ord} paragraph.',
      'Highlight paragraph {n} of {of}, beginning to end.'],
    pTopic: ['Select the whole paragraph about the {topic}.', 'Highlight the entire paragraph that talks about the {topic}.',
      'Find the paragraph about the {topic} and select all of it.'],
    pMentions: ['Select the whole paragraph that mentions "{word}".', 'Highlight the entire paragraph containing the word "{word}".',
      'Find the paragraph where "{word}" appears and select all of it.',
      'Select every sentence of the paragraph with "{word}" in it.',
      'The paragraph with "{word}" should be highlighted in full.'],
    sIndex: ['Select the {sord} sentence of the {ord} paragraph.', 'Highlight sentence {sn} in paragraph {n}, including its final punctuation.',
      'In paragraph {n}, select sentence number {sn}.',
      'Select sentence {sn}, punctuation too, in paragraph {n}.'],
    sWord: ['Select the full sentence that mentions "{word}".', 'Highlight the one sentence containing the word "{word}".',
      'Find the sentence with "{word}" in it and select the whole sentence.',
      'The sentence with "{word}" should be highlighted in full.'],
    sPrefix: ['Select the full sentence that begins with "{prefix}".', 'Highlight the whole sentence starting "{prefix} ...".',
      'Select the sentence that opens with "{prefix}", from its first word to its end.',
      'Beginning with "{prefix}", select through the sentence ending.',
      'Use "{prefix}" to find the sentence to highlight in full.',
      'Select the sentence beginning "{prefix}" in full, punctuation too.'],
    phrase: ['Select exactly the phrase "{phrase}"{where}.', 'Highlight the words "{phrase}"{where} and nothing else.',
      'Select "{phrase}"{where}.', 'Mark the phrase "{phrase}"{where} by selecting it.', 'Highlight just "{phrase}"{where}.',
      'Find "{phrase}"{where} and select those words.',
      'Limit the selection to "{phrase}"{where}.',
      'Select from start to end of "{phrase}"{where}.',
      'Only "{phrase}"{where} should be selected.',
      'Keep "{phrase}"{where} as the exact selection.',
      'Choose "{phrase}"{where} as the selection.'],
    word: ['Select the word "{word}"{where}.', 'Highlight the word "{word}"{where}, only that word.', 'Select "{word}"{where} in the text.',
      'Find the word "{word}"{where} and select it.', 'Mark the single word "{word}"{where}.', 'Select just the word "{word}"{where}, without the spaces around it.',
      'Use "{word}"{where} as your selection.', 'Select "{word}"{where}, stopping at its edges.',
      'The selection should cover "{word}"{where} alone.'],
    tip: ['Hover over the underlined word "{anchor}" to read its tooltip, then select the word the tooltip names.',
      'The underlined word "{anchor}" has a tooltip with a key term. Select that term in the text.',
      'Hover the dotted-underlined word "{anchor}" for its hint, then highlight the word the hint points to.',
      'Read the tooltip on "{anchor}" (hover it) and select the key term it mentions.',
      'Check what the tooltip on the underlined word "{anchor}" says, and select that word in the text.',
      'To find the word to select in the text, hover over underlined "{anchor}" and read its tooltip.',
      'Hover over underlined "{anchor}". Read its tooltip for the key term to highlight in the text.',
      'Hover over underlined "{anchor}" for its tooltip. Select the word it names in the text.'],
    field: ['Select {role} in the message.', 'Highlight {role}.', 'Find {role} in the text and select it.', 'Select just {role}, nothing else.',
      'Mark {role} by selecting it.', 'Select the text of {role} so it can be copied.', 'Highlight {role} in the email.',
      'Select {role} as a whole value.', 'Make the selection span {role}.', 'Only {role} should be selected.',
      'Select each character of {role}.', 'Limit the selection to {role}.', 'Select {role} from start to end.',
      'For {role}, select its full value.'],
  };

  // Wording for the opt-in shapes: clauses of a terms page, chat messages, table cells, a one-line input.
  const U = {
    clause: {
      pIndex: ['Select the full text of clause {n}.', 'Highlight all of clause {n}, from its first word to its last.',
        'Select every sentence of clause {n} of the terms.', 'Highlight section {n} in full.',
        'Select clause {n} with each sentence included.'],
      pTitle: ['Select the whole "{title}" clause.', 'Highlight the full text of the clause titled "{title}".',
        'Select all of the text under "{title}".',
        'Select each sentence beneath "{title}".',
        'Make a selection of all text beneath "{title}".'],
      pMentions: ['Select the whole clause that mentions "{word}".', 'Highlight the entire clause containing the word "{word}".',
        'Find the clause where "{word}" appears and select all of it.',
        'The clause with "{word}" needs its whole body text selected.',
        'Select "{word}" along with the rest of its clause.'],
      sIndex: ['Select the {sord} sentence of clause {n}.', 'In clause {n}, highlight sentence {sn}.',
        'Highlight sentence {sn} of clause {n}, including its final punctuation.',
        'Select sentence {sn}, with punctuation, from clause {n}.',
        'Make a selection of sentence {sn} in clause {n}.'],
      where: ' in clause {n}',
    },
    message: {
      pIndex: ['Select the entire {ord} message in the chat.', 'Highlight all of message {n} in the conversation.',
        'Select the whole text of the {ord} message.',
        'Make a selection of the {ord} message body.',
        'Select all sentences of the {ord} chat message.'],
      pFrom: ['Select the whole message {who} sent at {at}.', "Highlight the full text of {who}'s message from {at}.",
        'Select everything {who} wrote at {at}.'],
      pMentions: ['Select the whole message that mentions "{word}".', 'Highlight the entire chat message containing "{word}".'],
      sIndex: ['Select the {sord} sentence of the {ord} message.', 'In message {n} of the chat, highlight sentence {sn}.'],
      field: ['Select {role} from the chat.', 'Highlight {role} someone shared in the conversation.',
        'Find {role} in the chat and select it.', 'Select just {role} in the conversation.',
        'Limit your chat selection to {role}.', 'Select {role} with all its symbols.',
        'Mark {role} as one complete value in the chat.', 'Select {role} exactly as shared in chat.'],
      where: ' in the {ord} message',
    },
    cell: {
      cell: ['Select the entire {col} cell for {key}.', "Highlight everything in {key}'s {col} cell.",
        'Select the whole {col} entry in the row for {key}.',
        'Make one selection covering {key}\'s {col} cell.'],
      role: [
        'Select {role} of {key}.', "Highlight {role} in {key}'s row.", 'In the table, select {role} of {key}.',
        'Keep {role} of {key} selected.', 'Select {role} as shown for {key}.'
      ],
      sIndex: ['Select the {sord} sentence of the {col} for {key}.', "In {key}'s {col}, highlight sentence {sn}."],
      where: " in {key}'s row",
    },
    line: { where: '' },
  };

  function unitInstruction(spec, rng) {
    const a = spec.ask;
    const isplit = spec.isplit;
    const u = U[spec.native === 'input' ? 'line' : spec.unit];
    const p = a.p ?? 0;
    const vars = { ord: ORD[p] || `${p + 1}th`, n: p + 1, sord: ORD[a.s ?? 0], sn: (a.s ?? 0) + 1, word: a.word,
      prefix: a.prefix, phrase: a.phrase };
    if (spec.unit === 'clause') vars.title = spec.titles[p];
    if (spec.unit === 'message') {
      vars.who = spec.chat.people[spec.chat.who[p]];
      vars.at = spec.chat.at[p];
    }
    if (spec.unit === 'cell') {
      const nC = spec.table.cols.length;
      vars.key = spec.judge && spec.judge.key ? spec.judge.key : spec.paragraphs[p - (p % nC)];
      vars.col = spec.table.cols[p % nC].label;
    }
    vars.where = a.where ? I.fill(u.where, vars) : '';
    let list;
    let terse;
    const v = spec.scenario;
    if (v === 'paragraph') {
      list = a.kind === 'cell' ? u.cell : a.kind === 'title' ? u.pTitle : a.kind === 'from' ? u.pFrom : a.kind === 'mentions' ? u.pMentions : u.pIndex;
      terse = a.kind === 'cell' ? `${vars.key}: ${vars.col}` : a.kind === 'title' ? `"${vars.title}"`
        : a.kind === 'from' ? `${vars.who}, ${vars.at}` : a.kind === 'mentions' ? `with "${a.word}"` : `${spec.unit === 'clause' ? 'clause' : 'message'} ${vars.n}`;
    } else if (v === 'sentence') {
      list = a.kind === 'word' ? T.sWord : a.kind === 'prefix' ? T.sPrefix : u.sIndex;
      terse = a.kind === 'index' ? `sentence ${vars.sn}` : `sentence with "${a.word || a.prefix}"`;
    } else if (v === 'word') {
      list = T.word;
      terse = `"${a.word}"`;
    } else if (v === 'field') {
      if (spec.unit === 'cell') {
        list = u.role;
        vars.role = a.name || rng.pick(TABLE_ROLES[a.role]);
      } else {
        list = (u && u.field) || T.field;
        vars.role = a.name || rng.pick(ROLES[a.role].names.filter((x) => !/sender|message|to call/.test(x)));
      }
      terse = vars.role.replace(/^the /, '') + (vars.key ? ` of ${vars.key}` : '');
    } else {
      list = T.phrase;
      terse = `"${a.phrase}"`;
    }
    const core = I.fill(I.pick(rng, list, isplit), vars);
    return I.say(rng, I.ucFirst(core), { isplit, terse });
  }

  function instructionOf(spec, rng) {
    if (spec.judge) spec = { ...spec, ask: spec.judge.ask }; // impossible: the phantom ask, in the scenario's own wording
    if (spec.unit || spec.native === 'input') return unitInstruction(spec, rng);
    const a = spec.ask;
    const isplit = spec.isplit;
    const n = (a.p ?? 0) + 1;
    const vars = { ord: ORD[a.p ?? 0], n, of: a.of, sord: ORD[a.s ?? 0], sn: (a.s ?? 0) + 1, topic: a.topic, word: a.word,
      prefix: a.prefix, phrase: a.phrase, where: a.where ? ` in the ${ORD[a.p]} paragraph` : '' };
    let key;
    let terse;
    if (spec.scenario === 'paragraph') {
      key = a.kind === 'topic' ? 'pTopic' : a.kind === 'mentions' ? 'pMentions' : 'pIndex';
      terse = a.kind === 'index' ? `paragraph ${n}` : `paragraph with "${a.topic || a.word}"`;
    } else if (spec.scenario === 'sentence') {
      key = a.kind === 'word' ? 'sWord' : a.kind === 'prefix' ? 'sPrefix' : 'sIndex';
      terse = a.kind === 'index' ? `paragraph ${n}, sentence ${vars.sn}` : `sentence with "${a.word || a.prefix}"`;
    } else if (spec.scenario === 'word') {
      key = 'word';
      terse = `"${a.word}"`;
    } else if (spec.scenario === 'tip') {
      key = 'tip';
      vars.anchor = a.anchor;
      terse = `tooltip of "${a.anchor}"`;
    } else if (spec.scenario === 'field') {
      key = 'field';
      vars.role = a.name || rng.pick(ROLES[a.role].names);
      terse = vars.role.replace(/^the /, '');
    } else {
      key = 'phrase';
      terse = `"${a.phrase}"`;
    }
    const core = I.fill(I.pick(rng, T[key], isplit), vars);
    return I.say(rng, I.ucFirst(core), { isplit, terse });
  }


  Object.assign(lib, { instructionOf });
})();

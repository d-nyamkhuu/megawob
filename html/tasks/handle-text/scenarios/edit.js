/* handle-text/scenarios/edit.js: scenario sampling; private task lib. */
(function () {
  'use strict';
  const lib = env.taskOf('handle-text').lib;
  const C = env.content;

  function sampleEdit(rng, spec) {
    const mode = rng.pick(['insert', 'cut', 'undo', 'paste-at']);
    const pool = lib.sentences(spec).filter((s) => s.length >= 40 && s.length <= (spec.ood ? 140 : 90));
    if (mode === 'insert') {
      for (let t = 0; ; t++) {
        const text = rng.pick(pool);
        const words = text.split(' ');
        const cands = words.map((w, i) => i).filter((i) => i > 0 && i < words.length - 1 && (lib.SHORT_WORDS.has(words[i].toLowerCase()) || (t > 40 && /^[a-z]{2,4}$/.test(words[i]))));
        if (!cands.length) continue;
        const i = rng.pick(cands);
        const word = words[i];
        const startText = words.slice(0, i).concat(words.slice(i + 1)).join(' ');
        const at = words.slice(0, i).join(' ').length + 1; // where the next word starts in startText
        const anchor = words[i + 1].replace(/[.,;:!?]$/, '');
        if (startText.split(' ').filter((w) => w.replace(/[.,;:!?]$/, '') === anchor).length !== 1) continue;
        return { mode, fields: [{ label: rng.pick([
          'Subject', 'Note', 'Message', 'Caption', 'Summary', 'Context', 'Update', 'Journal', 'Record', 'Detail'
        ]), value: startText, target: text }],
          insert: { at, text: `${word} ` }, word, anchor, where: 'before' };
      }
    }
    if (mode === 'cut') {
      for (;;) {
        const text = rng.pick(pool);
        const words = text.split(' ');
        const len = rng.int(1, Math.min(3, words.length - 2));
        const i = rng.int(1, words.length - len - 1);
        const phraseWords = words.slice(i, i + len);
        if (phraseWords.some((w) => /[.,;:!?)("]$/.test(w) || /^[("]/.test(w))) continue;
        const phrase = phraseWords.join(' ');
        if (text.split(phrase).length !== 2) continue;
        const start = words.slice(0, i).join(' ').length + 1;
        const labels = rng.pick([['Draft', 'Final'], ['Notes', 'Title'], ['Message', 'Tags'], ['Description', 'Keywords']]);
        return { mode, fields: [{ label: labels[0], value: text, target: lib.squash(text.slice(0, start) + text.slice(start + phrase.length)) },
          { label: labels[1], value: '', target: phrase }], phrase: { start, end: start + phrase.length, text: phrase } };
      }
    }
    if (mode === 'undo') {
      const original = rng.pick(pool);
      const words = original.split(' ');
      const kind = rng.pick(['delete', 'replace', 'append']);
      let damaged;
      if (kind === 'delete') {
        const i = rng.int(1, words.length - 3);
        damaged = words.slice(0, i).concat(words.slice(i + rng.int(2, 3))).join(' ');
      } else if (kind === 'replace') {
        const i = rng.int(0, words.length - 1);
        damaged = words.map((w, k) => (k === i ? rng.pick([
          'asdf', 'TODO', 'xxx', 'lorem', '???', 'zqv', 'kxpt', 'vrrk', 'qxz', 'bqrrt'
        ]) : w)).join(' ');
      } else damaged = `${original} ${rng.pick([
        'jjjjjj', 'asdfgh', 'ok ok ok', '11111', 'zqvrrx', 'kkxptz', 'vvqzxx', 'xqvrrzz'
      ])}`;
      return { mode, kind, fields: [{ label: rng.pick([
        'Notes', 'Message', 'Description', 'Comment', 'Context', 'Journal', 'Details', 'Narrative'
      ]), value: damaged, target: original }], history: [original] };
    }
    // paste-at: a code from a note goes after an anchor phrase inside the message.
    const key = rng.pick(Object.keys(lib.VALUE_LABELS));
    const code = lib.codeValue(rng, key);
    const name = C.personName(rng, C.csplitOf(spec)).first;
    const tpl = rng.pick([
      ['Hi {n}, your {k} is  and you can use it right away.', 'your {k} is'],
      ['Thanks {n}! Please quote {k}  in any reply.', `quote {k}`],
      ['{n}, the {k}  is attached to this message.', 'the {k}'],
      ['Reminder for {n}: enter {k}  at checkout.', 'enter {k}'],
      ['Hello {n}, keep {k}  handy for questions.', 'keep {k}'],
      ['{n}, we set {k}  as the lookup value today.', 'we set {k}'],
      ['{n}, we filed this under {k}  for easy lookup.', 'under {k}'],
      ['Dear {n}, check {k}  against your copy.', 'check {k}'],
      ['{n}, list {k}  in the subject of your next email.', 'list {k}'],
      ['{n}, good news: {k}  is ready for your records.', 'news: {k}'],
      ['{n}, our team will need {k}  when you call us.', 'need {k}'],
      ['An update: {k}  has been confirmed for {n}.', 'update: {k}'],
      ['{n}, the printed label now reads {k}  below.', 'reads {k}'],
      ['Please tell {n} we located {k}  in the archive.', 'located {k}'],
      ['{n}, our records show {k}  appears twice.', 'show {k}'],
    ]);
    const text = tpl[0].replace('{n}', name).replace('{k}', key);
    const at = text.indexOf('  ') + 1;
    const target = text.slice(0, at) + code + text.slice(at);
    return { mode, fields: [{ label: rng.pick([
      'Message', 'Reply', 'Email body', 'Letter', 'Response', 'Dispatch'
    ]), value: text, target }],
      snippet: { title: rng.pick([
        'Note', 'Receipt', 'Confirmation', 'Sticky note', 'Field logs', 'Logbook', 'Bulletin', 'Dispatch'
      ]), label: lib.VALUE_LABELS[key], text: code }, at, anchor: tpl[1].replace('{k}', key), key };
  }
  env.scenario('handle-text', { name: 'edit', sample: sampleEdit });
})();

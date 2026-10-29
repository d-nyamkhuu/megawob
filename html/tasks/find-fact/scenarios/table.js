/*
 * find-fact / table: kind 'record' (read-table / -2.
 * Spec, model, error and plan targets are documented in the logic.js header.
 */
(function () {
  'use strict';

  const fam = env.taskOf('find-fact');
  const C = env.content;
  const { keepIdx, cap } = env.util;
  const { askField, colNoun, dataTable, FORMATS, normCase, normText, people, pickCols, planType, randomISO, say,
    showDate, textErr, usPhone, wrongOf } = fam.lib;

  const COLORS = [
    'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Black', 'White', 'Gray', 'Teal', 'Navy', 'Maroon', 'Cyan',
    'Pink', 'Brown', 'Lime', 'Olive', 'Coral', 'Salmon', 'Indigo', 'Gold', 'Silver', 'Beige', 'Ivory', 'Cream', 'Tan',
    'Khaki', 'Azure', 'Lilac', 'Mauve', 'Plum', 'Peach', 'Amber', 'Copper', 'Bronze', 'Slate', 'Mint', 'Jade',
    'Ochre', 'Sienna', 'Umber', 'Cobalt', 'Orchid', 'Ecru', 'Taupe', 'Pewter', 'Russet', 'Fawn'
  ];
  const LANGS = ['English', 'Spanish', 'French', 'German', 'Mandarin', 'Hindi', 'Arabic', 'Portuguese', 'Japanese',
    'Korean', 'Italian', 'Turkish', 'Dutch', 'Swahili', 'Polish', 'Vietnamese', 'Bengali', 'Russian', 'Ukrainian',
    'Greek', 'Hebrew', 'Persian', 'Romanian', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Icelandic', 'Czech',
    'Slovak', 'Hungarian', 'Bulgarian', 'Serbian', 'Croatian', 'Bosnian', 'Albanian', 'Lithuanian', 'Latvian',
    'Estonian', 'Irish', 'Welsh', 'Basque', 'Catalan', 'Galician', 'Afrikaans', 'Amharic', 'Hausa', 'Yoruba', 'Igbo',
    'Zulu', 'Xhosa', 'Khmer', 'Burmese', 'Tibetan', 'Mongolian', 'Quechua', 'Aymara', 'Guarani', 'Nahuatl',
    'Mapudungun', 'Hawaiian', 'Maori', 'Samoan', 'Tongan', 'Fijian', 'Tahitian', 'Javanese', 'Sundanese', 'Malay',
    'Cebuano', 'Ilocano', 'Hmong', 'Thai', 'Georgian', 'Armenian', 'Kazakh', 'Kyrgyz', 'Uzbek', 'Pashto', 'Kurdish',
    'Urdu', 'Punjabi', 'Gujarati', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Nepali', 'Sinhala',
    'Sanskrit', 'Somali', 'Breton', 'Romansh', 'Occitan', 'Corsican', 'Sardinian', 'Sicilian', 'Neapolitan',
    'Venetian', 'Friulian', 'Walloon', 'Yiddish', 'Ladino', 'Maltese', 'Faroese', 'Manx', 'Cornish', 'Romani',
    'Inuktitut', 'Cree', 'Ojibwe', 'Zapotec', 'Mixtec', 'Tzotzil', 'Tzeltal', 'Lingala', 'Kirundi', 'Shona', 'Sesotho',
    'Setswana', 'Malagasy', 'Wolof', 'Tigrinya', 'Uyghur', 'Tajik'];
  const BLOOD = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  function sampleRecord(rng, spec, nRows) {
    const p = people(rng, 1, spec)[0];
    const city = C.pick(rng, C.CITIES, C.csplitOf(spec));
    const dob = randomISO(rng, 1950, 2005);
    const attrs = [
      ['First name', { text: p.first }],
      ['Last name', { text: p.last }],
      ['Country', { text: city.country }],
      ['City', { text: city.city }],
      ['Occupation', { text: C.pick(rng, C.JOB_TITLES, C.csplitOf(spec)) }],
      ['Department', { text: C.pick(rng, C.DEPARTMENTS, C.csplitOf(spec)) }],
      ['Date of birth', { text: showDate(dob, rng.pick(['long', 'dmy-long', 'short'])), iso: dob, date: true }],
      ['Phone', { text: usPhone(rng), phone: true }],
      ['Email', { text: C.emailAddress(rng, p).toLowerCase() }],
      ['Language', { text: rng.pick(LANGS) }],
      ['Favorite color', { text: rng.pick(COLORS) }],
      ['Blood type', { text: rng.pick(BLOOD) }],
    ];
    const chosen = rng.sample(attrs, nRows);
    return { dataset: 'record', title: rng.pick([
      'Personal record', 'Profile', 'Member details', 'Patient card', 'Record outline', 'Member file', 'Data card',
      'Person summary'
    ]),
      columns: ['Attribute', 'Value'], rows: chosen.map(([k, v]) => [k, v.text]), meta: chosen.map(([, v]) => v), ref: '' };
  }

  function fmtFor(rng, meta, colName) {
    if (meta && meta.date) return rng.pick(['dmy', 'mdy', 'iso']);
    if (meta && meta.phone) return 'digits';
    if (colName === 'Price' || colName === 'Total') return 'number';
    if (meta && /^[A-Za-z][a-z]+$/.test(meta.text) && rng.bool(0.3)) return 'upper';
    return null;
  }

  function sampleTable(rng, spec) {
    const kind = rng.bool(0.45) ? 'record' : 'grid';
    const nAsk = rng.bool(0.4) ? 2 : 1;
    let data;
    if (kind === 'record') data = sampleRecord(rng, spec, spec.ood ? rng.int(8, 10) : 5);
    else {
      const dataset = rng.pick(['products', 'flights', 'staff', 'orders']);
      const names = pickCols(rng, dataset, rng.int(4, 6), false);
      const t = dataTable(rng, dataset, spec.ood ? rng.int(10, 14) : rng.int(5, 8), names, spec);
      data = { dataset, title: t.title, columns: t.cols.map((c) => c.name), cols: t.cols, rows: t.rows, ref: t.ref };
    }
    const cells = [];
    if (kind === 'record') data.rows.forEach((_, r) => cells.push([r, 1]));
    else data.rows.forEach((_, r) => data.columns.forEach((_, c) => { if (c > 0) cells.push([r, c]); }));
    const asks = rng.sample(cells, nAsk);
    // Answer-format rules: only for one-field asks, where the instruction can state them clearly.
    const wantFmt = nAsk === 1 && rng.bool(0.45);
    const fields = asks.map(([row, col]) => {
      const shown = data.rows[row][col];
      let fmt = null;
      let answer = shown;
      if (wantFmt) {
        const meta = kind === 'record' ? data.meta[row] : { text: shown };
        fmt = fmtFor(rng, meta, data.columns[col]);
        if (fmt && kind === 'grid' && fmt !== 'number' && fmt !== 'upper') fmt = null;
        if (fmt) answer = FORMATS[fmt].apply(meta);
        if (fmt && answer === shown) fmt = null;
        if (!fmt) answer = shown;
      }
      const noun = kind === 'record' ? data.rows[row][0] : data.cols[col].noun;
      return {
        row, col, answer, shown, fmt,
        label: nAsk === 1 ? null : kind === 'record' ? `${data.rows[row][0]}:` : `${cap(noun)} of ${data.ref}${data.rows[row][0]}`,
      };
    });
    delete data.meta;
    return { kind, ...data, fields };
  }

  env.scenario('find-fact', {
    name: 'table',
    sample: sampleTable,
    level(spec, lv, r) {
      const easy = lv >= 1;
      const k = (e, m) => (easy ? e : m);
      if (easy && spec.fields.length > 1) spec.fields = [{ ...spec.fields[0], label: null }];
      const want = spec.fields.map((f) => f.row);
      const keep = keepIdx(r, spec.rows.length, want, spec.kind === 'record' ? k(1, 2) : k(2, 3));
      if (keep.length < spec.rows.length) {
        spec.fields = spec.fields.map((f) => ({ ...f, row: keep.indexOf(f.row) }));
        spec.rows = keep.map((i) => spec.rows[i]);
      }
    },
    wrongAnswers: (spec, rng) => spec.fields.map((f) => wrongOf(rng, f.answer, spec.rows.map((r) => r[f.col]))),
    error(model, spec) {
      return spec.fields.reduce((s, f, i) => s + textErr(model.answers[i], f.answer, f.fmt ? normCase : normText), 0) / spec.fields.length;
    },
    plan: planType,
    answers(spec, one) {
      if (spec.fields.length > 1) {
        return spec.fields.map((f) => ({ label: f.label.replace(/:$/, ''), value: String(f.answer) }));
      }
      const f = spec.fields[0];
      if (spec.kind === 'record') return one(spec.rows[f.row][0].toLowerCase(), f.answer);
      return one(spec.cols[f.col].noun, f.answer, spec.cols[f.col].aliases || []);
    },
    instruction(spec, rng) {
      if (spec.fields.length === 2) {
        return say(rng, spec, [
          'Fill in each field of the answer form with the matching value from the table.',
          'Enter the value that corresponds with each label into the form.',
          'Use the table to complete both answer fields.',
          'Copy the right values from the table into the two fields below it.',
          'Look up each requested value in the table and type it into its field.',
          'Complete the answer form using the information in the table.',
          'Both labels refer to table values. Enter each in its answer field.',
          'The two fields each need the table value named by their label.',
          'Use each field label to find and enter its value from the table.',
          'The table has both values. Add them to the matching fields.',
          'Answer both labeled fields with the values shown for them in the table.',
        ], {}, { terse: 'fill both fields from the table' });
      }
      const f = spec.fields[0];
      const key = spec.rows[f.row][0];
      const fmt = f.fmt ? ` ${rng.pick(FORMATS[f.fmt].phrase)}` : '';
      if (spec.kind === 'record') {
        return say(rng, spec, [
          'Enter the value of {key} into the text field{fmt}.',
          'Type the {key} from the table into the answer box{fmt}.',
          'What is the {lkey} on this record? Type it{fmt}.',
          'Find the {lkey} in the record and enter it{fmt}.',
          'Read the {lkey} off the table and put it in the answer field{fmt}.',
          'Fill in the answer with the person’s {lkey}{fmt}.',
          'The answer field needs the record’s {lkey} from the table{fmt}.',
          'Which value is shown for {key}? Enter that{fmt}.',
        ], { key, lkey: key.toLowerCase(), fmt }, { terse: `${key.toLowerCase()}${fmt}` });
      }
      const col = colNoun(rng, spec.cols[f.col]);
      const row = `${spec.ref}${key}`;
      return say(rng, spec, [
        'Enter the {col} of {row} into the text field{fmt}.',
        'Look up the {col} of {row} in the table and type it{fmt}.',
        'What is the {col} for {row}? Type the answer{fmt}.',
        'Find {row} in the table and enter its {col}{fmt}.',
        'Type the {col} listed for {row}{fmt}.',
        'Report the {col} of {row} in the answer box{fmt}.',
        'Use the {col} for {row} as the answer{fmt}.',
        'The answer box needs the {col} for {row}{fmt}.',
        'Which {col} belongs to {row}? Enter it{fmt}.',
        'Answer with the table value under {col} for {row}{fmt}.',
      ], { col, row, fmt }, { terse: `${col} of ${row}${fmt}` });
    },
    replyInstruction(spec, rng) {
      if (spec.fields.length === 2) {
        const [a, b] = spec.fields.map((f) => f.label.replace(/:$/, ''));
        return say(rng, spec, [
          'Look up {a} and {b} in the table.',
          'Find {a} and {b} in the table.',
          'Use the table to get {a} and {b}.',
          'Read {a} and {b} off the table.',
          'Check the table for {a} and {b}.',
          'Give both values for {a} and {b}.',
        ], { a, b }, { terse: `${a}, ${b}` });
      }
      const f = spec.fields[0];
      const key = spec.rows[f.row][0];
      const fmt = f.fmt ? `, ${rng.pick(FORMATS[f.fmt].phrase)}` : '';
      if (spec.kind === 'record') {
        return say(rng, spec, [
          'What is the {lkey} on this record{fmt}?',
          'Find the {lkey} in the record{fmt}.',
          'Look up the person’s {lkey}{fmt}.',
          'Read the {lkey} off the table{fmt}.',
          'Check the record for the {lkey}{fmt}.',
          'Give me this person’s {lkey}{fmt}.',
          'Which value is shown for {lkey}{fmt}?',
          'The required detail is {lkey}{fmt}.',
          'Use the record to give the {lkey}{fmt}.',
        ], { lkey: key.toLowerCase(), fmt }, { terse: `${key.toLowerCase()}${fmt}` });
      }
      const col = colNoun(rng, spec.cols[f.col]);
      const row = `${spec.ref}${key}`;
      return say(rng, spec, [
        'What is the {col} for {row}{fmt}?',
        'Look up the {col} of {row} in the table{fmt}.',
        'Find {row} in the table and check its {col}{fmt}.',
        'Read the {col} listed for {row}{fmt}.',
        'Check the table for the {col} of {row}{fmt}.',
        'The value needed is the {col} for {row}{fmt}.',
        'Give the {col} from the row for {row}{fmt}.',
        'Give me the {col} belonging to {row}{fmt}.',
      ], { col, row, fmt }, { terse: `${col} of ${row}${fmt}` });
    },
    judgeAsk: askField,
    factRows(model, spec, out) {
      if (spec.fields.length === 1) {
        const f = spec.fields[0];
        if (spec.kind === 'record') {
          spec.rows.forEach((r, i) => { if (i !== f.row && out.length < 3) out.push({ label: r[0], value: String(r[1]), labels: [r[0].toLowerCase()] }); });
        } else {
          spec.columns.forEach((c, i) => {
            if (i > 0 && i !== f.col && out.length < 3) out.push({ label: `${c} of ${spec.ref}${spec.rows[f.row][0]}`, value: String(spec.rows[f.row][i]), labels: [c.toLowerCase()] });
          });
        }
      }
    },
    retargetTries(spec, model, rng, tries) {
      if (spec.fields.length === 1 && !spec.fields[0].fmt) {
        const f = spec.fields[0];
        spec.rows.forEach((r, i) => {
          if (i === f.row) return;
          const shown = r[f.col];
          if (spec.rows.some((r2, j) => j !== i && r2[f.col] === shown)) return; // keep the answer unique
          tries.push({ ...spec, fields: [{ ...f, row: i, answer: shown, shown, label: null }] });
        });
      }
    },
  });
})();

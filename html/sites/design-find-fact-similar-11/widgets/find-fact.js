// Groups the candidate words under source headings and omits the template briefing block.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-similar-11',
  name: 'design',
  split: 'train',
  scenarios: ['similar'],
  template: 'find-fact/similar',
  design: {
    briefSelector: null,
    parts: {
      build: (base, S) => (ctx, work, up, room) => {
        const { spec, util, rng } = ctx;
        const { card: c, body } = S.P.card(util, work,
          rng.pick(['Word list', 'Synonym check', 'Vocabulary']), `${spec.words.length} words`);
        c.style.minWidth = '300px';
        S.P.wordCard(ctx, c, body, work);
        const tiles = rng.bool(0.45);
        const rowsFit = Math.floor((room.h - 110) / (tiles ? 42 : 38));
        const cols = spec.words.length > rowsFit || (spec.words.length > 4 && rng.bool(0.6)) ? 2 : 1;
        if (rng.bool(0.6)) util.el('div', 'rl-hint', body,
          rng.pick(['Tick every word that means the same as one of the words in the task.', 'Check all synonyms that apply.', 'Select the matching words.']));
        S.P.hint(ctx, c, body);
        const grid = util.el('div', 'rl-words' + (tiles ? ' tiles' : ''), body);
        grid.style.gridTemplateColumns = `repeat(${cols}, minmax(150px, max-content))`;
        if (tiles) grid.style.gap = '8px 12px';
        grid.style.setProperty('--source-count', spec.given.length);
        grid.style.setProperty('--max-options', Math.ceil(spec.words.length / spec.given.length));
        const groups = spec.given.map((word) => {
          const group = util.el('section', 'wb-word-column', grid);
          util.el('header', 'wb-source', group, word);
          return util.el('div', 'wb-options', group);
        });
        S.P.grid(ctx, c, body, grid);
        const labels = {};
        const inputs = spec.words.map((w, i) => {
          const group = groups[Math.min(groups.length - 1, Math.floor(i * groups.length / spec.words.length))];
          const lab = S.P.option(ctx, group, w, i);
          lab.dataset.role = 'option';
          const inp = util.el('input', '', lab);
          inp.type = 'checkbox';
          inp.value = w.text;
          util.el('span', '', lab, w.text);
          labels[w.text] = lab;
          return [w.text, inp];
        });
        const ch = env.ui.choices(inputs, {
          label: 'word',
          multi: true,
          values: ctx.model.values,
          onChange(values) {
            const order = spec.words.map((w) => w.text);
            up({ values: order.filter((x) => values.includes(x)) });
            mark(ctx.model);
          },
        });
        function mark(m) {
          for (const w of spec.words) labels[w.text].classList.toggle('on', m.values.includes(w.text));
          S.P.marked(ctx, m);
        }
        mark(ctx.model);
        S.P.ready(ctx, { c, body, grid, labels, inputs, ch, mark, up });
        return {
          sync(m) { ch.set(m.values); mark(m); },
          locate: (t) => (t.word !== undefined ? ch.locate(t.word) : null),
        };
      },
    },
  },
});

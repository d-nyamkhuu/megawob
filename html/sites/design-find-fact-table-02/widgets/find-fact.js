// This design labels the source table and uses a fixed, dense answer form and source sizing.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-table-02',
  name: 'design',
  split: 'train',
  scenarios: ['table'],
  answerReply: true,
  template: 'find-fact/table',
  design: {
    parts: {
      answerForm: (base, S) => (ctx, parent, labels, model, onEdit) => {
        const { util, rng } = ctx;
        const inline = labels.length > 1 && labels.every((l) => l && l.length <= 14) && rng.bool(0.5);
        const { card: c, body } = S.P.card(util, parent, 'Your Answers');
        c.classList.add('rl-form');
        body.classList.add('rl-answer-grid');
        const head = util.el('div', 'rl-answer-head', body);
        util.el('span', '', head, 'Field');
        util.el('span', '', head, 'Value (type your answer)');
        if (inline) c.classList.add('inline');
        return labels.map((label, i) => {
          const f = util.el('div', 'rl-field', body);
          const id = `rl-f${i}`;
          const l = util.el('label', '', f, label || 'Requested value');
          l.htmlFor = id;
          const inp = S.P.input(util, f, 'field', '');
          inp.id = id;
          return env.ui.textField(inp, {
            value: model.answers[i] || '',
            label: `answer${i}`,
            onInput: (v) => onEdit(i, v),
          });
        });
      },
      source: (base, S) => (ctx, tc, body) => {
        tc.classList.add('rl-source');
        tc.querySelector('h3').firstChild.nodeValue = 'Research Data Table';
      },
      fit: (base, S) => (ctx, B) => {
        const { work, room, body, t } = B;
        const rowCount = ctx.spec.rows.length + (ctx.spec.kind === 'grid' ? 1 : 0);
        const rowHeight = body.getBoundingClientRect().height / rowCount;
        const baseFont = ctx.size.width < 1000 ? 14 : ctx.size.height < 480 ? 16 : 20;
        const fontSize = Math.min(baseFont, Math.max(11, Math.floor((rowHeight - 3) / 1.3)));
        B.tc.style.setProperty('--sheet-font', fontSize + 'px');
        B.tc.style.setProperty('--sheet-py', Math.max(0, Math.floor((rowHeight - fontSize * 1.25 - 2) / 2)) + 'px');
      },
    },
  },
});

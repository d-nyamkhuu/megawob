// Adds the source passage and operation-specific answer label to the shared transform form.
env.widget({
  task: 'type-text',
  site: 'design-type-text-transform-03',
  name: 'design',
  split: 'train',
  scenarios: ['transform'],
  template: 'type-text/fields',
  design: {
    parts: {
      finish: (base, S) => (ctx, card) => {
        base(ctx, card);
        const instruction = ctx.stage.dataset.sourceInstruction || '';
        const q = /"([^"]+)"/.exec(instruction);
        if (q) {
          const label = ctx.util.el('div', 'ds-src-label', card.parentNode, 'Source text:');
          const source = ctx.util.el('div', 'ds-src', card.parentNode, q[1]);
          card.parentNode.insertBefore(label, card);
          card.parentNode.insertBefore(source, card);
        }
        const operation = /each word capitalized|title case/i.test(instruction)
          ? 'title case'
          : (/upper case|lower case/i.exec(instruction) || [])[0];
        const answerLabel = card.querySelector('.ft-label');
        if (answerLabel) answerLabel.textContent = 'Your answer' + (operation ? ' (in ' + operation.toLowerCase() + ')' : '') + ':';
        for (const input of Object.values(S.st.inputs)) input.el.placeholder = '';
      },
    },
  },
});

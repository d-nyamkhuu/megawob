env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-arithmetic-09',
  name: 'design',
  split: 'train',
  scenarios: ['arithmetic'],
  template: 'solve-puzzle/classic',
  design: {
    answerLabel: 'Your answer:',
    parts: {
      answerActions: (base, S) => (fieldEl) => {
        const s = S.spec,
          u = S.ctx.util,
          scene = S.scene;
        if (s.scenario === 'arithmetic') {
          const tools = u.el('div', 'reference-tools', scene),
            clear = S.P.button(
              tools,
              '✎　Clear answer',
              { tool: 'clear' },
              () => {
                S.field.set('');
                S.P.set({ answer: '' });
              },
              'tool-button',
            ),
            calc = S.P.button(
              tools,
              '▦　Show calculator',
              { tool: 'calculator' },
              () => {
                panel.hidden = !panel.hidden;
                calc.textContent = panel.hidden ? '▦　Show calculator' : '▦　Hide calculator';
              },
              'tool-button',
            ),
            panel = u.el('div', 'calculator-panel', scene);
          panel.hidden = true;
          for (const key of ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '⌫', 'C'])
            S.P.button(
              panel,
              key,
              { key },
              () => {
                let value = S.field.get() || '';
                if (key === 'C') value = '';
                else if (key === '⌫') value = value.slice(0, -1);
                else value += key;
                S.field.set(value);
                S.P.set({ answer: value });
              },
              'calc-key',
            );
        }
      },
    },
  },
});

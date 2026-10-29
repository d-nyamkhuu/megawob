// Design on the shared use-form-builder/editor template.
env.widget({
  task: 'use-form-builder',
  site: 'design-use-form-builder-settings-05',
  name: 'design',
  split: 'train',
  scenarios: ['settings'],
  template: 'use-form-builder/editor',
  design: {
    parts: {
      rendered: (base, S) => function (st) {
        base(st);
        const root = st.root;
        const util = st.ctx.util;
        const tabs = root.querySelector('.af-tabs');
        const originalPreview = [...root.querySelectorAll('.af-top button')].find((b) => /Preview/i.test(b.textContent));
        if (tabs && originalPreview) {
          const p = util.el('button', 'nb-preview-tab', tabs, 'Preview');
          p.type = 'button';
          p.addEventListener('click', () => originalPreview.click());
        }
        const sections = root.querySelector('.af-sections');
        if (sections) {
          const actions = util.el('div', 'nb-section-actions', sections);
          for (const label of ['Add Section', 'Rename Section', 'Delete Section']) {
            const button = util.el('button', '', actions, label);
            button.type = 'button';
            button.addEventListener('click', () => env.log('decoy', { label }));
          }
        }
        const canvas = root.querySelector('.af-canvas');
        if (canvas) {
          const order = util.el('div', 'nb-order-actions', canvas);
          for (const label of ['↑', '↓']) {
            const button = util.el('button', '', order, label);
            button.type = 'button';
            button.title = label === '↑' ? 'Move up' : 'Move down';
            button.addEventListener('click', () => env.log('decoy', { label: button.title }));
          }
          const actions = util.el('div', 'nb-question-actions', canvas);
          for (const label of ['Duplicate', 'Delete']) {
            const button = util.el('button', '', actions, label);
            button.type = 'button';
            button.addEventListener('click', () => {
              if (label === 'Delete') root.querySelector('.af-inspector > button:last-of-type')?.click();
              else env.log('decoy', { label });
            });
          }
        }
        const inspector = root.querySelector('.af-inspector');
        if (inspector && inspector.querySelector('.af-property-heading')) {
          for (const field of inspector.querySelectorAll('.af-field')) {
            const label = field.querySelector('.af-label')?.textContent.trim() || '';
            if (/Question type/i.test(label)) field.classList.add('nb-type-field');
            else if (/Question title/i.test(label)) field.classList.add('nb-title-field');
            else if (/Rule/i.test(label)) field.classList.add('nb-rule-field');
          }
          const help = util.el('label', 'nb-help-field', inspector);
          util.el('span', '', help, 'Help text (optional):');
          util.el('textarea', '', help);
          util.el('div', 'nb-validation-heading', inspector, 'Validation');
          for (const name of ['Minimum', 'Maximum']) {
            const row = util.el('label', 'nb-length-row', inspector);
            util.el('span', '', row, `${name} length:`);
            const input = util.el('input', '', row);
            input.type = 'text'; input.inputMode = 'numeric';
            util.el('span', '', row, 'characters');
          }
        }
      },
    },
  },
});

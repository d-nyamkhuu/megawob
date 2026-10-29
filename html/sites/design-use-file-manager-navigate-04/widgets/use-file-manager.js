// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-navigate-04',
  name: 'design',
  split: 'train',
  scenarios: ['navigate'],
  template: 'use-file-manager/explorer',
  design: {
    parts: {
      rendered: (base, S) => (ctx) => {
        base(ctx);
        const { win, bar, crumbs, backBtn, upBtn } = S.els;
        const el = (tag, cls, parent, text) => ctx.util.el(tag, cls, parent, text);
        const tabs = el('nav', 'aqua-tabs', win);
        for (const [i, label] of ['Browse', 'Preview', 'Organize', 'Burn'].entries()) {
          const b = el('button', `aqua-tab${i === 0 ? ' active' : ''}`, tabs, label);
          b.type = 'button';
          b.addEventListener('click', () => ctx.log('decoy', { what: 'tab', label }));
        }
        const view = el('div', 'fm-view-switch', bar);
        for (const [label, glyph] of [['Icon View', '▦'], ['List View', '☷'], ['Column View', '▥']]) {
          const b = el('button', 'fm-view-button', view);
          b.type = 'button';
          b.setAttribute('aria-label', label);
          b.title = label;
          el('span', 'fm-view-glyph', b, glyph);
          el('span', 'fm-view-label', b, label);
          b.addEventListener('click', () => ctx.log('decoy', { what: 'view', label }));
        }
        const search = el('div', 'fm-search', bar);
        el('span', 'fm-search-glass', search, '⌕');
        const input = el('input', 'fm-search-input', search);
        input.type = 'text';
        input.placeholder = 'Search';
        input.readOnly = true;
        const pathbar = el('div', 'fm-pathbar', win);
        pathbar.appendChild(crumbs);
        bar.after(tabs);
        tabs.after(pathbar);
        // Keep navigation controls first, view choices next, and search at the far end.
        upBtn.after(view);
        bar.appendChild(search);
        bar.appendChild(S.els.undoBtn);
        bar.appendChild(S.els.trashBtn);
        void backBtn;
      },
    },
  },
});

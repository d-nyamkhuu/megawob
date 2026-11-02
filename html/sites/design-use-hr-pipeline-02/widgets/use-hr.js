// Design on templates/use-hr/workspace.js; defaults reproduce the scaffold.
env.widget({
  task: 'use-hr',
  site: 'design-use-hr-pipeline-02',
  name: 'design',
  split: 'train',
  scenarios: ['pipeline'],
  template: 'use-hr/workspace',
  design: {
    titles: { pipeline: 'Software Engineer' },
    brand: 'PeopleHub', workspaceLabel: 'Recruiting',
    sidebarWidth: '0px', railWidth: '0px', railWidthAt: 99999,
    font: '14px/1.35 Arial,"Segoe UI",sans-serif', inset: '0px', radius: '5px',
    panel: '#f2f7fb', foreground: '#102c54', muted: '#617594', line: '#d2e0ec', accent: '#0874d1',
    background: '#f1f6fa',
    parts: {
      empty: (base, S) => function (ctx, parent, text, glyph) {
        base(ctx, parent, text, glyph);
        const node = parent.lastElementChild;
        if (!node || !node.classList.contains('hr-empty')) return;
        node.textContent = 'No candidates';
        ctx.util.el('span', 'hr-empty-hint', node, 'Move candidates here based on the screening policy.');
      },
      policy: (base, S) => function (ctx) {
        const state = S.current;
        if (!state || state.s.scenario !== 'pipeline') return base(ctx);
        const { years, skill, score } = state.s.rule;
        const el = (tag, cls, parent, text) => ctx.util.el(tag, cls, parent, text);
        const box = el('section', 'hr-policy hr-policy-groups', state.main);
        el('strong', 'hr-policy-title', box, 'Screening Policy');
        const groups = el('div', 'hr-policy-grid', box);
        const group = (title, text, color) => {
          const item = el('div', 'hr-policy-group', groups);
          item.style.setProperty('--policy-color', color);
          el('b', '', item, title);
          el('span', '', item, text);
        };
        group('Experience & skills', `≥ ${years} years experience\nAND ${skill}`, '#46ad67');
        group('Interview score', `Offer if score is ≥ ${score}\nOtherwise Interview`, '#f08a20');
        group('All other candidates', 'Rejected\nApplied is the review queue', '#8951c5');
      },
    },
  },
});

// Design on the use-slides/office template; defaults reproduce the reference scaffold.
env.widget({
  task: 'use-slides',
  site: 'design-use-slides-align-01',
  name: 'design',
  split: 'train',
  scenarios: ['align'],
  template: 'use-slides/office',
  design: {
    uiFont: 'Arial, "DejaVu Sans", sans-serif',
    brand: 'Presentation', workspace: 'Project Update', documentTitle: 'Project Update',
    slideEyebrow: '', slideFooter: '', notesLabel: '', notesText: '',
    frameInset: 0, compactAt: 900, tightAt: 650, inspectorAt: 0,
    railWidth: 180, thumbnailPitch: 100, thumbnailHeight: 88,
    canvasInsetX: 0, canvasInsetY: 0, maxScale: 1.6,
    parts: {
      rail(base, S) {
        return function (main) {
          base(main);
          const workspace = main.querySelector('.as-main');
          const rail = main.querySelector('.as-rail');
          const editor = main.querySelector('.as-editor');
          const inspector = main.querySelector('.as-inspector');
          if (workspace) {
            workspace.style.setProperty('display', 'flex', 'important');
            workspace.style.setProperty('flex-direction', 'column', 'important');
            workspace.style.setProperty('position', 'relative', 'important');
            workspace.style.setProperty('min-height', '0', 'important');
          }
          if (rail) {
            rail.style.setProperty('width', '75%', 'important');
            rail.style.setProperty('height', '104px', 'important');
            rail.style.setProperty('flex', '0 0 104px', 'important');
          }
          if (editor) {
            editor.style.setProperty('width', '75%', 'important');
            editor.style.setProperty('flex', '1 1 0', 'important');
            editor.style.setProperty('min-height', '0', 'important');
          }
          if (inspector) {
            inspector.style.setProperty('position', 'absolute', 'important');
            inspector.style.setProperty('inset', '0 0 0 auto', 'important');
            inspector.style.setProperty('width', '25%', 'important');
          }
          const pane = S.refs['pane:rail'];
          const board = pane && pane.querySelector('.as-thumbs');
          if (!board) return;
          board.style.setProperty('position', 'relative', 'important');
          board.style.setProperty('display', 'flex', 'important');
          board.style.setProperty('align-items', 'flex-start', 'important');
          board.style.setProperty('gap', '18px', 'important');
          board.style.setProperty('width', 'max-content', 'important');
          board.style.setProperty('height', '100%', 'important');
          for (const card of board.querySelectorAll('.as-thumb')) {
            card.style.setProperty('position', 'relative', 'important');
            card.style.setProperty('inset', 'auto', 'important');
            card.style.setProperty('left', 'auto', 'important');
            card.style.setProperty('top', 'auto', 'important');
            card.style.setProperty('transform', 'none', 'important');
            card.style.setProperty('translate', 'none', 'important');
            card.style.setProperty('right', 'auto', 'important');
            card.style.setProperty('bottom', 'auto', 'important');
            card.style.setProperty('display', 'block', 'important');
            card.style.setProperty('visibility', 'visible', 'important');
            card.style.setProperty('opacity', '1', 'important');
            card.style.setProperty('flex', '0 0 190px', 'important');
            card.style.setProperty('width', '190px', 'important');
          }
        };
      },
      inspector(base, S) {
        return function (main) {
        const { util, spec } = S.ctx;
        const pane = util.el('aside', 'as-inspector summary-panel', main);
        util.el('h3', 'summary-heading', pane, 'Slide Summary');
        const block = (title) => {
          const el = util.el('section', 'summary-block', pane);
          util.el('h4', '', el, title);
          return el;
        };
        const row = (parent, label, value) => {
          const el = util.el('div', 'summary-row', parent);
          util.el('span', '', el, label); util.el('b', '', el, String(value));
        };
        const totals = block('Slide 1 — Project Update');
        row(totals, 'Total slides', spec.slides.length);
        row(totals, 'Text boxes', spec.shapes.filter(x => x.type === 'text').length || 1);
        row(totals, 'Shapes', spec.shapes.length);
        row(totals, 'Pictures', 0);
        const details = block('Shape details');
        for (const shape of spec.shapes) {
          const line = util.el('div', 'summary-row shape-detail', details);
          util.el('i', `shape-chip ${shape.kind || ''}`, line);
          util.el('span', '', line, shape.label);
          util.el('b', '', line, '1');
        }
        const other = block('Other elements');
        row(other, 'Bullet lists', 0); row(other, 'Tables', 0);
        };
      },
    },
  },
});

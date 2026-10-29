// Design on the shared use-spreadsheet/workbook template.
env.widget({
  task: 'use-spreadsheet',
  site: 'design-use-spreadsheet-range-02',
  name: 'design',
  split: 'train',
  scenarios: ['range'],
  template: 'use-spreadsheet/workbook',
  design: {
    rowHeight: 32,
    headerHeight: 34,
    gutter: 50,
    cellFontSize: 18,
    largeFontSize: 19,
    columnWeights: [1.25, 1.05, 1.15, 1.05, 1.35, 1.45, 0.08, 0.08],
    parts: {
      title: () => () => null,
      navigation: () => () => null,
      context: (base) => base,
      formulaBar: (base, S) => (ctx, book) => {
        base(ctx, book);
        S.formulaBar = book.lastElementChild;
      },
      workarea: (base, S) => (ctx, book) => S.util.el('div', 'as-workarea flash-workarea', book),
      workspace: () => () => null,
      activity: (base, S) => (ctx, workarea) => {
        const inspector = S.util.el('aside', 'flash-inspector', S.workarea);
        const fhead = S.util.el('div', 'flash-inspector-head', inspector, 'Formula:');
        fhead.append(S.formulaBar);
        const section = S.util.el('section', 'flash-inspector-section', inspector);
        S.util.el('h3', '', section, 'Cell Format');
        const select = S.util.el('button', 'flash-select', section, 'General');
        select.type = 'button'; select.setAttribute('aria-label', 'Cell format');
        S.util.el('span', '', select, '▾');
        const decimal = S.util.el('div', 'flash-decimal', section);
        S.util.el('span', '', decimal, 'Decimal places:');
        const number = S.util.el('span', 'flash-spin', decimal, '2');
        S.util.el('span', '', number, '▴\n▾');
        const quick = S.util.el('section', 'flash-inspector-section', inspector);
        S.util.el('h3', '', quick, 'Quick Format');
        const styles = S.util.el('div', 'flash-style-buttons', quick);
        for (const t of ['B', 'I', 'U']) S.util.el('button', `flash-style ${t}`, styles, t);
        const aligns = S.util.el('div', 'flash-style-buttons', quick);
        for (const t of ['☰', '☷', '☰']) S.util.el('button', 'flash-style', aligns, t);
        const colors = S.util.el('div', 'flash-style-buttons', quick);
        S.util.el('button', 'flash-color-fill', colors, '▰  ▾');
        S.util.el('button', 'flash-color-text', colors, 'A  ▾');
        const actions = S.util.el('section', 'flash-inspector-section flash-insert', inspector);
        S.util.el('h3', '', actions, 'Insert');
        for (const label of ['Insert Row', 'Insert Column', 'Delete Row', 'Delete Column']) {
          const b = S.util.el('button', 'flash-action', actions, label); b.type = 'button';
          S.util.el('span', 'flash-action-icon', b, label.startsWith('Insert') ? '▤' : '▧');
        }
        return inspector;
      },
      bottom: (base, S) => (ctx, book) => {
        const strip = S.util.el('div', 'as-bottom flash-tabs', S.book);
        S.util.el('span', 'flash-tab-arrow', strip, '◀');
        S.util.el('span', 'flash-tab-arrow', strip, '◆');
        S.util.el('span', 'flash-tab-arrow', strip, '▶');
        S.util.el('span', 'as-tab active', strip, S.spec.sheet || 'Sales Q1');
        S.util.el('span', 'flash-tab-add', strip, '+');
      },
    },
  },
});

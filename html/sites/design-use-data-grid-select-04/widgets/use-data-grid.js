// Design on use-data-grid/grid; defaults reproduce the scaffolded base widget.
env.widget({
  task: 'use-data-grid',
  site: 'design-use-data-grid-select-04',
  name: 'design',
  split: 'train',
  scenarios: ['select'],
  template: 'use-data-grid/grid',
  design: {
    expandedAt: 100000,
    contextAt: 800,
    contextHeight: 400,
    navWidth: 0,
    railWidth: 0,
    contextWidth: 360,
    cardInsetX: 18,
    cardInsetY: 0,
    cardTop: 0,
    rowMin: 12,
    rowMax: 40,
    fixedHeight: 40 + 58 + 40 + 52 + 8,
    extraCss: `
      .to-card .to-tools::before {
        content:"▤  New     ✎  Edit     ✖  Delete     │     ☑  Adjust Stock     ▤  Print     ▣  Export";
        flex:1 1 auto; min-width:0; overflow:hidden; white-space:pre; color:#080808; font:17px Arial,sans-serif;
      }
      .to-context h4:first-child { font-size:0 !important; }
      .to-context h4:first-child::after { content:"Product Details"; font:bold 19px Arial,sans-serif; }
      .to-context .inv-fields { padding:0 18px; }
      .to-context .inv-field { display:block; margin:0 0 12px; font:18px/1.2 Arial,sans-serif; color:#080808; }
      .to-context .inv-field input, .to-context .inv-field select, .to-context .inv-field textarea {
        display:block; width:100%; height:34px; margin-top:3px; border:2px inset #dfdfdf; border-radius:0;
        padding:2px 5px; background:#c0c0c0 !important; color:#080808; font:17px Arial,sans-serif;
      }
      .to-context .inv-field select { background:linear-gradient(90deg,#c0c0c0 calc(100% - 28px),#aaa calc(100% - 28px)); }
      .to-context .inv-field textarea { height:110px; background:#fff; resize:none; }
      @media (max-width:1100px) {
        .to-card .to-tools::before { font-size:12px; }
      }
    `,
    parts: {
      tabs: () => () => {},
      appbar: (base, S) => function () {
        base();
        S.shell.style.inset = '0';
        S.appbar.style.display = 'none';
      },
      fit: (base, S) => function () {
        base();
        // Reserve exactly the visible frame before fitting the complete page.
        S.FIXED = S.H < 440 ? 160 : S.D.fixedHeight;
        S.rowH = Math.max(S.D.rowMin, Math.min(S.D.rowMax,
          Math.floor((S.cardH - S.FIXED - 4) / S.spec.pageSize)));
      },
      heading: (base, S) => function () {
        base();
        S.head.style.height = S.H < 440 ? '32px' : '40px';
      },
      toolbar: (base, S) => function () {
        base();
        S.tools.style.height = S.H < 440 ? '42px' : '58px';
      },
      footer: (base, S) => function () {
        base();
        S.foot.style.height = S.H < 440 ? '38px' : '52px';
        // Selection status belongs below the table in this window design.
        S.foot.prepend(S.selInfo, S.clearSelBtn);
        S.facts.style.display = 'none';
      },
      stream: (base, S) => function () {
        base();
        S.stream.style.display = 'none';
      },
      rowReady: (base, S) => function (row, r, m) {
        base(row, r, m);
        if (S.rowH < 24) {
          for (const cell of row.children) cell.style.setProperty('font-size', Math.max(11, S.rowH - 3) + 'px', 'important');
        }
      },
      contextPanel: (base, S) => function () {
        if (!S.contextual) return;
        const panel = S.P.el('aside', 'to-context', S.shell);
        Object.assign(panel.style, { top: '0', padding: '0', overflow: 'auto' });
        const heading = S.P.el('h4', '', panel, 'Product Details');
        Object.assign(heading.style, { height: '40px', margin: '0 0 20px', padding: '8px 18px' });
        const fields = S.P.el('div', 'inv-fields', panel);
        for (const [label, type] of [['Product Name:', 'input'], ['SKU:', 'input'], ['Category:', 'select'],
          ['Supplier:', 'select'], ['Unit Price:', 'input'], ['Stock Quantity:', 'input'], ['Reorder Level:', 'input'],
          ['Description:', 'textarea']]) {
          const wrap = S.P.el('label', 'inv-field', fields, label);
          if (type === 'select') {
            const select = S.P.el('select', '', wrap);
            select.tabIndex = -1;
          } else S.P.el(type, '', wrap);
        }
      },
    },
  },
});

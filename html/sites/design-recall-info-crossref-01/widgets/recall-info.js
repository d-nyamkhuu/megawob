// Design on recall-info/classic; defaults preserve the scaffolded base widget.
env.widget({
  task: 'recall-info',
  site: 'design-recall-info-crossref-01',
  name: 'design',
  split: 'train',
  scenarios: ['crossref'],
  template: 'recall-info/classic',
  design: {
    width: 1140,
    title: 'Employee Records',
    panel: '#ffffff', fg: '#182131', line: '#c9d0d9', accent: '#0875d1', muted: '#778395', bg: '#eef1f4',
    frameRadius: '4px', fontSize: '16px', inputRadius: '3px', tightHeight: 560,
    parts: {
      frame: (base, S) => (ctx, title) => {
        ctx.rng.bool(0.25);
        const stage = ctx.stage;
        const root = env.util.el('div', 'cr-layout', stage);
        root.dataset.role = 'recall';
        const rail = env.util.el('section', 'cr-rail', root);
        const head = env.util.el('div', 'cr-rail-title', rail, 'Employees');
        const search = env.util.el('div', 'cr-search', rail);
        const input = env.util.el('span', 'cr-search-placeholder', search, 'Search employees...');
        env.util.el('span', 'cr-search-button', search, '⌕');
        const grid = env.util.el('div', 'cr-list-grid', rail);
        const hdr = env.util.el('div', 'cr-list-row cr-list-head', grid);
        ['ID', 'Name', 'Department'].forEach((x) => env.util.el('span', '', hdr, x));
        const rows = [
          ['E1024','Carter, Daniel','Engineering'],['E1025','Brooks, Olivia','Marketing'],['E1026','Patel, Rohan','Engineering'],
          ['E1027','Nguyen, Amy','HR'],['E1028','Foster, Lucas','Sales'],['E1029','Kim, Megan','Finance'],
          ['E1030','Ramirez, Carlos','Support'],['E1031','White, Jenna','Engineering'],['E1032','Hall, Marcus','Marketing'],
          ['E1033','Young, Tiffany','HR'],['E1034','Allen, Nathan','Sales'],['E1035','King, Rachel','Finance'],
          ['E1036','Wright, Kevin','Support'],['E1037','Scott, Lauren','Engineering'],['E1038','Green, Adrian','Marketing'],
          ['E1039','Baker, Elise','HR'],['E1040','Nelson, Derek','Sales'],['E1041','Carter, Brianna','Finance'],
          ['E1042','Mitchell, Evan','Support'],['E1043','Perez, Marisol','Engineering']
        ];
        rows.forEach((r, i) => {
          const row = env.util.el('div', 'cr-list-row' + (i === 0 ? ' selected' : ''), grid);
          r.forEach((x) => env.util.el('span', '', row, x));
        });
        const pager = env.util.el('div', 'cr-pager', rail);
        env.util.el('span', '', pager, '1–20 of 42 employees');
        env.util.el('span', 'cr-pages', pager, '‹　1　2　3　›');
        const main = env.util.el('div', 'cr-main', root);
        S.P.bar(ctx, main, 'Company Records');
        const work = S.P.work(ctx, main);
        return { app: root, work };
      },
      placeFrame: (base, S) => (ctx, app) => {
        app.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;left:0;top:0';
      },
    },
  },
});

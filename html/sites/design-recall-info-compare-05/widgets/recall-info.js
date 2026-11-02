// Design on recall-info/classic; defaults preserve the scaffolded base widget.
env.widget({
  task: 'recall-info',
  site: 'design-recall-info-compare-05',
  name: 'design',
  split: 'train',
  scenarios: ['compare'],
  template: 'recall-info/classic',
  design: {
    width: 1600,
    title: 'Riverton Public Library Catalogue',
    parts: {
      placeFrame: (base, S) => (ctx, app, W, H) => {
        base(ctx, app, W, H);
        Object.assign(app.style, {
          left: '0px', top: '0px',
          width: `${ctx.size.width}px`, height: `${ctx.size.height}px`,
        });
      },
      work: (base, S) => (ctx, app) => {
        const work = base(ctx, app);
        Object.assign(work.style, { padding: '0', gap: '0', overflow: 'hidden', position: 'relative' });
        return work;
      },
      catalog: (base, S) => (ctx, work) => {
        const e = env.util.el;
        const head = e('div', 'ur-colhead riv-head', work);
        Object.assign(head.style, {
          height: ctx.size.width <= 1100 ? '38px' : '50px',
          display: 'grid', gridTemplateColumns: ctx.spec.listChoose ? 'minmax(0, 1fr) 310px' : 'minmax(0, 1fr) 155px',
          alignItems: 'center', padding: '0 28px', boxSizing: 'border-box',
        });
        e('span', '', head, 'Product');
        e('span', '', head, 'Action');
        const body = e('div', 'ur-body riv-list', work);
        Object.assign(body.style, { flex: '1 1 0px', minHeight: '0', overflow: 'auto', boxSizing: 'border-box', width: '68%' });
        const list = e('div', 'ur-view', body);
        const grid = e('div', 'ur-cgrid', list);
        grid.style.setProperty('--ur-cc', '1');
        grid.style.gap = '0';
        const bar = e('div', 'ur-choice riv-choice', work);
        const inspector = e('aside', 'gem-inspector', work);
        e('div', 'gem-inspector-title', inspector, 'Details');
        const fields = e('div', 'gem-fields', inspector);
        for (const label of ['Name:','Category:','Colour:','Price:','Rating:','Delivery:']) {
          const row = e('div', 'gem-field', fields); e('span', '', row, label); e('i', '', row);
        }
        e('div', 'gem-empty', inspector, 'No item selected');
        return { bar, body, list, grid };
      },
      choice: (base, S) => (ctx, bar, m) => {
        base(ctx, bar, m);
        bar.style.display = m.picked == null ? 'none' : 'flex';
      },
      tile: (base, S) => (ctx, grid, it, i, apply) => {
        const e = env.util.el;
        const row = e('div', 'ur-tile riv-row', grid);
        const compact = ctx.size.width <= 1300;
        const small = ctx.size.width <= 1100;
        const rowHeight = Math.min(small ? 64 : compact ? 82 : 129,
          (ctx.size.height - (small ? 42 : 55) - 38) / ctx.spec.items.length);
        Object.assign(row.style, {
          display: 'grid', gridTemplateColumns: `${small ? 105 : compact ? 135 : 160}px minmax(0, 1fr) 155px${ctx.spec.listChoose ? ' 155px' : ''}`,
          alignItems: 'center', gap: ctx.spec.listChoose ? '10px' : '0',
          height: `${rowHeight}px`, padding: compact ? '0 18px' : '0 28px',
          fontSize: small ? '18px' : compact ? '20px' : '30px',
        });
        const icon = e('span', `gem-product-icon icon-${i % 5}`, row);
        icon.style.height = `${Math.max(30, Math.min(119, rowHeight - 8))}px`;
        const art = [
          '<path d="M30 27 Q28 17 41 13 Q50 10 60 14 Q72 17 70 29" fill="none"/><path d="M26 29 Q32 24 45 25 L69 28 Q79 31 81 43 L86 86 Q84 97 71 98 L30 97 Q19 95 19 84 L22 42 Q22 33 26 29Z"/><path d="M72 31 Q82 29 87 38 L94 82 Q96 91 86 93 M24 34 Q15 37 13 47 L11 78 Q13 87 20 88" fill="none"/><path d="M29 30 Q37 27 47 29 L67 31 Q74 33 75 44 L77 70 L26 69 L27 42 Q27 34 29 30Z" fill="none"/><path d="M23 67 Q47 70 80 68 L79 87 Q77 94 67 94 L32 93 Q25 90 24 84Z"/><path d="M25 75 Q51 79 79 75 M31 85 Q49 89 73 86 M33 31 Q43 34 52 32 M69 32 L76 38" fill="none" stroke-width="2"/><path d="M27 69 L78 70" fill="none" stroke-width="3"/>',
          '<path d="M12 47 Q19 37 34 38 L75 38 Q91 39 95 51 L96 77 Q91 87 75 88 L24 88 Q9 85 8 75Z"/><path d="M10 52 Q7 62 10 76 Q14 86 25 85 M85 42 Q95 46 97 59 L96 75 Q94 85 85 86" fill="none"/><path d="M31 39 Q34 12 47 10 Q58 9 64 39 M42 38 Q45 20 53 19 Q58 22 60 39" fill="none"/><path d="M27 40 L24 84 M37 40 L34 87 M67 39 L71 87 M78 40 L82 84" fill="none" stroke-width="6"/><path d="M14 55 Q18 61 24 60 M83 57 Q91 61 95 56 M37 81 L68 82" fill="none" stroke-width="2"/><path d="M46 10 Q51 7 57 12" fill="none" stroke-width="2"/>',
          '<path d="M24 31 Q33 27 77 31 L85 38 L88 82 Q85 96 71 97 L25 94 Q16 92 15 82 L19 41Z"/><path d="M25 35 Q13 46 10 71 Q6 87 18 91 M78 33 Q94 45 93 76 Q94 87 86 90" fill="none"/><path d="M25 33 L77 34 Q86 46 83 61 Q66 73 21 63 Q17 52 25 33Z"/><path d="M22 63 Q51 72 83 62 M25 88 Q49 94 72 90 M30 40 Q54 43 74 40" fill="none" stroke-width="2"/><rect x="48" y="64" width="9" height="12" rx="1" fill="#dedede" stroke-width="2"/><path d="M52 61 L52 69 M18 80 L22 84" fill="none" stroke-width="2"/>',
          '<path d="M17 38 L86 38 L81 91 Q78 99 67 100 L31 99 Q22 98 21 89Z"/><path d="M35 45 Q35 14 48 11 Q62 9 66 45 M39 45 Q40 19 49 18 Q59 17 61 45" fill="none" stroke-width="4"/><path d="M18 42 L84 42 M24 51 L81 51 M25 91 Q50 97 77 91" fill="none" stroke-width="2"/><path d="M18 49 L22 89 M86 45 L82 90 M33 48 L33 58 M69 47 L68 58" fill="none" stroke-width="2"/>',
          '<path d="M39 29 L39 9 L61 9 L61 29 M35 10 L65 10" fill="none" stroke-width="4"/><rect x="23" y="29" width="55" height="66" rx="8"/><path d="M29 34 L70 34 M29 55 L72 55 M31 88 L69 88" fill="none" stroke-width="2"/><path d="M25 53 Q50 57 76 53 M28 31 L28 92 M72 31 L72 92" fill="none" stroke-width="2"/><circle cx="31" cy="101" r="4" fill="#222"/><circle cx="69" cy="101" r="4" fill="#222"/>'
        ][i % 5];
        icon.innerHTML = `<svg viewBox="0 0 104 110" aria-hidden="true"><defs><pattern id="gem-hatch-${i}" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#606060"/><path d="M0 4L4 0M-1 1L1 -1" stroke="#111" stroke-width=".9"/></pattern></defs><g fill="url(#gem-hatch-${i})" stroke="#050505" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round">${art}</g></svg>`;
        e('span', 'nm', row, it.name).title = it.name;
        let c = null;
        if (ctx.spec.listChoose) {
          c = e('button', 'ur-btn small riv-view', row, ctx.spec.actLabel);
          Object.assign(c.style, { width: small ? '96px' : compact ? '112px' : '156px', height: `${Math.min(small ? 36 : compact ? 42 : 53, rowHeight - 6)}px`, padding: '0' });
          c.type = 'button';
          c.addEventListener('click', () => apply({ pick: i }));
        }
        const v = e('button', 'ur-btn small riv-view', row, 'View');
        Object.assign(v.style, { width: small ? '96px' : compact ? '112px' : '156px', height: `${Math.min(small ? 36 : compact ? 42 : 53, rowHeight - 6)}px`, padding: '0' });
        v.type = 'button';
        v.addEventListener('click', () => apply({ open: i }));
        return { v, c };
      },
      bar: (base, S) => (ctx, app, title) => {
        ctx.rng.pick(['J. Doe', 'A. Kim', 'M. Silva', 'R. Lee', 'T. Park']);
      },
    },
  },
});

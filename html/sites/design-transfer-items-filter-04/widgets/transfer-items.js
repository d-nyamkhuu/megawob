// Design on the shared transfer-items/dual template.
env.widget({
  task: 'transfer-items',
  site: 'design-transfer-items-filter-04',
  name: 'design',
  split: 'train',
  scenarios: ['filter'],
  template: 'transfer-items/dual',
  design: {
    fontFamily: 'Arial, "Lucida Grande", sans-serif',
    colors: { panel: '#d1d4d8', line: '#85909b', fg: '#111827', muted: '#394451',
      accent: '#9fc8ee', selected: '#111827', selectedIndex: '#394451' },
    leftLabel: 'Available',
    rightLabel: 'Selected',
    filterPlaceholders: ['', ''],
    parts: {
      heading() {
        // The directory summary supplies the heading above the widget.
        return () => document.createElement('div');
      },
      status() {
        return () => document.createElement('div');
      },
      body(base) {
        return (ctx, card) => {
          const body = base(ctx, card);
          Object.assign(body.style, {
            flex: '1 1 auto', minHeight: '0', marginTop: '0',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            gridTemplateRows: 'minmax(0, 1fr) 48px', gap: '0 28px',
          });
          return body;
        };
      },
      geometry(base, S) {
        return (ctx, card, note) => {
          const geo = base(ctx, card, note);
          const compact = ctx.size.height < 340;
          const head = compact ? 28 : 37;
          const filter = compact ? 36 : 49;
          const room = ctx.size.height - 16 - 48 - head - filter - 8;
          geo.pitch = Math.max(8, Math.min(geo.pitch, Math.floor(room / geo.cap)));
          card.style.setProperty('--tl-row', geo.pitch + 'px');
          card.style.setProperty('--tl-fs', Math.min(18, Math.max(11, geo.pitch - 3)) + 'px');
          card.style.setProperty('--directory-head', head + 'px');
          card.style.setProperty('--directory-filter', filter + 'px');
          return geo;
        };
      },
      side(base) {
        return (ctx, key, label) => {
          const side = base(ctx, key, label);
          Object.assign(side.style, {
            gridColumn: key === 'L' ? '1' : '2', gridRow: '1',
            minHeight: '0', padding: '0 2px 2px',
          });
          return side;
        };
      },
      sideHeading(base) {
        return (ctx, col, key, label) => {
          const count = base(ctx, col, key, label);
          Object.assign(count.parentElement.style, {
            height: 'var(--directory-head)', flex: 'none',
            marginBottom: '0', padding: '3px 14px',
          });
          return count;
        };
      },
      filter(base, S) {
        return (ctx, col, key, label) => {
          const row = ctx.util.el('div', 'tl-filter-row', col);
          Object.assign(row.style, {
            height: 'var(--directory-filter)', flex: 'none', display: 'flex',
            alignItems: 'center', gap: '12px', padding: '4px 14px',
          });
          ctx.util.el('span', 'tl-filter-label', row, 'Filter:');
          const input = base(ctx, row, key, label);
          Object.assign(input.style, { flex: '1', width: '0', height: '100%', margin: '0' });
          return input;
        };
      },
      list(base) {
        return (ctx, col, key, label) => {
          const list = base(ctx, col, key, label);
          Object.assign(list.style, { overflow: 'auto', minHeight: '0' });
          return list;
        };
      },
      more(base) {
        return (ctx, list, count) => {
          const more = base(ctx, list, count);
          // Compact rows need compact footer text so it cannot cover the last option.
          Object.assign(more.style, { fontSize: 'min(16px, var(--tl-fs))', lineHeight: '1' });
          return more;
        };
      },
      transferControls(base) {
        return (ctx, body) => {
          const controls = base(ctx, body);
          Object.assign(controls.style, {
            gridColumn: '1 / 3', gridRow: '2', flexDirection: 'row',
            alignItems: 'center', justifyContent: 'center', gap: '12px',
          });
          return controls;
        };
      },
      button(base) {
        return (ctx, parent, key, text) => {
          const button = base(ctx, parent, key, text);
          Object.assign(button.style, { flex: '0 1 120px', minWidth: '0' });
          return button;
        };
      },
      place(base) {
        return (ctx, card) => {
          // Retain the template's seeded placement draws before fitting its anchor.
          base(ctx, card);
          Object.assign(card.style, {
            left: '0', top: '0', width: ctx.size.width + 'px', height: ctx.size.height + 'px',
          });
        };
      },
    },
    widthRange: [1060, 1120],
    chromeHeight: 158,
    filterChrome: 0,
    horizontalInset: 16,
    verticalInset: 10,
    cardPadding: '8px 12px',
    cardShadow: 'none',
    pitchRange: [32, 34],
    minPitch: 22,
    compactPitch: 20,
    buttonHeight: 40,
    buttonColumnWidth: 1,
    columnGap: 28,
    fontSizes: { title: 20, note: 13, head: 18, count: 17, filter: 17, index: 12, more: 16,
      button: 20, order: 14, status: 13, ghost: 14, row: 18, compact: 15 },
  },
});

// Keep the GEM tabbed dialog, with space reserved for its in-form action row.
env.widget({
  task: 'type-text',
  site: 'design-type-text-sections-04',
  name: 'design',
  split: 'train',
  scenarios: ['sections'],
  template: 'type-text/base',
  design: {
    parts: {
      ensureStyle: (base) => () => {
        base();
        if (document.getElementById('gem-sections-style')) return;
        const style = document.createElement('style');
        style.id = 'gem-sections-style';
        style.textContent = `
        .gem-stage .ft-acc {
          position: relative; flex: 1 1 0; min-height: 0;
          flex-direction: row; align-items: flex-start; gap: 5px;
        }
        .gem-stage .ft-acc-sec { flex: 1; min-width: 0; border: 0; border-radius: 0; }
        .gem-stage .ft-acc-h {
          height: 44px; justify-content: center; padding: 4px;
          border: 2px solid #111; border-bottom: 0; border-radius: 9px 9px 0 0;
          background: #c9c9c9; color: #111; font-size: 18px; font-weight: normal;
        }
        .gem-stage .ft-acc-h[aria-expanded=true] { background: #eee; font-weight: bold; }
        .gem-stage .ft-acc-h .chev { display: none; }
        .gem-stage .ft-acc-b {
          position: absolute; inset: 44px 0 0; overflow: auto;
          padding: var(--gem-body-pad) var(--gem-body-side) 8px;
          border: 2px solid #111; background: #eee;
        }
        .gem-stage .ft-tabs { flex: none; margin: 0; }
        .gem-stage .ft-panes {
          position: relative; flex: 1 1 0; min-height: 0; overflow: auto;
          border: 2px solid #111; background: #eee;
          padding: var(--gem-body-pad) var(--gem-body-side) 8px;
        }
        .gem-stage .ft-grid.inline {
          grid-template-columns: minmax(90px, 35%) minmax(0, 1fr);
          column-gap: 14px; row-gap: var(--gem-row-gap);
        }
        .gem-stage .ft-grid.inline .ft-label {
          align-self: center; padding: 0; text-align: left; font-size: var(--gem-label-size);
          font-weight: normal; overflow-wrap: anywhere;
        }
        .gem-stage .ft-grid.inline .ft-err { margin-top: calc(-1 * var(--gem-row-gap)); }
        .gem-stage .ft-input { height: var(--gem-input-h); padding: 2px 10px; }
        .gem-stage .ft-input.underline { border-width: 2px; border-radius: 0; background: #f8f8f8; }
        .gem-stage .ft-actions { flex: none; margin: 10px 0 0; }
        `;
        document.head.append(style);
      },
      buildSections: (base, S) => (ctx, look, card) => {
        const compact = ctx.size.height < 500;
        card.style.setProperty('--gem-body-pad', compact ? '10px' : '50px');
        card.style.setProperty('--gem-body-side', compact ? '16px' : '30px');
        card.style.setProperty('--gem-row-gap', compact ? '6px' : '22px');
        card.style.setProperty('--gem-input-h', compact ? '32px' : '44px');
        card.style.setProperty('--gem-label-size', ctx.size.width < 1100 ? '15px' : '19px');
        base(ctx, { ...look, layout: 'inline', counts: false }, card);
        // The template measures before Save is appended. Let the flex row reserve
        // Save's height rather than freezing that earlier, larger measurement.
        if (ctx.spec.panes !== 'tabs') card.lastElementChild.style.minHeight = '0px';
      },
    },
  },
});

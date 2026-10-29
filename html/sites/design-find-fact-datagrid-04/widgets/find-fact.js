// Design on templates/find-fact/base.js: the base site's find-fact widget for this scenario, unchanged (it was
// scaffolded from it and restyled through site.css).
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-datagrid-04',
  name: 'design',
  split: 'train',
  scenarios: ['datagrid'],
  template: 'find-fact/base',
  design: {
    parts: {
      colWidths: (base) => (spec, fs) => {
        const widths = base(spec, fs);
        // A sideways wheel step is 260px. Equal column widths keep every
        // column reachable even beside the answer field in a narrow window.
        return spec.mode === 'hscroll' ? widths.map((w, i) => i ? 260 : w) : widths;
      },
      frame: (base, S) => (ctx) => {
        // Keep the template's seeded frame draws, then size the window and its
        // builder room together, rather than resizing only the visible frame.
        const out = base(ctx);
        let left = Math.min(245, Math.max(90, ctx.size.width - 1060));
        if (ctx.spec.mode === 'hscroll') {
          const needed = S.colWidths(ctx.spec, 14)[0] + 262 + 40 + 170;
          left = Math.min(left, Math.max(20, ctx.size.width - needed - 14));
        }
        const width = ctx.size.width - left - 14;
        const height = ctx.size.height - 30;
        Object.assign(out.app.style, {
          left: left + 'px', top: '17px', width: width + 'px', height: height + 'px',
          borderRadius: '8px',
        });
        const bar = out.app.querySelector('.rl-bar');
        bar.replaceChildren();
        ctx.util.el('strong', 'fm-dialog-title', bar, 'Product Details');
        ctx.util.el('span', 'fm-dialog-close', bar, '×');
        Object.assign(bar.style, { height: '60px', padding: '0 22px' });
        Object.assign(out.work.style, { padding: '0', display: 'flex', flexWrap: 'nowrap', gap: '0', alignItems: 'stretch' });
        out.room.w = width - 2;
        out.room.h = height - 62;
        out.room.grow = () => false;
        return out;
      },
      card: (base) => (...args) => {
        const out = base(...args);
        out.card.firstElementChild.remove();
        Object.assign(out.card.style, { border: '0', borderRadius: '0' });
        return out;
      },
      buildDatagrid: (base, S) => (ctx, work, up, room) => {
        const minTable = ctx.spec.mode === 'hscroll' ? S.colWidths(ctx.spec, 14)[0] + 262 : 0;
        const padding = room.w < 750 ? 12 : 20;
        const stacked = minTable && room.w - 170 - padding * 2 < minTable;
        const answerWidth = stacked ? room.w : Math.max(170, Math.min(365, Math.round(room.w * 0.33), room.w - minTable - padding * 2));
        if (stacked) work.style.flexDirection = 'column';
        const left = ctx.util.el('div', 'fm-table-column', work);
        Object.assign(left.style, { width: (stacked ? room.w : room.w - answerWidth) + 'px', minWidth: '0', padding: '17px ' + padding + 'px', flex: 'none' });
        const right = ctx.util.el('div', 'fm-answer-column', work);
        Object.assign(right.style, { width: answerWidth + 'px', minWidth: '0', padding: (stacked ? '12px ' : '25px ') + padding + 'px', borderLeft: '1px solid #dce3ea', flex: stacked ? 'none' : '1' });
        const result = base(ctx, left, up, {
          ...room, w: (stacked ? room.w : room.w - answerWidth) - padding * 2,
          h: room.h - 34 - (stacked ? 100 : 0),
        });
        const answer = left.querySelector('.rl-ans');
        right.append(answer);
        Object.assign(answer.style, { display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '9px' });
        Object.assign(answer.querySelector('.rl-input').style, { width: '100%', height: '46px' });
        return result;
      },
    },
  },
});
